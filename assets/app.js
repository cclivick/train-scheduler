$(document).ready(function() {

        var firebaseConfig = {
            apiKey: "AIzaSyD8uTYdX4UrWzu89noTn1yDIuVY4vdVc70",
            authDomain: "train-scheduler-c0a9c.firebaseapp.com",
            databaseURL: "https://train-scheduler-c0a9c.firebaseio.com",
            projectId: "train-scheduler-c0a9c",
            storageBucket: "train-scheduler-c0a9c.appspot.com",
            messagingSenderId: "230671423242",
            appId: "1:230671423242:web:6389f52e86f6261a"
        };

        firebase.initializeApp(firebaseConfig);

        var trainData = firebase.database();

        //Submit Button and remove default function
        $("#submitBtn").on("click", function(event) {
            event.preventDefault();
            //Get user inputs
                var trainName = $("#trainNameInput").val().trim();
                var trainDest = $("#destinInput").val().trim();
                var firstDepart = $("#timeInput").val().trim();
                var frequency = $("#freqInput").val().trim();

            //Store user data in temporary variable
                var newTrain = {
                    Name: trainName,
                    Destination: trainDest,
                    FirstTrain: firstDepart,
                    Frequency: frequency
                };

            //Push newTrain to firebase
                trainData.ref().push(newTrain);
                    console.log(trainName);
                    console.log(trainDest);
                    console.log(firstDepart);
                    console.log(frequency);

            //Clear all textboxes for new newTrain
                $("#trainNameInput").val("");
                $("#destinInput").val("");
                $("#timeInput").val("");
                $("#freqInput").val("");
            })

        //Firebase event "child_added" to create new train in DOM
        trainData.ref().on("child_added", function(childSnapshot) {
            console.log(childSnapshot.val());
                var trainName = childSnapshot.val().Name;
                var trainDest = childSnapshot.val().Destination;
                var firstDepart = childSnapshot.val().FirstTrain;
                var frequency = childSnapshot.val().Frequency;
                
                //Convert frequency from string to integer
                var frequency = parseInt(frequency);

                
                var dateConvert = moment(firstDepart, "HH:mm").subtract(1, "years");
                var trainTime = moment(dateConvert).format("HH:mm");

                var timeConvert = moment(trainTime, "HHmm").subtract(1, "years");
                var timeDifference = moment().diff(moment(timeConvert), "minutes");
                
                var timeRemaining = timeDifference % frequency;
                
                var timeAway = frequency - timeRemaining;
                var nextArrival = moment().add(timeAway, "minutes");
                var arrivalDisplay = moment(nextArrival).format("HH:mm");




                var newTrainRow = $("<tr>").append(
                    $("<td>").text(trainName),
                    $("<td>").text(trainDest),
                    $("<td>").text(frequency),
                    $("<td>").text(arrivalDisplay),
                    $("<td>").text(timeAway),
                )

                $("#trainTable > tbody").append(newTrainRow);

        })
        setInterval("window.location.reload()", 60000);

    });