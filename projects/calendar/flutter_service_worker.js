'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"assets/AppPartsIcons/alarm-clock-svgrepo-com.svg": "7f24fdb6bf9d6d74a2f684a6b9e42af3",
"assets/AppPartsIcons/album-collection-svgrepo-com.svg": "2d262b9cad70225646a26d0632f1b710",
"assets/AppPartsIcons/album-svgrepo-com.svg": "9dc707062572f32feb51f271063c5b81",
"assets/AppPartsIcons/arrow-down-svgrepo-com.svg": "7e66231271a292cf7888e88e4def4e4d",
"assets/AppPartsIcons/arrow-left-svgrepo-com.svg": "543b03f1b4a834119330beb7f6088e65",
"assets/AppPartsIcons/arrow-right-svgrepo-com.svg": "dd8b93fd05bbd6e5f3b72efc1961e3ca",
"assets/AppPartsIcons/book-user-svgrepo-com%2520(1).svg": "c54f779f46efc9d05f30d1c0963c76e7",
"assets/AppPartsIcons/book-user-svgrepo-com.svg": "c54f779f46efc9d05f30d1c0963c76e7",
"assets/AppPartsIcons/calendar-alt-svgrepo-com.svg": "4caa3a22b14f1c5ebf57db3ee3c5284a",
"assets/AppPartsIcons/calendar-arrow-up-svgrepo-com.svg": "770f0c9309b4f95ef66a3f25964b7110",
"assets/AppPartsIcons/calendar-check-svgrepo-com.svg": "5bc07513fe6df266ee66f1c5003970e1",
"assets/AppPartsIcons/calendar-circle-exclamation-svgrepo-com.svg": "1469a443db20d5ff2dcabc6921d4bbaf",
"assets/AppPartsIcons/calendar-circle-minus-svgrepo-com.svg": "34fdb3a26c2448ba90be7acbcb47541b",
"assets/AppPartsIcons/calendar-circle-plus-svgrepo-com.svg": "9ca57779ca1621c109215acefd8a366d",
"assets/AppPartsIcons/calendar-days-svgrepo-com.svg": "0b9171a3b41a823455e44f26b162d5ac",
"assets/AppPartsIcons/calendar-exclamation-alt-svgrepo-com.svg": "2e45587e5440e502cbf3d621c111e490",
"assets/AppPartsIcons/calendar-heart-svgrepo-com.svg": "18a5c5125f14188eba645b0aec48325c",
"assets/AppPartsIcons/calendar-lines-pen-svgrepo-com.svg": "d1e288a60c44038504b44c53e106e45a",
"assets/AppPartsIcons/calendar-lines-svgrepo-com.svg": "51427d00981948363b2fa71525bee0e7",
"assets/AppPartsIcons/calendar-minus-svgrepo-com.svg": "3a952cdb2df01431f89f5501ee17651b",
"assets/AppPartsIcons/calendar-plus-alt-svgrepo-com.svg": "454d3be1e4774d7bbda9ad45a3e1b052",
"assets/AppPartsIcons/calendar-plus-svgrepo-com.svg": "874b324b6fbae7ffa4effa97c26307bb",
"assets/AppPartsIcons/calendar-svgrepo-com.svg": "3c225d4c77874afad4a86ea70f352fdb",
"assets/AppPartsIcons/calendar-week-svgrepo-com.svg": "05cb2a628bb226b1ef8b6986edb0686c",
"assets/AppPartsIcons/calendar-xmark-alt-svgrepo-com.svg": "b1ec1e88af4a339ef3f1b39e4e91f0b6",
"assets/AppPartsIcons/calendar-xmark-svgrepo-com.svg": "4306e3e88b64bd50adadd55a5b65aa2e",
"assets/AppPartsIcons/calendars-svgrepo-com.svg": "572789efeeed40f9dd28789e8eac5855",
"assets/AppPartsIcons/check-svgrepo-com.svg": "6136e566d0bb4c6ff755c1128418690a",
"assets/AppPartsIcons/circle-pause-svgrepo-com.svg": "7c06c5605a666f9c49985d09162920b0",
"assets/AppPartsIcons/circle-play-svgrepo-com.svg": "33f15c734f7ee32e18ad97c22b6354c7",
"assets/AppPartsIcons/circle-question-svgrepo-com.svg": "3f27e455e805950ff8948e01b65c489b",
"assets/AppPartsIcons/circle-stop-svgrepo-com.svg": "aebf1956eef66a3284cf8f486ce2790c",
"assets/AppPartsIcons/circle-user-svgrepo-com.svg": "7182aef33c92157317b657248a208048",
"assets/AppPartsIcons/circle-video-svgrepo-com.svg": "e134fac1b671977cd406190fe4e6ea69",
"assets/AppPartsIcons/circle-xmark-svgrepo-com.svg": "e3f87d9e42799db4082eba05dd6888c2",
"assets/AppPartsIcons/clock-eight-svgrepo-com.svg": "a16e2ac1c3399a66298c86774744909b",
"assets/AppPartsIcons/clock-plus-svgrepo-com.svg": "42c8bd7d0bcb539e5a47260dd51a21ec",
"assets/AppPartsIcons/clock-snooze-svgrepo-com.svg": "877ba6bb9a2d3a54e14f1fc0e6dae641",
"assets/AppPartsIcons/clock-xmark-svgrepo-com.svg": "9a776391409b95b76ebbf4ec22e2cc79",
"assets/AppPartsIcons/cloud-arrow-down-alt-svgrepo-com.svg": "4eb2e1a55fea19f310ae4886c2336089",
"assets/AppPartsIcons/cloud-up-arrow-svgrepo-com.svg": "ba7f71ebe0c07eb8acd297dd56f67fbc",
"assets/AppPartsIcons/compress-alt-svgrepo-com.svg": "b896509b2ee20b6ff9815fbf945be0e6",
"assets/AppPartsIcons/credit-card-minus-svgrepo-com.svg": "c06ba2d9aa3b4b9f1adf399235eb9074",
"assets/AppPartsIcons/credit-card-plus-svgrepo-com.svg": "c9992dfb04117dbb7bb3c8a931c2f370",
"assets/AppPartsIcons/delete-left-svgrepo-com.svg": "dbd6c2bc8e3a67d4a7dd8a009c26549b",
"assets/AppPartsIcons/document-layout-right-svgrepo-com.svg": "18f32fb9b2adf1b8a566f1b3ede78221",
"assets/AppPartsIcons/file-alt-svgrepo-com.svg": "32632010b8204e07847a16541a24cc2e",
"assets/AppPartsIcons/file-search-alt-svgrepo-com.svg": "770cad1071d2d89762693d2e6fed2e99",
"assets/AppPartsIcons/film-slash-svgrepo-com.svg": "b7d74102bdb6ae8c3e46d744e31b0a63",
"assets/AppPartsIcons/grid-plus-svgrepo-com.svg": "d413844693f5efb87d5b77b431a736d3",
"assets/AppPartsIcons/grid-search-svgrepo-com.svg": "e471cb5ecde5581c1b97b3f9e072da1e",
"assets/AppPartsIcons/grid-svgrepo-com.svg": "2d6415f49fd7caeedb2da9300755802c",
"assets/AppPartsIcons/halloween-calendar-alt-svgrepo-com%2520(1).svg": "61632b11d9a7d61275c97d5b0d15e1be",
"assets/AppPartsIcons/halloween-calendar-alt-svgrepo-com.svg": "61632b11d9a7d61275c97d5b0d15e1be",
"assets/AppPartsIcons/halloween-calendar-svgrepo-com.svg": "454a77c58b1aa515d2692a7dbb32b81b",
"assets/AppPartsIcons/headphones-alt-1-svgrepo-com.svg": "e1bd3ac62bcb6a30d829fb0fa62b5dc1",
"assets/AppPartsIcons/heart-crack-svgrepo-com.svg": "f6a8ccb7c14b72972a13f4d0537f3240",
"assets/AppPartsIcons/heart-svgrepo-com.svg": "cfb5ca052cf83869c48e830a8551bf86",
"assets/AppPartsIcons/house-chimney-floor-svgrepo-com.svg": "e46b756add406b4841314aa06ef090bb",
"assets/AppPartsIcons/image-minus-svgrepo-com.svg": "263c9530e3249ee81c236f9a411e9ccb",
"assets/AppPartsIcons/image-pen-svgrepo-com.svg": "17b077df0cd11e981cdd02b89a9afbda",
"assets/AppPartsIcons/image-plus-svgrepo-com.svg": "797996801453e2cab4ae0e32c1522438",
"assets/AppPartsIcons/image-square-check-svgrepo-com.svg": "cb301dc9089a0ed2a141f43a421bb5fa",
"assets/AppPartsIcons/image-square-svgrepo-com.svg": "aac7c4c6874a2bf3e10c43a07d8bab37",
"assets/AppPartsIcons/image-square-xmark-svgrepo-com.svg": "838e747b62c73ae1d6594ba96f0c858d",
"assets/AppPartsIcons/laptop-alt-1-svgrepo-com.svg": "e1387482878631315ed286180e0ad4bd",
"assets/AppPartsIcons/lightbulb-svgrepo-com.svg": "4b94ab0c634b72aee7feb2813f8da4eb",
"assets/AppPartsIcons/link-slash-svgrepo-com.svg": "7185907715b05b74c328bc5ef3804374",
"assets/AppPartsIcons/link-svgrepo-com.svg": "867e2d176a178be875dcb856a6e4a90a",
"assets/AppPartsIcons/list-music-svgrepo-com.svg": "e34c4dd2eee60c4b84fb4068a3407b35",
"assets/AppPartsIcons/list-ul-svgrepo-com.svg": "26c54615736ea0fae2480eba5fbb4f27",
"assets/AppPartsIcons/loop-svgrepo-com.svg": "0cbd55023cefc741d9945be3be2e10a6",
"assets/AppPartsIcons/map-pin-alt-svgrepo-com.svg": "e3fb26cc2c97b734f42df56867304793",
"assets/AppPartsIcons/memo-pencil-svgrepo-com.svg": "680fcd7604ccc546664b4da721744cf7",
"assets/AppPartsIcons/menu-alt-svgrepo-com.svg": "35e4c338d65b1e15a25f6db6ce62685e",
"assets/AppPartsIcons/menu-svgrepo-com.svg": "6ecfc7069439782da0bf65f9645e68c6",
"assets/AppPartsIcons/message-square-notification-svgrepo-com.svg": "24086f1e3cf83d7d866d23b2f4f5f1da",
"assets/AppPartsIcons/message-square-svgrepo-com.svg": "07411d3cc72faf9b4f682dd02b14abdc",
"assets/AppPartsIcons/moon-stars-svgrepo-com.svg": "e6bfbcf7c2704568385d24bbba665037",
"assets/AppPartsIcons/mug-sauser-svgrepo-com.svg": "c5ff5881d8ff9add4445b20bba7f0965",
"assets/AppPartsIcons/music-note-slash-svgrepo-com.svg": "1e51e124c0817a998705cc05a48b6b8c",
"assets/AppPartsIcons/music-note-svgrepo-com.svg": "6f0aab6e201e0e0632bf894ef6b9052d",
"assets/AppPartsIcons/paintbrush-alt-svgrepo-com.svg": "ee97f470d39d68237de6b21aefca9a9c",
"assets/AppPartsIcons/pause-svgrepo-com.svg": "e06f7f288dc9b215b5b0021901a86d06",
"assets/AppPartsIcons/play-svgrepo-com.svg": "445fcbec08bb4f7d29f8397eda6c3ff7",
"assets/AppPartsIcons/plus-large-svgrepo-com.svg": "b2e551e8b4cd83c313b80b5238523a10",
"assets/AppPartsIcons/refresh-ccw-alt-1-svgrepo-com.svg": "76daac3317e56465a241110043135f67",
"assets/AppPartsIcons/refresh-ccw-clock-svgrepo-com.svg": "9866cbedf2a728403f5617d467a9d623",
"assets/AppPartsIcons/rotate-ccw-svgrepo-com.svg": "ae2c10edc2096acd8f653ba5e51a3d54",
"assets/AppPartsIcons/screencast-svgrepo-com.svg": "69a03e99eea5604ee00bc0881b805798",
"assets/AppPartsIcons/search-alt-1-svgrepo-com.svg": "5482d92f2d140d85ad086d251800e248",
"assets/AppPartsIcons/search-minus-svgrepo-com.svg": "3c87accd8d101c2f8178f8a0d8fa761a",
"assets/AppPartsIcons/search-plus-svgrepo-com.svg": "b3da4eb3f87fdde3f0ee21e7f758b3c2",
"assets/AppPartsIcons/send-alt-2-svgrepo-com.svg": "b42a6cc236eee7d6668f8b99a160e899",
"assets/AppPartsIcons/send-alt-svgrepo-com.svg": "7f44389af8341a6190124501b3ea2016",
"assets/AppPartsIcons/send-svgrepo-com.svg": "429eafc0838bf5c3d77bb30ce58cbf9a",
"assets/AppPartsIcons/shuffle-svgrepo-com.svg": "a96e12c424e8200d5e6862b02a9ff980",
"assets/AppPartsIcons/signal-steam-svgrepo-com.svg": "9f40a4d3c5d5a97b5b0f23b358f283f4",
"assets/AppPartsIcons/sitemap-svgrepo-com.svg": "84dd02c0d1b9424cdeeab45ba8d08c87",
"assets/AppPartsIcons/snooze-svgrepo-com.svg": "1fc38222622a700ec00cd7b2090c5e87",
"assets/AppPartsIcons/sort-amount-down-svgrepo-com.svg": "a8ac5052a7f4a17fca623fb7f1fd0ec3",
"assets/AppPartsIcons/sort-down-svgrepo-com.svg": "6556e481a77d1114fee81afb55f54fe5",
"assets/AppPartsIcons/star-sharp-svgrepo-com.svg": "0da02a95f6fdd9f85b27774276b3bdb6",
"assets/AppPartsIcons/sun-svgrepo-com.svg": "e65ea44ed4b5a366d51e041a1f05210a",
"assets/AppPartsIcons/table-alt-svgrepo-com.svg": "a7238b64ecd812aae8f010992d0492c7",
"assets/AppPartsIcons/tablet-alt-svgrepo-com.svg": "e88e7a24e91ee2fa8b302b36f9dca8d7",
"assets/AppPartsIcons/trash-svgrepo-com.svg": "9afd967040a2e245f685944c9c342c2d",
"assets/AppPartsIcons/triangle-instrument-svgrepo-com.svg": "dddc20396c4b5d4a7cd936e6f26f221c",
"assets/AppPartsIcons/tv-alt-svgrepo-com.svg": "a0df9d926cdd467d5d990ef866254cd8",
"assets/AppPartsIcons/tv-svgrepo-com.svg": "6c3f9eaa6b3a094ef57e1c208a8fe8a5",
"assets/AppPartsIcons/usb-flash-drive-svgrepo-com.svg": "4a0599ac7b099d5a1792a78f6d655b73",
"assets/AppPartsIcons/user-block-alt-1-svgrepo-com.svg": "80f9753bbb5713ad36d33bfa0ee6c067",
"assets/AppPartsIcons/user-heart-alt-1-svgrepo-com.svg": "0809b17f2dd37b56aff5a069aaadf56f",
"assets/AppPartsIcons/user-lock-alt-1-svgrepo-com.svg": "e235b51370d83e02f3bb248a0b5094a8",
"assets/AppPartsIcons/user-minus-svgrepo-com.svg": "bdd03dca705b604c82da39a3d29ceccf",
"assets/AppPartsIcons/user-plus-alt-1-svgrepo-com.svg": "d858cf52e31b0f9a3066fa3c5192ddca",
"assets/AppPartsIcons/user-refresh-alt-1-svgrepo-com.svg": "6e3cc424570a47108d9baa1f61f434c6",
"assets/AppPartsIcons/user-search-alt-1-svgrepo-com.svg": "28b61315b234bfd67e022bf60d089d44",
"assets/AppPartsIcons/video-plus-svgrepo-com.svg": "ab4b4ea4d58daa716347a5349f4f105d",
"assets/AppPartsIcons/volume-max-svgrepo-com.svg": "cbf8f8892b75c6177ac4230294cfac0e",
"assets/AppPartsIcons/volume-min-svgrepo-com.svg": "dcef3f618c59f265bd4204fccae289f0",
"assets/AppPartsIcons/volume-minus-svgrepo-com.svg": "e46d3d0f88f9325ae113fed76dbc96f0",
"assets/AppPartsIcons/volume-off-svgrepo-com.svg": "d476764946d752f3900d8bbf5068a7e1",
"assets/AppPartsIcons/volume-plus-svgrepo-com.svg": "0dce2846f62f04178b6c01dfa47590bc",
"assets/AppPartsIcons/volume-xmark-svgrepo-com.svg": "550fbe79d7ebaf03c086a4143d63bbf8",
"assets/AssetManifest.bin": "3189d72ada007027cfacdaf3231fba2d",
"assets/AssetManifest.bin.json": "cef68a01b9b81f36a32374efefe53c55",
"assets/assets/app_icon.png": "5eb65a63f167954215e747d66f680ff5",
"assets/Font/DotGothic16-Regular.ttf": "6c52c4b44f10786745afda7bbfff0d85",
"assets/FontManifest.json": "2c220d7455cb479691c65f7dd584b016",
"assets/fonts/MaterialIcons-Regular.otf": "06ffc213b8aeee149eac718dda811bd3",
"assets/NOTICES": "b7be34ff943674f6feb82f1d079669f5",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "33b7d9392238c04c131b6ce224e13711",
"assets/shaders/ink_sparkle.frag": "ecc85a2e95f5e9f53123dcaf8cb9b6ce",
"assets/shaders/stretch_effect.frag": "40d68efbbf360632f614c731219e95f0",
"canvaskit/canvaskit.js": "8331fe38e66b3a898c4f37648aaf7ee2",
"canvaskit/canvaskit.js.symbols": "a3c9f77715b642d0437d9c275caba91e",
"canvaskit/canvaskit.wasm": "9b6a7830bf26959b200594729d73538e",
"canvaskit/chromium/canvaskit.js": "a80c765aaa8af8645c9fb1aae53f9abf",
"canvaskit/chromium/canvaskit.js.symbols": "e2d09f0e434bc118bf67dae526737d07",
"canvaskit/chromium/canvaskit.wasm": "a726e3f75a84fcdf495a15817c63a35d",
"canvaskit/skwasm.js": "8060d46e9a4901ca9991edd3a26be4f0",
"canvaskit/skwasm.js.symbols": "3a4aadf4e8141f284bd524976b1d6bdc",
"canvaskit/skwasm.wasm": "7e5f3afdd3b0747a1fd4517cea239898",
"canvaskit/skwasm_heavy.js": "740d43a6b8240ef9e23eed8c48840da4",
"canvaskit/skwasm_heavy.js.symbols": "0755b4fb399918388d71b59ad390b055",
"canvaskit/skwasm_heavy.wasm": "b0be7910760d205ea4e011458df6ee01",
"favicon.png": "65f70b5eb06146a0b1dfe6438d6470b2",
"flutter.js": "24bc71911b75b5f8135c949e27a2984e",
"flutter_bootstrap.js": "cf0ec5ea3f30cc6da5272ee7a0edbc7d",
"icons/Icon-192.png": "dd65bef927f0b04fc877b6ac1991ad49",
"icons/Icon-512.png": "353268d8d81ba1606af63745b8a7f6ee",
"icons/Icon-maskable-192.png": "dd65bef927f0b04fc877b6ac1991ad49",
"icons/Icon-maskable-512.png": "353268d8d81ba1606af63745b8a7f6ee",
"index.html": "1ed55bffd02b91b94738643da2a13d8a",
"/": "1ed55bffd02b91b94738643da2a13d8a",
"main.dart.js": "87d3cc86d30bb2dbbcb0cd1916ff1e5d",
"manifest.json": "09b1151de0ad26337db8061f29065b94",
"version.json": "5d7b19ca0c61286c7a78b7cd1a8bce6e"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"flutter_bootstrap.js",
"assets/AssetManifest.bin.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
