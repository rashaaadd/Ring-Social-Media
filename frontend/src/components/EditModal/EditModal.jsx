import React, { useState } from 'react'
import { Modal, useMantineTheme } from "@mantine/core";
import { useDispatch } from 'react-redux';
import { hideLoading, showLoading } from '../../redux/alertSlice';
import { POSTS_API, POSTS_POST } from '../../axios';
import { toast } from 'react-hot-toast';


function EditModal({ editmodalOpened, setEditModalOpened,data }) {
    const theme = useMantineTheme();
    const dispatch = useDispatch();

    const [ formData, setFormData ] = useState({
        desc:''
    })

    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setFormData((data)=>({...data, [name]: value}))
    }

    const handleSubmit = async(e) => {
        e.preventDefault();
        console.log(formData)
        try {
            dispatch(showLoading())
            const response = await POSTS_API.put(`/${data?._id}`,formData)
            dispatch(hideLoading())
            if(response.data.status){
                toast.success(response.data.message)
                setEditModalOpened(false)
            }
        } catch (error) {
            console.log(error)
            dispatch(hideLoading())
            toast.error(error.response.data.message)
            setEditModalOpened(false)
        }
    }
    return (
        <Modal
          overlayColor={
            theme.colorScheme === "dark"
              ? theme.colors.dark[9]
              : theme.colors.gray[2]
          }
          overlayOpacity={0.55}
          overlayBlur={3}
          size="40%"
          opened={editmodalOpened}
          onClose={() => setEditModalOpened(false)}
        >
          <form className="infoForm" encType="multipart/form-data" onSubmit={handleSubmit}>
            <h3>Edit Post</h3>
            <div>
              <input
                type="text"
                className="infoInput"
                name="desc"
                placeholder={data?.desc}
                onChange={handleChange}
              />
            </div>
            <button
              className="button infoButton"
              type="submit"
            >
              Update
            </button>
          </form>
        </Modal>
      );
}

export default EditModal
