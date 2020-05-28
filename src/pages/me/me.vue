<template>
    <view>
        <view v-if="userinfo">
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
        <view v-if="notloggedin">
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
            notloggedin: false
        };
    },
    async onShow() {
        var tHIS = this;
        //console.log("userinfo: ", uni.getStorageSync("userinfo"));
        console.log("checking account status");
        await auth.functions.requestAcessToken(success => {
            console.log("rat: callback, succ=", success);
            if (!success) {
                uni.setStorageSync("userinfo", "");
            }
            tHIS.userinfo = uni.getStorageSync("userinfo");
            console.log("userinfo : ", tHIS.userinfo);
            if (!tHIS.userinfo) {
                tHIS.notloggedin = true;
                console.log(tHIS.notloggedin);
                // uni.navigateTo({
                //     url: "../login/login",
                //     success: res => {},
                //     fail: () => {},
                //     complete: () => {}
                // });
            }
        });
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
                success: res => {
                    if (res.data.success) {
                        uni.removeStorageSync("userinfo");
                        uni.removeStorageSync("refresh_token");
                        uni.showToast({
                            title: "You have successfully logged out.",
                            duration: 2000
                        });
                        uni.reLaunch({
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