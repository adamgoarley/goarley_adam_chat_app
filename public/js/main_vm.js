// imports always go first - if we're importing anything
import ChatMessage from "./modules/ChatMessage.js";

const socket = io();

function setUserId({sID, count}) {
    vm.socketID = sID;

    // Sets userNum to current number of other users in room when joining
    vm.userNum = count;
};

function connectSound(message){
    // Plays sound when a user connects
    var connectSound = new Audio("audio/user_connect.mp3");
    connectSound.play();

    // Adds a user to userNum when someone connects
    vm.userNum += 1;

    // Displays a message when a new user connects
    if(message !== vm.socketID) {
        socket.emit('connection_message', {
            content: `A new user has connected.`,
            name: "Console"
        })
    }
}

function runDisconnectMessage(message) {
    // Plays sound when a user disconnects
    var disconnectSound = new Audio("audio/user_disconnect.mp3");
    disconnectSound.play();

    // Subtracts a user from userNum when someone disconnects
    vm.userNum -= 1;

    // Displays a message when a user disconnects
    socket.emit('connection_message', {
        content: message,
        name: "Console"
    })
};

function appendNewMessage(msg) {
    // Take the incoming message and push it into the Vue instance
    vm.messages.push(msg);
    
    // Plays sound when messages are received
    if(msg.id !== this.id && msg.message.name !== "Console"){
        var newMessageSound = new Audio("audio/message.mp3");
        newMessageSound.play();
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
socket.addEventListener('new_user', connectSound);
socket.addEventListener('user_disconnect', runDisconnectMessage);
socket.addEventListener('new_message', appendNewMessage);