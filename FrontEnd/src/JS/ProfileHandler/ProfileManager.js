import React from 'react'

function ProfileManager() {
    return (
        <>
            {/* User Email */}
            <div className="Person" usermsgkey={0} onClick={0}>
                <img src="../public/Img/User.svg" alt="IMG"/>
                <div className="details">
                    <h4>NAN</h4>
                    <p>---</p>
                </div>
                <time>8:40pm</time>
            </div>

            {/* User Phone number */}
            <div className="Person" usermsgkey={0} onClick={0}>
                <img src="../public/Img/User.svg" alt="IMG"/>
                <div className="details">
                    <h4>NAN</h4>
                    <p>---</p>
                </div>
                <time>8:40pm</time>
            </div>

            {/* UserNickName */}
            <div className="Person" usermsgkey={0} onClick={0}>
                <img src="../public/Img/User.svg" alt="IMG"/>
                <div className="details">
                    <h4>NAN</h4>
                    <p>---</p>
                </div>
                <time>8:40pm</time>
            </div>
        </>
    )
}

export default ProfileManager
