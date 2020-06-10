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
                <button type="primary" v-bind:loading ='loggingInProcessing'
                @tap="_login">{{loggingInProcessing == false? 'log in'
                :'logging in in progress'}}</button>
                <button type="primary"
                @tap="_register">Or register here</button>
            </view>
            <!-- <view class="inputArea">
                <text style="float:right;color:blue;"
                @click="_register">>>Or register here>></text>
            </view>-->
        </view>
    </view>
</template>

<script>
export default {
  data() {
    return {
      username: '',
      password: '',
      success: '',
      valid: false,
      error: '',
      // res:'',
      refresh_token: '',
      loggingInProcessing: false,
    };
  },
  methods: {
    _register() {
      uni.navigateTo({
        url: '../login/register',
        success: (res) => {},
        fail: () => {},
        complete: () => {},
      });
    },
    async _login() {
      const tHIS = this;
      if (this.username.length <= 0) {
        uni.showToast({
          title: 'Cannot lah please enter valid username',
          duration: 2000,
        });
        return;
      } else if (this.password.length <= 0) {
        uni.showToast({
          title: 'forgot ur password meh',
          duration: 2000,
        });
        return;
      } else {
        tHIS.loggingInProcessing = true;
        const loginMethod = this.username.includes('@') ?
                    'email' :
                    'username';
        const url =
                    getApp().globalData.base_url +
                    '/auth/user/login?by=' +
                    loginMethod;
        await uni.request({
          url: url,
          data: {
            email: tHIS.username,
            username: tHIS.username,
            password: tHIS.password,
          },
          method: 'POST',
          header: {
            'content-type': 'application/json',
          },
          success: async (res) => {
            console.log('this.email' + tHIS.email);
            console.log('this.username' + tHIS.username);
            if (res.data.success) {
              tHIS.valid = true;
              tHIS.refresh_token = res.data.refresh_token;
              uni.setStorageSync('refresh_token', tHIS.refresh_token);
              uni.setStorageSync('userinfo', tHIS.username);
              uni.setStorageSync('notloggedin', false);
              console.log('login success set, notloggedin =',
                  uni.getStorageSync('notloggedin'));
              // console.log("userinfo:", uni.getStorageSync('userinfo'));
              await uni.showToast({
                title: 'log in successfully',
                duration: 2000,
              });
              // uni.reLaunch({
              // url: '../me/me'
              // });
              tHIS.loggingInProcessing = false;
              uni.navigateBack();
            } else {
              tHIS.valid = false;
              tHIS.error = res.data.error;
              uni.showToast({
                title: tHIS.error,
                duration: 2000,
              });
            }
          },
          fail: async (res) => {
            if (this.username.length <= 0) {
              uni.showToast({
                title: 'Cannot lah please enter valid username',
                duration: 2000,
              });
              return;
            } else if (this.password.length <= 0) {
              uni.showToast({
                title: 'forgot ur password meh',
                duration: 2000,
              });
              return;
            } else {
              const loginMethod = this.username.includes('@') ?
                    'email' :
                    'username';
              const url =
                    getApp().globalData.base_url +
                    '/auth/user/login?by=' +
                    loginMethod;
              await uni.request({
                url: url,
                data: {
                  email: tHIS.username,
                  username: tHIS.username,
                  password: tHIS.password,
                },
                method: 'POST',
                header: {
                  'content-type': 'application/json',
                },
                success: async (res) => {
                  console.log(tHIS.email);
                  if (res.data.success) {
                    tHIS.valid = true;
                    tHIS.refresh_token = res.data.refresh_token;
                    uni.setStorageSync('refresh_token', tHIS.refresh_token);
                    uni.setStorageSync('userinfo', tHIS.username);
                    uni.setStorageSync('notloggedin', false);
                    console.log('login success set, notloggedin =',
                        uni.getStorageSync('notloggedin'));
                    await uni.showToast({
                      title: 'log in successfully',
                      duration: 2000,
                    });

                    uni.navigateBack();
                  } else {
                    tHIS.valid = false;
                    tHIS.error = res.data.error;
                    uni.showToast({
                      title: tHIS.error,
                      duration: 2000,
                    });
                  }
                },
              });
            }
          },

        });
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
.inputArea {
    padding: 20upx 10%;
    border: 1px solid aquamarine;
    border-radius: 5rpx;
    margin: 5rpx;
}
</style>
