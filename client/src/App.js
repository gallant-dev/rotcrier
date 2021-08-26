import React, { useState } from 'react';
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
import { clean } from 'unzalgo';
import {
  Switch,
  Route,
  useHistory,
  withRouter
} from "react-router-dom";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [focus, setFocus] = useState({type: "menu", name: "Home"})
  const [memberSections, setMemberSections] = useState([])
  const [search, setSearch] = useState("")
  const [defaultSection, setDefaultSection] = useState('')
  const [userId, setUserId] = useState()
  const history = useHistory();

  const focusChangeHandler = (newFocus) => {
    setFocus(newFocus)
    newFocus.name === "Home" && history.push('/')
    newFocus.name === "Top Posts"  && history.push('/top-posts')
    newFocus.name === "New Posts" && history.push('/new-posts')
    newFocus.name === "Search" && history.push('/search')
    newFocus.name === "Create a new section"  && history.push('/create-new-section')
    newFocus.name === "Create a new post" && history.push('/create-new-post')
    newFocus.type === "section" && history.push('/section')
    //newFocus.type === "post" && history.push('/post')
    newFocus.type === "user" && history.push('/user')
  }

  const memberSectionsHandler = (sections) => {
    setMemberSections(sections)
  }

  const searchHandler = (params) => {
    const newParams = clean(params)
    setSearch(newParams)
  }

  const defaultSectionHandler = (section) =>{
    setDefaultSection(section)
  }

  const loginHandler = (id) => {
    setIsLoggedIn(true)
    setUserId(id)
  }

  const logoutHandler = () => {
    setIsLoggedIn(false)
    setUserId(null)
    sessionStorage.clear()
  }

  console.log(history.location)
  return (
    <div className="App">
        <div className="container-fluid p-0">
          <Header memberSections={memberSections} viewFocus={focus} isLoggedIn={isLoggedIn} onLogin={loginHandler} onLogout={logoutHandler} onFocusChange={focusChangeHandler} onUpdateMemberSections={memberSectionsHandler} onSearch={searchHandler} />
          <div className="container-fluid p-2">
            <Switch>
              <Route exact path="/"> 
                <Home viewFocus={focus} memberSections={memberSections} onFocusChange={focusChangeHandler} />
              </Route>
              <Route path="/top-posts">
                <TopPosts viewFocus={focus} memberSections={memberSections} onFocusChange={focusChangeHandler} />
              </Route>
              <Route path="/new-posts">
                <NewPosts viewFocus={focus} memberSections={memberSections} onFocusChange={focusChangeHandler} />
              </Route>
              <Route path="/search">
                <Search viewFocus={focus} onFocusChange={focusChangeHandler} search={search} />
              </Route>
              <Route path="/create-new-section">
                <SectionForm onFocusChange={focusChangeHandler} />
              </Route>
              <Route path="/create-new-post">
                <PostForm defaultSection={defaultSection} onFocusChange={focusChangeHandler} />
              </Route>
              <Route path="/section">
                <Section viewFocus={focus} isLoggedIn={isLoggedIn} userId={userId} onMakePost={defaultSectionHandler} onFocusChange={focusChangeHandler}/>
              </Route>
              <Route path="/post/:id">
                <Post viewFocus={focus} isLoggedIn={isLoggedIn} userId={userId} onFocusChange={focusChangeHandler}/>
              </Route>
              <Route path="/user">
                <User viewFocus={focus} isLoggedIn={isLoggedIn} userId={userId} onFocusChange={focusChangeHandler} />
              </Route>
            </Switch>
          </div>
        </div>
    </div>
  );
}

export default withRouter(App);
