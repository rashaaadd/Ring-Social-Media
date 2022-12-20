import React, { useEffect, useState } from "react";
import ProfileImg from "../../img/profileImg.jpg";
import "./PostShare.css";
import { UilScenery } from "@iconscout/react-unicons";
import { UilPlayCircle } from "@iconscout/react-unicons";
import { UilLocationPoint } from "@iconscout/react-unicons";
import { UilSchedule } from "@iconscout/react-unicons";
import { UilTimes } from "@iconscout/react-unicons";
import { useRef } from "react";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { POSTS, POSTS_POST } from "../../axios";
import  { PostsData }  from '../../Data/PostData'
import { hideLoading, showLoading } from "../../redux/alertSlice";
import { Image } from 'cloudinary-react'


function PostShare({data}) {
  const { posts, setPosts } = data
  console.log(posts,'hello this is posts')
  const loading = useSelector((state) => state.alerts.loading)
  const [image, setImage] = useState({});
  const [displayImage, setDisplayImage] = useState({})
  const imageRef = useRef();
  const [formData,setFormData] = useState({
    desc: ''
  });
  const dispatch = useDispatch()
  const onImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      let img = e.target.files[0];
      setDisplayImage({image: URL.createObjectURL(img)});
      setImage({image:img});
    }
  };

  function handleChange(e) {
    const name = e.target.name;
    const value = e.target.value;
    setFormData((data) => ({ ...data, [name]: value }));
  }
  const reset = () => {
    setDisplayImage(null);
    setImage(null);
    setFormData({
      desc: ''
    });
  }
  const handleSubmitPostUpload = async (e) => {
    e.preventDefault();
    if(!image) return toast.error("Please choose a file");
    console.log(formData,'formData.......111')
    try {
      dispatch(showLoading())
      const response = await POSTS_POST('/create',formData)
      console.log(response,'response after creating post')
      dispatch(hideLoading())
      if(response.data.status){
        toast.success(response.data.message)
        setPosts([response.data.data,...posts])
        reset();
      }
    } catch (error) {
      dispatch(hideLoading())
      console.error(error)
      toast.error(error.response.data.message)
    }

  }
  useEffect(() => {
    setFormData({...formData,...image})
  },[image])

  return (
    <div className="PostShare">
      <img src={ProfileImg} alt="ProfileImage" />
      <form encType="multipart/form-data" onSubmit={handleSubmitPostUpload}>
        <input type="text" placeholder="What's happening" name="desc" value={formData.desc} onChange={handleChange}/>
        <div className="postOptions">
          <div
            className="option"
            style={{ color: "var(--photo)" }}
            onClick={() => imageRef.current.click()}
          >
            <UilScenery />
            Photo
          </div>
          <div className="option" style={{ color: "var(--video)" }}>
            <UilPlayCircle />
            Video
          </div>
          <div className="option" style={{ color: "var(--location)" }}>
            <UilLocationPoint />
            Location
          </div>
          <div className="option" style={{ color: "var(--schedule)" }}>
            <UilSchedule />
            Schedule
          </div>
          <div style={{ display: "none" }}>
            <input
              type="file"
              name="image"
              ref={imageRef}
              multiple={false}
              onChange={onImageChange}
            />
          </div>
          <button className="button ps-button" type="submit" disabled={loading}>{loading ? 'Loading...' : 'Share'}</button>
        </div>
        {displayImage && (
          <div className="previewImage">
            <UilTimes onClick={() => setImage(null)} />
            <Image src={`${displayImage.image}`} alt="" />
          </div>
        )}
      </form>
    </div>
  );
}

export default PostShare;
