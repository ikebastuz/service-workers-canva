var CACHE_NAME = `my-web-app-push-sw`;

self.addEventListener('activate', () => self.clients.claim());

self.addEventListener('install', () => {});

self.addEventListener('push', e => {
	console.log('Received push event');
	const payload = JSON.parse(e.data.text());
	const { title, body } = payload;
	var options = {
		body,
	};
	e.waitUntil(self.registration.showNotification(title, options));
});
