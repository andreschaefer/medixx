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


function loadDrive(callback) {
    if (!gapi.client.drive) {
        gapi.client.load('drive', 'v2', callback);
    }
    else if (callback) {
        callback();
    }
}

var CONFIG = {
    clientId: '127208033176-radabdvn4rdphv46bm97eon9650ts7no.apps.googleusercontent.com',
    apiKey: 'AIzaSyBbfqpyqkA6r0h57DpdhBxyAbOOQwiq4Ls',
    scopes: [
        'https://www.googleapis.com/auth/drive.appfolder'
    ]
};

var app = {};
app.module = angular.module('Medixx', ['ngRoute']);

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

/**
 * Set up handlers for various authorization issues that may arise if the access token
 * is revoked or expired.
 */
app.module.run(['$rootScope', '$location', '$medics', function ($rootScope, $location, $medics) {
    // Error loading the document, likely due revoked access. Redirect back to home/install page
    $rootScope.$on('$routeChangeError', function () {
        $location.url('/install?target=' + encodeURIComponent($location.url()));
    });

    // Token expired, refresh
    $rootScope.$on('medixx.token_refresh_required', function () {
        $medics.requireAuth(true).then(function () {
            // no-op
        }, function () {
            $location.url('/install?target=' + encodeURIComponent($location.url()));
        });
    });

}]);

// called by google client script callback
function init() {
    $(document).ready(function () {
        angular.bootstrap(document, ['Medixx']);
    });
}
