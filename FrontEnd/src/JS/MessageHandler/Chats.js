import React from 'react'

function Chats() {
    return (
        <>
          <li className="replyMessage">
            <time>---</time>
            <div>
                <img src="../public/img/User.svg" id="userIcon" alt="IMG"/>
                <label>Name</label>
                <p>Testing</p>
            </div>
          </li>

          <li className="sentMessage">
            <time>--</time>
            <div>
                <label>Name</label>
                <p>---</p>
            </div>
          </li> 
        </>
    )
}

export default Chats
