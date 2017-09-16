
var url='https://open.weixin.qq.com/connect/oauth2/authorize?'+
    'appid='+window.urlObject.appid+
    '&redirect_uri='+window.urlObject.redirectUrl+
    '&response_type=code&scope=snsapi_userinfo'+
    '&state=STATE#wechat_redirect';
//console.log(url);
//url=window.urlObject.ctrl+'/home';
window.location.href=url;