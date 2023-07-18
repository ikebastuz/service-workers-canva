const setOnline = (online = true) => {
	const status = document.getElementById('status');
	if (online) {
		status.classList.add('badge-success');
		status.classList.remove('badge-error');
		status.innerHTML = 'Online';
	} else {
		status.classList.add('badge-error');
		status.classList.remove('badge-success');
		status.innerHTML = 'Offline';
	}
};

setOnline(window.navigator.onLine);
window.addEventListener('online', () => {
	setOnline(true);
});
window.addEventListener('offline', () => {
	setOnline(false);
});

if ('serviceWorker' in navigator) {
	navigator.serviceWorker
		.register('sw.js', {
			scope: '/05_pwa/', // This allows the service worker to control the whole app when testing locally.
		})
		.then(registration => {
			console.log('Service Worker registered successfully!', registration);
		})
		.catch(error => {
			console.error('Service Worker registration failed:', error);
		});
}
