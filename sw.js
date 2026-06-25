// ── Firebase Cloud Messaging (push notifications) ──
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyDebW-daQXFTIRTb9ieu0BYi9x8cnLcK5w",
  authDomain: "ditiooddhay-8207a.firebaseapp.com",
  projectId: "ditiooddhay-8207a",
  storageBucket: "ditiooddhay-8207a.firebasestorage.app",
  messagingSenderId: "669700279571",
  appId: "1:669700279571:web:d88dbbe62e9d6c0c6bdee6"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const title = (payload.notification && payload.notification.title) || 'দ্বিতীয় অধ্যায়';
  const options = {
    body: (payload.notification && payload.notification.body) || '',
    icon: '/icon-192.png',
    badge: '/icon-192.png'
  };
  self.registration.showNotification(title, options);
});

// ── PWA offline cache (existing) ──
const CACHE = 'ditio-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/gallery.html',
  '/booking.html',
  '/packages.html',
  '/team.html',
  '/contact.html',
  '/reviews.html',
  '/schedule.html',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE).map(k => caches.delete(k))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request)
      .then(res => {
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});