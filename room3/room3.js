let currentUser;
let roomNumber = 3;

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

//Image Sequence
let imgButton = document.getElementsByClassName("btn image-button my-1 p-0");
let buttonIntervals = 10;
let imgButtonAns;
let imgCounter;
let imgButtonInput;
let murderLocation;
let weatherMultiplyAns;
let murderArticle;
let answerCircuit = document.getElementById("answerCircuit");
let circuitBoard = document.getElementById("circuitBoard");
let mainRoom = document.getElementById("mainRoom");
let newsFeed = document.getElementById("newsFeed");
let newsArticleContent = document.getElementById("newsArticleContent");


let startDate = new Date(2020, 0, 1);
let endDate = new Date();
let randomDateTime = new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));
console.log(randomDateTime);
let hours = randomDateTime.getHours();
hours = String(hours);
let minutes = randomDateTime.getMinutes();
minutes = String(minutes);
let seconds = randomDateTime.getSeconds();
seconds = String(seconds);
if (hours.length == 1) {
    hours = "0" + hours;
}
if (minutes.length == 1) {
    minutes = "0" + minutes;
}
if (seconds.length == 1) {
    seconds = "0" + seconds;
}
var time = hours + ":" + minutes + ":" + seconds;
let date = (randomDateTime).toISOString().split('T')[0];
let murderDate = date;
let murderTime = time;

let murdererNum = Math.floor(Math.random() * 19);
let murdererName;
let guessAttempts = 2;
newsArticleContent.innerHTML = `
<h4 style="color: red;">BREAKING: Murder at Singapore Management University</h4>
<br>
<i>A dead body</i> was found lying outside Singapore Management University's Hong Seng Curry Rice on <i>${murderDate}</i> at <i>${murderTime}</i>. Students arrived in campus for lessons reported an overwhelming stench coming near the food stall and saw a dead body lying outside. Employees said that nothing suspicious happened recently and they have no idea how the body ended up there.
`;
console.log("Article: ", murdererNum);

getUserProgress(currentUser);
getNews();
correctMurderDateTime();

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

function checkKey(){
    permitted = "1234567890"
    console.log(event)
    if(!permitted.includes(event.key) && event.key!=="Backspace"){
        console.log("ya")
      event.preventDefault();
    }
  }

