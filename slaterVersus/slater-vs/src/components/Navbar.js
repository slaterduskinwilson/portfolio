import { useState, useEffect } from 'react'
import sanityClient from '../client'
import { Link } from 'react-router-dom'
import './Navbar.css'

export default function NavBar() {
    const [links, setLinks] = useState([])

    useEffect(() => {
        sanityClient
            .fetch(
                `*[_type == 'subPage']{
            title,
            slug
            }`
            )
            .then(data => setLinks(data))
            .catch(console.error)
    }, [])

    return (
        <div className="navbar">
            <ul className="h-1/6 bg-pink-900 bg-opacity-90 text-yellow-100 py-4 lg:px-4 flex justify-around lg:justify-start flex-wrap">
              <li className="hover:underline cursor-pointer m-2 lg:mx-4">
                <Link to="/">Home</Link></li>
                {links.map((link, index) => (
                    <li key={index} className="hover:underline cursor-pointer m-2 lg:mx-4">
                        <Link 
                        to={'/sub/' + link.slug.current}
                        >{link.title}</Link>
                    </li>
                ))}
            </ul>


            {/* <li className="hover:underline cursor-pointer m-2"><Link to='/'>Home</Link></li>
                <li className="hover:underline cursor-pointer m-2">
                    <Link to='/about'>About</Link>
                </li>
                <li className="hover:underline cursor-pointer m-2"><Link to='/donate'>Donate</Link></li>
                <li className="hover:underline cursor-pointer m-2"><Link to='/otherprojects'>Other Projects</Link></li>
                
             */}
        </div>
    )
}
