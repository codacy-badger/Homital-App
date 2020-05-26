<template>
	<view>
		<view class="uni-padding-wrap uni-common-mt">
			<view class="uni-textarea uni-common-mt">
				<textarea :value="res"></textarea>
			</view>
			<view class="uni-btn-v uni-common-mt">
				<button @click="_request" :loading="loading" v-bind:type="status ? 'primary' : 'default'">Switch {{status ? 'Off' : 'On'}}</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			console.log("Evil data() is running");
			return {
				status: '',
				res: '',
				loading: false,
				haha: 'warn'
			}
		},
		onReady: function() {
			var fff =this;
			uni.request({
				url: 'http://homital.ml:2333/api/user/alice/livingroom/lamp',
				method: 'GET',
				success: function(res) {
					console.log(res.data);
					console.log(res.data.success);
					if (res.data.success) {
						fff.status = res.data.status.power;
						fff.haha = fff.status ? "primary" : "default";
					} else {
						uni.showToast({
							icon: 'none',
							title: 'Cannot lah :<\nplease refresh the page',
							duration: 2000
						});
					}
				}
			});
			uni.showToast({
				icon: 'none',
				title: 'Try pressing the button :>',
				duration: 2000
			})
		},
		methods: {
			_request() {
				if (this.status) {
					uni.request({
						url: 'http://homital.ml:2333/api/user/alice/livingroom/lamp/poweroff',
						data() {
							return {
								res: ''
							}
						},
						method: 'POST',
						success: (res) => {
							if (res.data.success) {
								console.log('request success');
								this.status = false;
								this.haha = "default";
							}
						},
					});
				} else {
					uni.request({
						url: 'http://homital.ml:2333/api/user/alice/livingroom/lamp/poweron',
						data() {
							return {
								res: ''
							}
						},
						method: 'POST',
						success: (res) => {
							if (res.data.success) {
								console.log('request success');
								this.status = true;
								this.haha = "primary";
							}
						},
					});
				}
			}
		}
	}
</script>

<style>
	.container {
		padding: 20px;
		font-size: 14px;
		line-height: 24px;
	}
</style>
