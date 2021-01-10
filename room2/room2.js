let currentUser;
let roomNumber = 2;

if (localStorage.getItem("username") != null) {
  currentUser = localStorage.getItem("username");
} else {
  window.location.replace("../login.html"); 
}

let roundId;
let currentDuration;
let currentProgress;
let currentDateTime = new Date();
let timerStarted = false;
let timerDisplay = document.getElementById("countdownTimer");
let userRoomObjects = {};
let intervalTimer;
let correct_list = [];

let bookshelfContainer = document.getElementById("bookshelfContainer");
let bookCollectionModals = document.getElementById("bookCollectionModals");
let bookCategory = shuffle(["Ghost", "Horror", "Murder", "Killing", "Monster", "Death"]);
console.log(bookCategory);

let bookCategories = {
    [bookCategory[0]] : "btn-primary", 
    [bookCategory[1]] : "btn-success", 
    [bookCategory[2]] : "btn-danger", 
    [bookCategory[3]] : "btn-warning"
};
let bookAnswer = [[Object.keys(bookCategories)[Math.floor((Math.random() * 3) + 1)], Math.floor((Math.random() * 10) + 1)], 
                  [Object.keys(bookCategories)[Math.floor((Math.random() * 3) + 1)], Math.floor((Math.random() * 10) + 1)]];
let puzzle1Ans = `${categoryColourTranslate(bookAnswer[0][0])}${numberTranslate(bookAnswer[0][1])}`;
let puzzle2Ans = `${categoryColourTranslate(bookAnswer[1][0])}${numberTranslate(bookAnswer[1][1])}`;
let pin = 0;
let pinCounter = 0;

let alphabetText = "abcdefghijklmnopqrstuvwxyz".split('').sort(function(){return 0.5-Math.random()}).join('');
let cipherKey = Math.floor((Math.random() * 26));

document.getElementById("cipherKeyContent").innerHTML = "Cipher Key: " + cipherKey + "<br> Cipher Alphabet: " + alphabetText.toUpperCase(); 


let encryptedPuzzle1 = encrypt(puzzle1Ans, alphabetText, cipherKey);
let decryptedPuzzle1 = decrypt(encryptedPuzzle1, alphabetText, cipherKey);
let encryptedPuzzle2 = encrypt(puzzle2Ans, alphabetText, cipherKey);
let decryptedPuzzle2 = decrypt(encryptedPuzzle2, alphabetText, cipherKey);

console.log("Cipher Key: ", cipherKey);
console.log("Custom Alphabet: ", alphabetText.toUpperCase());
console.log("Puzzle 1 Encrypted Text: ", encryptedPuzzle1);
console.log("Puzzle 1 Decrypted Text: ", decryptedPuzzle1);
console.log("Puzzle 2 Encrypted Text: ", encryptedPuzzle2);
console.log("Puzzle 2 Decrypted Text: ", decryptedPuzzle2);

getUserProgress(currentUser);

// Countdown Timer source:https://stackoverflow.com/questions/20618355/the-simplest-possible-javascript-countdown-timer
function startTimer(duration, timerDisplay) {
  let timer = duration, minutes, seconds;
  document.getElementById("startTimer").className = "btn btn-danger d-none";

  intervalTimer = setInterval(function () {
    updateGameProgress(roundId, currentDuration);
    minutes = parseInt(timer / 60, 10);
    seconds = parseInt(timer % 60, 10);

    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    timerDisplay.textContent = minutes + ":" + seconds;

    if (--timer < 0) {
      timer = duration;
    }
  }, 1000);
}

function getUserProgress(username) {
  const request = new XMLHttpRequest();
  request.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      let userRoomData = JSON.parse(this.responseText);
      console.log(userRoomData);
      if (userRoomData.length != 0) {
        if (userRoomData.room_num == roomNumber) {
          roundId = userRoomData.round_id;
          let sourceDuration = userRoomData.duration.substr(0,8).split(":");
          currentDuration = (1 * Number(sourceDuration[0]) * 360) + (1 * Number(sourceDuration[1]) * 60) + Number(sourceDuration[2]);
          startTimer(3600 - currentDuration, timerDisplay);
          getRoomProgress(roundId, roomNumber);

        } else {
          window.location.replace(`../room${userRoomData.room_num}/room${userRoomData.room_num}main.html`);
        }
      } else {
        window.location.replace("../login.html");
      }
    }
  }
  request.open('POST', '../backend/getUserProgress.php', true);
  request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  request.send(`username=${username}`);
}

