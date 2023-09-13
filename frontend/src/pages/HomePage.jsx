import {  Flex, Spinner } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import useShowToast from "../hooks/useShowToast"
import Post from '../components/Post'

const HomePage = () => {
  const showToast = useShowToast();
  const [posts,setPosts] = useState([])
  const [loading,setLoading] = useState(true)
  useEffect(()=>{
    const getFeedPosts = async () =>{
      setLoading(true)
      try {
        const res = await fetch(`/api/posts/feed`);
        const data = await res.json()
        if(data.error){
          showToast('Error',data.error,'error')
          return;
        }
        setPosts(data)
      } catch (error) {
        showToast('Error',error.message,'error');
      }finally{
        setLoading(false)
      }
    }
    getFeedPosts();
  },[showToast])
  return (
    <>
        {
          loading && (
            <Flex justify='center'>
              <Spinner size='xl' />
            </Flex>
          )
        }
        {
          !loading && posts.length === 0 && (<h1>Folllow some users to see this feed!</h1>)
        }
        {
          posts.map((post)=>{
            return <Post key={post._id} post={post} userId={post.postedBy} />
          })
        }
    </>
  )
}

export default HomePage