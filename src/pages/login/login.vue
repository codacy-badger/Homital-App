<template>
    <view>
        <view class="uni-padding-wrap uni-common-mt">
            <view class="uni-hello-text">Please log in.</view>
            <view class="inputArea">
                <input
                    v-model="username"
                    placeholder="Please enter your username/email"
                    class="inputClass"
                />
            </view>
            <view class="inputArea">
                <input
                    v-model="password"
                    placeholder="Please enter your password"
                    type="password"
                    class="inputClass"
                />
            </view>
            <!-- <view class="uni-textarea uni-common-mt">
				<textarea :value="res"></textarea>
            </view>-->
            <view class="uni-btn-v uni-common-mt">
                <button type="primary" @tap="_login">log in</button>
                <!-- <button type="primary" @tap="_register">register</button> -->
                <button type="primary" @tap="_register">Or register here</button>
            </view>
            <!-- <view class="inputArea">
				<text style="float:right;color:blue;" @click="_register">>>Or register here>></text>
            </view>-->
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
			username: "",
            password: "",
            success: "",
            valid: false,
            error: "",
            // res:'',
            refresh_token: ""
        };
    },
    methods: {
        _register() {
            uni.navigateTo({
                url: "../login/register",
                success: res => {},
                fail: () => {},
                complete: () => {}
            });
        },
        async _login() {
            var tHIS = this;
            if (this.username.length <= 0) {
                uni.showToast({
                    title: "Cannot lah please enter valid username",
                    duration: 2000
                });
                return;
            } else if (this.password.length <= 0) {
                uni.showToast({
                    title: "forgot ur password meh",
                    duration: 2000
                });
                return;
            } else {
                var loginMethod = this.username.includes("@")
                    ? "email"
                    : "username";
                var url =
                    getApp().globalData.base_url +
                    "/auth/user/login?by=" +
                    loginMethod;
                await uni.request({
                    url: url,
                    data: {
                        email: tHIS.username,
                        username: tHIS.username,
                        password: tHIS.password
                    },
                    method: "POST",
                    header: {
                        "content-type": "application/json"
                    },
                    success: res => {
                        console.log(tHIS.email);
                        if (res.data.success) {
                            tHIS.valid = true;
                            tHIS.refresh_token = res.data.refresh_token;
                            uni.setStorageSync("refresh_token", tHIS.refresh_token);
							uni.setStorageSync("userinfo", tHIS.username);
							//console.log("userinfo:", uni.getStorageSync('userinfo'));
                            uni.showToast({
                                title: "log in successfully",
                                duration: 2000
							});
							uni.reLaunch({
								url: '../me/me'
							});

							// uni.navigateBack({});
                            // uni.navigateTo({
                            //     url: "../me/me",
                            //     success: res => {console.log('a')},
                            //     fail: () => {console.log('b')},
                            //     complete: () => {console.log('c')}
                            // });
                        } else {
                            tHIS.valid = false;
                            tHIS.error = res.data.error;
                            uni.showToast({
                                title: tHIS.error,
                                duration: 2000
                            });
                        }
                    }
                });
            }
        }
    }
};
</script>

<style>
.container {
    padding: 20px;
    font-size: 14px;
    line-height: 24px;
}
.inputArea {
    padding: 20upx 10%;
    border: 1px solid aquamarine;
    border-radius: 5rpx;
    margin: 5rpx;
}
</style>