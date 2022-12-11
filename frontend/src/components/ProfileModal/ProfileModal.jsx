import React from 'react'
import { Modal, useMantineTheme } from "@mantine/core";

function ProfileModal({ modalOpened, setModalOpened }) {
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
      size = '55%'
      opened={modalOpened}
      onClose={() => setModalOpened(false)}
    >
      <form className="infoForm">
        <h3>Your Info</h3>

        <div>
          <input
            type="text"
            className="infoInput"
            name="firstname"
            placeholder="First Name"
           />
           <input
            type="text"
            className="infoInput"
            name="lastname"
            placeholder="Last Name"
           />
        </div>
        <div>
        <input
            type="text"
            className="infoInput"
            name="worksAt"
            placeholder="Works at"
           />
        </div>
        <div>
          <input
            type="text"
            className="infoInput"
            name="firstname"
            placeholder="Lives in"
           />
           <input
            type="text"
            className="infoInput"
            name="country"
            placeholder="Country"
           />
        </div>
        <div>
            <input type="text"
            className="infoInput"
            name="relationshipStatus"
            placeholder="Relationship Status" 
            />
        </div>
        <div>
            Profile Image
            <input type="file" name="profileImg" />
            Cover Image
            <input type="file" name="coverImg" />            
        </div>
        <button className="button infoButton">Update</button>
      </form>
    </Modal>
  );
}
export default ProfileModal;
