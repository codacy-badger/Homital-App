<script>
	export default {
		globalData: {  
			base_url :'https://homital.ml:2333/api',
            refresh_token: '',
			access_token: '',
			userinfo:''
        }, 
		onLaunch: function() {
			console.log('App Launch');
		},
		onShow: function() {
			console.log('App Show');
		},
		onHide: function() {
			console.log('App Hide');
		}
	}
</script>

<style>
	/*每个页面公共css */
</style>
