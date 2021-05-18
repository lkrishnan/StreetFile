<template>
	<v-container class="grey lighten-4">
		<v-row justify="center">
			<v-col sm="8" md="6" lg="5">
				<v-card class="pa-5">
					<v-autocomplete
						v-model="st_selection"
						label="Enter a Street Name"
						:loading="loading"
						:items="items"
						:search-input.sync="searchInput"
						clearable
						Event
						@click:clear="clearResults">
						<template slot="selection" slot-scope="data">
							<v-chip class="mr-2" color="primary" outlined label>{{ data.item.value.tag }}</v-chip>{{ data.item.text }}
						</template>
						<template slot="item" slot-scope="data">
							<v-chip class="mr-2" color="primary" outlined label>{{ data.item.value.tag }}</v-chip>{{ data.item.text }}
						</template>
					</v-autocomplete>
					<v-row justify="center" v-if="blocks.length > 1" class="pa-2">    
						<v-col md="10" lg="8">     
							<v-select
								v-model="block_selection" 
								:items="blocks" 
								label="Select Block Number"            
								item-value="countystcode"
								@change="setStcode"> 
									<template slot="selection" slot-scope="data">
										{{ ( data.item.lowerblock && data.item.upperblock ? data.item.lowerblock + ' - ' + data.item.upperblock : 'None' ) }}
									</template>
									<template slot="item" slot-scope="data">
										{{ ( data.item.lowerblock && data.item.upperblock ? data.item.lowerblock + ' - ' + data.item.upperblock : 'None' ) }}
									</template>
							</v-select> 
						</v-col>
					</v-row> 
				</v-card>
			</v-col>
		</v-row> 
	</v-container>
</template>

<script>
  	import axios from "axios";
  	import JSONToURL from "../js/jsontourl";

  	export default {
      	name: "search",

      	data: ( ) => ( {
			items: [ ],
			searchInput: null,
			st_selection: null,
			block_selection: null,
			loading: false,
			axios_inst: axios.create( { 
				headers: { 
					"Cache-Control": "max-age=0, no-cache, no-store",
					"Pragma": "no-cache"  
				}
			} ),
			cancel_source: null

      	} ),
      
      	computed: {
			ws( ){
				return this.$store.state.ws;
			},
			admkey( ){
				return this.$store.state.admkey;
			},
			stcode( ){
				return this.$store.state.stcode;
			},
			blocks( ){
				return this.$store.state.blocks;
			}

      	},
      
      	watch: {
        	searchInput( val ){
				val && val !== this.st_selection && this.getItems( val )

        	},
        	st_selection( new_selection, old_selection ){
				const _this = this;
					
				if( _this.st_selection ){
					const url = _this.ws.adm + "v1/query/streetfileall",
						admkey = _this.st_selection.admkey,
						aliaslegalflag = _this.st_selection.aliaslegalflag,
						params = {
							columns: "countystcode, lowerblock, upperblock",
							filter: "admkey = '" + admkey + "' and aliaslegalflag = '" + aliaslegalflag + "'"
						};

					_this.$store.commit( "admkey", admkey );
          
					_this.axios_inst.get( `${ url }?${ JSONToURL( params ) }` )
						.then( function( response ){
							return response.data;
						} )
						.then( data => {
							if( data.length > 0 ){
								_this.$store.commit( "stcode", data[ 0 ].countystcode );
								_this.$store.commit( "blocks", data );
								_this.block_selection = data[ 0 ];
							}
						} )
						.catch( ex => {
							console.log( "parsing failed", ex );
						} );	
					
				}
				
			}
      
      	},
      
      	methods: {
        	getItems( v ){
				const _this = this;

				if( v.length < 3 ){
					_this.items = [ ];
					_this.loading = false;
					return

				}

				const url = _this.ws.adm + "v1/query/streetfileall",
					params = {
							columns: "admkey, aliaslegalflag",
							filter: "admkey like '" + v.toUpperCase( ) + "%'",
							group: "admkey, aliaslegalflag"
						}

				_this.loading = true;
				_this.cancelSearch( );
      			_this.cancel_source = axios.CancelToken.source( )

				_this.axios_inst.get( `${ url }?${ JSONToURL( params ) }`, { cancelToken: _this.cancel_source.token } )
					.then( function( response ){
						_this.cancel_source = null
						return response.data

					} )
					.then( legal_alias_data => { 
						this.items = [ ];

						legal_alias_data.forEach( element => {
							_this.items.push( { 
								"text": element.admkey, 
								"value": { 
									"tag": ( element.aliaslegalflag ? "Legal" : "Alias" ), 
									"admkey": element.admkey, 
									"aliaslegalflag": element.aliaslegalflag 
								}

							} );

						} )

						_this.loading = false;
					
					} )
					.catch( thrown => {
						if( axios.isCancel( thrown ) ){
							//console.log('Request canceled', thrown.message);
						
						}else{
							console.log( "parsing failed", thrown );
						
						}
					
					} )
			
			},
			cancelSearch( ){
				const _this = this

      			if( _this.cancel_source ){
        			_this.cancel_source.cancel( )

      			}
    		},
			clearResults( ){
          		this.items = [ ];
        
        	},
        	setStcode( ){
          		this.$store.commit( "stcode", this.block_selection );
        
        	}
      
      	}
  
  	}
</script>