const cacheName = 'CTC'
const staticAssets = [ './', './index.html', './styles.css', './script.js', "manifest.json" ]

self.addEventListener('install', async function()
{
    const cache = await caches.open(cacheName)
    await cache.addAll(staticAssets)
    return self.skipWaiting()
})

self.addEventListener('activate', function()
{
    self.clients.claim()
})

self.addEventListener('fetch', async function(e)
{
    const req = e.request;
    const url = new URL(req.url)

    if (url.origin === location.origin) return e.respondWith(cacheFirst(req))
    e.respondWith(networkAndCache(req))
})

async function cacheFirst(req)
{
    const cache = await caches.open(cacheName)
    const cached = await cache.match(req)
    return cached || fetch(req)
}

async function networkAndCache(req)
{
    const cache = await caches.open(cacheName)
    try
    {
        const fresh = await fetch(req)
        await cache.put(req, fresh.clone())
        return fresh
    }
    catch (e)
    {
        const cached = await cache.match(req)
        return cached
    }
}
