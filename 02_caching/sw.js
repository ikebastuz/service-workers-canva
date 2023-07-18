const origin = location.origin;

const VERSION = 1;
const CACHE_NAME = `my-web-app-cache-v${VERSION}`;
const urlsToCache = [`${origin}/02_caching/index.html`, `${origin}/02_caching/cached.png`];
const cacheWhitelist = ['my-web-app-cache-v-100500'];

self.addEventListener('activate', event => {
	console.log('activating...');

	event.waitUntil(
		caches.keys().then(keyList => {
			return Promise.all(
				keyList.map(key => {
					if (cacheWhitelist.indexOf(key) === -1) {
						return caches.delete(key); // my-web-app-cache-v...
					}
				})
			);
		})
	);
	return self.clients.claim();
});

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
