import React from 'react'
import { Modal, useMantineTheme } from "@mantine/core";



function UsersModal({ usermodalOpened, setUserModalOpened,data }) {
    const theme = useMantineTheme();
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
          opened={usermodalOpened}
          onClose={() => setUserModalOpened(false)}
        >
            <div>
              <h4>Following</h4>
              {data?.map((user)=>{
                return(
                  <div className='d-flex mt-4' key={user._id}>
                    <img src={user?.profilePic} alt="" className='me-3'  style={{width:'40px',height:'40px',borderRadius:'20px'}}/>
                    <span>{user?.username}</span>
                  </div>
                )
              })}
            </div>
        </Modal>
      );
}

export default UsersModal
