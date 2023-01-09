import React from 'react' 
// import LogoSearch from '../LogoSearch/LogoSearch';
import ProfileCard from '../ProfileCard/ProfileCard';
import './ProfileSide.css'

function ProfileSide() {
  return (
    <div className='ProfileSide'>
      {/* <LogoSearch/> */}
      <ProfileCard path='homePage'/>
    </div>

    
  )
}

export default ProfileSide;
