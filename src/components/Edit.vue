<template>
  	<v-container v-if="( [ 'edit_legal', 'edit_alias', 'add_alias' ].includes( mode ) && stcode ) || ( [ 'add_legal' ].includes( mode ) )">
    	<v-form v-model="valid" ref="form">
      		<v-row>
        		<v-col cols="12">
          			<v-card class="my-5 pa-5">
            			<v-card-title v-if="[ 'edit_legal' ].includes( mode )">Edit Legal Street Name</v-card-title>
            			<v-card-title v-if="[ 'edit_alias' ].includes( mode )">Edit selected Alias Street Name</v-card-title>
            			<v-row>
              				<v-col cols="12">
                				<v-data-table 
									:headers="headers" 
									:items="new_stinfo" 
									:items-per-page="1" 
									hide-default-footer>
									<template v-slot:item.preaddrnum="{item}">
										<v-select
											v-model="item.preaddrnum"
											:items="prefixes"
											menu-props="auto"
											label="Select"
											hide-details
											single-line
											dense>
										</v-select>
									</template>
									<template v-slot:item.streetname="{item}">
										<v-text-field 
											v-model="item.streetname"
											single-line
											dense
											class="pt-4"
											:rules="stname_rules"
											required>
										</v-text-field>
									</template>
									<template v-slot:item.streettype="{item}">
										<v-select
											v-model="item.streettype"
											:items="sttypes"
											menu-props="auto"
											label="Select"
											single-line>
										</v-select>
									</template>
									<template v-slot:item.addrnumsuf="{item}">
										<v-select
											v-model="item.addrnumsuf"
											:items="suffixes"
											menu-props="auto"
											label="Select"
											single-line>
										</v-select>
									</template> 
									<template v-slot:item.municipality="{item}">
										<v-select
											v-model="item.municipality"
											:items="juris"
											menu-props="auto"
											label="Select"
											single-line
											:rules="municipality_rules"
											required>
										</v-select> 
									</template>  
									<template v-slot:item.citystcode="{item}">
										<v-text-field 
											v-model="item.citystcode"
											single-line
											dense
											class="pt-4"
											:rules="citystcode_rules"
											required>
										</v-text-field>
									</template>    
                				</v-data-table>
              				</v-col>
            			</v-row>
            			<v-row>
							<v-col cols="12">
								<v-data-table 
									:headers="headers2" 
									:items="new_stinfo" 
									:items-per-page="1"
									hide-default-footer>
									<template v-slot:item.lowerblock="{item}">
										<v-text-field 
											v-model="item.lowerblock"
											single-line
											dense
											class="pt-5">
										</v-text-field>
									</template>
									<template v-slot:item.upperblock="{item}">
										<v-text-field 
											v-model="item.upperblock"
											single-line
											dense
											class="pt-5">
										</v-text-field>
									</template>
									<template v-slot:item.addrnumbers="{item}">
										<v-select
											v-model="item.addrnumbers"
											:items="addrnumbers"
											menu-props="auto"
											label="Select"
											hide-details
											single-line
											dense>
											<template slot="selection" slot-scope="data">
												{{ data.item.text }}
											</template>
											<template slot="item" slot-scope="data">
												{{ data.item.text }}
											</template>
										</v-select>
									</template>
									<template v-slot:item.roadtype="{item}">
										<v-select
											v-model="item.roadtype"
											:items="roadtype"
											menu-props="auto"
											label="Select"
											hide-details
											single-line
											dense>
											<template slot="selection" slot-scope="data">
											{{ data.item.text }}
											</template>
											<template slot="item" slot-scope="data">
											{{ data.item.text }}
											</template>
										</v-select>
									</template>
									<template v-slot:item.staccess="{item}">
										<v-select
											v-model="item.staccess"
											:items="staccess"
											menu-props="auto"
											label="Select"
											hide-details
											single-line
											dense>
											<template slot="selection" slot-scope="data">
												{{ data.item.text }}
											</template>
											<template slot="item" slot-scope="data">
												{{ data.item.text }}
											</template>
										</v-select>
									</template>
									<template v-slot:item.stcontinuous="{item}">
										<v-select
											v-model="item.stcontinuous"
											:items="stcont"
											menu-props="auto"
											label="Select"
											hide-details
											single-line
											dense>
										</v-select>
									</template>
									<template v-slot:item.parcelsattached="{item}">
										<v-select
											v-model="item.parcelsattached"
											:items="parcelsattach"
											menu-props="auto"
											label="Select"
											hide-details
											single-line
											dense>
										</v-select>
									</template>
								</v-data-table> 
							</v-col>
            			</v-row>
            			<v-row>
              				<v-col cols="12">
								<v-data-table 
									:headers="headers3" 
									:items="new_stinfo" 
									:items-per-page="1"
									hide-default-footer>
									<template v-slot:item.directions="{item}">
										<v-textarea
											v-model="item.directions"
											dense>
										</v-textarea>
									</template>
									<template v-slot:item.comments="{item}">
										<v-textarea
											v-model="item.comments"
											dense>
										</v-textarea>
									</template>
									<template v-slot:item.reason="{item}">
										<v-select
											v-model="item.reason"
											:items="reason"
											menu-props="auto"
											label="Select"
											hide-details
											single-line
											dense>
										</v-select>
									</template>
								</v-data-table> 
              				</v-col>
            			</v-row>
          			</v-card>
        		</v-col>
      		</v-row>
      		<v-row>
        		<v-col cols="12">
          			<v-alert
						dense
						outlined
						type="error"
						v-if="nochanges">
						No edits were detected. Make some changes before saving or hit <strong>Cancel</strong> to exit edit mode.
					</v-alert>
					<v-btn 
						class="ma-2" 
						color="primary" 
						x-large
						@click="save( )">
						<v-icon left>mdi-content-save</v-icon>Save
					</v-btn>
					<v-btn 
						class="ma-2" 
						color="primary" 
						x-large
						@click="cancel( )">
						<v-icon left>mdi-content-save</v-icon>Cancel
					</v-btn>
        		</v-col>
      		</v-row>
    	</v-form>
  	</v-container>
