import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import SectionForm from './components/SectionForm'
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const[focus, setFocus] = useState(["Home"])
  const[userCreatedSections, setUserCreatedSections] = useState([])

  const focusChangeHandler = (newFocus) => {
    setFocus(newFocus)
  }

  return (
    <div className="App">
      <div className="container-fluid p-0">
        <Header onFocusChange={setFocus} viewFocus={focus}/>
        <div className="container-fluid p-2">
        {focus == "Home" && <div>Home</div>}
        {focus == "Create a new section" && <SectionForm onNewSection={setUserCreatedSections} onFocusChange={focusChangeHandler} />}
        </div>

      </div>
    </div>
  );
}

export default App;
