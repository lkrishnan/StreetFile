import Vue from 'vue'
import Vuex from 'vuex'
import axios from "axios";

Vue.use( Vuex )

export default new Vuex.Store( {
  state: {
    ws: {
      adm: "https://maps.mecklenburgcountync.gov/api/adm/",
      gis: "https://maps.mecklenburgcountync.gov/api/gis/"
    },
    admkey: null,
    stcode: null,
    blocks: [ ],
    stinfo: { "legal": [ ], "alias": [ ] },
    new_stinfo: null,
    mode: "info",
    token: ""
  },
  getters: {
    admkey: state => state.admkey,
    stcode: state => state.stcode,
    blocks: state => state.blocks,
    stinfo: state => state.stinfo,
    new_stinfo: state => state.new_stinfo,
    mode: state => state.mode,
    auth: state => state.token
  
  },
  mutations: {
    admkey( state, payload ){
      state.admkey = payload;
    },
    stcode( state, payload ){
      state.stcode = payload;
    },
    blocks( state, payload ){
      state.blocks = payload;
    },
    stinfo( state, payload ){
      state.stinfo = payload;
    },
    new_stinfo( state, payload ){
      state.new_stinfo = payload;
    },
    mode( state, payload ){
      state.mode = payload;
    },
    auth(state, token) {
        state.token = token;
    }

  },
  actions: {
    async login( { commit }, loginData ){
      let token = ( await axios.post( "https://maps.mecklenburgcountync.gov/auth/v1/login", loginData ) ).data;
      
      if( typeof token === 'object' && token !== null ){
        commit( "auth", "error_" + Math.floor( Math.random( ) * 1000 ) + 1 );

      }else{
        const now = new Date( ),
          item = {
            token: token,
            expiry: now.getTime( ) + ( 4320000000 ) //expires in 12 hours
          };
          
          localStorage.setItem( "token", JSON.stringify( item ) );
          commit( "auth", token );

      }

    }, 
    async update( { commit }, updateData ){
      let update_instance = axios.create( {
          headers: ( this.state.token.length > 0 ? { "Authorization": this.state.token } : { } )
      } ),
        reply = ( await update_instance.post( "https://maps.mecklenburgcountync.gov/auth/v1/update", updateData ) ).data;
      
      if( reply.result === "success" ){
        commit( "mode", "info" );
      }

    }, 
    async insert( { commit }, insertData ){
      let insert_instance = axios.create( {
        headers: ( this.state.token.length > 0 ? { "Authorization": this.state.token } : { } )
      } ),
        reply = ( await insert_instance.post( "https://maps.mecklenburgcountync.gov/auth/v1/insert", insertData ) ).data;
    
      if( reply.result === "success" ){
        commit( "mode", "info" );
      }

    }, 
    async delete( { commit }, deleteData ){
      let delete_instance = axios.create( {
        headers: ( this.state.token.length > 0 ? { "Authorization": this.state.token } : { } )
      } ),
        reply = ( await delete_instance.post( "https://maps.mecklenburgcountync.gov/auth/v1/delete", deleteData ) ).data;
    
      if( reply.result === "success" ){
        if( this.state.mode == "delete_legal"){
          commit( "stcode", null );
        }
        commit( "mode", "info" );
      }

    }

  }

} );