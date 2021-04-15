<template>
  <v-container v-if="[ 'info' ].includes( mode )">
    <v-row>
      <v-col cols="12">
        <Search />
      </v-col>
      <!--<v-col xs="12" sm="12" md="4" v-if="stcode">-->
      <v-col cols="12" v-if="stcode">  
        <StreetDetail />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
    import Search from "./Search.vue";
    import StreetDetail from "./StreetDetail.vue";
    
    export default {
        name: "information",
        components: {
            Search,
            StreetDetail
            //StreetDetail: ( ) => import (/* webpackChunkName: "streetdetail"*/"./StreetDetail.vue")
        },  
        computed: {
          mode( ){
            return this.$store.state.mode;
          },
          stcode( ){
            return this.$store.state.stcode;
          }
        }
    };
</script>