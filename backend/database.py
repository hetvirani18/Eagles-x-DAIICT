from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
import os
from typing import List
import logging
import asyncio

logger = logging.getLogger(__name__)


class Database:
    client: AsyncIOMotorClient = None
    db: AsyncIOMotorDatabase = None


# Database instance
db_instance = Database()


async def connect_to_mongo():
    """Create database connection"""
    try:
        db_instance.client = AsyncIOMotorClient(os.environ['MONGO_URL'])
        db_instance.db = db_instance.client[os.environ['DB_NAME']]

        # Create geospatial indexes for location-based queries
        await create_indexes()

        logger.info("Connected to MongoDB successfully")
    except Exception as e:
        logger.error(f"Failed to connect to MongoDB: {e}")
        raise e


async def close_mongo_connection():
    """Close database connection"""
    if db_instance.client:
        # keep async function async for linter by yielding control
        await asyncio.sleep(0)
        db_instance.client.close()
        logger.info("Disconnected from MongoDB")


async def create_indexes():
    """Create necessary indexes for optimal performance"""
    try:
        # Create geospatial indexes for location-based queries
        collections_with_location = [
            'energy_sources', 'demand_centers', 'water_sources',
            'water_bodies', 'optimal_locations', 'cities'
        ]

        for collection_name in collections_with_location:
            await db_instance.db[collection_name].create_index([
                ("location.latitude", 1),
                ("location.longitude", 1),
            ])

        # Skip geospatial indexes for routes for now - will implement later
        # await db_instance.db['gas_pipelines'].create_index([
        #     ("route", "2dsphere")
        # ])
        # await db_instance.db['road_networks'].create_index([
        #     ("route", "2dsphere")
        # ])

        logger.info("Database indexes created successfully")

    except Exception as e:
        logger.error(f"Failed to create indexes: {e}")

    # Additional helpful indexes
    try:
        # Case-insensitive name index for cities search and a text index fallback
        await db_instance.db['cities'].create_index('name')
        await db_instance.db['cities'].create_index([('name', 'text')])
    except Exception as e:
        logger.warning(f"Optional index creation failed: {e}")


def get_database() -> AsyncIOMotorDatabase:
    """Get database instance"""
    return db_instance.db