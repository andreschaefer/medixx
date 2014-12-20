'use strict';

/* Filters */

angular.module('medixxFilters', []).filter('checkmark', function() {
  return function(input) {
    return input ? '\u2713' : '\u2718';
  };
});
