import React, { useState, useEffect } from "react";
import { Modal, useMantineTheme } from "@mantine/core";
import "./ProfileModal.css";
import { useDispatch, useSelector } from "react-redux";
import { showLoading, hideLoading } from "../../redux/alertSlice";
import { toast } from "react-hot-toast";
import { USER, USER_PUT } from "../../axios";

function ProfileModal({ modalOpened, setModalOpened }) {
  const { user } = useSelector((state) => state.users);
  const theme = useMantineTheme();
  const [formData, setFormData] = useState({});
  const [profilePic, setProfilePic] = useState({});
  const [coverPic, setCoverPic] = useState({});
  const dispatch = useDispatch();
  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setFormData((data) => ({ ...data, [name]: value }));
  };
  const reset = () => {
    setProfilePic(null);
    setCoverPic(null);
    setFormData({});
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(user,'hello')
      dispatch(showLoading());
      const response = await USER.post(`/${user?._id}`, formData);
      dispatch(hideLoading());
      if(response.data.status){
        toast.success(response.data.message)
        setModalOpened(false)
        reset()
      }else{
        toast.error('Error updating user.')
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      toast.error(error.response.data.message);
    }
  };
  useEffect(() => {
    setFormData({ ...formData, ...profilePic, ...coverPic });
  }, [profilePic,coverPic]);

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
          <input
            type="text"
            className="infoInput"
            name="fname"
            placeholder="First Name"
            onChange={handleChange}
          />
          <input
            type="text"
            className="infoInput"
            name="lname"
            placeholder="Last Name"
            onChange={handleChange}
          />
        </div>
        <div>
          <input
            type="date"
            className="infoInput"
            name="dob"
            placeholder="Date"
            onChange={handleChange}
          />
          <select
            className="form-select infoSelect"
            aria-label="Default select example"
            name="gender"
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
        <div>
          <input
            type="text"
            className="infoInput"
            name="bio"
            placeholder="Bio"
            onChange={handleChange}
          />
        </div>
        <div>
          <select
            className="form-select infoSelect"
            aria-label="Default select example"
            name="relation"
            onChange={handleChange}
          >
            <option selected defaultValue>
              Choose Relation Status
            </option>
            <option>Single</option>
            <option>In Relationship</option>
            <option>Married</option>
          </select>
          <input
            type="text"
            className="infoInput"
            name="work"
            placeholder="Work At"
            onChange={handleChange}
          />
        </div>
        <div>
          <input
            type="text"
            className="infoInput"
            name="city"
            placeholder="City"
            onChange={handleChange}
          />
          <input
            type="text"
            className="infoInput"
            name="country"
            placeholder="Country"
            onChange={handleChange}
          />
        </div>
        <div>
          Profile Image
          <input
            type="file"
            id="profilePic"
            name="profilePic"
            onChange={onDPImageChange}
            multiple={false}
          />
          Cover Image
          <input type="file" id="coverPic" name="coverPic" onChange={onCoverImageChange} multiple={false}/>
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
