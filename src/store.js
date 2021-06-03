import axios from "axios"
import router from "./router"
import Vue from "vue"
import Vuex from "vuex"

Vue.use( Vuex )

export default new Vuex.Store( {
  	state: {
    	ws: {
      		adm: "https://maps.mecklenburgcountync.gov/api/adm/",
      		gis: "https://maps.mecklenburgcountync.gov/api/gis/"
    	},
		admkey: null,
		blocks: [ ],
		block_selection: null,
		new_stinfo: null,
		show_search: true,
		search_results: [ ],
		stinfo: { 
				"legal": [ ], 
				"alias": [ ] 
			},
		token: ""
  
	},
	getters: {
		admkey: state => state.admkey,
		auth: state => state.token,
		blocks: state => state.blocks,
		block_selection: state => state.block_selection,
		new_stinfo: state => state.new_stinfo,
		search_results: state => state.search_results,
		show_search: state => state.show_search,
		stinfo: state => state.stinfo,
		ws: state => state.ws
	
	},
	mutations: {
		admkey( state, payload ){
			state.admkey = payload
		
		},
		auth(state, token) {
			state.token = token
		
		},
		blocks( state, payload ){
			state.blocks = payload
		
		},
		block_selection( state, payload ){
			state.block_selection = payload
		
		},
		new_stinfo( state, payload ){
			state.new_stinfo = payload
		
		},
		search_results( state, payload ){
			state.search_results = payload

		},
		show_search( state, payload ){
			state.show_search = payload
		
		},
		stinfo( state, payload ){
			state.stinfo = payload
		
		}
		
	},
  	actions: {
		async login( { commit }, loginData ){
			//let token = ( await axios.post( "https://maps.mecklenburgcountync.gov/auth/v1/login", loginData ) ).data;
			let token = ( await axios.post( "http://localhost:3000/v1/login", loginData ) ).data;
		
			if( typeof token === 'object' && token !== null ){
				commit( "auth", "error_" + Math.floor( Math.random( ) * 1000 ) + 1 )

			}else{
				const now = new Date( ),
					item = {
						token: token,
						expiry: now.getTime( ) + ( 4320000000 ) //expires in 12 hours
					};
			
				localStorage.setItem( "token", JSON.stringify( item ) )
				commit( "auth", token )

			}

		}, 
		
		async update( { commit }, updateData ){
			let update_instance = axios.create( {
					headers: ( this.state.token.length > 0 ? { "Authorization": this.state.token } : { } )
				} ),
				//reply = ( await update_instance.post( "https://maps.mecklenburgcountync.gov/auth/v1/update", updateData ) ).data;
				reply = ( await update_instance.post( "http://localhost:3000/v1/update", updateData ) ).data;
		
			if( reply.result === "success" ){
				router.go( -1 )
			
			}

		
		}, 

		async insert( { commit }, insertData ){
			let insert_instance = axios.create( {
					headers: ( this.state.token.length > 0 ? { "Authorization": this.state.token } : { } )
				} ),
				//reply = ( await insert_instance.post( "https://maps.mecklenburgcountync.gov/auth/v1/insert", insertData ) ).data;
				reply = ( await insert_instance.post( "http://localhost:3000/v1/insert", insertData ) ).data;
		
			if( reply.result === "success" ){
				router.go( -1 )
			
			}

		}, 

		async delete( { commit }, deleteData ){
			let delete_instance = axios.create( {
					headers: ( this.state.token.length > 0 ? { "Authorization": this.state.token } : { } )
				} ),
				//reply = ( await delete_instance.post( "https://maps.mecklenburgcountync.gov/auth/v1/delete", deleteData ) ).data;
				reply = ( await delete_instance.post( "http://localhost:3000/v1/delete", deleteData ) ).data;
		
			if( reply.result === "success" ){
				if( this.state.stinfo.legal[ 0 ].objectid === deleteData.filter ){
					this.state.search_results = [ ]
					router.replace( { name: "Search" } )
				
				}else{
					router.go( )

				}
			
			}

		}

  	}

} );