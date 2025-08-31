import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import MainMapPage from './components/MainMapPage';
import FullAnalysisPage from './components/FullAnalysisPage';
import DynamicDataDemo from './components/DynamicDataDemo';

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainMapPage />} />
      <Route path="/analysis" element={<FullAnalysisPage />} />
      <Route path="/demo" element={<DynamicDataDemo />} />
    </Routes>
  );
}

export default App;