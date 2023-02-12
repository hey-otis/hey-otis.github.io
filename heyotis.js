// var langs =
//     [['Afrikaans', ['af-ZA']],
//     ['Bahasa Indonesia', ['id-ID']],
//     ['Bahasa Melayu', ['ms-MY']],
//     ['Català', ['ca-ES']],
//     ['Čeština', ['cs-CZ']],
//     ['Deutsch', ['de-DE']],
//     ['English', ['en-AU', 'Australia'],
//         ['en-CA', 'Canada'],
//         ['en-IN', 'India'],
//         ['en-NZ', 'New Zealand'],
//         ['en-ZA', 'South Africa'],
//         ['en-GB', 'United Kingdom'],
//         ['en-US', 'United States']],
//     ['Español', ['es-AR', 'Argentina'],
//         ['es-BO', 'Bolivia'],
//         ['es-CL', 'Chile'],
//         ['es-CO', 'Colombia'],
//         ['es-CR', 'Costa Rica'],
//         ['es-EC', 'Ecuador'],
//         ['es-SV', 'El Salvador'],
//         ['es-ES', 'España'],
//         ['es-US', 'Estados Unidos'],
//         ['es-GT', 'Guatemala'],
//         ['es-HN', 'Honduras'],
//         ['es-MX', 'México'],
//         ['es-NI', 'Nicaragua'],
//         ['es-PA', 'Panamá'],
//         ['es-PY', 'Paraguay'],
//         ['es-PE', 'Perú'],
//         ['es-PR', 'Puerto Rico'],
//         ['es-DO', 'República Dominicana'],
//         ['es-UY', 'Uruguay'],
//         ['es-VE', 'Venezuela']],
//     ['Euskara', ['eu-ES']],
//     ['Français', ['fr-FR']],
//     ['Galego', ['gl-ES']],
//     ['Hrvatski', ['hr_HR']],
//     ['IsiZulu', ['zu-ZA']],
//     ['Íslenska', ['is-IS']],
//     ['Italiano', ['it-IT', 'Italia'],
//         ['it-CH', 'Svizzera']],
//     ['Magyar', ['hu-HU']],
//     ['Nederlands', ['nl-NL']],
//     ['Norsk bokmål', ['nb-NO']],
//     ['Polski', ['pl-PL']],
//     ['Português', ['pt-BR', 'Brasil'],
//         ['pt-PT', 'Portugal']],
//     ['Română', ['ro-RO']],
//     ['Slovenčina', ['sk-SK']],
//     ['Suomi', ['fi-FI']],
//     ['Svenska', ['sv-SE']],
//     ['Türkçe', ['tr-TR']],
//     ['български', ['bg-BG']],
//     ['Pусский', ['ru-RU']],
//     ['Српски', ['sr-RS']],
//     ['한국어', ['ko-KR']],
//     ['中文', ['cmn-Hans-CN', '普通话 (中国大陆)'],
//         ['cmn-Hans-HK', '普通话 (香港)'],
//         ['cmn-Hant-TW', '中文 (台灣)'],
//         ['yue-Hant-HK', '粵語 (香港)']],
//     ['日本語', ['ja-JP']],
//     ['Lingua latīna', ['la']]];

// let select_language = document.querySelector('#select_language');
// let select_dialect = document.querySelector('#select_dialect');

// for (var i = 0; i < langs.length; i++) {
//     select_language.options[i] = new Option(langs[i][0], i);
// }

// select_language.selectedIndex = 6;
// updateCountry();
// select_dialect.selectedIndex = 6;

// function updateCountry() {
//     for (var i = select_dialect.options.length - 1; i >= 0; i--) {
//         select_dialect.remove(i);
//     }
//     var list = langs[select_language.selectedIndex];
//     for (var i = 1; i < list.length; i++) {
//         select_dialect.options.add(new Option(list[i][1], list[i][0]));
//     }
//     select_dialect.style.visibility = list[1].length == 1 ? 'hidden' : 'visible';
// }

function processTranscript(transcript) {
    let processed_transcript = "";
    const word_array = transcript.split(" ");

    var msg_start_idx = word_array.length;
    for (let i = 0; i < word_array.length - 1; i++) {
        if (word_array[i].toLowerCase() == "hey" && word_array[i + 1].toLowerCase() == "otis") {
            processed_transcript += "Hey Otis,";
            msg_start_idx = i + 2;
        }
        if (i > msg_start_idx) {
            processed_transcript += " ";
            processed_transcript += word_array[i];
        }
    }

    return processed_transcript;
}

function constructResponse(query) {
    query = query.toLowerCase();
    if (query.includes("directions") && query.includes("food") || query.includes("court")) {
        return "Take the elevator to floor 2 when it arrives. " +
            "When you exit the elevator, turn left and walk straight. " +
            "You will see the food court on your right. " +
            "Scan the QR code to take the directions with you."
    }
    else {
        return ""
    }
}

function speakResponse(response) {
    var msg = new SpeechSynthesisUtterance();
    msg.text = response;
    window.speechSynthesis.speak(msg);
}

if ("webkitSpeechRecognition" in window) {
    let speechRecognition = new webkitSpeechRecognition();
    let final_transcript = "";

    speechRecognition.continuous = true;
    speechRecognition.interimResults = true;
    // speechRecognition.lang = document.querySelector("#select_dialect").value;

    // speechRecognition.onstart = () => {
    //     document.querySelector("#status").style.display = "block";
    // };
    // speechRecognition.onerror = () => {
    //     document.querySelector("#status").style.display = "none";
    //     console.log("Speech Recognition Error");
    // };
    // speechRecognition.onend = () => {
    //     document.querySelector("#status").style.display = "none";
    //     console.log("Speech Recognition Ended");
    // };

    speechRecognition.onresult = (event) => {
        let interim_transcript = "";

        for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                final_transcript += event.results[i][0].transcript;
                final_transcript = processTranscript(final_transcript);
                let response = constructResponse(final_transcript);
                speakResponse(response);
            } else {
                interim_transcript += event.results[i][0].transcript;
                interim_transcript = processTranscript(interim_transcript);
            }
        }

        document.querySelector("#final").innerHTML = final_transcript;
        document.querySelector("#interim").innerHTML = interim_transcript;

    }

    document.addEventListener("keypress", speechRecognition.start());

    // document.querySelector("#start").onclick = () => {
    //     speechRecognition.start();
    // };
    // document.querySelector("#stop").onclick = () => {
    //     speechRecognition.stop();
    // };

} else {
    console.log("Speech Recognition Not Available");
}
