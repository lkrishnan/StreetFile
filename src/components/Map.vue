<template>
    <v-card id="map" class="my-5" height="600">
    </v-card>
</template>

<script>
    import Mapboxgl from "mapbox-gl";
    import MapStyle from "../mapstyle/streetfile.json";
    import JSONToURL from "../js/jsontourl";
    import axios from "axios";

    export default {
        name: "themap",
        mounted: function () {
            this.initMap( );
        },
        data:  ( ) => ( {
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
                return this.$store.state.ws;
            },
            stcode( ){
                return this.$store.state.stcode;
            }
            
        },
        watch: {
            stcode: "selectRoad"
        },
        methods: {
            isIEorEDGE( ){
                return( navigator.appName == 'Netscape' && ( navigator.appVersion.indexOf( 'Edge' ) > -1 || navigator.appVersion.indexOf( 'Trident' ) > -1 ) );
            },
            initMap: function(){
                const _this = this,
                    mapOptions = {
                        container: 'map',
                        style: MapStyle,
                        attributionControl: false,
                        center: [-80.84, 35.26],
                        minZoom: 9,
                        pitch: 0,
                        preserveDrawingBuffer: navigator.userAgent.toLowerCase().indexOf("firefox") > -1
                    };

                //Mapboxgl.accessToken = "pk.eyJ1IjoibGtyaXNobmFuIiwiYSI6InRMWkIzVVkifQ.PUIkfgrzDKtkS6NyXD4rFA";
                _this.map = new Mapboxgl.Map( mapOptions );
                
                let map = _this.map;

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
                    map.addSource( id, info );
                }else{
                    _this.updateSource( id, info )        
                }

            },
            clearSource( id ){
                const map = this.map;

                if( map.getSource( id ) ){
                    map.removeSource( id );        
                }

            },
            updateSource( id, info ){
                const _this = this,
                    map = _this.map;

                if( info.type === "image" ){
                    map.getSource( id ).updateImage( { url: source.info.url, coordinates: source.info.coordinates } );
                }else{
                    map.getSource( id ).setData( info.data );
                }

            },
            clearLayer: function( lyrs ){
                const _this = this,
                    map = _this.map;

                lyrs.forEach( lyr => {
                    if( map.getLayer( lyr.id ) ){
                        map.removeLayer( lyr.id );
                    }    
                } );

            },
            addLayers( lyrs ){
                const _this = this,
                    map = _this.map;

                lyrs.forEach( lyr => {
                    if( !map.getLayer( lyr.id ) ){
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
                        } );
                    }    
                } );

            },
            getBounds( coordinates ){
                const _this = this,
                    map = _this.map;

                return coordinates.reduce( ( bounds, coord ) => { return bounds.extend( coord ); }, new Mapboxgl.LngLatBounds( coordinates[ 0 ], coordinates[ 1 ] ) );
                
            },
            /*selectRoad( ){
                const _this = this,
                    url = _this.ws.open + "v1/geojson/roads",
                    params = { 
                            geom_column: "the_geom",
                            columns: "lstreetcod, rstreetcod",
                            filter: "lstreetcod = " + _this.stcode + " or rstreetcod = " + _this.stcode 
                        };

                let map = _this.map;

                _this.axios_inst.get( `${ url }?${ JSONToURL( params ) }` )
                    .then( response => {
                        return response.data;

                    } )
                    .then( geojson => { 
                        const _this = this,
                            map = _this.map;

                        let coord_array = [ ];

                        _this.addSource( "sel_road", { type: "geojson", data: geojson, generateId: true } );
                        _this.addLayers( [ { id: "sel_road_lyr", source_id: "sel_road" } ] );
                        geojson.features.forEach( feature => { 
                            coord_array.push( ...feature.geometry.coordinates[ 0 ] );
                        } );
                        console.log( coord_array )
                        map.fitBounds( _this.getBounds( coord_array ), { padding: 50 } );
                                                
                    } )
                    .catch( ex => {
                        console.log( "parsing failed", ex );

                    } );
  
            }*/
            selectRoad( ){
                const _this = this,
                    url = _this.ws.gis + "v1/geojson/streets_ln",
                    params = { 
                            geom_column: "shape",
                            columns: "lstreetcode as lstreetcod, rstreetcode as rstreetcod",
                            filter: "lstreetcode = " + _this.stcode + " or rstreetcode = " + _this.stcode 
                        };

                let map = _this.map;

                _this.axios_inst.get( `${ url }?${ JSONToURL( params ) }` )
                    .then( response => {
                        return response.data;

                    } )
                    .then( geojson => { 
                        const _this = this,
                            map = _this.map;

                        let coord_array = [ ];

                        _this.addSource( "sel_road", { type: "geojson", data: geojson, generateId: true } );
                        _this.addLayers( [ { id: "sel_road_lyr", source_id: "sel_road" } ] );
                        
                        geojson.features.forEach( feature => { 
                            //coord_array.push( ...feature.geometry.coordinates[ 0 ] );
                            coord_array.push( ...feature.geometry.coordinates );
                        } );

                        map.fitBounds( _this.getBounds( coord_array ), { padding: 50 } );
                                                
                    } )
                    .catch( ex => {
                        console.log( "parsing failed", ex );

                    } );
  
            }
            
        }

    }
</script>