function getRoomProgress(roundId, roomNumber) {
  const request = new XMLHttpRequest();
  request.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      let userRoomData = JSON.parse(this.responseText);
      if (userRoomData.length != 0) {
        getUserRoomObjects(roomNumber, roundId);
        currentProgress = userRoomData.progress;
      } else {
        currentProgress = 0;
      }
      updateProgressBar(currentProgress); 
    }
  }
  request.open('POST', '../backend/getRoomProgress.php', true);
  request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  request.send(`round_id=${roundId}&object_room=${roomNumber}`);
}

function getUserRoomObjects(object_room, round_id) {
  const request = new XMLHttpRequest();
  request.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        let userObjectData = JSON.parse(this.responseText).room_objects;
        if (userObjectData.length > 0) {
            console.log(userObjectData)
            for (object of userObjectData) {
                if (object.object_name == "sudoku") {
                    let sudokuContent = document.getElementById("sudokuContent");
                    sudokuContent.innerHTML = `<p>Congratulations! Your hint is: <b>${encryptedPuzzle1}</b></p>`;
                }
                if (object.object_name == "slidingPuzzle") {
                    let puzzleContent = document.getElementById("puzzleContent");
                    puzzleContent.innerHTML = `<p>Congratulations! Your hint is: <b>${encryptedPuzzle2}</b></p>`;
                }
            }
        }
    }
  }
  request.open('POST', '../backend/getUserRoomObjects.php', true);
  request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  request.send(`object_room=${object_room}&round_id=${round_id}`);
}

function updateProgressBar(value) {
  progressBarWidth = parseInt(document.getElementById('progressBar').style.width);
  document.getElementById('progressBar').style.width = (value) +'%';
}

function updateGameProgress(round_id, duration) {
  let secondsDifference = (new Date().getTime() - currentDateTime.getTime()) / 1000;
  let newDuration = new Date((secondsDifference + duration) * 1000).toISOString().substr(11, 8)
  if (newDuration == "01:00:00") {
      updateGame(roundId, "lose");
      clearInterval(intervalTimer);
      document.getElementById("countdownTimer").className = "d-none"
      alert("Times Up!");
  }
  const request = new XMLHttpRequest();
  request.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      const data = JSON.parse(this.responseText);
      if (data.success == false) {
        console.log("Update Progress Failed")
      }
    }
  }
  request.open('POST', '../backend/updateProgress.php', true);
  request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  request.send(`round_id=${round_id}&duration=${newDuration}`);
}

function goNextPage(round_id, room_num) {
  const request = new XMLHttpRequest();
  request.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      const data = JSON.parse(this.responseText);
      if (data.success == true) {
        window.location.replace("../room3/room3main.html");
      } else {
        console.log("Update Progress Failed")
      }
    }
  }
  request.open('POST', '../backend/updateRoom.php', true);
  request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  request.send(`round_id=${round_id}&room_num=${room_num}`);
}

function check_lock_combination () {
    console.log(correct_list);
    let user_input_list = [document.getElementById("num1").value, document.getElementById("num2").value, document.getElementById("num3").value, document.getElementById("num4").value];
    if (JSON.stringify(user_input_list) === JSON.stringify(correct_list)) {
      // document.getElementById("modal_title").innerText = "Congratulations!";
      // document.getElementById("modal_text").innerText = "You have successfully unlocked the chest and obtained the key! Proceeding to Room 2...";
      // redirect to room 2
      goNextPage(roundId, "3");
      // 
    }
    else {
      document.getElementById("modal_title").innerText = "Oops...";
      document.getElementById("modal_text").innerText = "You attempt to unlock the chest but it seems that the lock combination is incorrect!";
      $("#padlockModal").modal('hide');
      // reset lock combination
      // XXX
    }
  }
  
function addToInventory(object_id) {
    const request = new XMLHttpRequest();
    request.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        const data = JSON.parse(this.responseText);
        if (data.success == true) {
          getRoomProgress(roundId, roomNumber);
        } else {
          console.log("Add Item Failed")
        }
      }
    }
    request.open('POST', '../backend/addInventory.php', true);
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    request.send(`round_id=${roundId}&object_id=${object_id}`);
}





