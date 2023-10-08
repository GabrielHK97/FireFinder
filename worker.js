// import { precacheAndRoute } from 'workbox-precaching';

// precacheAndRoute(self.__WB_MANIFEST);

self.addEventListener('install', (event) => {});

self.addEventListener('activate', (event) => {});

self.addEventListener('fetch', (event) => {});

self.addEventListener('push', (event) => {
	const promiseChain = self.registration.showNotification(event.data.text());
	event.waitUntil(promiseChain);
});
