async function requestAcessToken(refreshToken) {
    var _str = '';
    await uni.request({
        url: 'http://homital.ml:2333/api/auth/user/token',
        data() {
            return {
                token: refreshToken
            }
        },
        method : 'POST',
        header: {
            'content-type' : 'application/json'
        },
        success: (res) => {
            if (res.data.success) {
                _str = res.data.access_token;
                getApp().globalData.access_token = _str;
            } else {
                _str = res.data.error;
            }
        }
    });
    return _str;
}

async function makeAuthenticatedCall(access_token, _url, _body, _method) {
    //first check if access_token has expired
    
    //if expired, generate again using -> requestAcessToken(getRefreshToken from local data storage)
    await unirequest({
        url : _url,
        data : _body,
        method : _method,
        header : {
            'Authorisation' : 'Bearer ' + access_token
        },
        success : (res) => {
            if (res.data.error.equals("token_verification_error")) {
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
                makeAuthenticatedCall(new_access, _url, _body, _method);
            }
        } 
    }); 


}

module.exports = {
    functions : {
        requestAcessToken : requestAcessToken,
        makeAuthenticatedCall : makeAuthenticatedCall
    }
}
