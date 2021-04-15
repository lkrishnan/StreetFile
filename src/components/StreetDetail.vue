<template>
  	<v-container v-if="(mode === 'info') && stcode">
    	<v-row>
      		<v-col cols="12">
        		<v-card class="my-5 pa-5">
					<v-row>
						<v-col col="11">
							<v-card-title>Legal Street Name</v-card-title>
						</v-col>
						<v-col col="1" class="d-flex justify-end">
							<v-btn class="ma-2" color="primary" @click="takeAction( 'delete_legal', 0 )" v-if="( auth !== '' && stinfo.alias.length == 0 )" ><v-icon left>mdi-trash-can</v-icon>Delete</v-btn>
							<v-btn class="ma-2" color="primary" @click="takeAction( 'edit_legal', 0 )" v-if="( auth !== '' )" ><v-icon left>mdi-file-edit</v-icon>Edit</v-btn>
						</v-col>
					</v-row>
          			<v-row>
						<v-col cols="12">
							<v-data-table 
								:headers="headers" 
								:items="stinfo.legal" 
								:items-per-page="1" 
								hide-default-footer>
							</v-data-table>
						</v-col>
          			</v-row>
          			<v-row>
						<v-col cols="12">
							<v-data-table 
								:headers="headers2" 
								:items="stinfo.legal" 
								:items-per-page="1"
								hide-default-footer>
								<template v-slot:item.lowerblock="{item}">
								{{ item.lowerblock }} 
								</template>
								<template v-slot:item.upperblock="{item}">
								{{ item.upperblock }} 
								</template>
								<template v-slot:item.addrnumbers="{item}">
								{{ addrnumbers[ item.addrnumbers ] }}
								</template>
								<template v-slot:item.roadtype="{item}">
								{{ roadtype[ item.roadtype ] }}
								</template>
								<template v-slot:item.staccess="{item}">
								{{ staccess[ item.staccess ] }}
								</template>
							</v-data-table>
						</v-col>
					</v-row> 
          			<v-row>
						<v-col cols="12">
							<v-data-table 
								:headers="headers3" 
								:items="stinfo.legal" 
								:items-per-page="1"
								hide-default-footer>
								<template v-slot:item.reason="{item}">
								{{ reason[ item.reason ] }}
								</template>
							</v-data-table>
						</v-col>
          			</v-row>
          			<v-row>
						<v-col cols="12">
							<v-data-table 
								:headers="headers4" 
								:items="stinfo.legal" 
								:items-per-page="1"
								hide-default-footer>
								<template v-slot:item.created_date="{item}">
								{{ formatTheDate( item.created_date ) }}
								</template>
								<template v-slot:item.last_edited_date="{item}">
								{{ formatTheDate( item.last_edited_date ) }}
								</template>
							</v-data-table>
						</v-col>
          			</v-row>
        		</v-card>
      		</v-col>
    	</v-row>
    	<v-row>
			<v-col cols="12" v-if="stcode">
				<Map /> 
				<!--<v-card class="my-5">-->
					<!--<EsriMap />-->
				<!--</v-card>-->  
			</v-col>
    	</v-row>
    	<v-row v-if="stinfo.alias.length > 0">
			<v-col cols="12">
				<v-card class="my-5 pa-5">
					<v-row>
						<v-col col="11">
						<v-card-title>Alias Street Names</v-card-title>
						</v-col>
						<v-col col="1" class="d-flex justify-end">
						<v-btn class="ma-2" color="primary" @click="takeAction( 'add_alias' )" v-if="( auth !== '' )" ><v-icon left>mdi-plus-circle</v-icon>Add New Alias</v-btn>
						</v-col>
					</v-row>
					<v-expansion-panels inset>
						<v-expansion-panel v-for="(item, index) in stinfo.alias" :key="index">
							<v-expansion-panel-header>
								<v-row>
									<v-col col="11" class="d-flex align-center">
										{{ item.admkey }}
									</v-col>
									<v-col col="1" class="d-flex justify-end">
										<v-btn class="ma-2" color="primary" @click="takeAction( 'delete_alias', index )" v-if="( auth !== '' )" ><v-icon left>mdi-trash-can</v-icon>Delete</v-btn>
										<v-btn class="ma-2" color="primary" @click="takeAction( 'edit_alias', index )" v-if="( auth !== '' )" ><v-icon left>mdi-file-edit</v-icon>Edit</v-btn>
									</v-col>
								</v-row>
							</v-expansion-panel-header>
							<v-expansion-panel-content>
								<v-row>
									<v-col cols="12">
										<v-data-table 
											:headers="headers" 
											:items="[item]" 
											:items-per-page="1" 
											hide-default-footer>
										</v-data-table>
									</v-col>
								</v-row>
								<v-row>
									<v-col cols="12">
										<v-data-table 
											:headers="headers2" 
											:items="[item]" 
											:items-per-page="1"
											hide-default-footer>
											<template v-slot:item.addrnumbers="{item}">
												{{ addrnumbers[ item.addrnumbers ] }}
											</template>
											<template v-slot:item.roadtype="{item}">
												{{ roadtype[ item.roadtype ] }}
											</template>
											<template v-slot:item.staccess="{item}">
												{{ staccess[ item.staccess ] }}
											</template>
										</v-data-table>
									</v-col>
								</v-row>
								<v-row>
									<v-col cols="12">
										<v-data-table 
											:headers="headers3" 
											:items="[item]" 
											:items-per-page="1"
											hide-default-footer>
											<template v-slot:item.reason="{item}">
												{{ reason[ item.reason ] }}
											</template>
										</v-data-table>
									</v-col>
								</v-row>
								<v-row>
									<v-col cols="12">
										<v-data-table 
											:headers="headers4" 
											:items="[item]" 
											:items-per-page="1"
											hide-default-footer>
											<template v-slot:item.created_date="{item}">
												{{ formatTheDate( item.created_date ) }}
											</template>
											<template v-slot:item.last_edited_date="{item}">
												{{ formatTheDate( item.last_edited_date ) }}
											</template>
										</v-data-table>
									</v-col>
								</v-row>
              				</v-expansion-panel-content>
            			</v-expansion-panel>
         			</v-expansion-panels>
        		</v-card>
      		</v-col>
    	</v-row>
  	</v-container>
