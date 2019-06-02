var userData = {},
    msgLoader = require("./ServerRequest/MSGDBHandler");

// Sets data in the DB
function setDataToDB(userInfo){

    for (let objKey in userInfo){

        if (userData[objKey] === undefined){ 
            userData[objKey] = {
                state: "",
                picture: "",
                newUser: "",
                msgKey:"",
                userName: objKey,
                email: {
                    detail: "",
                    lastUpdate: ""
                },
                phone: {
                    detail: "",
                    lastUpdate: ""
                },
                nickName: {
                    detail: "",
                    lastUpdate: ""
                },
                story: {
                    picture: "",
                    detail: "",
                    lastUpdate: ""
                },
                messageSection:async (actionType,key,msg)=>{
                    return await msgLoader.msgLoader(actionType,key,msg);
                }
            }
        }

        // This modefies data to the specific user in DB if changes happen on the profile
        for (let elm in userInfo[objKey]){

            if(["story","nickName","phone","email"].includes(elm)){
                let picture = elm == "story"?userInfo[objKey][elm].picture:"", 
                    detail = userInfo[objKey][elm].detail,
                    lastUpdate = userInfo[objKey][elm].lastUpdate;
                }

            switch(elm){
                case "story":
                    if(detail != ""){userData[objKey][elm].detail = detail};
                    if(picture != ""){userData[objKey][elm].picture = picture};
                    if(lastUpdate != ""){userData[objKey][elm].lastUpdate = lastUpdate};

                case ["nickName","phone","email"].includes(elm):
                    if(lastUpdate != ""){userData[objKey][elm].lastUpdate = lastUpdate};
                    if(detail != ""){userData[objKey][elm].detail = detail};

                default:
                    if(["state","picture","newUser","userName","msgKey"].includes(elm) &&
                    userInfo[objKey][elm] !==""){
                        userData[objKey][elm] = userInfo[objKey][elm];
                    }
            }
        }
    }

    return userData
}



module.exports = {
    setDataToDB: setDataToDB
}