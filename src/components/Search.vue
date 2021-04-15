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
			} )

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
          		const _this = this,
            		url = _this.ws.adm + "v1/query/streetfileall";

          		_this.loading = true;

				if( v.length > 2 ){
					const legal_params = {
							columns: "admkey",
							filter: "admkey like '" + v.toUpperCase( ) + "%' and aliaslegalflag = 'L'",
							group: "admkey"
						},
						alias_params = {
							columns: "admkey",
							filter: "admkey like '" + v.toUpperCase( ) + "%' and aliaslegalflag = 'A'",
							group: "admkey"
						};

					_this.items.length = 0;
					
					axios.all( [ 
						_this.axios_inst.get( `${ url }?${ JSONToURL( legal_params ) }` )
							.then( function( response ){
								return response.data;
							} ),
                    	_this.axios_inst.get( `${ url }?${ JSONToURL( alias_params ) }` )
							.then( function( response ){
								return response.data;
							} )

					] )
					.then( axios.spread( ( legal_data, alias_data ) => {
						legal_data.forEach( element => {
							_this.items.push( { "text": element.admkey, "value": { "tag": "Legal", "admkey": element.admkey, "aliaslegalflag": "L" } } );
						} );
						alias_data.forEach( element => {
							_this.items.push( { "text": element.admkey, "value": { "tag": "Alias", "admkey": element.admkey, "aliaslegalflag": "A" } } );
						} );

						_this.loading = false;

					} ) )			
					.catch( ex => {
          				console.log( "parsing failed", ex );

        			} );

				}else{
					_this.items.length = 0;
				
				}

        	},
        	clearResults( ){
          		this.items.length = 0;
        
        	},
        	setStcode( ){
          		this.$store.commit( "stcode", this.block_selection );
        
        	}
      
      	}
  
  	}
</script>