// Defaults to sessionStorage for storing the Facebook token
openFB.init({appId: '221467778006567'});

//  Uncomment the line below to store the Facebook token in localStorage instead of sessionStorage
//  openFB.init({appId: 'YOUR_FB_APP_ID', tokenStore: window.localStorage});

function login() {
    openFB.login(
            function (response) {
                if (response.status === 'connected') {

                } else {
                    alert('Facebook login failed: ' + response.error);
                }
            }, {scope: 'email,read_stream,publish_stream'});
}

function getInfo() {
    show_loading();
    openFB.api({
        path: '/me',
        success: function (data) {
            console.log(JSON.stringify(data));
            $("#userName").html(data.first_name + ' ' + data.middle_name + '<br/>' + data.last_name );
            document.getElementById("userPic").src = 'http://graph.facebook.com/' + data.id + '/picture?type=small';
            hide_loading();
        },
        error: function(error){
            hide_loading();
            errorHandler(error);
        }
    });
}
function getLargePicture() {
    show_loading();
    $("#viewer_userPic_large").show();
    openFB.api({
        path: '/me',
        success: function (data) {
            document.getElementById("userPic_large").src = 'http://graph.facebook.com/' + data.id + '/picture?type=large';
            hide_loading();
        },
        error: function(error){
            hide_loading();
            errorHandler(error);
        }
    });
}
function share() {
    show_loading();
    openFB.api({
        method: 'POST',
        path: '/me/feed',
        params: {
            message: document.getElementById('Message').value || 'Testing Facebook APIs'
        },
        success: function () {
            alert('the item was posted on Facebook');
            hide_loading();            
        },
        error: function(error){
            hide_loading();
            errorHandler(error);
        }
    });
}

function revoke() {
    openFB.revokePermissions(
            function () {
                alert('Permissions revoked');
            },
            errorHandler);
}

function logout() {
    openFB.logout(
            function () {
                alert('Logout successful');
            },
            errorHandler);
}

function errorHandler(error) {
    alert(error.message);
}


$("#login_fb").on("click", function () {
    show_loading();
});

$("#userPic").on("click",function(){
     getLargePicture();
});

$("#viewer_userPic_large > input").on("click",function(){
     $("#viewer_userPic_large").hide();
     
});

$(function () {
    if(openFB.is_login()){
        getInfo();
        $("#login_fb").hide();
        $("#logout_fb").show();
    }else{
        $("#user").hide();
        $("#login_fb").show();
        $("#logout_fb").hide();
    }
    
});


$.urlParam = function (name) {
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results == null) {
        return null;
    }
    else {
        return results[1] || 0;
    }
}

function show_loading(){
    $.mobile.loading('show', {
        text: 'Cargando',
        textVisible: true,
        theme: 'b',
        textonly: false
    });
}

function hide_loading(){
    $.mobile.loading('hide');
}
