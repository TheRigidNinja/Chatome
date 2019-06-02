import React from 'react'

function InboxPeople() {
    return (
        <>
            <div className="Template2 Person" usermsgkey={0} onClick={0}>
                <span id="ProfilePic">
                    <img src="../public/Img/User.svg" alt="IMG"/>
                    <span id="status"></span>
                </span>
                <div className="details">
                    <h4>NAN</h4>
                    <p>---</p>
                </div>
                <time>8:40pm</time>
            </div> 
        </>
    )
}

export default InboxPeople
