// npm install -g @sanity/cli && sanity init --project-plan boosted-free-2021-12-08

import {BrowserRouter, Route, Routes} from 'react-router-dom'
// import {useState, useEffect} from 'react'
import sanityClient from './client'
import AllPosts from './components/AllPosts.js'
import OnePost from './components/OnePost.js'
import SubPage from './components/SubPage.js'


function App() {



  return (
<BrowserRouter>

<div>
  <Routes>
  <Route element={<AllPosts/>} path='/' exact /> 
  <Route element={<OnePost/>} path='/:slug' /> 
  <Route element={<SubPage/>} path='/sub/:slug' />


 
  </Routes>
</div>
</BrowserRouter>
);
}


export default App;
