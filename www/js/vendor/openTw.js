/* -- Twitter START -- */

var openTW = (function () {

    var consumerKey = 'BN14oi6siiCwG2qXDgEcfXpI4';
    var consumerSecret = 'qsccXWEEQPtOKErQcGCsK22L0zhgHpKFRpOI0PhF749SuK8NWm';
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

        var options = {
            consumerKey: consumerKey,
            consumerSecret: consumerSecret,
            callbackUrl: "http://192.168.10.112:8383/HTML5Application/index.html",
        }

        options.accessTokenKey = userKey;
        options.accessTokenSecret = userSecret;

        console.log(options);
        
        oauth = OAuth(options);
        oauth.get('https://api.twitter.com/1.1/account/verify_credentials.json?skip_status=true');


    }
    function logout() {
        localStorage.userKey = '';
        localStorage.userSecret = '';
        userKey = '';
        userSecret = '';
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
        logout: logout,
        is_login: is_login
    }

}());

/* -- Twitter END -- */