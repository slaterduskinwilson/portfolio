import {useState, useEffect} from 'react'
import sanityClient from '../client'
import {Link} from 'react-router-dom'
import Navbar from './Navbar'

export default function AllPosts() {

    const [allPostsData, setAllPosts] = useState(null)

    useEffect(() => {
        sanityClient.fetch(
           
            `*[_type == 'post']{
                title,
                slug,
                mainImage{
                    asset->{
                        _id,
                        url
                    }
                }
            }`
        )
         //query for all of the things are are type: post, bringing in the title, the slug, and the main image. within the main image, we need that image's id and url. groq!
        .then((data) => setAllPosts(data))
        .catch(console.error)
    }, [])
    //remember the empty array, so that this process doesn't just keep running forever

  return (
      <div className="bg-yellow-200 min-h-screen pb-12">


    
           <Navbar />

      
    <div className="container mx-auto">
       
        <div className="main-content h-5/6 m-4">

        
        <h2 className="text-4xl flex justify-center m-10">Slater Versus...</h2>
        <h3 className="text-lg text-gray-700 flex justify-center mt-6 mb-12">An Airing of Legitimate Grievances</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 ">
            {allPostsData &&
            allPostsData.map((post, index) => (
                <Link to={'/' + post.slug.current} key={post.slug.current} >
                <span className="bg-white block h-64 relative rounded shadow leading-snug border-l-8 border-pink-800" key={index}>
                    <img 
                    className="w-full h-full rounded-r object-cover absolute"
                    src={post.mainImage.asset.url} 
                    alt="main hero image for blog post" />
                    <span className="relative h-full flex justify-end items-end pr-4 pb-4">
                        <h2 className="text-lg font-bold px-3 py-4 bg-pink-700 text-yellow-200 bg-opacity-75 rounded">{post.title}</h2>
                    </span>
                </span>
                </Link>
            ))}
        </div>
        </div>
        </div>
        </div>
  )
}
