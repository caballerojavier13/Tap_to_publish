 var deviceReadyDeferred = $.Deferred();
 var jqmReadyDeferred = $.Deferred();
 var resourcesReady = false;

var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        if(navigator.userAgent.match(/\b[0-9]+_[0-9]+(?:_[0-9]+)?\b/)){
            
        }
        //load scripts
        if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/)) {
            
            alert(navigator.userAgent);
            $LAB.script("cordova.js").wait(
                function(){
                    document.addEventListener('deviceready', this.onDeviceReady, false);
              //      
                }
            );
        }else{
            aler(navigator.userAgent);
            var _this = this;
            setTimeout(function(){
                _this.onDeviceReady(); 
            }, 1);
        }
        $.when(deviceReadyDeferred, jqmReadyDeferred).then(this.doWhenBothFrameworksReady);
    },

    // deviceready Event Handler
    onDeviceReady: function() {
        deviceReadyDeferred.resolve();
    },

    doWhenBothFrameworksReady: function(){
        resourcesReady = true;
    }
};

$(document).one("mobileinit", function () {
    $.support.cors = true;
    $.mobile.allowCrossDomainPages = true;
    $.mobile.phonegapNavigationEnabled = true;
    jqmReadyDeferred.resolve();
 });



function PageShowFunction(e){
    // we are sure that both frameworks are ready here
    alert("Hola");
}

function CallPageEvent(funcToCall,e){
    if(resourcesReady){
        return funcToCall(e);
    }else{
        setTimeout(function() { 
            CallPageEvent(funcToCall,e);
        }, 200);
    }
}

app.initialize();

