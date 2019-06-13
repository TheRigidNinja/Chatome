import React from 'react'
import socketIOClient from "socket.io-client";

export function Socket() {
    return socketIOClient("http://da4fb8ca.ngrok.io/");//http://localhost:8080
}


