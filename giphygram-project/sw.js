//SW version
const version = '1.0';

//static cache
const appAssets =[
    'index.html',
    'main.js',
    'images/flame.png',
    'images/logo.png',
    'images/sync.png',
    'vendor/bootstrap.min.css',
    'vendor/jquery.min.js'
];

//SW install
self.addEventListener('install',e=>{
    e.waitUntil(
        caches.open(`static-${version}`)
            .then(cache => cache.addAll(appAssets))
    );
});

//SW Activate

self.addEventListener('activate',e=>{
    //clean static cache
    let cleaned = caches.keys().then(keys =>{
       keys.forEach(key =>{
          if(key !== `static-${version}`&&key.match(`static-`)){
              return caches.delete(key);
          }
       });
    });

    e.waitUntil(cleaned);
});

//static cache
const staticCache = (req)=>{
    return caches.match(req).then(cachedRes =>{
       //return cached if found
       if(cachedRes) return cachedRes;

       //fallback to network
        return fetch(req).then(networkRes =>{
           //update cache with new response
           caches.open(`static-${version}`)
               .then(cache => cache.put(req,networkRes));
           //return clone
            return networkRes.clone();
        });
    });
}

//SW Fetch
self.addEventListener('fetch',e=>{
    //App shell
    if(e.request.url.match(location.origin)){
        e.respondWith(staticCache(e.request));
    }
});