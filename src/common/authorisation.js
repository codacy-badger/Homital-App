function requestAcessToken(callback) {
    requestAcessTokenwrapped(callback, 1);
}

async function requestAcessTokenwrapped(callback, num) {
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
            console.log("failed to get access token in 1 attempt, let's try again");
            if (num > 0) {
                requestAcessTokenwrapped(callback, num - 1);
            } else {
                callback(false);
            }
            return;
        }
    });
    return successful;
}

async function makeAuthenticatedCall(callback, _url, _body, _method, num) {
    var access_token = await getApp().globalData.access_token;
    console.log('printing access token before request: ' + access_token);

    uni.request({
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

                if (num > 0) {
                    console.log("ok access token was not ok, let's try again");
                    await requestAcessToken(async success => {
                        if (success) {
                            console.log("yayy access token gotten");
                            makeAuthenticatedCall(callback, _url, _body, _method, num - 1);
                        } else {
                            await uni.showToast({
                                icon: 'none',
                                title: 'Your token has already expired. Please log in again.',
                                duration: 2000
                            });
                            uni.setStorageSync("notloggedin", true);
					        uni.removeStorageSync("refresh_token");
					        uni.removeStorageSync("userinfo");
                            callback({success : false, power : undefined});
                            console.log("ohno howw")
                        }
                    });
                } else {
                    uni.showToast({
                        icon: 'none',
                        title: 'Your request cannot be processed',
                        duration: 2000
                    });
                }
            }
        },
        fail: async (res) => {
            console.log("failed to get light status");
            console.log("may have gotten empty response, let's retry");
            var new_access_token = await getApp().globalData.access_token;
            await uni.request({
                url: _url,
                data: _body,
                method: _method,
                header: {
                    'Authorization': 'Bearer ' + new_access_token
                },
                success: async (res) => {
                    var suc = res.data.success;
                    console.log("request sent suc : " + suc);

                    if (res.data.success) {
                        console.log("finally succeeded");
                        callback(res.data);
                    } else {
                        console.log("reached but res.data.success = false :(");
                    }
                },
                fail: (res) => {
                    console.log("why second time still fail, hopeless alr");
                }
            });
        }
    });
}

module.exports = {
    functions: {
        requestAcessToken: requestAcessToken,
        makeAuthenticatedCall: makeAuthenticatedCall
    }
}
