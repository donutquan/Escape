let currentUser;

if (localStorage.getItem("username") != null) { 
    currentUser = localStorage.getItem("username");
    document.getElementById("currentUser").innerHTML = " " + currentUser;
    getUserProgress(currentUser);
    // Hamburger display logout
} else {
    let regLogin = document.getElementById("regLogin");
    regLogin.className = "d-inline";
    // Hamburger display login
    document.getElementById("login_logout").innerText = "Login";
    document.getElementById("login_logout").setAttribute("href", "login.html")
    document.getElementById("profile_button").className = "d-none";
}
  
displayRanking();

function createRound() {     
    const request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let createData = JSON.parse(this.responseText);
            if (createData.result == true) {
                window.location.replace("room1/room1main.html");
            }
        }
    }
    request.open('POST', 'backend/createRound.php', true);
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    request.send(`username=${currentUser}`);
}

function getUserProgress(username) {
    const request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let userRoomData = JSON.parse(this.responseText);
            if (userRoomData.length != 0) {
                let room_num = userRoomData.room_num
                document.getElementById("btnResume").className = "btn btn-primary d-inline";
                document.getElementById("btnResume").href = `room${room_num}/room${room_num}main.html`;
            } else {
                document.getElementById("btnCreate").className = "btn btn-primary d-inline";
            }
        }
    }
    request.open('POST', 'backend/getUserProgress.php', true);
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    request.send(`username=${username}`);
}

function displayRanking() {
    const request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let data = JSON.parse(this.responseText);
            let rankingData = [];
            Object.keys(data).forEach(function(key) {
                var rank = data[key].rank;
                var username = data[key].username;
                var duration = data[key].duration;
                var complete_date = data[key].complete_date;

                var duration_array = duration.split(":");
                var hour = duration_array[0];
                var hour_array = hour.split("");
                if (hour_array[0] == "0") {
                    hour = hour_array[1]
                }
                var min = duration_array[1];
                var seconds = duration_array[2];
                var seconds_array = seconds.split(".");
                seconds = seconds_array[0];
                duration = `${hour} h ${min} min ${seconds} sec`;
                
                complete_date = String(complete_date)
                complete_date = new Date(complete_date.replace(/-/g,"/"));
                complete_date = String(complete_date)
                complete_date_array = complete_date.split(" ");
                var day = complete_date_array[2];
                var day_array = complete_date_array[2];
                day_array = day_array.split("");
                if (day_array[0] == "0") {
                    day = day_array[1];
                }
                complete_date = day + " " + complete_date_array[1] + " " + complete_date_array[3];
                
                rankingData.push({rank, username, duration, complete_date});
            });
            $('#rankingTable').DataTable({
                data: rankingData,
                order: [[ 2, "asc" ]],
                columns: [
                    { data: 'rank' },
                    { data: 'username' },
                    { data: 'duration' },
                    { data: 'complete_date'}
                ]
            }) 
        }
    }
    request.open('POST', 'backend/getRanking.php', true);
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    request.send();
}