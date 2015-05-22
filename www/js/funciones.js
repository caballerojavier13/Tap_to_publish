
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