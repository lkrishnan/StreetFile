<template>
    <v-card id="map" class="my-5" height="600">
    </v-card>
</template>

<script>
    import Maplibregl from "maplibre-gl"
    import MapStyle from "../mapstyle/streetfile.json"
    import JSONToURL from "../js/jsontourl"
    import axios from "axios"

    export default {
        name: "themap",
        
        mounted: function( ){
            this.initMap( )
        
        },
        
        data: ( ) => ( {
            map: null,
            seen: false,
            axios_inst: axios.create( { 
        		headers: { 
					"Cache-Control": "max-age=0, no-cache, no-store",
					"Pragma": "no-cache"  
				
                }
      		
            } )
              
        } ),
        
        computed: {
            ws( ){
                return this.$store.state.ws
            
            },
			stcode( ){
				return this.$route.params.stcode 
			
            }
            
        },
        watch: {
            stcode: "selectRoad"

        },
        methods: {
            isIEorEDGE( ){
                return( navigator.appName == 'Netscape' && ( navigator.appVersion.indexOf( 'Edge' ) > -1 || navigator.appVersion.indexOf( 'Trident' ) > -1 ) )
            
            },

            initMap: function( ){
                const _this = this,
                    mapOptions = {
                        container: 'map',
                        style: MapStyle,
                        attributionControl: false,
                        center: [ -80.84, 35.26 ],
                        minZoom: 9,
                        pitch: 0,
                        preserveDrawingBuffer: navigator.userAgent.toLowerCase().indexOf( "firefox" ) > -1
                    
                    }

                _this.map = new Maplibregl.Map( mapOptions )
                
                let map = _this.map

                // hack for IE/Edge not loading map every other load
                if( _this.isIEorEDGE( ) ){
                    console.log( 'Kicking map for Microsoft bugs...' );
                    //map.setStyle( MapStyle );
                
                }

                if( _this.stcode ){
                    _this.selectRoad( )
                
                }

            },
            
            addSource( id, info ){
                const _this = this,
                    map = _this.map;   

                if( !map.getSource( id ) ){
                    map.addSource( id, info )

                }else{
                    _this.updateSource( id, info )        
                
                }

            },
            
            clearSource( id ){
                const map = this.map

                if( map.getSource( id ) ){
                    map.removeSource( id )        
                
                }

            },
            updateSource( id, info ){
                const _this = this,
                    map = _this.map;

                if( info.type === "image" ){
                    map.getSource( id ).updateImage( { url: source.info.url, coordinates: source.info.coordinates } )

                }else{
                    map.getSource( id ).setData( info.data )

                }

            },
            
            clearLayer: function( lyrs ){
                const _this = this,
                    map = _this.map;

                lyrs.forEach( lyr => {
                    if( map.getLayer( lyr ) ){
                        map.removeLayer( lyr )
                    
                    }    
                
                } )

            },

            addLayers( lyrs ){
                const _this = this,
                    map = _this.map;

                lyrs.forEach( lyr => {
                    if( !map.getLayer( lyr.id ) ){
                        switch( lyr.id ){
                            case "sel_road_lyr":
                                map.addLayer( {
                                    id: lyr.id,
                                    type: "line",
                                    source: lyr.source_id,
                                    layout: {
                                        "line-join": "round",
                                        "line-cap": "round"
                                    },
                                    paint: {
                                        "line-color": "#10F765",
                                        "line-width": 2
                                    }

                                } )

                                break
                            case "sel_addr_lyr":
                                map.addLayer( {
                                    id: lyr.id,
                                    type: "circle",
                                    source: lyr.source_id,
                                    paint: {
                                        "circle-color": "#10F765",
                                        "circle-radius": 6
                                    }
                                } )

                                break

                        }

                        
                    }   

                } )

            },

            getBounds( coordinates ){
                const _this = this,
                    map = _this.map;

                return coordinates.reduce( ( bounds, coord ) => { return bounds.extend( coord ); }, new Maplibregl.LngLatBounds( coordinates[ 0 ], coordinates[ 1 ] ) )
                
            },
            
            selectRoad( ){
                const _this = this,
                    url = _this.ws.gis + "v1/geojson/",
                    streets_params = { 
                        geom_column: "shape",
                        columns: "lstreetcode as lstreetcod, rstreetcode as rstreetcod",
                        filter: "lstreetcode = " + _this.stcode + " or rstreetcode = " + _this.stcode 
                        },
                    addr_params = { 
                        geom_column: "shape",
                        columns: "num_addr",
                        filter: "county_street_code = " + _this.stcode 
                        };    

                let map = _this.map

                axios.all( [ 
					_this.axios_inst.get( `${ url + "streets_ln" }?${ JSONToURL( streets_params ) }` )
						.then( response => {
                            return response.data
						
						} ),
					_this.axios_inst.get( `${ url + "masteraddress_pt" }?${ JSONToURL( addr_params ) }` )
						.then( response => {
							return response.data

						} )

				] )
				.then( axios.spread( ( streets_geojson, addr_geojson ) => {
					let coord_array = [ ],
                        add_lyrs = [ ],
                        remove_lyrs = [ ];

                    const _this = this,
                        map = _this.map,
                        createLyr = ( geojson, source_id, lyr_id ) => {
                            if( geojson ){
                                _this.addSource( source_id, { type: "geojson", data: geojson, generateId: true } )
                                add_lyrs.push( { id: lyr_id, source_id: source_id } )

                                geojson.features.forEach( feature => { 
                                    coord_array.push( ...feature.geometry.coordinates )
                    
                                } );
                    
                            }else{
                                remove_lyrs.push( lyr_id )

                            }      

                        };

                    //parse addr geojson and create a layer
                    createLyr( streets_geojson, "sel_road", "sel_road_lyr"  )
                    
                    //parse addr geojson and create a layer
                    createLyr( addr_geojson, "sel_addr", "sel_addr_lyr"  )
                    
                    //add the layers to the map
                    if( add_lyrs.length > 0 ){
                        _this.addLayers( add_lyrs )
                    
                    }

                    //remove layers from map
                    if( remove_lyrs.length > 0 ){
                        _this.clearLayer( remove_lyrs )
                       
                    }
                    
                    //zoom to the extent of the added layers
                    if( coord_array.length > 0 ){
                        map.fitBounds( _this.getBounds( coord_array ), { padding: 50 }, { duration: 2000 } )

                    }else{
                        map.setCenter( [ -80.84, 35.26 ] )
                        map.zoomTo( 9, { duration: 2000 } )
                    
                    }
                                
        		} ) )
        		.catch( ex => {
          			console.log( "parsing failed", ex )

        		} )  

            }
            
        }

    }
</script>