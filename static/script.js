const button = document.getElementById("listen-btn");
const output = document.getElementById("output");
const statusText = document.getElementById("status");
const themeBtn = document.getElementById("theme-toggle");

const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

if (!SpeechRecognition) {
    alert("Speech Recognition not supported in this browser");
}

const recognition = new SpeechRecognition();

recognition.lang = "en-US";
recognition.continuous = false;
recognition.interimResults = false;



window.onload = function () {
    setTimeout(() => {
        wishUser();
    }, 1000);
};



button.addEventListener("click", () => {
    window.speechSynthesis.cancel();
    recognition.start();
});

themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("light");

    if (document.body.classList.contains("light")) {
        themeBtn.innerHTML = "🌙 Dark Mode";
        speak("Light mode enabled");
    } else {
        themeBtn.innerHTML = "☀️ Light Mode";
        speak("Dark mode enabled");
    }
});

recognition.onstart = () => {
    statusText.innerHTML = "Listening...";
    button.classList.add("listening");
};

recognition.onend = () => {
    statusText.innerHTML = "Idle";
    button.classList.remove("listening");
};

recognition.onerror = (event) => {
    statusText.innerHTML = "Error: " + event.error;
    speak("Sorry, there was an error");
};

recognition.onresult = (event) => {
    const transcript =
        event.results[0][0].transcript.toLowerCase();

    output.innerHTML = transcript;
    handleCommand(transcript);
};
function wishUser() {
    let hour = new Date().getHours();

    if (hour < 12) speak("Good Morning");
    else if (hour < 18) speak("Good Afternoon");
    else speak("Good Evening");
}
function handleCommand(command) {

    /* ---------------- GOOGLE ---------------- */
    if (command.includes("open google")) {
        speak("Opening Google");
        window.open("https://www.google.com", "_blank");
    }

    /* ---------------- YOUTUBE ---------------- */
    else if (command.includes("open youtube")) {
        speak("Opening YouTube");
        window.open("https://www.youtube.com", "_blank");
    }

    /* ---------------- OTHER WEBSITES ---------------- */
    else if (command.includes("open github")) {
        speak("Opening GitHub");
        window.open("https://github.com", "_blank");
    }

    else if (command.includes("open chatgpt")) {
        speak("Opening ChatGPT");
        window.open("https://chatgpt.com", "_blank");
    }

    /* ---------------- CALCULATOR ---------------- */
    else if (
        command.includes("calculate") ||
        command.includes("plus") ||
        command.includes("minus") ||
        command.includes("times") ||
        command.includes("divide")
    ) {
        let calc = command
            .replace(/calculate/gi, "")
            .replace(/plus/gi, "+")
            .replace(/minus/gi, "-")
            .replace(/times/gi, "*")
            .replace(/x/gi, "*")
            .replace(/divide/gi, "/")
            .replace(/\s+/g, "");

        try {
            let result = eval(calc);
            output.innerHTML = "Answer: " + result;
            speak("Answer is " + result);
        } catch {
            speak("Calculation failed");
        }
    }

    /* ---------------- WEATHER ---------------- */
    else if (command.includes("weather")) {
        speak("Opening weather");
        window.open(
            "https://www.google.com/search?q=weather",
            "_blank"
        );
    }

    /* ---------------- TIME ---------------- */
    else if (command.includes("time")) {
        let time = new Date().toLocaleTimeString();
        output.innerHTML = time;
        speak("Current time is " + time);
    }

    /* ---------------- DATE ---------------- */
    else if (command.includes("date")) {
        let date = new Date().toDateString();
        output.innerHTML = date;
        speak("Today's date is " + date);
    }
    else if (command.includes("take note")) {

        let note = command.replace("take note", "").trim();

        if (note !== "") {

            let notes = JSON.parse(localStorage.getItem("notes")) || [];

            notes.push(note);

            localStorage.setItem("notes", JSON.stringify(notes));

            output.innerHTML = "📝 Note saved: " + note;

            speak("Note saved");

        } else {
            speak("Please say something to note");
        }
    }

    else if (command.includes("show notes")) {

        let notes = JSON.parse(localStorage.getItem("notes")) || [];

        if (notes.length === 0) {
            output.innerHTML = "No notes found";
            speak("No notes available");
        } else {
            output.innerHTML = "📝 Notes:<br>" + notes.join("<br>");
            speak("Here are your notes");
        }
    }

    else if (command.includes("clear notes")) {

        localStorage.removeItem("notes");

        output.innerHTML = "Notes cleared";

        speak("All notes cleared");
    }
    else {
        speak("Sorry, I did not understand");
    }
}

function speak(text) {
    window.speechSynthesis.cancel();

    let speech = new SpeechSynthesisUtterance(text);
    speech.rate = 1;
    speech.pitch = 1;
    speech.volume = 1;

    window.speechSynthesis.speak(speech);
}
