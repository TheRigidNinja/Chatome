import React from 'react'

function OnlinePeople() {
    return (
        <div className="onlinePeople">
            <div className="Onlineperson" onClick={0}>
                <img src="../public/Img/Story.svg" alt="IMG"/>
                <h6>Your story</h6>
            </div>
            <div className="Onlineperson" usermsgkey={0} onClick={0}>
                <img src="../public/Img/User.svg"/>
                <span id="status"></span>
                <h6>NAN</h6>
            </div>
        </div>
    )
}

export default OnlinePeople
