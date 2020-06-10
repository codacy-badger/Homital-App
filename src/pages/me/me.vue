<template>
    <view>
        <view v-if="(notloggedin == true || notloggedin == false)
        && !notloggedin">
            <view class="uni-padding-wrap uni-common-mt">
                <view class="uni-hello-text" style="margin-bottom: 500rpx">
                    You are logged in as {{userinfo}}
                    <!--textarea :value="userinfo"></textarea-->
                </view>
                <view class="uni-btn-v uni-common-mt">
                    <button type="primary"
                    v-bind:loading ='loggingOutProcessing'
                    @tap="_logout">{{loggingOutProcessing == false
                    ? 'log out' :'logging out in progress'}}</button>
                </view>
            </view>
        </view>
        <view v-if="(notloggedin == true || notloggedin == false)
        && notloggedin">
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

// const auth = require('../../common/authorisation');
export default {
  data() {
    return {
      userinfo: '',
      refresh_token: '',
      error: '',
      notloggedin: null,
      loggingOutProcessing: false,
    };
  },
  async onShow() {
    const tHIS = this;
    tHIS.notloggedin = null;
    console.log('before userinfo: ', uni.getStorageSync('userinfo'));
    console.log('before refresh_token: ', uni.getStorageSync('refresh_token'));
    console.log('checking account status');
    const val = uni.getStorageSync('notloggedin');
    console.log('print val' + val);
    console.log('before' + tHIS.notloggedin);
    tHIS.notloggedin = await uni.getStorageSync('notloggedin');
    tHIS.userinfo = uni.getStorageSync('userinfo');
    console.log('after userinfo: ', uni.getStorageSync('userinfo'));
    console.log('after' + tHIS.notloggedin);
  },
  async onPullDownRefresh() {
    console.log('refresh');
    const tHIS = this;
    tHIS.notloggedin = null;

    console.log('before userinfo: ', uni.getStorageSync('userinfo'));
    console.log('before refresh_token: ', uni.getStorageSync('refresh_token'));
    console.log('checking account status');
    const val = uni.getStorageSync('notloggedin');
    console.log('print val' + val);
    console.log('before' + tHIS.notloggedin);
    tHIS.notloggedin = await uni.getStorageSync('notloggedin');
    tHIS.userinfo = uni.getStorageSync('userinfo');
    console.log('after userinfo: ', uni.getStorageSync('userinfo'));
    console.log('after' + tHIS.notloggedin);


    setTimeout(function() {
      uni.stopPullDownRefresh();
    }, 1000);
  },
  methods: {
    _logout() {
      const tHIS = this;
      tHIS.loggingOutProcessing = true;
      this.refresh_token = uni.getStorageSync('refresh_token');
      console.log(this.refresh_token);
      const url = getApp().globalData.base_url + '/auth/user/logout';
      uni.request({
        url: url,
        data: {
          token: this.refresh_token,
        },
        method: 'DELETE',
        header: {
          'content-type': 'application/json',
        },
        success: async (res) => {
          console.log('trying to log out...');
          await uni.removeStorageSync('userinfo');
          await uni.removeStorageSync('refresh_token');
          await uni.setStorageSync('notloggedin', true);
          tHIS.loggingOutProcessing = false;
          await uni.showToast({
            title: 'You have successfully logged out.',
            duration: 2000,
          });
          uni.reLaunch({
            url: '../me/me',
          });
        },
      });
    },
    _directToLogin() {
      uni.navigateTo({
        url: '../login/login',
        success: (res) => {},
        fail: () => {},
        complete: () => {},
      });
    },
  },
};
</script>

<style>
.container {
    padding: 20px;
    font-size: 14px;
    line-height: 24px;
}
</style>
