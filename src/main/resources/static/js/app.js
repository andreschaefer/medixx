'use strict';

function log() {
	if (console && console.log) {
		console.log.apply(null, arguments);
	}
}

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
app.module.value('config', {});

Offline.options = {
	checkOnLoad: false,
	interceptRequests: false,
	reconnect: false,
	requests: false,
	checks: {xhr: {url: '/'}},
	game: false
};

app.version = "unknown";
$(document).ready(function () {
	app.version = $('meta[name="medixx-version"]').attr('content');
	app.build = $('meta[name="medixx-build"]').attr('content');
	log('medixx-version', app.version, app.build);
	angular.bootstrap(document, ['Medixx']);
	$.ajaxSetup({
		withCredentials: true
	})
});
