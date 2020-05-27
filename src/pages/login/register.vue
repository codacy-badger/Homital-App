<template>
    <view>
	<view style="uni-padding-wrap uni-common-mt">
		<view class="inputArea">
			<input v-model="emailAddress" placeholder="Enter your email address" type="text" class="inputClass" />
		</view>
        <view class="inputArea">
			<input v-model="username" placeholder="Enter your username" type="text" class="inputClass" />
		</view>
		<view class="inputArea">
				<input type="number" maxlength="6" placeholder="Enter the 6-digit verification number sent to your email address." class="inputClass" v-model="verificationCode" />
				<button type="primary" class="inputClass" @tap="_sendVerificationCode">Send Verification Code</button>
		</view>
		<view class="inputArea">
			<input v-model="password" placeholder="Enter your password" type="password" class="inputClass" />
		</view>
		<view class="inputArea">
			<input v-model="reconfirmPassword" placeholder="Enter your password again" type="password" class="inputClass" />
		</view>
		<!-- <view style="padding: 0 10%;">
			<text style="color: red;">{{message}}</text>
		</view> -->
		<view class="inputArea">
			<button style="border-radius:22px;" type="primary" @tap="register">Register</button>
		</view>
		<view class="inputArea">
			<text style="float:right;color:blue;" @click="openAgreement">User Agreement</text>
		</view>
	</view>
    </view>
</template>

<script>
	export default {
		data() {
			return {
                emailAddress: '',
                username: '',
				password: '',
				reconfirmPassword: '',
				verificationCode: '',
				sendCode: {
					text: 'Send',
					status: false,
					codeTime: 180
				},
				timerId: null,
				message: ''
			}
        },
        methods: {
			_sendVerificationCode() {
				if (this.sendCode.codeTime != 180) {
					return;
				}
				this.timerId = setInterval(() => {
						var timer = this.sendCode.codeTime;
						timer--;
						this.sendCode.codeTime = timer;
						this.sendCode.text = timer + "S";
						if (timer < 1) {
							clearInterval(this.timerId);
							this.sendCode.text = "Resend";
							this.sendCode.codeTime = 180;
							this.sendCode.status = false;
						}
					},
					1000);
				return false;
            },
            register() {
                var tHIS = this;
                var password = tHIS.password;
                var reconfirmPassword = tHIS.reconfirmPassword;
                var url = getApp().globalData.base_url + '/auth/user/register';
                if (!password) {
					tHIS.message = "Password cannot be empty";
					return false;
                }
                if (tHIS.password != tHIS.reconfirmPassword) {
					tHIS.message = "Passwords don't match";
					return false;
				}
                uni.request({
						url: url,
						data: {
                            username: tHIS.username,
							email: tHIS.emailAddress,
							password: tHIS.password
						},
                        method : 'POST',
						header: {
						    'content-type' : 'application/json'
						},
						success: (res) => {
							if (!res.data.success) {
								tHIS.error = res.data.error
								uni.showToast({
					                title: res.data.error,
						            duration: 2000
					            });
							}
						}
					});
            },
			openAgreement() {
				uni.navigateTo({
					url: '../login/userAgreement',
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			}
		}
	}
</script>

<style>
	.inputClass {
		border: 2px solid #ccc;
		border-radius: 22px;
		outline: 0;
		padding: 8px 15px;
	}
</style>