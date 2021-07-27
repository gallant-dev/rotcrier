import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Home from './components/Home'
import TopPosts from './components/TopPosts'
import NewPosts from './components/NewPosts'
import Search from './components/Search'
import SectionForm from './components/SectionForm'
import Section from './components/Section'
import PostForm from './components/PostForm';
import Post from './components/Post'
import User from './components/User'
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const[focus, setFocus] = useState({type: "menu", name: "Home"})
  const [memberSections, setMemberSections] = useState([])
  const [search, setSearch] = useState("")

  const focusChangeHandler = (newFocus) => {
    setFocus(newFocus)
  }

  const memberSectionsHandler = (sections) => {
    setMemberSections(sections)
  }

  const searchHandler = (params) => {
    setSearch(params)
  }

  return (
    <div className="App">
      <div className="container-fluid p-0">
        <Header onFocusChange={focusChangeHandler} onUpdateMemberSections={memberSectionsHandler} onSearch={searchHandler} memberSections={memberSections} viewFocus={focus}/>
        <div className="container-fluid p-2">
        {focus.name === "Home" && <Home viewFocus={focus} memberSections={memberSections} onFocusChange={focusChangeHandler} />}
        {focus.name === "Top Posts" && <TopPosts viewFocus={focus} memberSections={memberSections} onFocusChange={focusChangeHandler} />}
        {focus.name === "New Posts" && <NewPosts viewFocus={focus} memberSections={memberSections} onFocusChange={focusChangeHandler} />}
        {focus.name === "Search" && <Search viewFocus={focus} onFocusChange={focusChangeHandler} search={search} />}
        {focus.name === "Create a new section" && <SectionForm onFocusChange={focusChangeHandler} />}
        {focus.name === "Create a new post" && <PostForm onFocusChange={focusChangeHandler} />}
        {focus.type === "section" && <Section viewFocus={focus} onFocusChange={focusChangeHandler}/>}
        {focus.type === "post" && <Post viewFocus={focus} onFocusChange={focusChangeHandler}/>}
        {focus.type === "user" && <User viewFocus={focus} onFocusChange={focusChangeHandler} />}
        </div>
      </div>
    </div>
  );
}

export default App;
