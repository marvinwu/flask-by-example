(function () {

  'use strict';

  angular.module('WordcountApp', [])

  .controller('WordcountController', ['$scope', '$log', '$http', '$timeout', 'callAPIService',
    function($scope, $log, $http, $timeout, callAPIService) {
      $scope.getResults = function() {

        $log.log("test")

        // get the URL from the input
        var userInput = $scope.input_url

        // fire the request
        callAPIService.response('post', '/start', {"url": userInput})
          .success(function(results) {
            $log.log(results)
            getWordCount(results)

          }).
          error(function(error) {
            $log.log(error)
          });

        // the poller functionality
        function getWordCount(jobID) {
          var timeout = ""

          var poller = function() {
            // fire another request
            callAPIService.response('get', '/results/'+jobID, null)
              .success(function(data, status, headers, config) {
                if(status === 202) {
                  $log.log(data, status)
                } else if (status === 200){
                  $log.log(data)
                  $scope.wordcounts = data;
                  $timeout.cancel(timeout);
                  return false;
                }
                // continue to call the poller() function every 2 seconds
                // until the timout is cancelled
                timeout = $timeout(poller, 2000);
              });
          };
          poller();
        }

      }
    }

  ])

  .factory('callAPIService', ['$http', function($http) {

    var request = function(requestMethod, endpoint, payload) {
      if (requestMethod === 'post') {
        return $http.post(endpoint, payload);
      } else if (requestMethod === 'get') {
        return $http.get(endpoint)
      };
    }
    return {
      response: function(requestMethod, endpoint, payload)
        { return request(requestMethod, endpoint, payload, 'response'); },
    };
  }]);

}());