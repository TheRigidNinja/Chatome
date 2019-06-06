import React from "react";
import Camera from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';
import "../../CSS/RegisterPhoto.css"
import { async } from "q";




function CameraHandler() {

    const OnTakePhoto = (dataUri)=>{
        const blob = new Blob([dataUri], {type: 'application/octet-stream'}),
        imgSrc = URL.createObjectURL(blob);
        console.log(imgSrc);
        if (imgSrc !== ""){
            return <img alt="No" src={imgSrc}/>
        }else{
            return <img alt="No" src="##"/>
        }
    }


  return (
    <div className="RegisterPic">
        <Camera onTakePhoto = { (dataUri) => {OnTakePhoto(dataUri)} }/>

        <OnTakePhoto/>
    </div>
  );
}

export default CameraHandler;
