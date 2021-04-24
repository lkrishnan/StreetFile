<template>
  	<v-container class="my-10" v-if="mode === 'login'">
    	<v-row justify="center">
      		<v-col sm="6">
        		<v-card outlined v-model="validating" :disabled="(validating === 1)"> 
          			<v-form>
            			<v-container class="pa-4">
              				<v-text-field 
								v-model="userName" 
								label="User Name"
								:error-messages="userNameErrors"
								@input="$v.userName.$touch( )"
								@blur="$v.userName.$touch( )" 
								required>
							</v-text-field>
							<v-text-field 
								v-model="password" 
								label="Password"
								:type="'password'"
								:error-messages="passwordErrors"
								@input="$v.password.$touch( )"
								@blur="$v.password.$touch( )"  
								required>
							</v-text-field>
							<v-row class="mt-4">
								<v-btn @click="login" outlined color="primary"  class="ml-4">Login</v-btn>
								<v-btn @click="back" outlined color="primary" class="ml-4">Back</v-btn>
								<p v-if="auth.indexOf( 'error' ) > -1" class="ml-4 red--text">The entered login or password is wrong.</p>
							</v-row>
            			</v-container>
            			<v-fade-transition>
              				<v-overlay :value="(validating === 1)">
                				<v-progress-circular :size="50" color="amber" indeterminate></v-progress-circular>
              				</v-overlay>
            			</v-fade-transition>
          			</v-form>
        		</v-card>  
      		</v-col>
    	</v-row>
  	</v-container>
</template>

<script>
  	import { validationMixin } from 'vuelidate'
  	import { required, maxLength, email } from 'vuelidate/lib/validators'
  
  	export default{
    	name: "login",
    	
		mixins: [ validationMixin ],
    	
		validations: {
      		userName: { required },
      		password: { required }
    	},
    	
		data( ){
      		return {
        		userName: "",
        		password: "",
        		validating: 0
      		}
    	},  
    
		computed: {
      		mode( ){
        		return this.$store.state.mode;
      		
			},
      		auth( ){
        		return this.$store.state.token;
      		
			},
      		userNameErrors( ){
        		const errors = [ ]
        
				if( !this.$v.userName.$dirty ){
					return errors
				} 
			
				!this.$v.userName.required && errors.push( "User Name is required." )

				return errors
      		
			},
      		passwordErrors( ){
        		const errors = [ ]
        
				if( !this.$v.password.$dirty ){
					return errors
				} 
          
        		!this.$v.password.required && errors.push( "Password is required." )
        
        		return errors
      		
			}
    	
		},
    
		watch: {
      		auth: "authenticate"
    
		},
    
		methods: {
      		async login( ){
        		this.validating = 1;
        		this.$store.dispatch( "login", { userName: this.userName, password: this.password } );
      		
			},
      		back( ){
        		const _this = this;

        		_this.userName = "";
        		_this.password = "";
        		this.$v.$reset( );
        		this.$store.commit( "mode", "info" );
      		
			},
		    authenticate( ){
				if( this.auth === '' || this.auth.indexOf( "error" ) > -1 ){
					this.$store.commit( "mode", "login" );
				}else{
					this.$store.commit( "mode", "info" );
				}

				this.validating = 0;
			
			}

    	}

  	};
</script>