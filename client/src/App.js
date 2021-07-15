import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Home from './components/Home'
import SectionForm from './components/SectionForm'
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const[focus, setFocus] = useState(["Home"])

  const focusChangeHandler = (newFocus) => {
    setFocus(newFocus)
  }

  

  return (
    <div className="App">
      <div className="container-fluid p-0">
        <Header onFocusChange={setFocus} viewFocus={focus}/>
        <div className="container-fluid p-2">
        {focus === "Home" && <Home />}
        {focus === "Create a new section" && <SectionForm onFocusChange={focusChangeHandler} />}
        </div>

      </div>
    </div>
  );
}

export default App;
