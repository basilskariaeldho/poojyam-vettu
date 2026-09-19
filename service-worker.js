const CACHE_NAME = "poojyam-vettu-v1";

const FILES_TO_CACHE = [
    "./",
    "./index.html",
    "./style.css",
    "./game.js",
    "./manifest.json",
    "./icon-192.png",
    "./icon-512.png"
];


/* =========================
   INSTALL
========================= */

self.addEventListener("install", event => {

    event.waitUntil(

        caches.open(CACHE_NAME)
            .then(cache => {

                return cache.addAll(
                    FILES_TO_CACHE
                );

            })

    );

    self.skipWaiting();

});


/* =========================
   ACTIVATE
========================= */

self.addEventListener("activate", event => {

    event.waitUntil(

        caches.keys()
            .then(names => {

                return Promise.all(

                    names
                        .filter(
                            name =>
                                name !== CACHE_NAME
                        )
                        .map(
                            name =>
                                caches.delete(name)
                        )

                );

            })

    );

    self.clients.claim();

});


/* =========================
   FETCH
========================= */

self.addEventListener("fetch", event => {

    event.respondWith(

        caches.match(event.request)
            .then(cachedResponse => {

                if (cachedResponse) {

                    return cachedResponse;

                }

                return fetch(event.request);

            })

    );

});