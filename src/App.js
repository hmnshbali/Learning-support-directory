import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Listings from './components/Listings';
import ProviderDetail from './components/ProviderDetail';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Listings />} />
          <Route path="/providers" element={<Listings />} />
          <Route path="/providers/:id" element={<ProviderDetail />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;