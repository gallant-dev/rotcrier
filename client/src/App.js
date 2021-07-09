import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  return (
    <div className="App">
      <div className="container-fluid p-0">
        <Header />
      </div>
    </div>
  );
}

export default App;
