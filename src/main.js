import './main.css'
import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import store from './store'
import vuetify from './plugins/vuetify';
//import "core-js/stable";
//import "regenerator-runtime/runtime";

Vue.config.productionTip = false

new Vue( {
  	store,
  	vuetify,
	render: h => h( App )
} ).$mount( "#app" )