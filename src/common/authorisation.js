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
                console.log('reached1');
                successful = true;
                _str = res.data.access_token;
                console.log("printing access token when first saved :" + _str);
                getApp().globalData.access_token = _str;
                var checktoken = getApp().globalData.access_token;
                console.log("printing again after saved : " + checktoken);
                callback(true);
                return;
            } else {
                console.log('reached2');
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
    console.log('printing access token before request: ' + access_token);

    await uni.request({
        url: _url,
        data: _body,
        method: _method,
        header: {
            'Authorization': 'Bearer ' + access_token
        },
        success: async (res) => {
            var suc = res.data.success;
            console.log("request sent suc : " + suc);

            if (res.data.success) {
                console.log("finally succeeded");
                callback(res.data);
            } else {
                console.log('checking whether get error');
                var err = res.data.error;
                console.log("ur error is : " + err);

                // if (!res.data.error || res.data.error.equals("token_verification_error")) {
                    //ok that means u didn't succeed for the first time

                    if (num >= 0) {
                        console.log("ok access token was not ok, let's try again");
                        await requestAcessToken(success => {
                            if (success) {
                                console.log("yayy access token gotten");
                            } else {
                                console.log("ohno howw")
                            }
                        });

                        await makeAuthenticatedCall(callback, _url, _body, _method, num - 1);
                    } else {
                        uni.showToast({
                            icon: 'none',
                            title: 'Your request cannot be processed',
                            duration: 2000
                        });
                    // }
                }
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
