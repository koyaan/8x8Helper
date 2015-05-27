'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('eightbyeightHelper').
  value('version', 'v0.9');

angular.module('eightbyeightHelper').
  filter('interpolate', ['version', function(version) {
    return function(text) {
      return String(text).replace(/\%VERSION\%/mg, version);
    }
  }]);