var sudokuArray = [
    [
        [[5, 9, 1, 2, 7, 4, 8, 3, 6], [4, 7, 8, 5, 3, 6, 9, 1, 2], [3, 2, 6, 1, 8, 9, 5, 4, 7], [2, 5, 7, 6, 9, 3, 4, 8, 1], [6, 8, 9, 4, 1, 5, 2, 7, 3], [1, 4, 3, 8, 2, 7, 6, 9, 5], [7, 6, 4, 9, 5, 1, 3, 2, 8], [9, 1, 2, 3, 6, 8, 7, 5, 4], [8, 3, 5, 7, 4, 2, 1, 6, 9]],
        [[5, 9, "", 2, 7, 4, 8, 3, ""], [4, 7, 8, "", "", 6, 9, 1, 2], ["", 2, 6, 1, 8, 9, 5, "", 7], [2, "", 7, 6, 9, 3, 4, 8, ""], [6, 8, 9, "", 1, 5, "", 7, 3], [1, 4, "", 8, 2, 7, 6, 9, ""], ["", 6, 4, "", 5, 1, 3, 2, 8], [9, 1, 2, 3, 6, "", "", 5, 4], ["", 3, 5, 7, 4, 2, 1, "", 9]]
    ],
    [
        [[1, 2, 3, 4, 5, 6, 7, 8, 9], [7, 8, 9, 1, 2, 3, 4, 5, 6], [4, 5, 6, 7, 8, 9, 1, 2, 3], [3, 1, 2, 8, 4, 5, 9, 6, 7], [6, 9, 7, 3, 1, 2, 8, 4, 5], [8, 4, 5, 6, 9, 7, 3, 1, 2], [2, 3, 1, 5, 7, 4, 6, 9, 8], [9, 6, 8, 2, 3, 1, 5, 7, 4], [5, 7, 4, 9, 6, 8, 2, 3, 1]],
        [[1, 2, "", 4, 5, 6, 7, 8, ""], [7, 8, 9, "", "", 3, 4, 5, 6], ["", 5, 6, 7, 8, 9, 1, "", 3], [3, "", 2, 8, 4, 5, 9, 6, ""], [6, 9, 7, "", 1, 2, "", 4, 5], [8, 4, "", 6, 9, 7, 3, 1, ""], ["", 3, 1, "", 7, 4, 6, 9, 8], [9, 6, 8, 2, 3, "", "", 7, 4], ["", 7, 4, 9, 6, 8, 2, "", 1]]
    ],
    [
        [[4, 3, 5, 2, 6, 9, 7, 8, 1], [6, 8, 2, 5, 7, 1, 4, 9, 3], [1, 9, 7, 8, 3, 4, 5, 6, 2], [8, 2, 6, 1, 9, 5, 3, 4, 7], [3, 7, 4, 6, 8, 2, 9, 1, 5], [9, 5, 1, 7, 4, 3, 6, 2, 8], [5, 1, 9, 3, 2, 6, 8, 7, 4,], [2, 4, 8, 9, 5, 7, 1, 3, 6], [7, 6, 3, 4, 1, 8, 2, 5, 9]],
        [[4, 3, "", 2, 6, 9, 7, 8, ""], [6, 8, 2, "", "", 1, 4, 9, 3], ["", 9, 7, 8, 3, 4, 5, "", 2], [8, "", 6, 1, 9, 5, 3, 4, ""], [3, 7, 4, "", 8, 2, "", 1, 5], [9, 5, "", 7, 4, 3, 6, 2, ""], ["", 1, 9, "", 2, 6, 8, 7, 4], [2, 4, 8, 9, 5, "", "", 3, 6], ["", 6, 3, 4, 1, 8, 2, "", 9]]
    ]
]
var selectedSudoku = 0
function selectSudoku() {
    var print = "";
    var random = Math.random();
    random = random * 3
    random = Math.floor(random)
    selectedSudoku = random
    var chosenArray = sudokuArray[random][0];
    var userArray = sudokuArray[random][1]
    var sudokuDisplay = document.getElementById("sudokuBoard");
    console.log(selectedSudoku)
    // empty spaces = “row 1 (2, 8)/ row 2 (3, 4)/row 3 (0,7)/ row 4 (1, 8)/ row 5 (3, 6)/ row 6 (2, 8)/ row 7 (0 3)/ row 8 (5, 6)/ row 9 (0, 7)”
    for (var i = 0; i < userArray.length; i++) {
        //create row
        print += "<tbody><tr>";
        for (var k = 0; k < 9; k++) {
            var id = i.toString() + k.toString(); // i =row value, k=col value
            var rowThick = 1;
            if(i%3==2){
                rowThick = 3;
            }
            var colThick = 1;
            if(k%3==2){
                colThick = 3;
            }
            if (userArray[i][k] == "") {
                print +=
                `<td style="color:green;background-color:black;text-align:center;width:30px;padding:0px;border-bottom: ${rowThick}px solid white;border-right: ${colThick}px solid white"> <input type="text"  pattern="[0-9]{1}" id="${id}" maxlength="1" size="1" min="1" max="9" style="background-color:black;color:green;width:30px;text-align:center;" onkeydown="checkKey()"> </td>
    `}
            else {
                print += `
    <td style="color:green;background-color:black;text-align:center;width:30px;padding:0px;border-bottom: ${rowThick}px solid white;border-right: ${colThick}px solid white"> ${userArray[i][k]} </td>`
            }
        }
        print += "</tr></tbody>"
    }
    if (sudokuDisplay != null) {
        sudokuDisplay.innerHTML=print;
    }
    
}

