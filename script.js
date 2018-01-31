

var userStorage = firebase.database().ref("user-storage")

console.log(uid)

var app = {
    isRunning: false,
    fullMessage: "",
    typewriter: function(historyApiRes, WordsApiRes){
        clearInterval(typeTimer)
        $("#results-container").empty()
        var fullText = "";
        var speed = 50;
        var i = 0;
        if(!WordsApiRes){
            fullText = historyApiRes;
            console.log("no word")
        }else{
            fullText = historyApiRes + WordsApiRes;
            console.log("else ran")
        }
        var typeTimer = setInterval(writeText, speed)
        function writeText(){ 
            if(i<fullText.length){
                console.log(fullText)
                var currentText = $("#results-container").text()
                var character = fullText.charAt(i);
                $("#results-container").text(currentText + character);
                i++;
            }
        }
    },
};
//Place for our API calls
var api = {
    nameText: "",
    historyText: "",
     
    callNameAPI: function (userName) {
        $.ajax({
            url: "https://wordsapiv1.p.mashape.com/words/" + userName,
            data: { "X-Mashape-Key": "KTvKMGaySOmsh75NGO7T8aR3MBbwp1rfNdIjsnwdXomPepANNE" },
            method: "GET",
            beforeSend: function (xhr) { xhr.setRequestHeader('X-Mashape-Key', 'KTvKMGaySOmsh75NGO7T8aR3MBbwp1rfNdIjsnwdXomPepANNE') }
        }).done(function (response) {
            var nameObj = response;
            var definition = nameObj.results[0]["definition"];
            api.nameText = ("Your name means " + definition)
        });
    },
    callHistory: function (month, day, userName) {

        var queryUrl = "https://cors-anywhere.herokuapp.com/" + "http://history.muffinlabs.com/date/" + month + "/" + day

        $.ajax({
            url: queryUrl,
            method: "GET"
        }).done(function (response) {
            var returnInfo = JSON.parse(response);
            var x = Math.floor(Math.random() * returnInfo.data.Events.length); //randomizes the response we add to the page (next 2 lines)
            var text = returnInfo.data.Events[x].text;
            var yearOccur = returnInfo.data.Events[x].year;

            if (text.indexOf(":") > -1) {
                text = text.split(":")
                text = text[1]
            }

            app.fullMessage = "";
            api.historyText = ("Hi " + userName + ", In the year " + yearOccur + " on the day you were born " + text)
            console.log(api.historyText, api.nameText)
            app.typewriter(api.historyText,api.nameText)
        })
    }
}

userStorage.on("child_added",function(snapshot){
    var div = $("<div>")
    var p = $("<p>")
    var span = $("<span>").text("X")
    span.attr("key",snapshot.key)
    span.attr("class","remove")
    p.html(snapshot.val().name + " " + snapshot.val().dobMonth + "/" + snapshot.val().dobDay + "/" + snapshot.val().dobYear)
    p.attr("class", "user-button")
    p.attr("name", snapshot.val().name)
    p.attr("day",snapshot.val().dobDay)
    p.attr("month",snapshot.val().dobMonth)
    div.append(p,span)
    div.attr("class","button-holder")
    $("#button-container").append(div)
    },
    function(errData){
        console.log("Unable to retreive data")
    }
)

$(document).delegate(".remove", "click", function(){
    var key = $(this).attr("key");
    console.log(key)
    userStorage.child(key).remove()
    $(this).parent().remove();
})

$(document).delegate(".user-button","click",function(){
    $("#results-container").empty()
    var userName = $(this).attr("name")
    var userDobDay = $(this).attr("day")
    var userDobMonth = $(this).attr("month")
    api.callHistory(userDobMonth, userDobDay, userName);
    api.callNameAPI(userName);
})

document.onkeydown = function(event){
    if(event.which === 13){
        $("#results-container").empty()
        var userName = $("#name-input").val().trim()
        var userDob = $("#date").val();
        var userDobDay = userDob.substring(userDob.length - 2);
        var userDobMonth = userDob.substring(5, 7);
        var userDobYear = userDob.substring(0, 4);

        userStorage.push({
            name: userName,
            dobDay: userDobDay,
            dobMonth: userDobMonth,
            dobYear: userDobYear
        })
        api.callNameAPI(userName);
        api.callHistory(userDobMonth, userDobDay, userName);
    }
}