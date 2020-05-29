<template>
    <view>
        <view v-if="(notloggedin == true || notloggedin == false) && !notloggedin">
            <view class="uni-padding-wrap uni-common-mt">
                <view class="uni-hello-text" style="margin-bottom: 500rpx">
                    You are logged in as {{userinfo}}
                    <!--textarea :value="userinfo"></textarea-->
                </view>
                <view class="uni-btn-v uni-common-mt">
                    <button type="primary" @tap="_logout">log out</button>
                </view>
            </view>
        </view>
        <view v-if="(notloggedin == true || notloggedin == false) && notloggedin">
            <view class="uni-padding-wrap uni-common-mt">
                <view
                    class="uni-hello-text"
                    style="margin-bottom: 500rpx"
                >You are not logged in yet.</view>
                <view class="uni-btn-v uni-common-mt">
                    <button type="primary" @tap="_directToLogin">log in</button>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
const auth = require("../../common/authorisation");
export default {
    data() {
        return {
            userinfo: "",
            refresh_token: "",
            error: "",
            notloggedin: null
        };
    },
    async onShow() {
        var tHIS = this;
        tHIS.notloggedin = null;
        //console.log("userinfo: ", uni.getStorageSync("userinfo"));
        console.log("checking account status");
        const val = uni.getStorageSync("notloggedin");
        console.log("print val" + val);
        console.log("before" + tHIS.notloggedin);
        tHIS.notloggedin = await uni.getStorageSync("notloggedin");
        tHIS.userinfo = uni.getStorageSync("userinfo");
        console.log("after" + tHIS.notloggedin);
    },
    methods: {
        _logout() {
            var tHIS = this;
            this.refresh_token = uni.getStorageSync("refresh_token");
            console.log(this.refresh_token);
            var url = getApp().globalData.base_url + "/auth/user/logout";
            uni.request({
                url: url,
                data: {
                    token: this.refresh_token
                },
                method: "DELETE",
                header: {
                    "content-type": "application/json"
                },
                success: async res => {
                    if (res.data.success) {
                        console.log("trying to log out...");
                        uni.removeStorageSync("userinfo");
                        uni.removeStorageSync("refresh_token");
                        uni.setStorageSync("notloggedin", true);
                        uni.showToast({
                            title: "You have successfully logged out.",
                            duration: 2000
                        });
                        await uni.reLaunch({
                            url: "../me/me"
                        });
                    } else {
                        tHIS.error = res.data.error;
                        uni.showToast({
                            title: tHIS.error,
                            duration: 2000
                        });
                    }
                }
            });
        },
        _directToLogin() {
            uni.navigateTo({
                url: "../login/login",
                success: res => {},
                fail: () => {},
                complete: () => {}
            });
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
</style>