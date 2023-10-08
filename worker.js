// import { precacheAndRoute } from 'workbox-precaching';

// precacheAndRoute(self.__WB_MANIFEST);

self.addEventListener('install', (event) => {});

self.addEventListener('activate', (event) => {});

self.addEventListener('fetch', (event) => {
	console.log('test');
	const promiseChain = self.registration.showNotification(event.data.text());
	event.waitUntil(promiseChain);
});

self.addEventListener('push', (event) => {
	console.log(event.data.text());
	const promiseChain = self.registration.showNotification(event.data.text());
	event.waitUntil(promiseChain);
});
