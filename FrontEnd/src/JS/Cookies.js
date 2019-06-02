import React from 'react'


function SetCookie(cname,cvalue){
    let date = new Date(),
    expires = "expires="+ date.setTime(date.getTime() + (1*24*60*60*1000));

    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";

    return "Success"
}


function GetsCookie(name){

    var re = new RegExp(name + "=([^;]+)");
    var value = re.exec(document.cookie);

    return (value != null) ? value[1]: null;
}




export function Cookies(Type,CookieData) {

    if(Type === "SET"){

       return SetCookie(CookieData.name,CookieData.value);

    }else if(Type === "GET"){

        return GetsCookie(CookieData.name);

    }else{

      return "Type did not match"  

    }
    
    
}
