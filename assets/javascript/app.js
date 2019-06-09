// Web app's Firebase configuration
;var firebaseConfig = {
    apiKey: "AIzaSyAZVrzZwxL6ykjGkfmMlgrNeq3ZpE5udqA",
    authDomain: "train-scheduler-fb.firebaseapp.com",
    databaseURL: "https://train-scheduler-fb.firebaseio.com",
    projectId: "train-scheduler-fb",
    storageBucket: "",
    messagingSenderId: "77015605020",
    appId: "1:77015605020:web:04fe2e61530ff0b1"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var database = firebase.database();

// Initial Values
var name = "";
var destination = "";
var time = "";
var frequency = 0;

// Capture Button Clicks
$("#add-train").on("click", function(event) {
    event.preventDefault();

    name = $("#train-name").val().trim();
    destination = $("#destination").val().trim();
    time = $("#train-time").val().trim();
    frequency = $("#frequency").val().trim();

    // Push data
    database.ref().push({
        name: name,
        destination: destination,
        time: time,
        frequency: frequency,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    });

    alert("Train information successfully added!");

    // Clear all textboxes
    $("#train-name").val("");
    $("#destination").val("");
    $("#train-time").val("");
    $("#frequency").val("");
});

// Firebase event for adding train to database and html table
database.ref().on("child_added", function(snapshot) {
    console.log(snapshot.val());

    // Store new train data into variables
    var trainName = snapshot.val().name;
    var trainDestination = snapshot.val().destination;
    var trainTime = snapshot.val().time;
    var trainFrequency = snapshot.val().frequency;

    // Calculate next arrival and mins away from trainTime

    var convertedTime = moment(trainTime, "HH:mm").subtract(1, "years");
    console.log("Time: " + convertedTime);

    //Difference between the times
    var diffTime = moment().diff(moment(convertedTime), "minutes");
    console.log("Difference in time: " + diffTime);

    //Time apart
    var tRemainder = diffTime % trainFrequency;
    console.log("Remainder: " + tRemainder);

    //Minutes Until Train
    var minutesAway = trainFrequency - tRemainder;

    //Next Train
    var nextTime = moment().add(minutesAway, "minutes");
    console.log("Next Time: " + nextTime);
    var nextArrival = moment(nextTime).format("HH:mm");

    // Create new row
    var newTrain = $("<tr>").append(
        $("<td>").text(trainName),
        $("<td>").text(trainDestination),
        $("<td>").text(trainFrequency),
        $("<td>").text(nextArrival),
        $("<td>").text(minutesAway)
    );

    $("#new-train").append(newTrain);
});