</template>

<script>
  	import JSONToURL from "../js/jsontourl";
  	import FormatDate from "../js/formatDate";
  	import axios from "axios";
	import Map from "./Map.vue";
	
	export default {
    	name: "streetdetail",

    	components: {
      		//EsriMap: ( ) => import (/* webpackChunkName: "esrimap"*/"./EsriMap.vue")
			//EsriMap
			Map
    	},

    	mounted: function( ){
      		this.setInfo( );

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
			headers4: [
				{ text: "Created By", value: "created_user", sortable: false },
				{ text: "Created On", value: "created_date", sortable: false },
				{ text: "Modified By", value: "last_edited_user", sortable: false },
				{ text: "Modified On", value: "last_edited_date", sortable: false },
				{ text: "Modifying Agency", value: "last_edited_agency", sortable: false }
			],
			addrnumbers: {
				"B": "ODD AND EVEN",
				"E": "EVEN ONLY",
				"O": "ODD ONLY"
			},
			staccess: {
				"PUB": "PUBLIC",
				"PVT": "PRIVATE"
			},
			roadtype: {
				"Road": "ROAD",
				"NamedDriveway": "DRIVEWAY"
			},
			reason: {
				"AL": "ALIAS NAME ONLY",
				"AX": "ANNEXATION",
				"CC": "COUNTY COMMISSION",
				"NC": "NAME CHANGE",
				"PC": "PLANNING COMMISSION",
				"SD": "SUBDIVISION",
				null: "NA"
			},
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
      		},
      		stinfo( ){
          		return this.$store.state.stinfo;
      		},
      		new_stinfo( ){
          		return this.$store.state.new_stinfo;
      		},
      		mode( ){
        		return this.$store.state.mode;
      		},
      		auth( ){
        		return this.$store.state.token; 
      		}

    	},

    	watch: {
      		stcode: function( ){
        		this.setInfo( );
      		}

    	},
		
    	methods: {
      		setInfo( ){
        		const _this = this,
          			stcode = _this.stcode,
          			url = _this.ws.adm + "v1/query/streetfileall",
          			legal_params = {
            			columns: "objectid, countystcode, admkey, preaddrnum, streetname, streettype, standtype, addrnumsuf, municipality, lowerblock, upperblock, oldmunicipality, aliaslegalflag, editedagency, citystcode, directions, staccess, addrnumbers, parcelsattached, stcontinuous, roadtype, comments, reason, created_user, created_date, last_edited_user, last_edited_date, last_edited_agency",
            			filter: "countystcode = '" + stcode + "' and aliaslegalflag = 'L'"
          			},
					alias_params = {
						columns: "objectid, countystcode, admkey, preaddrnum, streetname, streettype, addrnumsuf, municipality, lowerblock, upperblock, oldmunicipality, aliaslegalflag, editedagency, citystcode, directions, staccess, addrnumbers, parcelsattached, stcontinuous, roadtype, comments, reason, created_user, created_date, last_edited_user, last_edited_date, last_edited_agency",
						filter: "countystcode = '" + stcode + "' and aliaslegalflag = 'A'"
					};

				axios.all( [ 
					_this.axios_inst.get( `${ url }?${ JSONToURL( legal_params ) }` )
						.then( response => {
							return response.data;
						
						} ),
					_this.axios_inst.get( `${ url }?${ JSONToURL( alias_params ) }` )
						.then( response => {
							return response.data;

						} )

				] )
				.then( axios.spread( ( legal_data, alias_data ) => {
					_this.$store.commit( "stinfo", { 
						legal: legal_data, 
						alias: alias_data
					} );
            
        		} ) )
        		.catch( ex => {
          			console.log( "parsing failed", ex );

        		} )  
        
      		},
      		takeAction( mode, idx ){
        		const _this = this;

				switch( mode ){
					case "add_alias":
						_this.$store.commit( "new_stinfo", [ { 
							countystcode: _this.stcode,
							aliaslegalflag: "A",
							staccess: "PUB", 
							addrnumbers: "B",
							parcelsattached: "N", 
							stcontinuous: "Y",
							roadtype: "Road",
							reason: null
						} ] );
						break;

					case "delete_legal":
						//delete the specific row
						this.$store.dispatch( "delete", { filter: _this.stinfo.legal[ idx ].objectid } );
						break;

					case "delete_alias":
						//delete the specific row
						this.$store.dispatch( "delete", { filter: _this.stinfo.alias[ idx ].objectid } );
						break;

					case "edit_legal": 
						var { created_user, created_date, last_edited_user, last_edited_date, last_edited_agency, ...temp } = _this.stinfo.legal[ idx ];
						this.$store.commit( "new_stinfo", [ { ...temp } ] );
						break;
					case "edit_alias":
						var { created_user, created_date, last_edited_user, last_edited_date, last_edited_agency, ...temp } = _this.stinfo.alias[ idx ];
						this.$store.commit( "new_stinfo", [ { ...temp } ] );
						break;
				}

        		this.$store.commit( "mode", mode );
      
      		},

      		formatTheDate( input_date ){
        		return FormatDate( new Date( input_date ), "MON DD, YYYY" ) + " " + new Date( input_date ).toLocaleTimeString( );
      		}

    	} 

  	}
</script>