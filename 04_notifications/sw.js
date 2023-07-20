var CACHE_NAME = `my-web-app-notification-sw`;

self.addEventListener('activate', () => self.clients.claim());

self.addEventListener('install', () => {});

self.addEventListener('notificationclick', event => {
	const { notification, action } = event;
	const { data: payload } = notification;

	console.log(`Notificationclick action: ${action}`);
	console.log({ payload });

	switch (action) {
		case 'close': {
			notification.close();
			break;
		}
		case 'explore': {
			clients.openWindow('http://www.example.com');
			notification.close();
			break;
		}
	}
});

self.addEventListener('notificationclose', () => {
	console.log(`Notificationclose action`);
});
