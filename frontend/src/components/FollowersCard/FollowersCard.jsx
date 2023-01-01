import React, { useState } from 'react'
import './FollowersCard.css'
import { useDispatch,useSelector } from 'react-redux'
import { hideLoading, showLoading } from '../../redux/alertSlice'
import { useEffect } from 'react'
import { USER_API_GET, USER_API_PUT } from '../../axios'
import { fetchUserById } from '../../redux/userSlice'
import { toast } from 'react-hot-toast'
import Profile from "../../img/profileImg.jpg";
import { useNavigate } from "react-router-dom"

function FollowersCard() {
  const token = localStorage.getItem('token')
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const  {user}  = useSelector((state) => state.users)
  const [followers, setFollowers ] = useState([])


  const handleProfileClick = (e,data) => {
    navigate(`/profile/${data?.username}`,{state:data})
  }
  useEffect(() => {
    (async() => {
      try {
        dispatch(showLoading())
        const response = await USER_API_GET('/allusers')
        dispatch(hideLoading())
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
      toast.success(response.data.message)
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
              <div onClick={(e)=>handleProfileClick(e,follower)}>
                <img src={follower.profilePic ? follower.profilePic : Profile} alt="" 
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
