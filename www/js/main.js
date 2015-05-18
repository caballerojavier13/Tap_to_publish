var url_back_end = "http://192.168.10.112:3000";

var url_front_end = "http://192.168.10.112:8383";

// Defaults to sessionStorage for storing the Facebook token
openFB.init({appId: '1572575729663760'});
openTW.init();
//  Uncomment the line below to store the Facebook token in localStorage instead of sessionStorage
//  openFB.init({appId: 'YOUR_FB_APP_ID', tokenStore: window.localStorage});



function loginFB() {
    openFB.login(
            function (response) {
                if (response.status === 'connected') {

                }
            }, {scope: 'email,publish_actions'});
}

function getInfo() {
    show_loading();
    if (openFB.is_login()) {
        openFB.api({
            path: '/me',
            success: function (data) {
                //console.log(JSON.stringify(data));
                $("#userName").html(data.first_name + ' ' + data.middle_name + '<br/>' + data.last_name);
                document.getElementById("userPic").src = 'http://graph.facebook.com/' + data.id + '/picture?type=small';
                hide_loading();
            },
            error: function (error) {
                hide_loading();
                errorHandler(error);
            }
        });
    } else {
        if (openTW.is_login()) {

        }
    }
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
function share() {
    shareFB();
    openTW.post();
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
                $("#alert").show();
                setTimeout(function () {
                    $("#alert").hide();
                }, 3000);

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
    //   alert(error.message);
}


$("#login_fb").on("click", function () {
    show_loading();
});

$("#login_tw").on("click", function () {
    show_loading();
    $.ajax({
        url: url_back_end + "/twitter/token",
        type: "GET"
    })
            .done(function (data) {
                if (data.token.token !== undefined) {
                    localStorage.userKey = data.token.token;
                    localStorage.userSecret = data.token.secret;
                    window.location.reload();
                }else{
                    console.log(data);
                }
                
                //window.location = "https://api.twitter.com/oauth/authenticate?oauth_token=" + data.token;
            })
            .fail(function (xhr, error, status) {
                hide_loading();
            })
            .always(function () {

            });
});

$("#logout_tw").on("click", function () {
    show_loading();
    localStorage.userKey = '';
    localStorage.userSecret = '';
    $("#login_tw").show();
    $("#logout_tw").hide();
    openTW.logout();
    if (openFB.is_login()) {
        getInfo();
        $("#login_fb").hide();
        $("#logout_fb").show();
    } else {
        $("#user").hide();
        $("#login_fb").show();
        $("#logout_fb").hide();
    }
    var login_some = (!(openFB.is_login())) && (!(openTW.is_login()));

    if (login_some) {
        $("#btn_to_home").hide();
    }
    hide_loading();

});

$("#userPic").on("click", function () {
    getLargePicture();
});

$("#viewer_userPic_large > input").on("click", function () {
    $("#viewer_userPic_large").hide();
});

$("#alert").on("click", function () {
    $("#alert").hide();
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

function fn_message() {
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
        $("#user").hide();
        $("#login_fb").show();
        $("#logout_fb").hide();
    }
    if (openTW.is_login()) {
        $("#login_tw").hide();
        $("#logout_tw").show();
    } else {
        $("#login_tw").show();
        $("#logout_tw").hide();
    }

    var login_some = (!(openFB.is_login())) && (!(openTW.is_login()));

    if (login_some) {
        $("#btn_to_home").hide();
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

    if (openFB.is_login() || openTW.is_login()) {
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

function control_To_Social() {

    if ($("#to_face").prop("checked")) {
        $("#to_face_label > img").attr("src", "img/icon_facebook.png");
    } else {
        $("#to_face_label > img").attr("src", "img/icon_facebook_gray.png");
    }

    if ($("#to_twitt").prop("checked")) {
        $("#to_twitt_label > img").attr("src", "img/icon_twitter.png");
        $("#Message").attr("maxlength", 140);
        if ($("#Message").val().length > 140) {
            $("#Message").val($("#Message").val().slice(0, 140));
        }
        fn_message();
        $("#length_msg").show();
    } else {
        $("#to_twitt_label > img").attr("src", "img/icon_twitter_gray.png");
        $("#Message").attr("maxlength", "");
        $("#length_msg").hide();
    }
}


