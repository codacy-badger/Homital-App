<template>
    <view>
		<view class="uni-padding-wrap uni-common-mt">
        <view v-if="(notloggedin == true || notloggedin == false) && notloggedin">
            <uni-card
                title="Log in"
                mode="title"
                :is-shadow="true"
                @click="_directToLogin"
            >Log in to check and control your devices.</uni-card>
			</view>
			</view>

<!-- 
            <view class="uni-padding-wrap uni-common-mt">
                <view
                    class="uni-hello-text"
                    style="margin-bottom: 500rpx"
                >Log in to check and control your devices.</view>
                <view class="uni-btn-v uni-common-mt">
                    <button type="primary" @tap="_directToLogin">log in</button>
                </view>
            </view>
        </view> -->

        <view v-if="(notloggedin == true || notloggedin == false) && !notloggedin">
            <view class="uni-padding-wrap uni-common-mt">
                <view class="uni-textarea uni-common-mt">
                    <textarea :value="res"></textarea>
                </view>
                <view class="uni-btn-v uni-common-mt">
                    <button
                        @click="_request"
                        :loading="loading"
                        v-bind:type="status ? 'primary' : 'default'"
                    >Switch {{status ? 'Off' : 'On'}}</button>
                </view>
            </view>
        </view>

    </view>
</template>

<script>
const auth = require("../../common/authorisation");
// const uniCard = require("../../components/uni-card/uni-card.vue");

import uniCard from "@/components/uni-card/uni-card.vue"
export default {
    data() {
        console.log("Evil data() is running");
        return {
            status: "",
            res: "",
            loading: false,
            haha: "warn",
            notloggedin: null
        };
    },
    components: { uniCard },
    async onShow() {
        var tHIS = this;
        tHIS.notloggedin = null;

        console.log("checking account status");
        console.log("before" + tHIS.notloggedin);
        tHIS.notloggedin = uni.getStorageSync("notloggedin");
        console.log("after" + tHIS.notloggedin);

        var access = getApp().globalData.access_token;
    console.log('printing access token just after page: ' + access);

        console.log("ok everything begins");

        if(tHIS.notloggedin) {
            await uni.navigateTo({
                url: "../login/login",
                success: res => {
                    console.log("suc");
                },
                fail: () => {
                    console.log("fal");
                },
                complete: () => {}
            });
        } else {
            console.log("reached else");
            await auth.functions.makeAuthenticatedCall(
                    resData => {
                        console.log("reached resData on/off");
                        console.log(resData);
                        console.log(resData.success);
                        if (resData.success) {
                            tHIS.status = resData.status.power;
                            tHIS.haha = tHIS.status ? "primary" : "default";
                        } else {
                            uni.showToast({
                                icon: "none",
                                title: "Cannot lah :<\nplease refresh the page",
                                duration: 2000
                            });
                        }
                    },
                    getApp().globalData.base_url +
                        "/user/alice/livingroom/lamp",
                    {},
                    "GET",
                    1
                );
        }

        




        // console.log("checking account status");
        // await auth.functions.requestAcessToken(success => {
        //     console.log("rat: callback, succ=", success);
        //     if (!success) {
        //         uni.setStorageSync("userinfo", "");
        //     }
        //     tHIS.userinfo = uni.getStorageSync("userinfo");
        //     console.log("userinfo : ", tHIS.userinfo);
        //     console.log("notloggedin : ", tHIS.notloggedin);
        //     if (!tHIS.userinfo) {
        //         tHIS.notloggedin = true;
        //         console.log(tHIS.notloggedin);
        //     } else {
        //         tHIS.notloggedin = false;
        //         auth.functions.makeAuthenticatedCall(
        //             resData => {
        //                 console.log(resData);
        //                 console.log(resData.success);
        //                 if (resData.success) {
        //                     tHIS.status = res.data.status.power;
        //                     tHIS.haha = tHIS.status ? "primary" : "default";
        //                 } else {
        //                     uni.showToast({
        //                         icon: "none",
        //                         title: "Cannot lah :<\nplease refresh the page",
        //                         duration: 2000
        //                     });
        //                 }
        //             },
        //             getApp().globalData.base_url +
        //                 "/user/alice/livingroom/lamp",
        //             {},
        //             "GET"
        //         );
        //     }
        // });
    },
    methods: {
        _request() {
            var tHIS = this;
            if (this.status) {
                console.log("trying to turn off...");
                auth.functions.makeAuthenticatedCall(
                    resData => {
                        if (resData.success) {
                            console.log("request success");
                            tHIS.status = false;
                            tHIS.haha = "default";
                        }
                    },
                    getApp().globalData.base_url +
                        "/user/alice/livingroom/lamp/poweroff",
                    {},
                    "POST"
                );
            } else {
                console.log("trying to turn on...");
                auth.functions.makeAuthenticatedCall(
                    resData => {
                        if (resData.success) {
                            console.log("request success");
                            tHIS.status = true;
                            tHIS.haha = "primary";
                        }
                    },
                    getApp().globalData.base_url +
                        "/user/alice/livingroom/lamp/poweron",
                    {},
                    "POST",
                    1
                );
            }
        },
        _directToLogin() {
            console.log("directing...");
            uni.navigateTo({
                url: "../login/login",
                success: res => {
                    console.log("suc");
                },
                fail: () => {
                    console.log("fal");
                },
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
