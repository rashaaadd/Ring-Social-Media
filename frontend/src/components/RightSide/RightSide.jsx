import React, { useState } from 'react'
import './RightSide.css'
import Home from '../../img/home.png'
import Noti from '../../img/noti.png'
import Comment from '../../img/comment.png'
import FollowersCard from '../FollowersCard/FollowersCard'
import { Link } from 'react-router-dom'

function RightSide() {
  // const [modalOpened, setModalOpened] = useState(false);
  return (
    <div className="RightSide">
        <div className="navIcons">
            <Link to={'/home'}><img src={Home} alt="" /></Link>
            <img src={Noti} alt="" />
            <img src={Comment} alt="" />
        </div>

      
        <FollowersCard/>

        
    </div>
  )
}

export default RightSide
