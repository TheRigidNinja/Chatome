import React from 'react'
import socketIOClient from "socket.io-client";

export function Socket() {
    return socketIOClient("http://localhost:8080");//http://localhost:8080
}


