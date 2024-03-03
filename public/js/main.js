const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

//username and room info from URL
const{ username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

const socket = io();

//join chatroom
socket.emit('joinRoom', {username, room});

//Get room and users info
socket.on('roomUsers', ({room, users})=> {
    outputRoomName(room);
    outputUsers(users);
})

//Message from server
socket.on('message', (message) => {
    console.log(message);
    outputMessage(message);

    //autoscroll
    chatMessages.scrollTop = chatMessages.scrollHeight;

});

//submit message
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    //get message
    let msg = e.target.elements.msg.value;

    //print message to server
    socket.emit('chatMessage', msg);

    //Clear input (so typing area is empty)
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});


//Output message
function outputMessage(message){
    const div = document.createElement('div');
    div.classList.add('message');
    const p = document.createElement('p');
    p.classList.add('meta');
    p.innerText=message.username;
    p.innerHTML += `<span>${message.time}</span>`;
    div.appendChild(p);
    const para = document.createElement('p');
    para.classList.add('text');
    para.innerText = message.text;
    div.appendChild(para);
    document.querySelector('.chat-messages').appendChild(div);
}

//room names
function outputRoomName(room) {
    roomName.innerText = room;
}

//Add users 
function outputUsers(users) {
    userList.innerHTML = '';
    users.forEach((user) => {
        const li = document.createElement('li');
        li.innerText = user.username;
        userList.appendChild(li);
    });
}