function checkKey(){
  permitted = "1234567890"
  console.log(event)
  if(!permitted.includes(event.key) && event.key!=="Backspace"){
      console.log("ya")
    event.preventDefault();
  }
}

function checkAnswer() {
    var selected = sudokuArray[selectedSudoku][1];
    var correct = sudokuArray[selectedSudoku][0];
    let sudokuResult = document.getElementById("sudokuResult");

    for (var i = 0; i < selected.length; i++) {
        for (var j = 0; j < selected[i].length; j++) {
            if (selected[i][j] === "") {
                var id = i.toString() + j.toString()
                var answer = document.getElementById(id).value
                if (Number(answer) !== correct[i][j]) {
                    console.log(i.toString() + j.toString())
                    sudokuResult.innerHTML = "<p style='color:red;'>Wrong Answer!</p>";
                    return false
                }
            }
        }
    }
    sudokuResult.innerHTML = `<p>Congratulations! Your hint is: <b>${encryptedPuzzle1}</b></p>";`;
    addToInventory(11);
    return true
}

// Start of Sliding Image Puzzle Source: Mount Olympus
var canvas=document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var empty=9;
var moves=-1;
function shuffle(array) {
	  var currentIndex = array.length, temporaryValue, randomIndex;

	  // While there remain elements to shuffle...
	  while (currentIndex !== 0 ) {

	    // Pick a remaining element...
	    randomIndex = Math.floor(Math.random() * currentIndex);
	    currentIndex -= 1;

	    // And swap it with the current element.
	    temporaryValue = array[currentIndex];
	    array[currentIndex] = array[randomIndex];
	    array[randomIndex] = temporaryValue;
	  }

	  return array;
	}
var ar=[1,2,3,4,5,6,7,8,0];
im=shuffle([1,2,3,4,5,6,7,8,0]);

for(var i=0;i<=8;i++){
	if(im[i]==0)
		empty=i+1;
}

var restart=0;
function won(){
	ctx.clearRect(300,300,150,150);
	var img=document.getElementById("puzz9");
	var pat=ctx.createPattern(img,"repeat");
	ctx.fillStyle=pat;
	ctx.fillRect(300,300,150,150);
    m=document.getElementById("message");
    m.innerHTML = `<p>Congratulations! You won the game in ${moves.toString()} moves. Your hint is: <b>${encryptedPuzzle2}</b></p>`;
    addToInventory(12);
    restart=1;
	moves=-1;
}

function draw(){
	moves++;
	mov=document.getElementById("moves");
	mov.innerHTML="MOVES: "+ moves.toString();
	if (moves == 10) {
        alert('You can choose to give up');
        display();
    }
	m=document.getElementById("message");
	m.innerHTML="";
  var t;
  t=0;
  if(restart==1){
	  im=shuffle([1,2,3,4,5,6,7,8,0]);
		for(var i=0;i<=8;i++){
			if(im[i]==0)
				empty=i+1;	
		}
		console.log(empty);	
	 ctx.clearRect(0,0,450,450);
	  restart=0;
  }
	for(var i=0;i<9;i++){
		if(im[i]!=ar[i])
			t=1;	
	}
	// console.log(im);
	// console.log(ar);
	
	for(var i=0;i<3;i++){
    	for(var j=0;j<3;j++){
            component(i,j);    		
    	}
    }
	// console.log(t);
	if(t==0){
		console.log("one more");
		won();
	}
}

