const socket = io();

const myFace = document.getElementById("myFace");
const muteBtn = document.getElementById("mute");
const cameraBtn = document.getElementById("camera");
const cameraSelect = document.getElementById("cameras");

let myStream;
let muted = true;
let cameraOff = false;

async function getCameras() {
    try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const cameras = devices.filter(
            devices => devices.kind === "videoinput");
        const currentCamera = myStream.getVideoTracks()[0];
        cameras.forEach(camera => {
            const option = document.createElement("option");
            option.value = camera.deviceId;
            option.innerText = camera.label;
            if (currentCamera.label == camera.label) {
                option.selected = true;
            }
            cameraSelect.appendChild(option);
        })
    } catch (e) {
        console.log(e);
    }
}

async function getMedia(deviceId) {
    const initialConstrains = {
        audio: true,
        video: { facingMode: "user" },
    };
    const cameraConstraints = {
        audio: true,
        video: { deviceId: { exact: deviceId } },
    };
    try {
        myStream = await navigator.mediaDevices.getUserMedia(
            deviceId ? cameraConstraints : initialConstrains
        );
        myFace.srcObject = myStream;
        if (!deviceId) {
            await getCameras();
        }
        setMute(muted);
        setCamera(cameraOff);
    } catch (e) {
        console.log(e);
    }
}

getMedia();

function setMute(input) {
    muted = input;
    muteBtn.innerText = muted ? "Unmute" : "Mute";
    myStream.getAudioTracks()
        .forEach(track => { track.enabled = !input; });
}

function setCamera(input) {
    cameraOff = input;
    cameraBtn.innerText = cameraOff ? "Turn Camera On" : "Turn Camera Off";
    myStream.getVideoTracks()
        .forEach(track => { track.enabled = !input; });
}

function handleMuteClick() {
    muted = !muted;
    setMute(muted);
}

function handleCameraClick() {
    cameraOff = !cameraOff;
    setCamera(cameraOff);
}

async function handleCameraChange() {
    await getMedia(cameraSelect.value);
}

muteBtn.addEventListener("click", handleMuteClick);
cameraBtn.addEventListener("click", handleCameraClick);
cameraSelect.addEventListener("input", handleCameraChange);