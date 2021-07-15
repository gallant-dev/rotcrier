import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Home from './components/Home'
import SectionForm from './components/SectionForm'
import Section from './components/Section'
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const[focus, setFocus] = useState({type: "menu", name: "Home"})
  const focusChangeHandler = (newFocus) => {
    setFocus(newFocus)
  }

  

  return (
    <div className="App">
      <div className="container-fluid p-0">
        <Header onFocusChange={focusChangeHandler} viewFocus={focus}/>
        <div className="container-fluid p-2">
        {focus.name === "Home" && <Home />}
        {focus.name === "Create a new section" && <SectionForm onFocusChange={focusChangeHandler} />}
        {focus.type === "section" && <Section viewFocus={focus} />}
        </div>
      </div>
    </div>
  );
}

export default App;
