<template>
    <view>
        <view class="uni-padding-wrap uni-common-mt">
            <view v-if="notloggedin != null && notloggedin">
                <uni-card
                    title="Log in"
                    mode="title"
                    :is-shadow="true"
                    @click="_directToLogin"
                >Log in to check and control your devices.</uni-card>
            </view>
        </view>

        <view v-if="notloggedin != null && !notloggedin">
            <view class="uni-padding-wrap uni-common-mt">
                <view class="uni-textarea uni-common-mt">
                    <textarea :value="res"></textarea>
                </view>
                <view class="uni-btn-v uni-common-mt">
                    <button
                        @click="_request"
                        v-bind:loading="status == null ? true : false"
                        v-bind:type="status ? 'primary' : 'default'"
                    >{{status == null? 'fetching light status' : status
                    ? 'Switch Off' : 'Switch On'}}</button>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
const auth = require('../../common/authorisation');
import uniCard from '@/components/uni-card/uni-card.vue';
export default {
  data() {
    return {
      status: null,
      res: '',
      loading: false,
      haha: 'warn',
      notloggedin: null,
    };
  },
  components: {uniCard},
  async onShow() {
    const tHIS = this;
    tHIS.notloggedin = null;
    tHIS.status = null;

    console.log('checking account status');
    console.log('before' + tHIS.notloggedin);
    tHIS.notloggedin = uni.getStorageSync('notloggedin');
    console.log('after' + tHIS.notloggedin);

    const access = await getApp().globalData.access_token;
    console.log('printing access token just after page: ' + access);

    console.log('ok everything begins');

    if (!tHIS.notloggedin) {
      console.log('reached else');
      auth.functions.makeAuthenticatedCall(
          (resData) => {
            console.log('reached resData on/off');
            console.log(resData);
            console.log(resData.success);
            if (resData.success) {
              tHIS.status = resData.status.power;
              tHIS.haha = tHIS.status ? 'primary' : 'default';
            } else {
              console.log('pos after ohhno howw');
              tHIS.notloggedin = true;
              uni.setStorageSync('notloggedin', true);
              uni.removeStorageSync('refresh_token');
              uni.removeStorageSync('userinfo');
              uni.showToast({
                icon: 'none',
                title: 'Your token has already expired. Please log in again.',
                duration: 2000,
              });
            }
          },
          getApp().globalData.base_url +
                        '/user/alice/livingroom/lamp',
          {},
          'GET',
          1,
      );
    }
  },
  async onPullDownRefresh() {
    _refresh();
    setTimeout(function() {
      uni.stopPullDownRefresh();
    }, 1000);
  },
  methods: {
    _request() {
      const tHIS = this;
      if (this.status) {
        console.log('trying to turn off...');
        auth.functions.makeAuthenticatedCall(
            (resData) => {
              if (resData.success) {
                console.log('request success');
                tHIS.status = false;
                tHIS.haha = 'default';
              }
            },
            getApp().globalData.base_url +
                        '/user/alice/livingroom/lamp/poweroff',
            {},
            'POST',
        );
      } else {
        console.log('trying to turn on...');
        auth.functions.makeAuthenticatedCall(
            (resData) => {
              if (resData.success) {
                console.log('request success');
                tHIS.status = true;
                tHIS.haha = 'primary';
              }
            },
            getApp().globalData.base_url +
                        '/user/alice/livingroom/lamp/poweron',
            {},
            'POST',
            1,
        );
      }
    },
    _directToLogin() {
      console.log('directing...');
      uni.navigateTo({
        url: '../login/login',
        success: (res) => {
          console.log('suc');
        },
        fail: () => {
          console.log('fal');
        },
        complete: () => {},
      });
    },
    async _refresh() {
      console.log('refresh method');
      const tHIS = this;
      tHIS.notloggedin = null;
      tHIS.status = null;

      console.log('checking account status');
      console.log('before' + tHIS.notloggedin);
      tHIS.notloggedin = uni.getStorageSync('notloggedin');
      console.log('after' + tHIS.notloggedin);

      const access = await getApp().globalData.access_token;
      console.log('printing access token just after page: ' + access);

      console.log('ok everything begins in refresh');

      if (!tHIS.notloggedin) {
        console.log('reached else');
        auth.functions.makeAuthenticatedCall(
            (resData) => {
              console.log('reached resData on/off');
              console.log(resData);
              console.log(resData.success);
              if (resData.success) {
                tHIS.status = resData.status.power;
                tHIS.haha = tHIS.status ? 'primary' : 'default';
              } else {
                uni.setStorageSync('notloggedin', true);
                uni.removeStorageSync('refresh_token');
                uni.removeStorageSync('userinfo');
                uni.showToast({
                  icon: 'none',
                  title: 'Your token has already expired. Please log in again.',
                  duration: 2000,
                });
                _refresh();
              }
            },
            getApp().globalData.base_url +
                        '/user/alice/livingroom/lamp',
            {},
            'GET',
            1,
        );
      }
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
