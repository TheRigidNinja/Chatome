import React from 'react'

function OnlinePeople() {
    return (
        <div class="onlinePeople">
            <div class="Onlineperson" onClick={0}>
                <img src="../public/Img/Story.svg"/>
                <h6>Your story</h6>
            </div>
            <div class="Template1 Onlineperson" data-UserID={0} onClick={0}>
                <img src="../public/Img/User.svg"/>
                <span id="status"></span>
                <h6>NAN</h6>
            </div>
        </div>
    )
}

export default OnlinePeople