function component(x, y) {
    var text="puzz";
    z=x+3*y;
    z=im[z];
    text=text+z.toString();
    if(z!=0)
    {
    	var img=document.getElementById(text);
    	var pat=ctx.createPattern(img,"repeat");
    	ctx.fillStyle=pat;
    }
    
    else
    {
    	ctx.fillStyle="white";
    }
    
    ctx.fillRect(150*x,150*y,150,150);    
}

function moveup() {
	ctx.clearRect(0,0,450,450);
	if(restart==1)
		{
		draw();
		return;
		}
    if(empty==9||empty==7||empty==8){
    	moves--;
    	draw();
    } 
    else{
    	text="puzz";
    	var curr=empty;
    	empty=empty+3;
    	var next=empty;
        im[curr-1]=im[next-1];
        im[next-1]=0;
        draw();
    	
    }
    console.log(empty);
}

function movedown() {
	ctx.clearRect(0,0,450,450);
	if(restart==1)
	{
	
	draw();
	return;
	}
	if(empty==1||empty==2||empty==3) {
		moves--;
		draw();
    }
    else{
    	text="puzz";
    	var curr=empty;
    	empty=empty-3;
    	var next=empty;
        im[curr-1]=im[next-1];
        im[next-1]=0;
        draw();
    }
    // console.log(empty);
}

function moveleft() {
	ctx.clearRect(0,0,450,450);
	
	if(restart==1)
	{
	
	draw();
	return;
	}
	
	if(empty==6||empty==9||empty==3) {
		moves--;  
		draw();
	    }
	    else{
	    	text="puzz";
	    	var curr=empty;
	    	empty=empty+1;
	    	var next=empty;
	        im[curr-1]=im[next-1];
	        im[next-1]=0;
	        draw();
	    }
	  console.log(empty);
}

function moveright() {
	ctx.clearRect(0,0,450,450);
	if(restart==1)
	{
	moves--;
	draw();
	return;
	}
	  if(empty==1||empty==4||empty==7) {
		  moves--;
		  draw();
	    }
	    else{
	    	text="puzz";
	    	var curr=empty;
	    	empty=empty-1;
	    	var next=empty;
	        im[curr-1]=im[next-1];
	        im[next-1]=0;
	        draw();
	    }console.log(empty);
	
	  }
	  
window.addEventListener('keydown', function (e) {
    key = e.keyCode;
    if(key==37){
    	e.preventDefault();
    	moveleft();
    }
    if(key==38){
    	e.preventDefault();
    	moveup();
    }
    if(key==39){
    	e.preventDefault();
    	moveright();
    }
    if(key==40){
    	e.preventDefault();
    	movedown();
    }
	if(key==83){
		e.preventDefault();
		start();
	}
    
});
function start(){
draw();
}
ctx.font = "30px Arial";
ctx.fillText("Hit S to begin.", 120,140);
ctx.fillText("Use your arrow keys to move", 30,250);

function giveup() {
	m=document.getElementById("message");
  m.innerHTML= `<p>You chose to give up. Your hint is: <b>${encryptedPuzzle2}</b></p>`;
  moves = document.getElementById('moves');
  moves.innerHTML = "";
  var context = canvas.getContext('2d');
  context.clearRect(0, 0, canvas.width, canvas.height);
  canvas.width = 0;
  canvas.height = 0;
  addToInventory(12);
}

document.getElementById('giveup').style.visibility = 'hidden';
var hidden = true;
function display() {
    hidden = !hidden;
    if(hidden) {
        document.getElementById('giveup').style.visibility = 'hidden';
    } else {
        document.getElementById('giveup').style.visibility = 'visible';
    }
}


// End of Sliding Image Puzzle



//End of Cipher & Bookshelf
function categoryColourTranslate(category) {
    let colourCategory = {
        [bookCategory[0]] : "blue", 
        [bookCategory[1]] : "green", 
        [bookCategory[2]] : "red", 
        [bookCategory[3]] : "yellow"
    };
    return colourCategory[category];
}

function numberTranslate(number) {
    let numberCategory = {
        1:"one", 2:"two", 3:"three", 4:"four",5:"five",6:"six",7:"seven",8:"eight",9:"nine",10:"ten"
    };
    return numberCategory[number]
}

