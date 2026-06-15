const area = document.getElementById('writing-area');
area.addEventListener('paste', e => e.preventDefault())
area.addEventListener('copy', e => e.preventDefault())
area.addEventListener('cut', e => e.preventDefault())

const timer = document.getElementById('timer');
const wordCounterElem = document.querySelector("#word-counter")
const writingAreaElem = document.querySelector("#writing-area")

function waitMainTimer(sec) {

    return new Promise(res => {
        let timeLeft = sec
        timer.textContent = [String(parseInt(timeLeft / 60)).padStart(2, "0"), String(timeLeft % 60).padStart(2, "0")].join(":");
        const timerInterval = setInterval(() => {
            timeLeft--;
            timer.textContent = [String(parseInt(timeLeft / 60)).padStart(2, "0"), String(timeLeft % 60).padStart(2, "0")].join(":");
            if (timeLeft <= 0 && timer.textContent === "00:00") {
                clearInterval(timerInterval)
                res()
            }
        }, 999)
    })
}

function saveWritngAsFile(textToWrite) {
    const textBlob = new Blob([textToWrite], { type: "text/plain" });
    const fileName = `writing ${new Date().toISOString().slice(0, 10)}.txt`;
    const downloadLink = document.createElement("a");
    downloadLink.download = fileName;
    downloadLink.href = window.URL.createObjectURL(textBlob);

    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    window.URL.revokeObjectURL(downloadLink.href);
}

function onType(e) {
    wordCounterElem.textContent = writingAreaElem.value.length.toString()
}

async function writingPart(params) {
    writingAreaElem.addEventListener("keyup", onType)
    document.querySelector("#writing-area").value = ""

    document.querySelector(".question-img").src = "./" + params.get("text_id")

    // read artice: 10 min
    await waitMainTimer(10 * 60)
    document.querySelector(".article-container").classList.add("hidden")
    document.querySelector(".writing-container").classList.remove("hidden")

    // write recap: 35 min
    await waitMainTimer(35 * 60)
    const writingText = document.querySelector("#writing-area").value
    document.querySelector(".writing-container").classList.add("hidden")
    saveWritngAsFile(writingText)
    alert("考试结束")

    console.log(writingText)
}

async function exam() {
    const params = new URLSearchParams(document.location.search)
    await writingPart(params)
}

exam()
