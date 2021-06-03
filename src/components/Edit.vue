<template>
  	<v-container>
    	<v-form v-model="valid" ref="form" v-if="new_stinfo">
			<v-row>
				<v-col cols="12">
					<v-card class="my-5 pa-5">
						<v-card-title>{{ title }}</v-card-title>
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
  	import FormatADMKey from "../js/formatADMKey"
	import GetInfoByOID from "../js/getInfoByOID"
	import GetInfoByStCode from "../js/getInfoByStCode"
	import ObjDiffs from "../js/objdiffs"
	import ObjToUppercase from "../js/objtouppercase"
  	
  	export default {
    	name: "edit",

		beforeRouteEnter( to, from, next ){
			next( async vm => {
    			switch( to.name ){
					case "Edit_Legal": case "Edit_Alias":
						if( !vm.new_stinfo ){ //fill new_stinfo with data to display on the edit form 
							vm.new_stinfo = await GetInfoByOID( to.params.oid )
							vm.stcode = vm.new_stinfo[ 0 ].countystcode

							if( vm.stinfo.legal.length === 0 && vm.stinfo.alias.length === 0 ){ //fill stinfo with data for doing edit comparison
								vm.stinfo = await GetInfoByStCode( vm.stcode )

							}

						}else{
							vm.stcode = vm.new_stinfo[ 0 ].countystcode
							
						}
						
						break

					case "Add_Legal": case "Add_Alias":
						vm.new_stinfo = [ {
								aliaslegalflag: ( to.name === "Add_Legal" ? "L" : "A" ), 
								staccess: "PUB", 
								addrnumbers: "B",
								parcelsattached: "N", 
								stcontinuous: "Y",
								roadtype: "Road",
								reason: null
							} ]

						if( to.name === "Add_Alias" ){
							vm.new_stinfo[ 0 ].countystcode = to.params.stcode 
						}
						
						break
				
				}

  			} )
		
		},
    	
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
			stcode: null

    	} ),

    	computed: {
			new_stinfo: {
      			set( new_stinfo ){
					this.$store.commit( "new_stinfo", new_stinfo )
									
				},
      			get( ){
					return this.$store.state.new_stinfo
      			
				}
							
			},
			stinfo: {
      			set( stinfo ){
					this.$store.commit( "stinfo", stinfo )
									
				},
      			get( ){
					return this.$store.state.stinfo
      			
				}
							
			},
			route_name( ){
				return this.$route.name; 
			},
			title( ){
				return this.$route.meta.title
			}

    	},

    	methods: {
      		save( ){
        		const _this = this;

				if( _this.$refs.form.validate( ) ){
					switch( _this.route_name ){
						case "Edit_Legal": case "Edit_Alias":
							_this.edit( )
						break

						case "Add_Legal": case "Add_Alias":
							_this.add( )
						break

					}
				
				}

      		},

			edit( ){
        		const _this = this,
					change_row = ObjDiffs( 
						( _this.route_name == "Edit_Alias" ? _this.stinfo.alias.find( x => x.objectid === _this.new_stinfo[ 0 ].objectid ) : _this.stinfo.legal[ 0 ] ), //old value
						_this.new_stinfo[ 0 ] ); //new value

        		if( Object.keys( change_row ).length > 0 ){
          			_this.nochanges = false;

					let update_row = { },
						add_admkey = Object.keys( change_row ).some( key => { 
							return [ "preaddrnum", "streetname", "streettype", "addrnumsuf", "municipality", "staccess", "roadtype" ].includes( key ) 
						} );

					update_row = { ...change_row };

					if( add_admkey ){
						update_row.admkey = FormatADMKey( _this.new_stinfo[ 0 ].preaddrnum, _this.new_stinfo[ 0 ].streetname, _this.new_stinfo[ 0 ].streettype,
							_this.new_stinfo[ 0 ].addrnumsuf, _this.new_stinfo[ 0 ].municipality, _this.new_stinfo[ 0 ].staccess, _this.new_stinfo[ 0 ].roadtype );  
					
					}

					if( Object.keys( update_row ).length > 0 ){
						//update the specific row
						this.$store.dispatch( "update", { 
							filter: _this.new_stinfo[ 0 ].objectid, 
							data: JSON.stringify( ObjToUppercase( update_row ) ) 
						} );
					
					}

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
				const _this = this;
        		
				_this.$router.go( -1 )
			
			},

      		
		}

  	}
</script>