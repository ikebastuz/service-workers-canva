const origin = location.origin;

const CACHE_NAME = 'my-pwa-cache-v2';
const urlsToCache = [
	`${origin}/03_pwa/`,
	`${origin}/03_pwa/app.js`,
	`${origin}/03_pwa/manifest.json`,
	`${origin}/03_pwa/index.html`,
	`${origin}/03_pwa/i_maked_this.png`,
];

// Install the service worker and cache the static assets
self.addEventListener('install', event => {
	console.log(`installing SW ${CACHE_NAME}...`);

	// Wrapper to wait for cache
	event.waitUntil(
		caches.open(CACHE_NAME).then(cache => {
			console.log('Opened cache');
			return cache.addAll(urlsToCache);
		})
	);
});

// Serve cached static assets when offline
self.addEventListener('fetch', event => {
	console.log(`%cRequested file: ${event.request.url}. Cache - ${CACHE_NAME}`, 'color: yellow');

	event.respondWith(
		caches.match(event.request).then(response => {
			if (response) {
				console.log(
					`%cFound file: ${event.request.url}, returning object. Cache - ${CACHE_NAME}`,
					'color: #A9DC76'
				);
				return response;
			}

			/**
			 * We clone request. Since request - is a buffer -
			 * we can access it only once.
			 */
			const fetchRequest = event.request.clone();

			/**
			 * Nothing in cache - we are fetching manually
			 */
			return fetch(fetchRequest)
				.then(response => {
					if (!response || response.status !== 200 || response.type !== 'basic') {
						return response;
					}

					if (urlsToCache.includes(event.request.url)) {
						const responseToCache = response.clone();

						caches.open(CACHE_NAME).then(cache => {
							console.log(
								`%cAdding file to cache: ${event.request.url}. Cache - ${CACHE_NAME}`,
								'color: #78DCE8'
							);
							cache.put(event.request, responseToCache);
						});
						return response;
					} else {
						console.log(
							`%cReturning fetched file: ${event.request.url}. Cache - ${CACHE_NAME}`,
							'color: #2b85fd'
						);
						return response;
					}
				})
				.catch(_ => {
					console.log(
						`%cError fetching file: ${event.request.url}. Cache - ${CACHE_NAME}`,
						'color: #ff8c9a'
					);
					return response;
				});
		})
	);
});
