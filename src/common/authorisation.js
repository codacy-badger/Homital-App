/**
 * wrapper for requiring access token
 * @param {*} callback callback
 */
function requestAcessToken(callback) {
  requestAcessTokenwrapped(callback, 1);
}

/**
 * requiring access token
 * @param {*} callback callback
 * @param {*} num num of times
 */
async function requestAcessTokenwrapped(callback, num) {
  let _str = '';
  let successful = false;
  await uni.request({
    url: 'https://homital.ml:2333/api/auth/user/token',
    data: {
      token: uni.getStorageSync('refresh_token'),
    },
    method: 'POST',
    header: {
      'content-type': 'application/json',
    },
    success: (res) => {
      if (res.data.success) {
        console.log('reached1');
        successful = true;
        _str = res.data.accessToken;
        console.log('printing access token when first saved :' + _str);
        getApp().globalData.accessToken = _str;
        const checktoken = getApp().globalData.accessToken;
        console.log('printing again after saved : ' + checktoken);
        callback(true);
        return;
      } else {
        console.log('reached2');
        console.log('res: ', res.data);
        _str = res.data.error;
        callback(false);
        return;
      }
    },
    fail: (res) => {
      console.log('failed to get access token in 1 attempt, let\'s try again');
      if (num > 0) {
        requestAcessTokenwrapped(callback, num - 1);
      } else {
        callback(false);
      }
      return;
    },
  });
  return successful;
}

/**
 * make authenticated call
 * @param {*} callback callback
 * @param {*} _url request url
 * @param {*} _body request body
 * @param {*} _method request method
 * @param {*} num num of times
 */
async function makeAuthenticatedCall(callback, _url, _body, _method, num) {
  const accessToken = await getApp().globalData.accessToken;
  console.log('printing access token before request: ' + accessToken);

  uni.request({
    url: _url,
    data: _body,
    method: _method,
    header: {
      'Authorization': 'Bearer ' + accessToken,
    },
    success: async (res) => {
      const suc = res.data.success;
      console.log('request sent suc : ' + suc);

      if (res.data.success) {
        console.log('finally succeeded');
        callback(res.data);
      } else {
        const err = res.data.error;
        console.log('ur error is : ' + err);

        if (num > 0) {
          console.log('ok access token was not ok, let\'s try again');
          await requestAcessToken(async (success) => {
            if (success) {
              console.log('yayy access token gotten');
              makeAuthenticatedCall(callback, _url, _body, _method, num - 1);
            } else {
              await uni.showToast({
                icon: 'none',
                title: 'Your token has already expired. Please log in again.',
                duration: 2000,
              });
              uni.setStorageSync('notloggedin', true);
              uni.removeStorageSync('refresh_token');
              uni.removeStorageSync('userinfo');
              callback({success: false, power: undefined});
              console.log('ohno howw');
            }
          });
        } else {
          uni.showToast({
            icon: 'none',
            title: 'Your request cannot be processed',
            duration: 2000,
          });
        }
      }
    },
    fail: async (res) => {
      console.log('failed to get light status');
      console.log('may have gotten empty response, let\'s retry');
      const newAccessToken = await getApp().globalData.accessToken;
      await uni.request({
        url: _url,
        data: _body,
        method: _method,
        header: {
          'Authorization': 'Bearer ' + newAccessToken,
        },
        success: async (res) => {
          const suc = res.data.success;
          console.log('request sent suc : ' + suc);

          if (res.data.success) {
            console.log('finally succeeded');
            callback(res.data);
          } else {
            console.log('reached but res.data.success = false :(');
          }
        },
        fail: (res) => {
          console.log('why second time still fail, hopeless alr');
        },
      });
    },
  });
}

module.exports = {
  functions: {
    requestAcessToken: requestAcessToken,
    makeAuthenticatedCall: makeAuthenticatedCall,
  },
};