function encrypt(cipherText, alphabetText, cipherKey) {
    let letters = cipherText.split("");
    let alphabets = alphabetText.split("");
    let encryptText = "";
    let shiftText = "";
    for (letter in letters) {
        if (letters[letter] == " ") {
            shiftText = " ";
        } else {
            if (cipherKey > 0) {
                shiftText = alphabets[(alphabets.indexOf(letters[letter]) + cipherKey) % alphabets.length]
            } else {
                shiftText = alphabets[(alphabets.indexOf(letters[letter]) + (26 - cipherKey)) % alphabets.length]
            }
        }
        encryptText += shiftText;
    }
    return encryptText
}

function decrypt(cipherText, alphabetText, cipherKey){
    var decryptText = "";
    cipherKey = (26 - cipherKey) % 26;
    decryptText = encrypt(cipherText, alphabetText, cipherKey);
    return decryptText;
}

let bookList = {};

function displayFinalisedList() {
    console.log(bookList)
}

function getBooks() {
    for (let category in bookCategories) {    
        let shelfRow = document.createElement("div");
        shelfRow.className = "row";
        const request = new XMLHttpRequest();
        request.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                let bookData = JSON.parse(this.responseText).items;
                let bookColumns = 1;
                for (book of bookData) {
                    let buttonType = bookCategories[category];
                    let shelfCol = document.createElement("div");
                    shelfCol.className = "col-1 p-0 mt-3";
                    shelfCol.innerHTML = `
                    <button type="button" class="btn pt-5 m-0 ${buttonType}" data-toggle="modal" data-target="#book${book.id}"></button>`
                    shelfRow.appendChild(shelfCol);
                    let authors = "None"
                    let ratings = "None";
                    let description = "No description available";
                    let toggleButton= "";
                    let pageCount = 0;

                    if (book.volumeInfo.hasOwnProperty("authors")) {
                        authors = book.volumeInfo.authors.join(", ");
                    }
                    if (book.volumeInfo.hasOwnProperty("averageRating")) {
                        ratings = book.volumeInfo.averageRating;
                    }
                    if (book.volumeInfo.hasOwnProperty("description")) {
                        description = book.volumeInfo.description;
                        if (description.length > 200) {
                            description = `${description.slice(0,197)}...`;
                            toggleButton = `<button type="button" class="btn btn-primary d-inline" value="${book.id}" id="toggle-${book.id}" onclick="toggleDesc(this)">Read More</button>`;
                        }
                    }
                    if (book.volumeInfo.hasOwnProperty("pageCount")) {
                        pageCount = book.volumeInfo.pageCount;
                    }
                    if ((category == bookAnswer[0][0] && bookColumns == bookAnswer[0][1]) || (category == bookAnswer[1][0] && bookColumns == bookAnswer[1][1])) {
                        pin += pageCount;
                        pinCounter++;
                        if (pinCounter == 2) {
                            answer = pin.toString();
                            while (answer.length != 4) {
                                answer = "0" + answer;
                            }
                            console.log("Correct PIN: ", answer);
                            correct_list = answer.split("");
                        }
                    }
            
                    bookCollectionModals.innerHTML += `
                    <div class="modal fade" id="book${book.id}" tabindex="-1" role="dialog" aria-labelledby="book${book.id}ModalLabel" aria-hidden="true">
                        <div class="modal-dialog" role="document">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title" id="book${book.id}ModalLabel">${book.volumeInfo.title}</h5>
                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                    </div>
                                    <div class="modal-body">
                                        <div class="card">
                                            <img class="card-img-top" src="${book.volumeInfo.imageLinks.thumbnail}" alt="${book.volumeInfo.title}">
                                            <div class="card-body">
                                                <h4 class="card-title">Author(s): ${authors}</h4>
                                                <p class="card-text m-0 font-weight-bold">Average Rating: ${ratings} (Pages: ${pageCount})</p>
                                                <p class="card-text font-italic d-inline" id="shortDesc-${book.id}">${description}</p>
                                                <p class="card-text font-italic d-none"   id="longDesc-${book.id}">${book.volumeInfo.description}</p>
                                                <p>${toggleButton}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>`;
                    bookColumns++;
                }
                bookshelfContainer.appendChild(shelfRow);
            }
        }
        request.open("GET", `https://www.googleapis.com/books/v1/volumes?q=${category}`, true);
        request.send();
    }
}

