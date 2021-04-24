/**
 * Service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 */

workbox.core.setCacheNameDetails( { prefix: "stfile" } );

//Change this value every time before you build
const LATEST_VERSION = "v1.5.3"

self.addEventListener('install', event => {
	console.log( "Service Worker Installing…" );
	//self.skipWaiting( );
	
  });

//The activate handler takes care of cleaning up old caches
self.addEventListener( "activate", ( event ) => {
  
	/*console.log( `%c ${LATEST_VERSION} `, "background: #ddd; color: #0000ff" )
  	
	if( caches ){
    	caches.keys( ).then( ( arr ) => {
      		arr.forEach( ( key ) => {
        		if( key.indexOf( "stfile-precache" ) < -1 ){
          			caches.delete( key ).then( ( ) => console.log( `%c Cleared ${key}`, "background: #333; color: #ff0000" ) )
        		
				}else{
          			caches.open( key ).then( ( cache ) => {
            			cache.match( 'version' ).then( ( res ) => {
              				if( !res ){
                				cache.put( 'version', new Response( LATEST_VERSION, { status: 200, statusText: LATEST_VERSION } ) )
              				
							}else if( res.statusText !== LATEST_VERSION ){
                				caches.delete( key ).then( ( ) => console.log( `%c Cleared Cache ${LATEST_VERSION}`, "background: #333; color: #ff0000" ) )
              				
							}else{
								console.log( `%c Great you have the latest version ${LATEST_VERSION}`, "background: #333; color: #00ff00" )
							
							} 
            			
						} )
          			
					} )
        		
				}
      
			} )
    	
		} )
  	}*/
} )

// The fetch handler serves responses for same-origin resources from a cache. 
// If no response is found, it populates the runtime cache with the response from the network before returning it to the page.
self.addEventListener( "fetch", event => {

} );
/*self.addEventListener( "fetch", event => {
	// Let the browser do its default thing
  	// for non-GET requests.
  	if (event.request.method != 'GET') return;

  	// Prevent the default, and handle the request ourselves.
  	event.respondWith(async function() {
    	// Try to get the response from a cache.
		if( caches ){
			caches.keys( ).then( ( arr ) => {
				arr.forEach( ( key ) => {

				} )
			} )


    	const cache = await caches.open('dynamic-v1');
    	const cachedResponse = await cache.match(event.request);

    if (cachedResponse) {
      // If we found a match in the cache, return it, but also
      // update the entry in the cache in the background.
      event.waitUntil(cache.add(event.request));
      return cachedResponse;
    }

    // If we didn't find a match in the cache, use the network.
    return fetch(event.request);
  }());

} )*/

self.addEventListener( "message", ( event ) => {
	if( event.data && event.data.hasOwnProperty( "type" ) ){
		if( event.data.type === "SKIP_WAITING" ){
			self.skipWaiting( );
		}
	}

} );

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
//workbox.core.skipWaiting( )
workbox.core.clientsClaim( )

// The precaching code provided by Workbox.
self.__precacheManifest = [ ].concat( self.__precacheManifest || [ ] )
//workbox.precaching.suppressWarnings( ) // Only used with Vue CLI 3 and Workbox v3.
workbox.precaching.precacheAndRoute( self.__precacheManifest, { } )