'use strict';

angular.module('busApp')
  .controller('MainCtrl', function ($scope, $interval, translinkAPIservice, localStorageService) {
    $scope.response = [];

    /*localStorageService.set('routes', [{stop: '53714', number: '159'}, {stop: '50268', number: '099'}]);*/

    $scope.addRoute = function (stopid, routeid) {

      // 0 padding to make the API happy
      if (routeid.length < 3) {
        var first = routeid.charAt(0).toLowerCase();
        if (first != 'c' && first != 'n') {
          switch (routeid.length) {
            case 1:
              routeid = '00' + routeid;
              break;
            case 2:
              routeid = '0' + routeid;
              break;
          }
        }
      }

      var currentRoutes = localStorageService.get('routes');

      if (currentRoutes === null) {
        currentRoutes = [];
      }

      // check if route already exists
      var containsDuplicates = false;

      if (currentRoutes.length > 0) {
        for (var i = 0; i < currentRoutes.length; i++) {
          if (currentRoutes[i].stop === stopid && currentRoutes[i].number === routeid) {
            containsDuplicates = true;
            break;
          }
        }
      }

      // get stop info and add
      if (!containsDuplicates) {
        translinkAPIservice.getStopInfo(stopid)
          .success(function(response) {
            if (!response.Code) {
              currentRoutes.push({stop: stopid.toString(), number: routeid.toString(), name: response.Name});
              localStorageService.set('routes', currentRoutes);
              $scope.updateEstimates();
            }
          });
      }
    };

    $scope.updateEstimates = function() {
      var routes = localStorageService.get('routes');
      routes.forEach(function(route) {
          delete route.response;
        });

      console.log(routes);

      $scope.response = routes;
      if (routes !== null) {
        $scope.response.forEach(function (route) {
          translinkAPIservice.getRouteEstimates(route.stop, route.number)
            .success(function(response) {
              if (response instanceof Array) {
                route.response = response[0];
                if (route.response.Schedules[0].ExpectedCountdown < 0) {
                  route.response.Schedules[0].ExpectedCountdown = 0;
                }
              } else {
                route.response = response;
              }
            });
        });
      }
      $scope.lastUpdated = new Date();
    };

    $scope.removeRoute = function(index) {
      $scope.response.splice(index, 1);
      localStorageService.set('routes', $scope.response);
    };

    $scope.updateEstimates();

    $interval(function() {
      $scope.updateEstimates();
    }, 60000);


    $scope.sortableOptions = {
      tolerance: 'intersect',
      stop: function() {
        localStorageService.set('routes', $scope.response);
      },
      axis: 'x'
    };


  });
