import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import sanityClient from '../client'
import imageUrlBuilder from '@sanity/image-url'
import BlockContent from '@sanity/block-content-to-react'
//this package will let us grab the entire "block" that is the "body" of our blog posts. So like, if our body text has html elements or images in it... we can get those all together. convenient!
import Navbar from './Navbar'

const builder = imageUrlBuilder(sanityClient)
function urlFor(source) {
    return builder.image(source)
}
//this is our setup for image-url which we imported from sanity

export default function OnePost() {
    const [postData, setPostData] = useState(null)
    const { slug } = useParams()
    //useParams grabs our dynamic "req.params" data from the parent route's path

    useEffect(() => {
        sanityClient
            .fetch(
                //so we don't have to create a component for every single blog post... we just create ONE blog post component, and pull in the data of the slug of whichever post we click on in our AllPosts component
                //the quotes labels are "aliases"
                `*[slug.current == $slug]{
                title,
                publishedAt,
                slug,
                mainImage {
                    asset->{
                        _id,
                        url
                    }
                },
                body,
                "name": author->name,
                "authorImage": author->image,
                
            }
            `,
                { slug }
            )
            .then(data => {
                setPostData(data[0])
                return data[0]})
            .catch(console.error)
    }, [slug])

    if (!postData) return <div>loading...</div>

   

    return (
        <>
        <Navbar />
        <div className="bg-yellow-200 min-h-screen  pb-12">
            {/* <div className="hidden lg:block lg:fixed w-full  z-10  ">
            <Navbar />
            </div> */}

            <div className="container relative shadow-lg mx-auto bg-yellow-100 rounded-lg flex flex-col">

            
               
          
                    <div className="title-and-image flex flex-col md:flex-row w-full h-auto">
                    <img
                        className="w-full object-cover rounded-b"
                        style={{ height: 'auto' }}
                        // src={urlFor(postData.mainImage).width(200).url()}
                        src={urlFor(postData.mainImage).url()}
                        alt="main image of post"
                    />

<div className="title-card absolute top-0 lg:bottom-20 bg-pink-700 bg-opacity-80  lg:p-4 flex flex-wrap items-center w-3/4 h-fit">


<div className="author-and-date flex flex-col align-start justify-start text-yellow-200 p-2 ml-4 mr-8 w-1/6">
        <div className="author-image">
            <img
                className="rounded"
                // className="w-10 h-10 rounded-full"
                src={urlFor(postData.authorImage)
                    .width(100)
                    .url()}
                alt="written by Matt"
            />
            {/* here's another way to grab an image, different from the way we did it in AllPosts which was from our groq query... npm i @sanity/image-url ... the image-url package lets us chain a whole bunch of stuff onto our image tags, like width etc*/}
            
        </div>


        <h4 className="md:text-2xl text-sm mt-2">
            {postData.name}
                {/* remember... "name" : author->name (see above) - this is the name we're referring to here */}
        </h4>
    
        <p className="text-xs md:text-sm text-yellow-200">{postData.publishedAt}</p>

    </div>

<div className="w-1/2 m-1 p-2">
<h2 className="text-xl md:text-3xl lg:text-5xl">
        {postData.title}
        
    </h2>

</div>
                    

    
    
</div>


                    </div>
                    {/* title and image div */}



                    <div className="px-10 lg:px-48 py-10 lg:py-10 mt-1 prose lg:prose-xl max-w-full">
                    {/* remember, prose is our typography class! */}

                    <BlockContent
                        blocks={postData.body}
                        projectId={sanityClient.clientConfig.projectId}
                        dataset={sanityClient.clientConfig.dataset}
                    />
                </div>

                            
                    </div>

               
             
            
            </div>
            </>
        
    )
}
