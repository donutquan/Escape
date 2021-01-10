let currentUser;

if (localStorage.getItem("username") != null) { 
    currentUser = localStorage.getItem("username");
    document.getElementById("currentUser").innerHTML = " " + currentUser;
} else {
    window.location.replace("index.html");
}

displayRanking(currentUser);

function displayRanking(username) {
    const request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {

            let data = JSON.parse(this.responseText);
            let rankingData = [];
            console.log(data);
            Object.keys(data).forEach(function(key) {
                var attempt = data[key].attempt;
                var room_num = data[key].room_num;
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
                
                if (complete_date != null) {
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
                    rankingData.push({attempt, room_num, duration, complete_date});
                } else {
                    console.log(data[key].duration);
                    if (data[key].duration == "01:00:00.000000") {
                        complete_date = "Time Out"
                        rankingData.push({attempt, room_num, duration, complete_date});
                    }
                }
            });
            $('#rankingTable').DataTable({
                data: rankingData,
                order: [[ 0, "desc" ]],
                columns: [
                    { data: 'attempt' },
                    { data: 'room_num' },
                    { data: 'duration' },
                    { data: 'complete_date'}
                ]
            }) 
        }
    }
    request.open('POST', 'backend/getPersonalRanking.php', true);
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    request.send(`username=${username}`);
}