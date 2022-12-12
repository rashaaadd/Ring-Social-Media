import React from 'react'
import { PostsData } from '../../Data/PostData'
import Post from '../Post/Post'
import './Posts.css'

function Posts() {
  return (
    <div className="Posts">
        {PostsData.map((post,id)=>{
            return <Post data={post} id={id} key={id}/>
        })}
    </div>
  )
}

export default Posts