function getUserProgress(username) {
    const request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
        let userRoomData = JSON.parse(this.responseText);
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
              for (object of userObjectData) {
                  if (object.object_name == "hangman") {
                      document.getElementById("message").innerHTML = `<p>Congratulations! Your hint is:  <b>Multiply ${murderLocation}</b></p>`;
                      document.getElementById("hangmanContent").className = "d-none";
                      
                  }
                  if (object.object_name == "circuit") {
                      document.getElementById("computerContent").className = "d-inline";
                      document.getElementById("computerError").className = "d-none"
                      document.getElementById("btnCircuitBoard").className = "d-none";
                  }
                  if (object.object_name == "lockedFolder") {
                      document.getElementById("folderCombination").className = "d-none";
                      document.getElementById("folderCombinationAnswer").className = "d-inline";
                      document.getElementById("padlockTitle").innerHTML = "Unlocked Folder";
                      document.getElementById("modal_text").innerText = murderArticle;
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

function check_lock_combination () {
    let user_input_list = [document.getElementById("num1").value, document.getElementById("num2").value, document.getElementById("num3").value, document.getElementById("num4").value];
    if (JSON.stringify(user_input_list) === JSON.stringify(correct_list)) {
        document.getElementById("modal_title").innerText = "Unlocked Folder";
        document.getElementById("modal_text").innerText = murderArticle;
        document.getElementById("folderCombination").className = "d-none";
        document.getElementById("folderCombinationAnswer").className = "d-inline";
        document.getElementById("padlockTitle").innerHTML = "Unlocked Folder"
        $("#padlockModal").modal('hide'); 
        addToInventory(23);
    }
    else {
        document.getElementById("modal_title").innerText = "Oops...";
        document.getElementById("modal_text").innerText = "You attempt to unlock the folder but it seems that the lock combination is incorrect!";
        $("#padlockModal").modal('hide');
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





function startImgSequence() {
    let previousNumber = undefined;
    imgButtonAns = "";
    answerCircuit.innerHTML = "";
    imgCounter = 0;

    setIntervalX(function () {
        if (imgCounter != buttonIntervals) {
            let randomNumber = Math.floor((Math.random() * 9) + 1)-1;
            while (randomNumber == previousNumber) {
                randomNumber = Math.floor((Math.random() * 9) + 1)-1;
            }
            if (previousNumber !== undefined) {
                imgButton[previousNumber].className = "btn image-button my-1 p-0";
            }
            previousNumber = randomNumber;
            imgButtonAns += randomNumber;       

            let ansButton = document.createElement("col");
            ansButton.className = "btn answer-button my-1 p-0";
            let test = document.createElement("div")
            test.className = "col-1 p-0";

            ansButton.id = "ansButton" + imgCounter;
            test.appendChild(ansButton);
            answerCircuit.appendChild(test);
            console.log(randomNumber);
            imgButton[randomNumber].className = "btn image-button my-1 p-0 glow";
            imgCounter++;
        } else {
            imgButton[previousNumber].className = "btn image-button my-1 p-0";
        }
    }, 1000, buttonIntervals+1);
}

function setIntervalX(callback, delay, repetitions) {
    var x = 0;
    var intervalID = window.setInterval(function () {
       callback();
       if (++x === repetitions) {
           window.clearInterval(intervalID);
       }
    }, delay);
}

function getImgButton(number) {
    if (imgButtonInput == undefined) {
        imgButtonInput = "";
    }
    if (imgCounter >= 10) {
        imgButtonInput += number;
        imgCounter++;
        document.getElementById("ansButton" + (imgCounter-11)).innerHTML = 
            document.getElementById("imgButton" + (number)).innerHTML;
        if (imgCounter-10 == buttonIntervals) {
            if (imgButtonAns == imgButtonInput) {
                alert("Correct");
                $('#circuitModal').modal('hide');
                document.getElementById("computerContent").className = "d-inline";
                document.getElementById("computerError").className = "d-none"
                document.getElementById("btnCircuitBoard").className = "d-none";
                addToInventory(22);
            } else {
                alert("Wrong");
            }
            imgButtonInput = "";
            imgCounter = 0;
        }
    }
    console.log(imgButtonAns, imgButtonInput)
}

//News Feed
function getNews() {
    const request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let authorArray = ["Alvan Tan" , "Craig Choy", "David Lim", "Joel Yang", "Yeo Yu Quan"];
            let articleCount = 0;
            let sourceData = JSON.parse(this.responseText).articles;
            for (source of sourceData) {
                let author = authorArray[Math.floor(Math.random() * authorArray.length)];
                let description = "No description available";
                let urlToImage = "../assets/pictures/imgRoom3/noImage.jpg";
                if (source.urlToImage != null) {
                    urlToImage = source.urlToImage;
                }
                if (source.description != "" && source.description != null) {
                    description = source.description;
                }
                if (articleCount == murdererNum) {
                    murdererName = author;
                    console.log("The murderer is:", murdererName, "    Article:", source.title);
                    murderArticle = source.title;
                    document.getElementById("folderCombinationAnswer").innerHTML = murderArticle;
                }
                articleCount++;
                newsFeed.innerHTML += `
                <div class="card">
                    <img class="card-img-top" src="${urlToImage}" alt="${source.title}">
                    <div class="card-body">
                        <h5 class="card-title"><a class="text-dark" href="${source.url}" target="blank">${source.title}</a></h5>
                        <p class="card-text m-0"><b>${author}</b><br>${new Date(source.publishedAt).customFormat( "#DD# #MMM# #YYYY# #hh#:#mm# #AMPM#")}</p>    
                        <p class="card-text font-italic">${description}</p>
                    </div>
                </div>`;
            }
        }
    }
    request.open("GET", `http://newsapi.org/v2/top-headlines?country=sg&apiKey=92b6863fb89a46729d78f58a5605e13d`, true);
    request.send();
}

Date.prototype.customFormat = function(formatString){
    var YYYY,YY,MMMM,MMM,MM,M,DDDD,DDD,DD,D,hhhh,hhh,hh,h,mm,m,ss,s,ampm,AMPM,dMod,th;
    YY = ((YYYY=this.getFullYear())+"").slice(-2);
    MM = (M=this.getMonth()+1)<10?('0'+M):M;
    MMM = (MMMM=["January","February","March","April","May","June","July","August","September","October","November","December"][M-1]).substring(0,3);
    DD = (D=this.getDate())<10?('0'+D):D;
    DDD = (DDDD=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][this.getDay()]).substring(0,3);
    th=(D>=10&&D<=20)?'th':((dMod=D%10)==1)?'st':(dMod==2)?'nd':(dMod==3)?'rd':'th';
    formatString = formatString.replace("#YYYY#",YYYY).replace("#YY#",YY).replace("#MMMM#",MMMM).replace("#MMM#",MMM).replace("#MM#",MM).replace("#M#",M).replace("#DDDD#",DDDD).replace("#DDD#",DDD).replace("#DD#",DD).replace("#D#",D).replace("#th#",th);
    h=(hhh=this.getHours());
    if (h==0) h=24;
    if (h>12) h-=12;
    hh = h<10?('0'+h):h;
    hhhh = hhh<10?('0'+hhh):hhh;
    AMPM=(ampm=hhh<12?'am':'pm').toUpperCase();
    mm=(m=this.getMinutes())<10?('0'+m):m;
    ss=(s=this.getSeconds())<10?('0'+s):s;
    return formatString.replace("#hhhh#",hhhh).replace("#hhh#",hhh).replace("#hh#",hh).replace("#h#",h).replace("#mm#",mm).replace("#m#",m).replace("#ss#",ss).replace("#s#",s).replace("#ampm#",ampm).replace("#AMPM#",AMPM);
};


// Hangman
var hangmanEl = document.getElementById("hangmanDisplay");
var messageEl = document.getElementById("message");
var output = "";
var answer = "";
var stage = 0;
var guessed_letters = [];
var guessed_words = [];
var progressEl = document.getElementById("progress");
var guessedLettersEl = document.getElementById("guessedLetters");
var guessedWordsEl = document.getElementById("guessedWords");
var progress = "";
function allLetter(inputTxt){ 
    var letters = /^[A-Za-z]+$/;
    if(inputTxt.value.match(letters)) {
        return true;
    } else {
        return false;
    }
}
function hang_stages(stage){
    if (stage == 0){
        return "---------------<br>|<br>|<br>|<br>|"
    }
    else if (stage == 1){
        return "---------------<br>|&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp|<br>|<br>|<br>|"
    }
    else if (stage == 2){
        return "---------------<br>|&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp|<br>|&nbsp&nbsp&nbsp&nbsp&nbsp&nbspO<br>|<br>|"
    }
    else if (stage == 3){
        return "---------------<br>|&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp|<br>|&nbsp&nbsp&nbsp&nbsp&nbsp&nbspO<br>|&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp|<br>|"
    }
    else if (stage == 4){
        return "---------------<br>|&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp|<br>|&nbsp&nbsp&nbsp&nbsp&nbsp&nbspO<br>|&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp/|<br>|"
    }
    else if (stage == 5){
        return "---------------<br>|&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp|<br>|&nbsp&nbsp&nbsp&nbsp&nbsp&nbspO<br>|&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp/|\\<br>|"
    }
    else if (stage == 6){
        return "---------------<br>|&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp|<br>|&nbsp&nbsp&nbsp&nbsp&nbsp&nbspO<br>|&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp/|\\<br>|&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp/"
    }        
    else{
        return "---------------<br>|&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp|<br>|&nbsp&nbsp&nbsp&nbsp&nbsp&nbspO<br>|&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp/|\\<br>|&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp/ \\"
    }
}

function main(){
    guessed_letters = [];
    guessed_words = [];
    progress = "";
    answer = murderLocation.toUpperCase();
    console.log("Hangman Answer (Murder Location):", answer);
    stage = 0;
    output = hang_stages(stage);
    hangmanEl.innerHTML = output;
    if (answer.includes(" ")){
        answer = answer.split(" ")
        
        for (word of answer){
            if(!isNaN(word)){
                progress += `${word}&nbsp`;
                progress += ",";
            }
            else{
                progress += "_&nbsp".repeat(word.length);
                progress += ",";
            }
        }
        answer = answer.join(",")
    }
    else{
        progress += "_&nbsp".repeat(answer.length);
        progress += ",";
    }
    progress = progress.slice(0, -1)
    progressEl.innerHTML = `Guess the word: ${progress}`;
    guessedLettersEl.innerHTML = `Guessed letters: [${guessed_letters}]`;
    guessedWordsEl.innerHTML = `Guessed words: [${guessed_words}]`;
}

function check_answer(){
    if (stage < 7){
        var guess = document.getElementById("guess").value;
        guess = guess.toUpperCase();
        document.getElementById("guess").value = "";
        if (guessed_letters.includes(guess) || guessed_words.includes(guess)){
            messageEl.innerHTML = "You have already made this guess before! Try again."
        }
        else{
            if (guess.length === 1){
                guessed_letters.push(guess)
                if (answer.includes(guess)){
                    progress = progress.split(",")
                    
                    answer = answer.split(",")
                    
                    for (let k=0; k<progress.length; k++){
                        progress[k] = progress[k].split("&nbsp");
                        for (let i=0; i<progress[k].length - 1; i++){
                            console.log(answer[k][i])
                            if (answer[k][i] === guess){
                                progress[k][i] = guess;
                            }
                        }
                        progress[k] = progress[k].join("&nbsp");    
                    }
                    progress = progress.join(",");
                    answer = answer.join(",")
                
                    if (!progress.includes("_")){
                        let message = document.getElementById("message");
                        message.innerHTML = `<p>Congratulations! Your hint is:  <b>Multiply ${murderLocation}</b></p>`;
                        let hangmanContent = document.getElementById("hangmanContent");
                        hangmanContent.className = "d-none";
                        addToInventory(21);
                        // main()
                    }
                    else{
                        progressEl.innerHTML = `Guess the word: ${progress}`;
                        guessedLettersEl.innerHTML = `Guessed letters: [${guessed_letters}]`;
                    }
                }
                else{
                    messageEl.innerHTML = `You have made the wrong guess :(`;
                    stage += 1
                    output = hang_stages(stage);
                    hangmanEl.innerHTML = output;
                    guessedLettersEl.innerHTML = `Guessed letters: [${guessed_letters}]`;
                }
            }
            else{
                guessed_words.push(guess)
                guess = guess.split(" ")
                guess = guess.join(",")
                if (guess === answer){
                    let message = document.getElementById("message");
                    message.innerHTML = `<p>Congratulations! Your hint is:  <b>Multiply ${murderLocation}</b></p>`;
                    let hangmanContent = document.getElementById("hangmanContent");
                    hangmanContent.className = "d-none";
                    addToInventory(21);
                    // main()
                }
                else{
                    messageEl.innerHTML = `You have made the wrong guess :(`;
                    stage += 1
                    output = hang_stages(stage);
                    hangmanEl.innerHTML = output;
                    guessedWordsEl.innerHTML = `Guessed words: [${guessed_words}]`;
                }
            }   
        }
    }
    if (stage === 7){
        messageEl.innerHTML = `Oh no, you lost! The answer is ${answer}`
        correctMurderDateTime();
    }
}    


// Weather API Request
function displayLocations() {
    var input_date = document.getElementById("date").value;
    var input_time = document.getElementById("time").value;
    input_time += ":00";
    var url = "https://api.data.gov.sg/v1/environment/air-temperature?date_time=" + input_date + "T" + input_time;
    var request = new XMLHttpRequest();
    request.onreadystatechange = function(){
        if (this.readyState == 4 && this.status == 200) {
            var weatherObj = JSON.parse(this.responseText);
            var readingsArray = weatherObj["items"][0]["readings"];
            var stationsArray = weatherObj["metadata"]["stations"];
            var my_dict = [];
            for (var readingObj of readingsArray) {
                var temperature = readingObj["value"];
                for (var locationObj of stationsArray) {
                    var location_name = locationObj["name"];
                    var location_id = locationObj["id"];
                    if (location_id == readingObj["station_id"]) {
                        var name_array = location_name.split(" ");
                        var name_string = name_array.join("_");
                        var name_tag = name_string.toLowerCase();
                        my_dict.push({
                            "name" : location_name,
                            "id" : location_id,
                            "location" : locationObj["location"],
                            "temperature" : temperature,
                            "name_tag" : name_tag
                        });
                    }
                }
            }
            var html_string = "";
            for (to_card_obj of my_dict) {
                html_string += `
                    <div class="card">
                        <img class="card-img-top" src="../assets/pictures/imgLocation/${to_card_obj['name_tag']}.jpg" alt="Card image cap">
                        <div class="card-body">
                            <h5 class="card-title">${to_card_obj['name']}</h5>
                            <p class="card-text">
                                Latitude: ${to_card_obj['location']['latitude']}
                                <br>
                                Longitude: ${to_card_obj['location']['longitude']}
                                <br>
                                Temperature: ${to_card_obj['temperature']} °C
                            </p>
                        </div>
                    </div>
                `;
            }
            document.getElementById("cards_div").innerHTML = html_string;
        }
    };
    request.open("GET", url, true);
    request.send();
}

function correctMurderDateTime() {
    let randomMurderStation = Math.floor((Math.random() * 10) + 1) -1;
    var url = "https://api.data.gov.sg/v1/environment/air-temperature?date_time=" + murderDate + "T" + murderTime;
    var request = new XMLHttpRequest();
    request.onreadystatechange = function(){
        if (this.readyState == 4 && this.status == 200) {
            var weatherObj = JSON.parse(this.responseText);
            let ansTemperature = weatherObj["items"][0]["readings"][randomMurderStation]["value"];
            let ansLatitude = weatherObj["metadata"]["stations"][randomMurderStation]["location"]["latitude"];
            let ansLongitude = weatherObj["metadata"]["stations"][randomMurderStation]["location"]["longitude"];
            weatherMultiplyAns = Math.floor(ansTemperature * ansLatitude * ansLongitude);
            murderLocation = weatherObj["metadata"]["stations"][randomMurderStation]["name"];
            correct_list = weatherMultiplyAns.toString().split("");
            console.log(correct_list);
            main();
        }
    };
    request.open("GET", url, true);
    request.send();
}



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

function guessMurderer() {
    let guessMurderer = document.getElementById("guessMurderer").value;
    let userGuess = guessMurderer.toUpperCase();
    let correctAnswer = murdererName.toUpperCase();
    if (userGuess == correctAnswer) {
        clearInterval(intervalTimer);
        updateGame(roundId, "win");
        document.getElementById("guessAnsModal-title").innerText = "Correct";
        document.getElementById("guessAnsModal-text").innerText = `${guessMurderer} was the murderer! Thank you for playing`;
        document.getElementById("guessAnsModal-close").className = "d-none";
        document.getElementById("guessAnsModal-finish").className = "btn btn-primary d-inline";
        $("#guessAnsModal").modal('hide');
    } else {
        guessAttempts--;
        if (guessAttempts == 0) {
            updateGame(roundId, "lose");
            clearInterval(intervalTimer);
            console.log("LOSE");
        }
        document.getElementById("guessAnsModal-title").innerText = "Wrong";
        document.getElementById("guessAnsModal-text").innerText = `${guessMurderer} is not the murderer, you have ${guessAttempts} left`;
        $("#guessAnsModal").modal('hide');
    }
}

function finishGame() {
    window.location.replace("../index.html"); 
}

function updateGame(round_id, outcome) {
    const request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            const data = JSON.parse(this.responseText);
            if (data.success == false) {
                console.log("Update Progress Failed")
            }
        }
    }
    request.open('POST', '../backend/updateGame.php', true);
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    request.send(`round_id=${round_id}&outcome=${outcome}`);

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
