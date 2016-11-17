var app = angular.module("fluttr", []);

app.directive('listElement', function () {
    return {
        replace: true,
        templateUrl: "/directives/header.html",
        controller: ['$scope', '$filter', function ($scope, $filter) {

          $scope.NowPlaying = {
            "album_art": "http://i.imgur.com/li9ObQP.jpg",
            "title": "Spectra",
            "artist": "Chipzel"
          }

        }]
    }
});
