import { io, Socket } from "socket.io-client";
import $ from "jquery";


//Interfaces for socket
interface ServerToClientEvents {
  "chat message": (message: string) => void;
  "disconnected": () => void;
}
interface ClientToServerEvents {
  "chat message": (message: string) => void;
}

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(); //: Socket<ServerToClientEvents, ClientToServerEvents> 
let username: string;

//Used with method addToChat()
enum AddToChatTypes {
  me = "meUser",
  other = "otherUser"
}

//Set key binding
$(function () {
  $("#message").on("keyup", function (event) {
    if (event.which == 13) {
      event.preventDefault();
      $("#sendMessage").trigger("click");
    }
  });

  $("#chatBox").on('scroll', (e) => {
    showNotificationDot(true)
  })

  $("#sendMessage").on('click', (e) => {
    sendMessage()
  })
})

function showNotificationDot(onlyHide = false) {
  let isAtBottom: boolean = nearBottomScrollbar(document.getElementById('chatBox'))

  if (isAtBottom)
    $('.dot').hide()
  else if (!onlyHide)
    $('.dot').show()
}

function nearBottomScrollbar(ele: HTMLElement): boolean {
  let sh = ele.scrollHeight;
  let st = ele.scrollTop;
  let ht = ele.offsetHeight;
  let rangeValue = sh - ht

  if (ht == 0)
    return true;
  if (rangeValue < st + 10 && rangeValue > st - 10) { return true; }
  else { return false; }
}

function addToChat(msg: string, type: AddToChatTypes) {
  showNotificationDot()

  let today = new Date();
  let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  msg = time + "<br />" + msg
  document.getElementById("chatBox").innerHTML += "<div class='" + type + "'>" + msg + "</div><br />"

}

function sendMessage() {
  let element: HTMLInputElement = (<HTMLInputElement>document.getElementById('message'))
  let msg: string = element.value
  if (msg.trim() != "") {
    socket.emit('chat message', msg);
    addToChat(msg, AddToChatTypes.me);
    element.value = "";
  }
}
socket.on('chat message', function (msg: string) {
  addToChat(msg, AddToChatTypes.other)
})
socket.on('disconnected', function () {
  addToChat("User disconnected", AddToChatTypes.other)
})
