$(document).on("pagecreate", function () {
    fix_visual_io7();
});
$(function () {
    $(document).delegate("#home", "pageshow", function () {
        fix_visual_io7();
    });
    $(document).delegate("#config", "pageshow", function () {
        fix_visual_io7();
    });
});

function fix_visual_io7() {
    if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/)) {
        if (navigator.userAgent.match(/(iPhone|iPod|iPad)/)) {
            if (navigator.userAgent.match(/\b[0-9]+_[0-9]+(?:_[0-9]+)?\b/)[0].split('_')[0] > 6) {
                $(".ios-status-bar").show();
                $(".ui-header").css("padding-top", "26px");
                if(some_login()){
                //if ($(".btn-head").is(":visible")) {
                    $(".btn-head").css("position", "relative");
                    $(".ui-header > h3").css("position", "relative");
                    $(".ui-header > h3").css("margin-top", "-22px");
                }
            } else {
                $(".ios-status-bar").hide();
            }
        } else {
            $(".ios-status-bar").hide();
        }
    } else {
        $(".ios-status-bar").hide();
    }
}

//var url_back_end = "http://192.168.10.112:3000";

var url_back_end = "https://tap-to-publish-back-end.herokuapp.com";

var url_front_end = "http://192.168.10.112:8383";

// Defaults to sessionStorage for storing the Facebook token
openFB.init({appId: '1572575729663760'});
//  Uncomment the line below to store the Facebook token in localStorage instead of sessionStorage
//openFB.init({appId: '1572575729663760', tokenStore: window.localStorage});

openTW.init();

function getInfo() {
    if (openFB.is_login()) {
        show_loading();
        openFB.api({
            path: '/me',
            success: function (data) {
                $("#userName").html(data.first_name + ' ' + data.middle_name + '<br/>' + data.last_name);
                document.getElementById("userPic").src = 'http://graph.facebook.com/' + data.id + '/picture?type=small';
                hide_loading();
            },
            error: function (error) {
                hide_loading();
            }
        });
    } else {
        if (openTW.is_login()) {
            show_loading();
            $.get(url_back_end + "/twitter/get_info_user?con_key=" + localStorage.consumerKey + "&con_secret=" + localStorage.consumerSecret + "&userKey=" + localStorage.userKey + "&userSecret=" + localStorage.userSecret, {})
                    .done(function (data) {
                        if (data.errors !== undefined) {
                            if (data.errors[0].code == 89) {
                                openTW.logout();
                            } else {
                                openTW.logout();
                            }
                        } else {
                            $("#userName").html(data[0].user.name);
                            document.getElementById("userPic").src = data[0].user.profile_image_url;
                            hide_loading();
                        }
                    })
                    .fail(function (xhr, error, status) {
                        hide_loading();
                    });
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
    var message = $("#Message").val();

    if (message !== "") {
        if ($("#to_twitt").prop("checked")) {
            openTW.post(message);
        }
        if ($("#to_face").prop("checked")) {
            shareFB(message);
        }
        $("#Message").val("");
        fn_message();
        $("#btn_Message").prop("disabled", true);

    }

}



function fn_message() {
    $("#length_msg").text(140 - parseInt($("#Message").val().length));
    if ($("#Message").val().length > 0) {
        $("#btn_Message").prop("disabled", false);
    } else {
        $("#btn_Message").prop("disabled", true);
    }
}


$(function () {
    getInfo();
    if (openFB.is_login()) {
        $("#login_fb").hide();
        $("#logout_fb").show();
    } else {
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


var pages = ['home', 'config'];
$(function () {

    $(document).on("swiperight", function () {
        $.mobile.changePage('#config', {
            'transition': 'slide',
            'reverse': true
        });
    });

    if ((openFB.is_login()) || (openTW.is_login())) {
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


$("#login_fb").on("click", function () {
    show_loading();
    loginFB();
});
$("#logout_fb").on("click", function () {
    show_loading();
    logoutFB();
});
$("#login_tw").on("click", function () {
    show_loading();
    $.ajax({
        url: url_back_end + "/twitter/token?callback=" + window.location,
        type: "GET",
    }).done(function (data) {
        console.log(data);
        localStorage.userKey = data.token;
        localStorage.userSecret = data.secret;
        window.location = data.url;
    }).fail(function (xhr, error, status) {
        hide_loading();
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

    if ((!openFB.is_login()) || (!openTW.is_login())) {
        $("#btn_to_home").hide();
    }
    hide_loading();

});

$("#userPic").on("click", function () {
    if (openFB.is_login()) {
        getLargePicture();
    }
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

$.urlParam = function (name) {
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results == null) {
        return null;
    }
    else {
        return results[1] || 0;
    }
}

function errorHandler(error) {

}

function show_loading() {
    $("#loading").show();
    $.mobile.loading('show', {
        text: 'Loading',
        textVisible: true,
        theme: 'b',
        textonly: false
    });
}

function hide_loading() {
    $("#loading").hide();
    $.mobile.loading('hide');
}

function some_login(){
    if(openFB.is_login() || openTW.is_login()){
        return true;
    }else{
        return false;
    }
}