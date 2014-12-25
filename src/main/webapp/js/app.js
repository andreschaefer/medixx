'use strict';
function log() {
    if (console && console.log) {
        console.log.apply(console.log, arguments);
    }
}

var CONFIG = {
    clientId: '127208033176-radabdvn4rdphv46bm97eon9650ts7no.apps.googleusercontent.com',
    apiKey: 'AIzaSyBbfqpyqkA6r0h57DpdhBxyAbOOQwiq4Ls',
    scopes: [
        'https://www.googleapis.com/auth/drive.appfolder'
    ]
};

var STATUS = {
    offline: "offline",
    online: "online",
    uploading: "upload",
    downloading: "download",
    synced: "sync"
}

var app = {};
app.module = angular.module('Medixx', ['ngRoute', 'ngTouch']);

/**
 * Initialize our application routes
 */
app.module.config(['$routeProvider',
        function ($routeProvider) {
            $routeProvider
                .when('/list', {
                    templateUrl: 'views/list.html',
                    controller: 'ListCtrl'
                })
                .when('/detail/:medicId', {
                    templateUrl: 'views/detail.html',
                    controller: 'DetailCtrl'
                })
                .when('/edit/:medicId', {
                    templateUrl: 'views/edit.html',
                    controller: 'EditCtrl'
                })
                .when('/settings', {
                    templateUrl: 'views/settings.html',
                    controller: 'SettingsCtrl'
                })
                .otherwise({
                    redirectTo: '/list'
                });
        }]
);

app.module.value('config', CONFIG);

function init() {
    $(document).ready(function () {
        log('medixx-version', $('meta[name="medixx-version"]').attr('content'));
        angular.bootstrap(document, ['Medixx']);
    });
}

// called by google client script callback
$(document).ready(function () {
    $.ajaxSetup({
        cache: true
    });
    $.getScript("https://apis.google.com/js/client.js?onload=init", function () {
        console.log("Loaded gapi script")
    })
        .fail(function (script, textStatus) {
            log("Failed to load gapi")
            init();
        });
    $.ajaxSetup({
        cache: false
    });
});
