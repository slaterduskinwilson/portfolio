import {useState, useEffect} from 'react'
import {useParams} from 'react-router-dom'
import sanityClient from "../client"
import BlockContent from "@sanity/block-content-to-react"
import Navbar from './Navbar'

export default function SubPage() {

    const [pageData, setPageData] = useState(null)
    const {slug} = useParams()

    useEffect(() => {
        sanityClient.fetch(
            `*[slug.current == $slug]{
                title,
                slug,
                body
            }
            `,
            {slug}
        )
        .then(data => setPageData(data[0]))
        .catch(console.error)
    }, [slug])

    if(!pageData) return <div>loading...</div>


  return (
    <div className="bg-yellow-200 min-h-screen px-12 pb-12">
         
          <Navbar />

          <div className="container shadow-lg mx-auto bg-yellow-100 rounded-lg">

          <h1 className="text-3xl lg:text-6xl mb-4">{pageData.title}</h1>

          <BlockContent 
            blocks={pageData.body}
            projectId={sanityClient.clientConfig.projectId}
            dataset={sanityClient.clientConfig.dataset}
            />
              
              </div>


    </div>
  )
}
