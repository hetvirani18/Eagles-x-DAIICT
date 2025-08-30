import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import MainMapPage from './components/MainMapPage';
import FullAnalysisPage from './components/FullAnalysisPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainMapPage />} />
      <Route path="/analysis" element={<FullAnalysisPage />} />
    </Routes>
  );
}

export default App;