</template>

<script>
  	import ObjDiffs from "../js/objdiffs";
	import ObjToUppercase from "../js/objtouppercase";
  	import FormatADMKey from "../js/formatADMKey";

  	export default {
    	name: "edit",
    	
		data: ( ) => ( {
      		headers: [
				{ text: "Dir", value: "preaddrnum", sortable: false },
				{ text: "Street Name", value: "streetname", sortable: false },
				{ text: "Street Type", value: "streettype", sortable: false },
				{ text: "Street Suffix", value: "addrnumsuf", sortable: false },
				{ text: "Jurisdiction", value: "municipality", sortable: false },
				{ text: "County Code", value: "countystcode", sortable: false },
				{ text: "City Code", value: "citystcode", sortable: false }
			],
			headers2: [
				{ text: "Lower Block", value: "lowerblock", sortable: false },
				{ text: "Upper Block", value: "upperblock", sortable: false },
				{ text: "Parity", value: "addrnumbers", sortable: false },
				{ text: "Type", value: "roadtype", sortable: false },
				{ text: "Access", value: "staccess", sortable: false },
				{ text: "Continuous", value: "stcontinuous", sortable: false },
				{ text: "Parcels Attached", value: "parcelsattached", sortable: false }
			],
			headers3: [
				{ text: "Directions to Street", value: "directions", sortable: false },
				{ text: "Comments", value: "comments", sortable: false },
				{ text: "Reason for Name Change", value: "reason", sortable: false }
			],
			addrnumbers: [
				{ value: "B", text: "ODD AND EVEN" },
				{ value: "E", text: "EVEN ONLY" },
				{ value: "O", text: "ODD ONLY" }
			],
			staccess: [
				{ value: "PUB", text: "PUBLIC" },
				{ value: "PVT", text: "PRIVATE" }
			],
			roadtype: [
				{ value: "Road", text: "ROAD" },
				{ value: "NamedDriveway", text: "DRIVEWAY" }
			],
			reason: [
				{ value: "AL", text: "ALIAS NAME ONLY" },
				{ value: "AX", text: "ANNEXATION" },
				{ value: "CC", text: "COUNTY COMMISSION" },
				{ value: "NC", text: "NAME CHANGE" },
				{ value: "PC", text: "PLANNING COMMISSION" },
				{ value: "SD", text: "SUBDIVISION" },
				{ value: null, text: "NA" }
			],
			prefixes: [ "N", "S", "W", "E","" ],
			sttypes: [ "AL", "AV", "BV", "BY", "CR", "CS", "CT", "CV", "DR", "EP", "EX", "FR", "HY", "LN", "LP", "PL", "PY", "RA", "RD", "RN", "RW", "ST", "TC", "TL", "TR", "WY", "" ],
			suffixes: [ "N", "NW", "SE", "W", "E", "NE", "S", "SW", "EXT", "NB", "SB", "EB", "WB", "CONN", "" ],
			juris: [ "MECK", "CHAR", "CORN", "DAVI", "HUNT", "MATT", "MINT", "PINE", "STAL", "OTHER" ],
			parcelsattach: [ "Y", "N" ],
			stcont: [ "Y", "N" ],
			valid: false,
			stname_rules: [
				v => !!v || 'Street Name is required'
			],
			municipality_rules: [
				v => !!v || 'Municipality is required'
			],
			citystcode_rules: [
				v => !!v || 'City Code is required'
			],
			nochanges: false,
			show_addalias: false

    	} ),

    	computed: {
			ws( ){
				return this.$store.state.ws;
			},
			stcode( ){
				return this.$store.state.stcode;
			},
			mode( ){
				return this.$store.state.mode;
			},
			stinfo( ){
				return this.$store.state.stinfo;
			},
			new_stinfo( ){
				return this.$store.state.new_stinfo;
			}

    	},

    	watch: {
      		mode: function( ){
        		this.chngHeader( );
      		}

    	},

    	methods: {
      		save( ){
        		const _this = this;

				if( _this.$refs.form.validate( ) ){
					switch( _this.mode ){
						case "edit_legal": case "edit_alias":
							_this.edit( );
						break;

						case "add_legal": case "add_alias":
							_this.add( );
						break;  

					}
				
				}
      		},
      		edit( ){
        		const _this = this,
					change_row = ObjDiffs( 
						( _this.mode == "edit_alias" ? _this.stinfo.alias.find( x => x.objectid === _this.new_stinfo[ 0 ].objectid ) : _this.stinfo.legal[ 0 ] ), //old value
						_this.new_stinfo[ 0 ] ); //new value

        		if( Object.keys( change_row ).length > 0 ){
          			_this.nochanges = false;

					let update_row = { };
						//insert_row = { };

          			/*if( change_row.hasOwnProperty( "municipality" ) ){
            			//change the existing legal street into an alias and add a new legal row into the table
            			update_row.aliaslegalflag = "A";
            
						const { objectid, ...temp } = _this.new_stinfo[ 0 ];
						insert_row = { ...temp };
						insert_row.aliaslegalflag = "L";
						insert_row.admkey = FormatADMKey( _this.new_stinfo[ 0 ].preaddrnum, _this.new_stinfo[ 0 ].streetname, _this.new_stinfo[ 0 ].streettype,
						_this.new_stinfo[ 0 ].addrnumsuf, _this.new_stinfo[ 0 ].municipality, _this.new_stinfo[ 0 ].staccess, _this.new_stinfo[ 0 ].roadtype );  

          			}else{*/
					//just update the attributes
					let add_admkey = Object.keys( change_row ).some( key => { 
						return [ "preaddrnum", "streetname", "streettype", "addrnumsuf", "municipality", "staccess", "roadtype" ].includes( key ) 
					} );

					update_row = { ...change_row };

					if( add_admkey ){
						update_row.admkey = FormatADMKey( _this.new_stinfo[ 0 ].preaddrnum, _this.new_stinfo[ 0 ].streetname, _this.new_stinfo[ 0 ].streettype,
							_this.new_stinfo[ 0 ].addrnumsuf, _this.new_stinfo[ 0 ].municipality, _this.new_stinfo[ 0 ].staccess, _this.new_stinfo[ 0 ].roadtype );  
					
					}
          
          			//}

					if( Object.keys( update_row ).length > 0 ){
						//update the specific row
						this.$store.dispatch( "update", { 
							filter: _this.new_stinfo[ 0 ].objectid, 
							data: JSON.stringify( ObjToUppercase( update_row ) ) 
						} );
					
					}

					/*if( Object.keys( insert_row ).length > 0 ){
						//insert the new legal row
						_this.$store.dispatch( "insert", { data: JSON.stringify( insert_row ) } );
					
					}*/

        		}else{
          			_this.nochanges = true;

        		}
      		},
      		add( ){
				const _this = this;

				if( _this.$refs.form.validate( ) ){
					let insert_row = { ..._this.new_stinfo[ 0 ] };

					insert_row.admkey = FormatADMKey( _this.new_stinfo[ 0 ].preaddrnum, _this.new_stinfo[ 0 ].streetname, _this.new_stinfo[ 0 ].streettype,
						_this.new_stinfo[ 0 ].addrnumsuf, _this.new_stinfo[ 0 ].municipality, _this.new_stinfo[ 0 ].staccess, _this.new_stinfo[ 0 ].roadtype ); 

					if( Object.keys( insert_row ).length > 0 ){
						//insert the new legal row
						_this.$store.dispatch( "insert", { data: JSON.stringify( ObjToUppercase( insert_row ) ) } );
					
					}

				}

      		},
      		cancel( ){
        		this.$store.commit( "mode", "info" );

      		},
      		chngHeader( ){
        		const _this = this,
          			idx = _this.headers.findIndex( ( { value } ) => value === 'countystcode' );

				switch( _this.mode ){
					case "add_legal":
						if( idx > -1 ){
							_this.headers.splice( idx, 1 );
						}
						
						break;

					default:
						if( idx == -1 ){
							_this.headers.splice( 5, 0, { text: "County Code", value: "countystcode", sortable: false } );
						}
						
						break;
				
				}

    		}

		}

  	}
</script>