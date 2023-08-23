// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyD8WeKUUhwt17U_4LcLahDHvch1ZxFAFd0",
    authDomain: "instagram-commenter.firebaseapp.com",
    projectId: "instagram-commenter",
    storageBucket: "instagram-commenter.appspot.com",
    messagingSenderId: "784942483737",
    appId: "1:784942483737:web:fbfe7036405c4884b0dd88"
};

firebase.initializeApp(firebaseConfig);

// Initialize Firestore
const db = firebase.firestore();

const searchForm = document.getElementById('searchForm');
const userName = document.getElementById('userName');
const userProgress = document.getElementById('userProgress');
const lastUpdatedTime = document.getElementById('lastUpdatedTime'); // New line for Last Updated Time
const incrementButton = document.getElementById('incrementButton');

searchForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const searchName = document.getElementById('searchName').value;

    // Reference to the Firestore collection
    const usersCollection = db.collection('users');

    // Query for the user by name
    usersCollection.where('name', '==', searchName).get()
        .then((querySnapshot) => {
            if (!querySnapshot.empty) {
                // User found, assuming only one match
                const userDoc = querySnapshot.docs[0].data();
                userName.textContent = userDoc.name;
                userProgress.textContent = userDoc.progress;
                lastUpdatedTime.textContent = userDoc.lastUpdatedTime || 'N/A'; // Display Last Updated Time if available
                incrementButton.disabled = false;
            } else {
                // User not found
                userName.textContent = 'User not found';
                userProgress.textContent = '';
                lastUpdatedTime.textContent = '';
                incrementButton.disabled = true;
            }
        })
        .catch((error) => {
            console.error('Error searching for user: ', error);
        });
});

incrementButton.addEventListener('click', function () {
    const searchName = document.getElementById('searchName').value;

    // Reference to the Firestore collection
    const usersCollection = db.collection('users');

    // Update user's progress and last updated time
    usersCollection.where('name', '==', searchName).get()
        .then((querySnapshot) => {
            if (!querySnapshot.empty) {
                // User found, assuming only one match
                const userDoc = querySnapshot.docs[0];
                const currentProgress = userDoc.data().progress;
                const newProgress = currentProgress + 1;

                // Update the progress and lastUpdatedTime fields
                usersCollection.doc(userDoc.id).update({
                    progress: newProgress,
                    lastUpdatedTime: new Date().toLocaleString() // Update with the current date and time
                })
                .then(() => {
                    userProgress.textContent = newProgress;
                    lastUpdatedTime.textContent = new Date().toLocaleString(); // Display the updated Last Updated Time
                    console.log('Progress updated successfully.');
                })
                .catch((error) => {
                    console.error('Error updating progress: ', error);
                });
            }
        })
        .catch((error) => {
            console.error('Error searching for user: ', error);
        });
});

// Function to check if the user has scrolled to the bottom of the page
function isAtBottom() {
    return window.innerHeight + window.scrollY >= document.body.offsetHeight;
}

// Function to reload the page when the user scrolls to the bottom
function reloadOnScroll() {
    if (isAtBottom()) {
        location.reload();
    }
}

// Listen for the scroll event
window.addEventListener('scroll', reloadOnScroll);
