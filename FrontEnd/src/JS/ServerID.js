function SetserverUserId(){
    let randStr =  (Math.random()*1000).toString(16).substring();
    SetCookie("serverUserId",randStr);
    
    return randStr
}


function GetserverUserId(serverReturnID){
    return GetsCookie("serverUserId") == serverReturnID
}