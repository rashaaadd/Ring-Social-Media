import React from 'react'
import PostSide from '../../components/PostSide/PostSide'
import ProfileSide from '../../components/ProfileSide/ProfileSide'
import RightSide from '../../components/RightSide/RightSide'
import './Home.css'

function Home() {
  return (
    <div className='Home'>
      <ProfileSide/>
      <div className='home-center'>
        <PostSide/>
      </div>
      <RightSide/>
    </div>
  )
}

export default Home
