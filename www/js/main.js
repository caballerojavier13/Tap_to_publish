// Defaults to sessionStorage for storing the Facebook token
openFB.init({appId: '1572575729663760'});

//  Uncomment the line below to store the Facebook token in localStorage instead of sessionStorage
//  openFB.init({appId: 'YOUR_FB_APP_ID', tokenStore: window.localStorage});



function loginFB() {
    openFB.login(
            function (response) {
                if (response.status === 'connected') {

                } else {
                    alert('Facebook login failed: ' + response.error);
                }
            }, {scope: 'email,publish_actions'});
}

function getInfo() {
    show_loading();
    openFB.api({
        path: '/me',
        success: function (data) {
            console.log(JSON.stringify(data));
            $("#userName").html(data.first_name + ' ' + data.middle_name + '<br/>' + data.last_name);
            document.getElementById("userPic").src = 'http://graph.facebook.com/' + data.id + '/picture?type=small';
            hide_loading();
        },
        error: function (error) {
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
        error: function (error) {
            hide_loading();
            errorHandler(error);
        }
    });
}
function share(){
    shareFB();
}
function shareFB() {
    if ($("#to_face").prop("checked") && document.getElementById('Message').value !== "") {
        show_loading();
        openFB.api({
            method: 'POST',
            path: '/me/feed',
            params: {
                message: document.getElementById('Message').value
            },
            success: function () {
                $("#Message").val("");
                hide_loading();
            },
            error: function (error) {
                hide_loading();
                errorHandler(error);
            }
        });
    }
}

function revoke() {
    openFB.revokePermissions(
            function () {
                alert('Permissions revoked');
            },
            errorHandler);
}

function logoutFB() {
    openFB.logout(
            function () {
                if (openFB.is_login()) {
                    getInfo();
                    $("#login_fb").hide();
                    $("#logout_fb").show();
                } else {
                    $("#user").hide();
                    $("#login_fb").show();
                    $("#logout_fb").hide();
                }
            },
            errorHandler);
}

function errorHandler(error) {

    console.log(error.menssage);
    alert(error.message);
}


$("#login_fb").on("click", function () {
    show_loading();
});

$("#userPic").on("click", function () {
    getLargePicture();
});

$("#viewer_userPic_large > input").on("click", function () {
    $("#viewer_userPic_large").hide();
});

$("#Message").on("keyup", function () {
    fn_message();
});

$("#Message").on("change", function () {
    fn_message();
});

$("#Message").on("paste", function () {
    fn_message();
});

$("#Message").on("cut", function () {
    fn_message();
});

function fn_message(){
    $("#length_msg").text(254 - parseInt($("#Message").val().length));
    if ($("#Message").val().length > 0) {
        $("#btn_Message").prop("disabled", false);
    } else {
        $("#btn_Message").prop("disabled", true);
    }
}


$(function () {
    if (openFB.is_login()) {
        getInfo();
        $("#login_fb").hide();
        $("#logout_fb").show();
    } else {
        $("#btn_to_home").hide();
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

function show_loading() {
    $.mobile.loading('show', {
        text: 'Loading',
        textVisible: true,
        theme: 'b',
        textonly: false
    });
}

function hide_loading() {
    $.mobile.loading('hide');
}


var pages = ['home', 'config'];
$(document).on('pageinit', '#home', function () {

    $(document).on("swiperight", function () {
        $.mobile.changePage('#config', {
            'transition': 'slide',
            'reverse': true
        });
    });
    if (openFB.is_login()) {
        $(document).on("swipeleft", function () {
            $.mobile.changePage('#home', {
                'transition': 'slide'
            });
        });
    } else {
        $.mobile.changePage('#config');
    }

});


$(function () {
    control_To_Social();
    $(".my_check").on("click", function () {
        control_To_Social();
    });
});

function control_To_Social(){
    
    if($("#to_face").prop("checked")){
       $("#to_face_label > img").attr("src", "img/icon_facebook.png");
    }else{
        $("#to_face_label > img").attr("src","img/icon_facebook_gray.png"); 
    }
    
    if($("#to_twitt").prop("checked")){
       $("#to_twitt_label > img").attr("src","img/icon_twitter.png"); 
       $("#Message").attr("maxlength", 254);
       if($("#Message").val().length > 254){
          $("#Message").val($("#Message").val().slice(0,254)); 
       }
       fn_message();
       $("#length_msg").show();
    }else{
        $("#to_twitt_label > img").attr("src","img/icon_twitter_gray.png"); 
        $("#Message").attr("maxlength", "");
        $("#length_msg").hide();
    }
}