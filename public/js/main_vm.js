import ChatMessage from "./modules/ChatMessage.js";

const socket = io();

function setUserId({sID, count}) 
{
    vm.socketID = sID;
    vm.userNum = count;
};

function soundConnection(message){
    // will play my voice when a new person connects
    var soundConnection = new Audio("audio/connect.m4a");
    soundConnection.play();
    // will add person to the total number of users
    vm.userNum += 1;
    if(message !== vm.socketID) {
        socket.emit('connection_message', {
            content: `A new friend has connected!`,
            name: "Console"
        })
                }
 }

function runDisconnectMessage(message) {

    var soundDisconnection = new Audio("audio/disconnected.m4a");
    soundDisconnection.play();

    vm.userNum -= 1;

    socket.emit('connection_message', {
        content: message,
        name: "Console"
    })
};

function appendNewMessage(msg) {
    vm.messages.push(msg);
    if(msg.id !== this.id && msg.message.name !== "Console")
    {
        var newText = new Audio("audio/new_message.m4a");
        newText.play();
    }
};

// This is our main Vue instance
const vm = new Vue({
    data: {
        socketID: "",
        messages: [],
        message: "",
        nickName: "",
        userNum: 0
    },

    methods: {
        dispatchMessage() {
            socket.emit('chat_message', {
                content: this.message,
                name: this.nickName || "Anonymous"
            })
            this.message = "";
        }
    },

    components: {
        newmessage: ChatMessage
    },

    mounted: function() {
        console.log('mounted');
    }
}).$mount("#app");

// Some event handling -> These events are coming from the server
socket.addEventListener('connected', setUserId);
socket.addEventListener('new_user', soundConnection);
socket.addEventListener('user_disconnect', runDisconnectMessage);
socket.addEventListener('new_message', appendNewMessage);