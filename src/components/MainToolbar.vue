<template>
	<div>
		<div class="d-none d-sm-flex">
			<v-app-bar app color="primary" dark>
				<v-toolbar-title class="headline">Street File Dictionary</v-toolbar-title>
				<v-spacer></v-spacer>
				<v-btn class="ma-2" outlined color="white" v-if="( auth !== '' ) && mode === 'info'" @click="toggle( 'add_legal' )" ><v-icon left>mdi-plus-circle</v-icon>Add New Legal</v-btn>
				<v-btn class="ma-2" outlined color="white" v-if="( auth === '' )" @click="toggle( 'login' )"><v-icon left>mdi-login-variant</v-icon>Login</v-btn>
				<v-btn class="ma-2" outlined color="white" v-if="( auth !== '' )" @click="logout( )"><v-icon left>mdi-logout-variant</v-icon>Logout</v-btn>
			</v-app-bar>
		</div>
		<div class="d-flex d-sm-none">
			<v-app-bar app color="primary" dark>
				<v-toolbar-title class="headline">
					<v-avatar>
						<v-img max-height="48" max-width="48" src="img/icons/48x48.png"></v-img>
					</v-avatar>
				</v-toolbar-title>
				<v-spacer></v-spacer>
				<v-btn class="ma-2" color="white" light v-if="( auth !== '' ) && mode === 'info'" @click="toggle( 'add_legal' )" ><v-icon>mdi-plus-circle</v-icon></v-btn>
				<v-btn class="ma-2" color="white" light v-if="( auth === '' )" @click="toggle( 'login' )"><v-icon>mdi-login-variant</v-icon></v-btn>
				<v-btn class="ma-2" color="white" light v-if="( auth !== '' )" @click="logout( )"><v-icon>mdi-logout-variant</v-icon></v-btn>
			</v-app-bar>
		</div>
	</div>
</template>

<script> 
  	export default {
      	name: "maintoolbar",
      	
		mounted: function( ){
        	const item_str = localStorage.getItem( "token" )

			if( item_str ){
				const item = JSON.parse( item_str ), 
					now = new Date( )
		
				// compare the expiry time of the item with the current time
				if( now.getTime( ) > item.expiry ){
					// If the item is expired, delete the item from storage
					// and return null
					localStorage.removeItem( "token" )
					this.$store.commit( "auth", "" )
					
				}else{
					this.$store.commit( "auth", item.token )
					
				}
			
			}

		},
      
	 	computed: {
        	stcode( ){
          		return this.$store.state.stcode
        	},
        	stinfo( ){
          		return this.$store.state.stinfo
        	},
        	new_stinfo( ){
          		return this.$store.state.new_stinfo
        	},
        	mode( ){
          		return this.$store.state.mode
        	},
        	auth( ){
          		return this.$store.state.token
        	}
      
      	},

      	data: ( ) => ( {
        	drawer: false,
        	items: [
          		[ "mdi-information", "Information", "info" ],
				[ "mdi-plus-circle", "Add Street", "edit" ],
				[ "mdi-login-variant", "Login", "login" ]
			],
			tools: [
        		{ title: "Add New Legal" },
        		{ title: "Logout" }
      		]

      	} ),

      	methods: {
        	toggle( mode ){
          		const _this = this

				if( mode === "add_legal" ){
					_this.$store.commit( "new_stinfo", [ {
						aliaslegalflag: "L", 
						staccess: "PUB", 
						addrnumbers: "B",
						parcelsattached: "N", 
						stcontinuous: "Y",
						roadtype: "Road",
						reason: null
					} ] )

				}

          		_this.$store.commit( "mode", mode )
        
        	},
        	logout( ){
          		localStorage.removeItem( "token" )
          		this.$store.commit( "auth", "" )
          		this.toggle( "info" )

        	}
      
      	}

  	};
</script>