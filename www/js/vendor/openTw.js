/* -- Twitter START -- */

var openTW = (function () {

    var consumerKey = 'dWLNF5yv9bVbZxB7TI87aLjTO';
    var consumerSecret = 'sUIGOsHZXzcjd0NROvWbH82xrkziU0v4BQlyx18kO3HZxeG8Xx';
    var userKey = '';
    var userSecret = '';


    function init() {
        console.log(localStorage.userKey);
        if (localStorage.userKey !== undefined) {
            userKey = localStorage.userKey;
        }
        console.log(localStorage.userSecret);
        if (localStorage.userSecret !== undefined) {
            userSecret = localStorage.userSecret;
        }

        if (window.location.href.indexOf("oauth_token=") > 0) {
            userKey = new RegExp('[\?&]oauth_token=([^&#]*)').exec(window.location.href)[1];
            userSecret = new RegExp('[\?&]oauth_verifier=([^&#]*)').exec(window.location.href)[1];
            localStorage.userKey = userKey;
            localStorage.userSecret = userSecret;
        }
        //window.opener.openFB.oauthCallback(window.location.href);

    }
    /*
     Now that we have the information we can Tweet!
     */
    function post() {
        var theTweet = $("#tweet").val(); // Change this out for what ever you want!
        alert("Twitt publicado");
//        oauth.post('https://api.twitter.com/1/statuses/update.json',
//            { 'status' : theTweet,  // jsOAuth encodes for us
//            'trim_user' : 'true' },
//            function(data) {
//                var entry = JSON.parse(data.text);
//                alert(entry);
//
//                // FOR THE EXAMPLE
//                app.done();
//            },
//            function(data) { 
//                alert(data);
//            }
//        ); 
    }
    function is_login() {
        if (localStorage.userKey !== undefined) {
            userKey = localStorage.userKey;
        }
        if (localStorage.userSecret !== undefined) {
            userSecret = localStorage.userSecret;
        }
        if (userKey.length > 0) {
            return true;
        } else {
            return false;
        }
    }
    // The public API
    return {
        init: init,
        post: post,
        is_login: is_login
    }

}());

/* -- Twitter END -- */