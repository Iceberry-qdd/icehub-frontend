importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js')

const { Route, registerRoute, setDefaultHandler, setCatchHandler } = workbox.routing
const { CacheFirst, NetworkFirst, NetworkOnly } = workbox.strategies
const { CacheableResponsePlugin } = workbox.cacheableResponse
const { ExpirationPlugin } = workbox.expiration
const { precacheAndRoute } = workbox.precaching
const { cacheNames, setCacheNameDetails, clientsClaim } = workbox.core
const { BackgroundSyncPlugin } = workbox.backgroundSync

self.skipWaiting()
clientsClaim()

setCacheNameDetails({
    prefix: 'icehub',
    suffix: 'v1',
    precache: 'precache',
    runtime: 'runtime',
    googleAnalytics: 'ga'
})

const DAY = 24 * 60 * 60
const SW_VERSION = cacheNames.suffix
const FIRST_CACHE_TYPE = ['audio', 'audioworklet', 'document', 'embed', 'font', /*'frame', 'fencedframe', 'iframe',*/ 'image', 'json', 'manifest', 'object', 'paintworklet', 'report', 'script', 'sharedworker', 'style', 'track', 'video', 'worker', 'xslt']
const FIRST_NETWORK_PATTERN = [/\/api\/curUser/, /\/api\/search\/hot.*/]
const precaches = self.__WB_MANIFEST
const vueFallbackPage = precaches
    .find(it => it.url.match(/assets\/GlobalNetworkOffPage\.[0-9a-f]{8}\.js/)).url

precacheAndRoute(precaches)

FIRST_CACHE_TYPE.forEach(type => {
    registerRoute(
        ({ request }) => /*sameOrigin &&*/ request.destination === type,
        new CacheFirst({
            cacheName: `icehub-${type}-${SW_VERSION}`,
            plugins: [
                new CacheableResponsePlugin({ statuses: [0, 200] }),
                new ExpirationPlugin({ maxEntries: 100, maxAgeSeconds: 30 * DAY })
            ]
        }),
        'GET'
    )
})

FIRST_NETWORK_PATTERN.forEach(pattern => {
    registerRoute(
        ({ url }) => new URL(url).pathname.match(pattern),
        new NetworkFirst({
            cacheName: `icehub-api-${SW_VERSION}`,
            plugins: [
                new CacheableResponsePlugin({ statuses: [0, 200, 201, 204] }),
                new ExpirationPlugin({ maxEntries: 500, maxAgeSeconds: 30 * DAY })
            ]
        })
    )
})

registerRoute(
    ({ url }) => new URL(url).pathname.match(/\/api\/.*/),
    new NetworkOnly({
        cacheName: `icehub-api-${SW_VERSION}`,
        plugins: [
            new CacheableResponsePlugin({ statuses: [0, 200, 201, 204] }),
            new ExpirationPlugin({ maxEntries: 500, maxAgeSeconds: 30 * DAY })
        ]
    })
)

const OFFLINE_SCRIPT_PATTERNS = [/\/assets\/Explore\.[0-9a-f]{8}\.js/, /\/assets\/Index\.[0-9a-f]{8}\.js/, /\/assets\/Notify\.[0-9a-f]{8}\.js/, /\/assets\/Bookmark\.[0-9a-f]{8}\.js/, /\/assets\/Profile\.[0-9a-f]{8}\.js/]
setCatchHandler(({ url, event, params }) => {
    switch (event.request.destination) {
        case 'document': return caches.match('/offline.html')
        case 'script': {
            const canOffline = OFFLINE_SCRIPT_PATTERNS.some(it => url.pathname.match(it))
            return canOffline ? caches.match(vueFallbackPage) : Response.error()
        }
        default: return Response.error()
    }
})

self.addEventListener('activate', function (event) {
    event.waitUntil(
        caches
            .keys()
            .then(keys => keys.filter(key => !key.endsWith(SW_VERSION)))
            .then(keys => Promise.all(keys.map(key => caches.delete(key))))
    )
})