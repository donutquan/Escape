let currentUser;
let roomNumber = 1;

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

let correct_items = ["obj1-dog", "obj-2cat", "obj3-owl"];
let correct_list = ["8","5","4"];
let batteryCounter = 0
let speakerFirstPlay = true;
let speakerControl = false;
let speakerProgress = false;

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
      for (object of userObjectData) {
        let targetObjectId = `obj${object.object_id}-${object.object_name}`;
        let targetElement = document.getElementById(targetObjectId);
        userRoomObjects[targetObjectId] = [object.object_name, object.object_description, object.object_room, object.progress_value];  
        if(typeof(targetElement) != 'undefined' && targetElement != null){
          targetElement.className = "d-none"
        }
      }
      getInventory(userRoomObjects)
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
        window.location.replace("../room2/room2main.html");
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
  let user_input_list = [document.getElementById("num1").value, document.getElementById("num2").value, document.getElementById("num3").value];
  if (JSON.stringify(user_input_list) === JSON.stringify(correct_list)) {
    goNextPage(roundId, "2");
  }
  else {
    document.getElementById("modal_title").innerText = "Oops...";
    document.getElementById("modal_text").innerText = "You attempt to unlock the lock but it seems that the lock combination is incorrect!";
    $("#padlockModal").modal('hide');
  }
}

function getInventory(userRoomObjects) {
  let inventory = document.getElementById("inventory");
  let tableResult = `<tr><th>Name</th><th>Description</th><th>Image</th></tr>`;

  for (let item in userRoomObjects){
    if (userRoomObjects[item][0].includes("battery")) {
      batteryCounter++;
    }
    if (userRoomObjects[item][0].includes("speaker")) {
      speakerProgress = true;
    }
    if (userRoomObjects[item][1] != "") {
      console.log(item);
      tableResult += `<tr>
        <td>${userRoomObjects[item][0]}</td>
        <td>${userRoomObjects[item][1]}</td>
        <td><img src="../assets/pictures/imgRoom1/${item}.png" width="100px" height="100px" data-toggle="modal" data-target="#inventoryModal" onclick="showModal()"></td>
      </tr>`;
    }
  }
  inventory.innerHTML = tableResult;
}

function addToInventory(object_id) {
  console.log(object_id); 
  const request = new XMLHttpRequest();
  request.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      const data = JSON.parse(this.responseText);
      if (data.success == true) {
        getUserRoomObjects(roomNumber, roundId);
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

function removeItemFromScreen(objectData) {
  console.log(objectData);
  if (!userRoomObjects[objectData.id]) {
    let selectedItem = document.getElementById(objectData.id);
    selectedItem.className = "d-none";
    let object_id = objectData.id[3];
    addToInventory(object_id)
    if(correct_items.includes(objectData.id)) { 
      getRoomProgress(roundId, roomNumber);
    }
  }
}






//Start of Speaker & Battery Insert Code
function insertBattery() {
  selectedBattery = document.getElementById("battery");
  if (batteryCounter > 0) {
    selectedBattery.className = "btn btn-success";
    selectedBattery.value = "true";
    operateSpeaker();
    if (speakerProgress == false) {
      addToInventory(4);
    }
  }
  else {
    alert('Nothing happens. You need to find a battery');
  }
}

function operateSpeaker() {
  updateGameProgress(roundId, currentDuration);

  let speaker = document.getElementById("speaker");
  if (document.getElementById("battery").value == "true") {
    if(speakerFirstPlay) {
      getRoomProgress(roundId, roomNumber);
      speakerFirstPlay = false;
    }
    $("#speakerModal").modal('hide');
    if (!speakerControl) {
        speaker.play();
        speakerControl = true;
    } else {
        speaker.pause();
        speakerControl = false;
    }
  } else {
    $("#speakerModal").modal('show');
  }
}
//End of Speaker & Battery Insert Code



function showModal() {
  console.log("A");
  let imgSrc = event.target.src;
  document.getElementById('inventoryModal-body').innerHTML = `<img src="${imgSrc}" class="w-100">`;
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


function moveCushion() {
  var cushion=document.getElementById('cushion');
  if (cushion.style.left != "39%") {
    cushion.style.left = '39%';
  }
  else {
    cushion.style.left="34%";
  }
  

}
function jumpScare() {
  let jumpScare = document.getElementById("jumpScare");
  jumpScare.play();
}

function nothing() {
  alert('Nothing interests you here.');
}

