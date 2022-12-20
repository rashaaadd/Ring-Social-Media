import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { POSTS_API } from '../../axios'
import { PostsData } from '../../Data/PostData'
import { hideLoading, showLoading } from '../../redux/alertSlice'
import Post from '../Post/Post'
import './Posts.css'

function Posts({data}) {
  const { posts, setPosts } = data
  const {user} = useSelector((state) => state.users)
  const dispatch = useDispatch();
  
  useEffect(() => {
    (async() => {
      try {
        dispatch(showLoading())
        const response  = await POSTS_API.get('/timeline')
        if(response.data.status){ 
          console.log(response.data,'response in posts folder')
          setPosts(response.data.data)
        }
        dispatch(hideLoading())
      } catch (error) {
        dispatch(hideLoading())
        console.log(error)
        toast.error(error.response.data.message)
      }
    })();
  },[])

  return (
    <div className="Posts">
        {posts?.map((post,id)=>{
            return <Post data={post} id={user?.id} key={post?._id}/>
        })}
    </div>
  )
}

export default Posts
