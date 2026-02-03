// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
  apiKey: "AIzaSyAnof02syBCxCgmUiUXa9Q-GYZ8bHz10r8",
  authDomain: "reactnoti-49496.firebaseapp.com",
  projectId: "reactnoti-49496",
  storageBucket: "reactnoti-49496.firebasestorage.app",
  messagingSenderId: "655409057384",
  appId: "1:655409057384:web:a34111efe2348df25c35dd"
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icon-192.png' // Ensure this path matches your public folder icon
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
