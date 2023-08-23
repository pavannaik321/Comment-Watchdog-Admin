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

// ...

userDataForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const userName = document.getElementById('userName').value;
    const progress = parseInt(document.getElementById('progress').value);

    // Reference to the Firestore collection
    const usersCollection = db.collection('users');

    // Check if a user with the same name already exists
    usersCollection.where('name', '==', userName).get()
        .then((querySnapshot) => {
            if (querySnapshot.empty) {
                // User doesn't exist, add a new document
                usersCollection.add({
                    name: userName,
                    progress: progress
                })
                .then(() => {
                    console.log('User added to Firestore');
                    alert('User added to Firestore!');
                })
                .catch((error) => {
                    console.error('Error adding user: ', error);
                });
            } else {
                // User already exists, do not add
                console.log('User already exists in Firestore');
                alert('User already exists in Firestore. Cannot add.');
            }

            // Reset the form
            userDataForm.reset();
        })
        .catch((error) => {
            console.error('Error checking user existence: ', error);
        });
});

