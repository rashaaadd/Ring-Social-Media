import React, { useState } from 'react'
import Posts from '../Posts/Posts'
import PostShare from '../PostShare/PostShare'
import './PostSide.css'

function PostSide() {
  const [posts , setPosts] = useState([])
  return (
    <div className="PostSide">
        <PostShare data={{ posts, setPosts }}/>
        <Posts data={{ posts, setPosts }}/>
    </div>
  )
}

export default PostSide
