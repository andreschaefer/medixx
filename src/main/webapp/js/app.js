/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';
function log() {
    if (console && console.log) {
        console.log(arguments);
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
        var version = $('meta[name="medixx-version"]').attr('content');
        log('medixx-version', version);
        angular.bootstrap(document, ['Medixx']);
    });
}

// called by google client script callback
$(document).ready(function () {
    $.ajaxSetup({
        cache: true
    });
    $.getScript("https://apis.google.com/js/client.js?onload=init", function () {
        log("Loaded gapi script")
    })
        .fail(function (script, textStatus) {
            log("Failed to load gapi")
            init();
        });
    $.ajaxSetup({
        cache: false
    });
});
