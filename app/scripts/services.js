'use strict';

angular.module('busApp.services', [])
  .factory('translinkAPIservice', function($http) {
    var apiURL = 'http://simplebus.herokuapp.com';

    var translinkAPI = {};

    translinkAPI.getStopEstimates = function(stopid) {
      return $http({
        method: 'GET',
        url: apiURL + '/api/estimate/' + stopid
      });
    };

    translinkAPI.getRouteEstimates = function(stopid, routeid) {
      return $http({
        method: 'GET',
        url: apiURL + '/api/estimate/' + stopid + '/' + routeid
      });
    };

    translinkAPI.getStopInfo = function(stopid) {
      return $http({
        method: 'GET',
        url: apiURL + '/api/stop/' + stopid
      });
    };

    translinkAPI.getStopRouteInfo = function(stopid, routeid) {
      return $http({
        method: 'GET',
        url: apiURL + '/api/stop/' + stopid + '/' + routeid
      });
    };

    return translinkAPI;
  });