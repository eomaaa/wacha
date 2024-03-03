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

    const img = document.createElement('img');
    img.classList.add('img');
    img.src = "phrugpfp.jpg"; 
    img.alt = 'Profile Picture';
    div.appendChild(img);

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

//stopwatch
let startBtn = document.getElementById('start');
let stopBtn = document.getElementById('stop');

let hour= 0;
let minute = 0;
let second = 0;
let count = 0;

startBtn.addEventListener('click', function () {
    timer = true;
    stopWatch();
});

stopBtn.addEventListener('click', function () {
    timer = false;
});

function stopWatch() {
    if (timer) {
        count++;

        if (count == 100) {
            second++;
            count = 0;
        }
        if (second == 60) {
            minute++;
            second = 0;
        }
        if (minute == 60) {
            hour++;
            minute = 0;
            second = 0;
        }

        let hrString = hour;
        let minString = minute;
        let secString = second;
        let countString = count;

        if (hour < 10) {
            hrString = "0" + hrString;
        }
        if (minute < 10) {
            minString = "0" + minString;
        }
        if (second < 10) {
            secString = "0" + secString;
        }
        if (count < 10) {
            countString = "0" + countString;
        }

        document.getElementById('hr').innerHTML = hrString;
        document.getElementById('min').innerHTML = minString;
        document.getElementById('sec').innerHTML = secString;
        document.getElementById('count').innerHTML = countString;
        setTimeout(stopWatch, 10);
    }
}