import React from 'react'
import { Followers } from '../../Data/FollowersData'
import './FollowersCard.css'

function FollowersCard() {
  return (
    <div className="FollowersCard">
      <h5>Who is following you</h5>
        {Followers.map((follower,i)=>{
          return(
            <div className="follower" key={follower.name}>
              <div>
                <img src={follower.img} alt="" 
                className='followerImg'/>
                <div className="name">
                  <span>{follower.name}</span>
                  <span>{follower.username}</span>
                </div>
              </div>
              <button className='button fc-button'>
                Follow
              </button>
            </div>
          )
        })}
    </div>
  )
}

export default FollowersCard
