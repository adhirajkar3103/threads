import { useEffect, useState } from "react";
import UserHeader from "../components/UserHeader";
import { useParams } from "react-router-dom";
import useShowToast from "../hooks/useShowToast";
import Post from '../components/Post'
const UserPage = () => {
  const [user, setUser] = useState(null);
  const [posts,setPosts] = useState([])
  const { username } = useParams();
  const showToast = useShowToast();
  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`api/users/profile/${username}`);
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        setUser(data);
      } catch (error) {
        showToast("Error", error, "error");
      }
    };
    const getPosts = async ()=>{
      try {
        const res = await fetch(`/api/posts/user/${username}`)
        const data = await res.json()
        console.log(data)
        setPosts(data)
      } catch (error) {
        showToast('Error',error,'error')
      }
    }
    getUser();
    getPosts();
  }, [showToast, username]);

  if(!user) return null;
  return (
    <>
      <UserHeader user={user} />
      { posts.length !==0 &&
        posts.map((post)=>{
          return <Post key={post._id} userId={username} post={post} />
        })
      }
    </>
  );
};

export default UserPage;
