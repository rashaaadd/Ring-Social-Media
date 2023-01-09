import React, { useEffect, useState } from "react";
import "./Settings.css";
import SettingsLeft from "../../components/SettingsLeft/SettingsLeft";
import SettingsBody from "../../components/SettingsBody/SettingsBody";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserById } from "../../redux/userSlice";


const Settings = () => {
  const token = localStorage.getItem('token')
  const [ savedPost, setSavedPost ] = useState(true)
  const [ changePass, setChangePass ] = useState(false)
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.users)
  useEffect(()=>{
    if(!user){
      dispatch(fetchUserById(token))
    }
  },[dispatch])

  return (
    <div className="Settings">
          <SettingsBody savedPost={savedPost} changePass={changePass}/>
          <SettingsLeft setChangePass={setChangePass} setSavedPost={setSavedPost}/>
    </div>
  );
};

export default Settings;
