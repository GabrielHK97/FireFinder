self.addEventListener('install', (event) => {});

self.addEventListener('activate', (event) => {});

self.addEventListener('fetch', (event) => {
	console.log('fetch');
});

self.addEventListener('push', (event) => {
	console.log('push');
});
