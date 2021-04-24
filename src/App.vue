<template>
	<v-app>
		<MainToolbar />
		<v-main class="grey lighten-4">
			<Login />
			<Information />
			<Edit />
		</v-main>
		<v-snackbar bottom right :value="updateExists" :timeout="-1" color="primary">
    		An update is available
    		<v-btn text @click="refreshApp">Update</v-btn>
  		</v-snackbar>
  	</v-app>
</template>

<script>
	import MainToolbar from "./components/MainToolbar.vue";
  	import Login from "./components/Login.vue";
  	import Information from "./components/Information.vue";
  	import Edit from "./components/Edit.vue";
	
  	export default {
    	name: "App",
    	
		components: {
      		MainToolbar,
      		Login, 
      		Information,
      		Edit
    	},
  		
		data( ){
			return {
				// refresh variables
				refreshing: false,
				registration: null,
				updateExists: false,
			}

    	},
  	    
		created( ){
			// Listen for our custom event from the SW registration
			document.addEventListener( 'swUpdated', this.updateAvailable, { once: true } )
			
			// Prevent multiple refreshes
			if( "serviceWorker" in navigator ){
				navigator.serviceWorker.addEventListener( 'controllerchange', ( ) => {
					if( this.refreshing ) 
						return
					this.refreshing = true
					// Here the actual reload of the page occurs
					window.location.reload( )
			
				} )
			}

    	},
  
		methods: {
			// Store the SW registration so we can send it a message
			// We use `updateExists` to control whatever alert, toast, dialog, etc we want to use
			// To alert the user there is an update they need to refresh for
			updateAvailable( event ){
				this.registration = event.detail
				this.updateExists = true
			
			},
		
			// Called when the user accepts the update
			refreshApp( ){
				console.debug("refreshing app")
				this.updateExists = false

				// Make sure we only send a 'skip waiting' message if the SW is waiting
				if( !this.registration || !this.registration.waiting ) 
					return
				// send message to SW to skip the waiting and activate the new SW
				this.registration.waiting.postMessage( { type: 'SKIP_WAITING' } )

			}

		}

  	};
</script>