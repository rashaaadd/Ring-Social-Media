import React from 'react'
import LogoSearch from '../LogoSearch/LogoSearch'
import FollowersCard from '../FollowersCard/FollowersCard'
import InfoCard from '../InfoCard/InfoCard'

function ProfileLeft() {
  return (
    <div className="ProfileSide">
        <LogoSearch/>
        <InfoCard/>
    </div>
  )
}

export default ProfileLeft
