import React, { useState } from 'react'
import './FollowersCard.css'
import { useDispatch,useSelector } from 'react-redux'
import { hideLoading, showLoading } from '../../redux/alertSlice'
import { useEffect } from 'react'
import { USER_API_GET, USER_API_PUT } from '../../axios'
import { fetchUserById } from '../../redux/userSlice'

function FollowersCard() {
  const token = localStorage.getItem('token')
  const dispatch = useDispatch()
  const  {user}  = useSelector((state) => state.users)
  const [followers, setFollowers ] = useState([])
  useEffect(() => {
    (async() => {
      try {
        dispatch(showLoading())
        const response = await USER_API_GET('/allusers')
        dispatch(hideLoading())
        console.log(response,'response @ followers card')
        if(response.data.status){
          setFollowers(response.data.data)
        }
      } catch (error) {
        dispatch(hideLoading())
        console.log(error)
      }
    })();
  },[])

  const handleFollow = async (id) => {
    try {
      dispatch(showLoading())
      const response = await USER_API_PUT(`/${id}/follow`)
      dispatch(hideLoading())
      console.log(response,'response @ following card')
      dispatch(fetchUserById(token))
    } catch (error) {
      dispatch(hideLoading())
      console.log(error)
    }
  }
  return (
    <div className="FollowersCard">
      <h5>People you may know</h5>
        {followers.map((follower,i)=>{
          return(
            <div className="follower" key={follower._id}>
              <div>
                <img src={follower.img} alt="" 
                className='followerImg'/>
                <div className="name">
                  <span>{follower.name}</span>
                  <span>{follower.username}</span>
                </div>
              </div>
              <button className='button fc-button' onClick={()=>handleFollow(follower._id)}>
                {user?.following?.includes(follower._id) ? "Unfollow" : "Follow" }
              </button>
            </div>
          )
        })}
    </div>
  )
}

export default FollowersCard
