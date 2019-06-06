import React from 'react'

export default function InboxPeople({peopleData,TogglePage}) {

    const People = ()=>{
        var arryCnt = 0;

        return(
        peopleData.map(data => {
        return(
        <>
          <div className="Person" messageKey={data.ID} onClick={()=>TogglePage("Messaging",data.ID)}>
            <span id="ProfilePic">
              <img src={data.picture} alt="IMG" />
              <span id="status" />
            </span>
            <div className="details">
              <h4>{data.userName}</h4>
              <p>---</p>
            </div>
            <time>8:40pm</time>
          </div>
        </>  
        )
    }))}

    // console.log(People);


    return <People/>
}

