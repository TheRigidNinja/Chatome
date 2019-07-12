// import React from "react";

// ----- // Main function to determine which support function should fire
export default function Cookie(Actiontype, data) {
  if (Actiontype === "SET") {
    return SetCookie(data);
  } else if (Actiontype === "GET") {
    return GetsCookie(data);
  }
}

// ----- // Support function to handle getting or writting cookies
function SetCookie(data) {
  var objName = Object.keys(data),
    objValue = Object.values(data),
    date = new Date(),
    expires =
      "expires=" + date.setTime(date.getTime() + 1 * 24 * 60 * 60 * 1000);

  for (let i = 0; i < objValue.length; i++) {
    document.cookie =
      objName[i] + "=" + objValue[i] + ";" + expires + ";path=/";
  }

  return "Success";
}

function GetsCookie(key) {
  var Objvalues = [];
  for (let i = 0; i < key.length; i++) {
    var re = new RegExp(key[i] + "=([^;]+)"),
      value = re.exec(document.cookie);
      value = value != null ? value[1] : null;

    Objvalues.push(value);
  }

  return Objvalues;
}
