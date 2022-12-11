import React from 'react'
import Logo from '../../img/logo1.png'
import './LogoSearch.css'
import {UilSearch} from '@iconscout/react-unicons'


function LogoSearch() {
  return (
    <div className='LogoSearch'>
      <img src={Logo} alt="Logo"  style={{width:'50px',height:'40px'}}/>
      <div className="Search">
        <input type="text" placeholder='#Explore'/>
        <div className="s-icon">
          <UilSearch/>
        </div>
      </div>
    </div>
  )
}

export default LogoSearch
