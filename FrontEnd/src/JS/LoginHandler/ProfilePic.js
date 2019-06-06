import React from "react";
import Camera from "./CameraHandler";

function ProfilePic() {
  return (
    <>
    <Camera/>

      <i className="fas fa-camera" />
      <img
        src="../public/img/User.svg"
        alt="Avatar"
        title="Choose your avatar"
        id="picture"
      />
    </>
  );
}

export default ProfilePic;
