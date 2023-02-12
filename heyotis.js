var otis_awake = false;
var recognition = null;


function wake_otis() {
    // Call this function to wake otis after hey otis is said
    otis_awake = true;
    document.getElementById("otis-orb").style.visibility = "visible";
}

function sleep_otis() {
    // Call this function to sleep otis after otis executes a command
    otis_awake = false;
    document.getElementById("otis-orb").style.visibility = "hidden";
}

// otis starts asleep
sleep_otis();

function listen_for_hey_otis(transcript) {
    // returns true if hey otis was said during the transcript
    const word_array = transcript.split(" ");
    for (let i = 0; i < word_array.length - 1; i++) {
        if (word_array[i].toLowerCase() == "hey" && word_array[i + 1].toLowerCase() == "otis") {
			console.log("found hey otis");
            return true;
        }
    }
    return false;
}

function processFinalTranscript(transcript) {
    // processes final transcripts
    if (otis_awake) {
        let response = constructResponse(transcript);
		if (response != "")
		{
			speakResponse(response);
		    sleep_otis();
			document.querySelector("#final").innerHTML = response;
			document.querySelector("#interim").innerHTML = "";
		}
    }
    else if (!otis_awake && listen_for_hey_otis(transcript)) {
        wake_otis();
        document.querySelector("#final").innerHTML = "";
		document.querySelector("#interim").innerHTML = "Hey Otis,";
    }
}

function constructResponse(query) {
    query = query.toLowerCase();
    if (query.includes("directions") && query.includes("cafeteria") || query.includes("food")) {
        return "Board the left-most elevator when it arrives. " +
			   "Exit on floor 2. " + "When you exit the elevator, turn left and walk straight. " +
            "You will see the cafeteria on your right.";
    } else if (query.includes("bathroom") || query.includes("restroom")) {
        return "Board the center elevator once it arrives. Exit on the third floor and take a left.";
    } else if (query.includes("work") && query.include("how") || query.includes("what are you")) {
		return "You can ask for me directions or tell me where you want to go. I can call the elevators for you.";
	} else if (query.includes("time") && query.includes("date")) {
		const now = new Date(); 
		var date_str = now.toLocaleDateString('en-us', { weekday:"long", year:"numeric", month:"short", day:"numeric"});
		var time_str = now.toLocaleTimeString("en-us");
		return "Today is " + date_str + ". It is " + time_str + ". How else can I help you?";				
	}
	else if (query.includes("date")) {
		const now = new Date();
		var date_str = now.toLocaleDateString('en-us', { weekday:"long", year:"numeric", month:"short", day:"numeric"});
		return "Today is " + date_str + ". How else can I help you?";	
	} else if (query.includes("time")) {
		const now = new Date();  
		return "It is " + now.toLocaleTimeString("en-us") + ". Is there anything else I can do for you?";
	} else {
		return ""
	}
}

function speakResponse(response) {
	console.log("speaking response");
	var speaker = new SpeechSynthesisUtterance();
    speaker.text = response;
    window.speechSynthesis.speak(speaker);
}

function setTranscriptOutput(interim, response) {
    document.querySelector("#interim").innerHTML = interim;
    document.querySelector("#final").innerHTML = response;
}

if ("webkitSpeechRecognition" in window) {
	
	
  var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
  var recognition = new SpeechRecognition();

  // This runs when the speech recognition service starts
  recognition.onstart = function () {
    //wake_otis();
  };

  // stop listenting the speech recognition
  recognition.onspeechend = function () {
    recognition.stop();
  }
  
   // stop listenting the speech recognition
  recognition.onend = function () {
    recognition.start();
  }

  // This runs when the speech recognition service returns result
  recognition.onresult = function (event) {
    const transcript = event.results[0][0].transcript.toLowerCase();
    const confidence = event.results[0][0].confidence;
	processFinalTranscript(transcript);
  }

  document.addEventListener("keypress", recognition.start());

} else {
    console.log("Speech Recognition Not Available");
}
