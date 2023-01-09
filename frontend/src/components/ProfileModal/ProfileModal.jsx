import React, { useState, useEffect } from "react";
import { Modal, useMantineTheme } from "@mantine/core";
import "./ProfileModal.css";
import { useDispatch, useSelector } from "react-redux";
import { showLoading, hideLoading } from "../../redux/alertSlice";
import { toast } from "react-hot-toast";
import { USER } from "../../axios";
import { fetchUserById } from "../../redux/userSlice";

function ProfileModal({ modalOpened, setModalOpened }) {
  const token = localStorage.getItem('token')
  const { user } = useSelector((state) => state.users);
  const theme = useMantineTheme();
  const [formData, setFormData] = useState(user);
  const [profilePic, setProfilePic] = useState({});
  const [coverPic, setCoverPic] = useState({});
  const dispatch = useDispatch();
  
  useEffect(()=>{
    if(!user){
      dispatch(fetchUserById(token))
    }
  },[dispatch])

  useEffect(()=>{
      setFormData({...formData,...profilePic,...coverPic})
  },[profilePic,coverPic])

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setFormData((data) => ({ ...data, [name]: value }));
    console.log(formData,'formData')
  };
  const reset = () => {
    setProfilePic(null);
    setCoverPic(null);
    setFormData({});
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(showLoading());
      const response = await USER.post(`/${user?._id}/user`, formData);
      dispatch(hideLoading());
      if (response.data.status) {
        toast.success(response.data.message);
        setModalOpened(false);
        dispatch(fetchUserById(token));
        reset();
      } else {
        console.log(response);  
        toast.error(response.data.message)
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  const onDPImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      let img = e.target.files[0];
      setProfilePic({ profile: img });
    }
  };

  const onCoverImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      let img = e.target.files[0];
      setCoverPic({ cover: img });
    }
  };
  console.log(formData,'sdjadaksajd111')
  return (
    <Modal
      overlayColor={
        theme.colorScheme === "dark"
          ? theme.colors.dark[9]
          : theme.colors.gray[2]
      }
      overlayOpacity={0.55}
      overlayBlur={3}
      size="55%"
      opened={modalOpened}
      onClose={() => setModalOpened(false)}
    >
      <form className="infoForm" encType="multipart/form-data">
        <h3>Your Info</h3>
        <div>
          <div className="d-flex col-6">
            <label htmlFor="fname" className="label">
              First Name
            </label>
            <input
              type="text"
              className="infoInput"
              name="fname"
              id="fname"
              defaultValue={formData?.fname}
              onChange={handleChange}
            />
          </div>
          <div className="d-flex col-6">
            <label htmlFor="lname" className="label">
              Last Name
            </label>
            <input
              type="text"
              className="infoInput"
              name="lname"
              id="lname"
              defaultValue={formData?.lname}
              onChange={handleChange}
            />
          </div>
        </div>
        <div>
          <div className=" d-flex col-6">
            <label htmlFor="dob" className="label">
              Date of Birth
            </label>
            <input
              type="date"
              className="infoInput"
              name="dob"
              id="dob"
              defaultValue={formData?.details?.dob?.slice(0,10)}
              onChange={handleChange}
            />
          </div>
          <div className=" d-flex col-6">
            <label htmlFor="gender" className="label">
              Gender
            </label>
            <select
              className="form-select infoSelect"
              aria-label="Default select example"
              name="gender"
              id="gender"
              defaultValue={formData?.details?.gender}
              onChange={handleChange}
            >
              <option selected defaultValue>
                Choose Gender
              </option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>
        </div>
        <div>
          <div className="d-flex col-12">
            <label htmlFor="bio" className="label">
              Bio
            </label>
            <input
              type="text"
              className="infoInput"
              name="bio"
              id="bio"
              defaultValue={formData?.details?.bio}
              onChange={handleChange}
            />
          </div>
        </div>
        <div>
          <div className="d-flex col-6">
            <label htmlFor="relation" className="label">
              Gender
            </label>
            <select
              className="form-select infoSelect"
              name="relation"
              defaultValue={formData?.details?.relation}
              onChange={handleChange}
            >
              <option selected defaultValue>
                Choose Relation Status
              </option>
              <option>Single</option>
              <option>In Relationship</option>
              <option>Married</option>
            </select>
          </div>
          <div className="d-flex col-6">
            <label htmlFor="work" className="label">
              Works At
            </label>
            <input
              type="text"
              className="infoInput"
              name="work"
              defaultValue={formData?.details?.work}
              onChange={handleChange}
            />
          </div>
        </div>
        <div>
          <div className="d-flex col-6">
            <label htmlFor="city" className="label">
              City
            </label>
            <input
              type="text"
              className="infoInput"
              name="city"
              defaultValue={formData?.details?.city}
              onChange={handleChange}
            />
          </div>
          <div className="d-flex col-6">
            <label htmlFor="country" className="label">
              Country
            </label>
            <input
              type="text"
              className="infoInput"
              name="country"
              defaultValue={formData?.details?.country}
              onChange={handleChange}
            />
          </div>
        </div>
        <div>
          <div className="d-flex col-6">
            <label className="label" htmlFor="profilePic">
              Profile Image
            </label>
            <input
              type="file"
              id="profilePic"
              name="profilePic"
              onChange={onDPImageChange}
              multiple={false}
            />
          </div>
          <div className="d-flex col-6">
            <label className="label" htmlFor="profilePic">
              Cover Image
            </label>
            <input
              type="file"
              id="coverPic"
              name="coverPic"
              onChange={onCoverImageChange}
              multiple={false}
            />
          </div>
        </div>
        <button
          className="button infoButton"
          type="submit"
          onClick={handleSubmit}
        >
          Update
        </button>
      </form>
    </Modal>
  );
}
export default ProfileModal;