function toggleDesc(buttonData) {
    if (buttonData.innerHTML == "Read More") {
        document.getElementById(`longDesc-${buttonData.value}`).className = "card-text font-italic d-inline";
        document.getElementById(`shortDesc-${buttonData.value}`).className = "card-text font-italic d-none";
        document.getElementById(`toggle-${buttonData.value}`).innerHTML = "Read Less";
    } else {
        document.getElementById(`longDesc-${buttonData.value}`).className = "card-text font-italic d-none";
        document.getElementById(`shortDesc-${buttonData.value}`).className = "card-text font-italic d-inline";
        document.getElementById(`toggle-${buttonData.value}`).innerHTML = "Read More";
    }
}
getBooks();

function decryptText() {
    alphabet = document.getElementById("alphabet").value.toLowerCase();
    cipherText = document.getElementById("cipherText").value;
    cipherKey = document.getElementById("cipherKey").value;
    document.getElementById("cipherDisplay").innerHTML = decrypt(cipherText, alphabet, cipherKey);
}
//End of Cipher & Bookshelf



// Calculator source:Web Dev Simplified
class Calculator {
    constructor(previousOperandTextElement, currentOperandTextElement) {
      this.previousOperandTextElement = previousOperandTextElement
      this.currentOperandTextElement = currentOperandTextElement
      this.clear()
    }
  
    clear() {
      this.currentOperand = ''
      this.previousOperand = ''
      this.operation = undefined
    }
  
    delete() {
      this.currentOperand = this.currentOperand.toString().slice(0, -1)
    }
  
    appendNumber(number) {
      if (number === '.' && this.currentOperand.includes('.')) return
      this.currentOperand = this.currentOperand.toString() + number.toString()
    }
    
    chooseOperation(operation) {
      if (this.currentOperand === '') return
      if (this.previousOperand !== '') {
        this.compute()
      }
      this.operation = operation
      this.previousOperand = this.currentOperand
      this.currentOperand = ''
    }
    
    compute() {
      let computation
      const prev = parseFloat(this.previousOperand)
      const current = parseFloat(this.currentOperand)
      if (isNaN(prev) || isNaN(current)) return
      switch (this.operation) {
        case '+':
          computation = prev + current
          break
        case '-':
          computation = prev - current
          break
        case '*':
          computation = prev * current
          break
        case '÷':
          computation = prev / current
          break
        default:
          return
      }
      this.currentOperand = computation
      this.operation = undefined
      this.previousOperand = ''
    }
    
    getDisplayNumber(number) {
      const stringNumber = number.toString()
      const integerDigits = parseFloat(stringNumber.split('.')[0])
      const decimalDigits = stringNumber.split('.')[1]
      let integerDisplay
      if (isNaN(integerDigits)) {
        integerDisplay = ''
      } else {
        integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 })
      }
      if (decimalDigits != null) {
        return `${integerDisplay}.${decimalDigits}`
      } else {
        return integerDisplay
      }
    }
    
    updateDisplay() {
      this.currentOperandTextElement.innerText =
        this.getDisplayNumber(this.currentOperand)
      if (this.operation != null) {
        this.previousOperandTextElement.innerText =
          `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`
      } else {
        this.previousOperandTextElement.innerText = ''
      }
    }
}
    
const numberButtons = document.querySelectorAll('[data-number]')
const operationButtons = document.querySelectorAll('[data-operation]')
const equalsButton = document.querySelector('[data-equals]')
const deleteButton = document.querySelector('[data-delete]')
const allClearButton = document.querySelector('[data-all-clear]')
const previousOperandTextElement = document.querySelector('[data-previous-operand]')
const currentOperandTextElement = document.querySelector('[data-current-operand]')

const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement)

numberButtons.forEach(button => {
button.addEventListener('click', () => {
    calculator.appendNumber(button.innerText)
    calculator.updateDisplay()
})
})

operationButtons.forEach(button => {
button.addEventListener('click', () => {
    calculator.chooseOperation(button.innerText)
    calculator.updateDisplay()
})
})

equalsButton.addEventListener('click', button => {
calculator.compute()
calculator.updateDisplay()
})

allClearButton.addEventListener('click', button => {
calculator.clear()
calculator.updateDisplay()
})

deleteButton.addEventListener('click', button => {
calculator.delete()
calculator.updateDisplay()
})

function movePlant() {
  var cushion=document.getElementById('plant');
  if (cushion.style.left != "75%") {
    cushion.style.left = '75%';
  }
  else {
    cushion.style.left="62%";
  }
  

}
