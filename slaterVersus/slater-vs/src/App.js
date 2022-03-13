// npm install -g @sanity/cli && sanity init --project-plan boosted-free-2021-12-08

import {BrowserRouter, Route, Routes} from 'react-router-dom'
// import {useState, useEffect} from 'react'
import sanityClient from './client'
import AllPosts from './components/AllPosts.js'
import OnePost from './components/OnePost.js'
import SubPage from './components/SubPage.js'
// import About from './components/About.js'
// import Donate from './components/Donate.js'
// import OtherProjects from './components/OtherProjects.js'

function App() {


  // const [subPages, setSubPages] = useState(null)

  // useEffect(() => {
  //   sanityClient.fetch(
  //     `*[_type == 'subPage']{
  //       title,
  //       slug
  //     }
  //     `
  //   )
  //   .then(data => setSubPages(data))
  //   .catch(console.error)

  // }, [])

  return (
<BrowserRouter>

<div>
  <Routes>
  <Route element={<AllPosts/>} path='/' exact /> 
  <Route element={<OnePost/>} path='/:slug' /> 
  <Route element={<SubPage/>} path='/sub/:slug' />
  {/* <Route element={<About/>} path='/about' /> 
  <Route element={<Donate/>} path='/donate' />  */}
  {/* <Route element={<OtherProjects/>} path='/other-projects' />  */}

 
  </Routes>
</div>
</BrowserRouter>
);
}


export default App;
