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
        console.log.apply(null, arguments);
    }
}

var CONFIG = {
    clientId: '71271216619-n8fq9kt68jr92jb12g2svjkatm57guac.apps.googleusercontent.com',
    apiKey: 'zDQHFqq9aZXmchMt1q13s1qR',
    scopes: [
        'https://www.googleapis.com/auth/drive.appfolder'
    ],
    gapiAuthBaseUrl: 'https://accounts.google.com/o/oauth2/auth?response_type=code&',
    returnTo: location.origin ?  location.origin : (location.protocol + "//" + location.host),
    isStandalone: window.navigator.standalone // true // window.navigator.standalone
};

var STATUS = {
    offline: "offline",
    unauthenticated: "unauthenticated",
    online: "online",
    uploading: "upload",
    downloading: "download",
    synced: "sync"
};

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
                .when('/history', {
                    templateUrl: 'views/history.html',
                    controller: 'HistoryCtrl'
                })
                .otherwise({
                    redirectTo: '/list'
                });
        }]
);

app.module.value('config', CONFIG);

Offline.options = {
    checkOnLoad: false,
    interceptRequests: false,
    reconnect: false,
    requests: false,
    checks: {xhr: {url: '/'}},
    game: false
};

var gapiReady = false;
function confirmGapi() {
    log("Loaded gapi script: typeof gapi", typeof gapi);
    log("Loaded gapi script: typeof gapi.load", typeof gapi.load);
    gapiReady = true;
    app.gapiCallback();
}

app.gapiCallback = function () {
};

function loadGapi() {
    $.ajaxSetup({
        cache: true
    });
    $.getScript("https://apis.google.com/js/client.js?onload=confirmGapi");
    $.ajaxSetup({
        cache: false
    });
}
loadGapi();
app.version = "unknown";
$(document).ready(function () {
    app.version = $('meta[name="medixx-version"]').attr('content');
    app.build = $('meta[name="medixx-build"]').attr('content');
    log('medixx-version', app.version, app.build);
    angular.bootstrap(document, ['Medixx']);
});
