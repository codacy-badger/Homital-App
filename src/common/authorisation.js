async function requestAcessToken(callback) {
    var _str = '';
    var successful = false;
    await uni.request({
        url: 'https://homital.ml:2333/api/auth/user/token',
        data: {
            token: uni.getStorageSync("refresh_token")
        },
        method: 'POST',
        header: {
            'content-type': 'application/json'
        },
        success: (res) => {
            console.log('in rat.succ');
            if (res.data.success) {
                successful = true;
                _str = res.data.access_token;
                getApp().globalData.access_token = _str;
                callback(true);
                return;
            } else {
                console.log("res: ", res.data)
                _str = res.data.error;
                callback(false);
                return;
            }
        },
        fail: (res) => {
            callback(false);
            return;
        }
    });
    return successful;
}

async function makeAuthenticatedCall(callback, _url, _body, _method, num) {
    //first check if access_token has expired

    //if expired, generate again using -> requestAcessToken(getRefreshToken from local data storage)
    var access_token = getApp().globalData.access_token;


    await uni.request({
        url: _url,
        data: _body,
        method: _method,
        header: {
            'Authorisation': 'Bearer ' + access_token
        },
        success: (res) => {
            if (res.data.error && res.data.error.equals("token_verification_error")) {
                var get_refresh = '';
                uni.getStorage({
                    key: 'refresh_token',
                    success: function (res) {
                        console.log(res.data);
                        get_refresh = res.data;
                    }
                });
                var new_access = requestAcessToken(get_refresh);
                getApp().globalData.access_token = new_access;
                if (num >= 0) {
                    makeAuthenticatedCall(callback, num - 1);
                } else {
                    uni.showToast({
                        icon: 'none',
                        title: 'Your request cannot be processed',
                        duration: 2000
                    });
                }
            } else {
                callback(res.data);
            }
        }
    });


}

module.exports = {
    functions: {
        requestAcessToken: requestAcessToken,
        makeAuthenticatedCall: makeAuthenticatedCall
    }
}
