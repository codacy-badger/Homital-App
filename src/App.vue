<script>
const auth = require("common/authorisation");
	export default {
		globalData: {  
			base_url :'https://homital.ml:2333/api',
			access_token: ''
        }, 
		onLaunch: async function() {
			console.log('App Launch');
			await auth.functions.requestAcessToken(success => {
            	console.log("rat: callback, succ=", success);
            	if (!success) {
					uni.setStorageSync("notloggedin", true);
					uni.removeStorageSync("refresh_token");
					uni.removeStorageSync("userinfo");
           		} else {
					uni.setStorageSync("notloggedin", false);
				}
        	});
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
