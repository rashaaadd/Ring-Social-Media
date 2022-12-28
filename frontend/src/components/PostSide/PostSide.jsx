import React, { useState } from 'react'
import Posts from '../Posts/Posts'
import PostShare from '../PostShare/PostShare'
import './PostSide.css'
import { useLocation } from 'react-router-dom'

function PostSide() {
  const [posts , setPosts] = useState([])
  const location = useLocation()

  return (
    <div className="PostSide">
        {location.state? null : <PostShare data={{ posts, setPosts }}/>}
        <Posts data={{ posts, setPosts }}/>
    </div>
  )
}

export default PostSide
