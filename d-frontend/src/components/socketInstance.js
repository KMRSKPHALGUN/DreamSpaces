import { io } from "socket.io-client";

const localhost = localStorage.getItem('localhost');
const user = JSON.parse(localStorage.getItem('client'));
const socket = io.connect(`https://${localhost}:5000`)

if(user)
{
    socket.emit("initialize", user._id);
}

export default socket;