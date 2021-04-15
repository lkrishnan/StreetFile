module.exports = {
  	publicPath: process.env.NODE_ENV === 'production' ? '' : '/',
  	css: {
    	sourceMap: true,
	},
	productionSourceMap: false,
	transpileDependencies: [
    	"vuetify"
  	],
  	pwa: {
    	name: 'Street File Dictionary',
    	workboxPluginMode: 'InjectManifest',
    	workboxOptions: {
      		swSrc: 'service-worker.js',
			exclude: [ /\.htaccess$/ ]
    	},
		
  	}
}