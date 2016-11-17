var app = angular.module("fluttr", []);

app.controller('fluttrCtrl', function ($rootScope, $scope, $http) {

  setInterval(function(){
    if($rootScope.playlistURI && $rootScope.hasLocation)
    {
      $rootScope.updateCurrent();
      $rootScope.updateVotes();
    }
  }, 20000)

    /* ---- LOCATION ---- */
    $scope.hasCoordinates = false;
    $scope.coordinates = {
      "longitude": "0",
      "latitude": "0"
    };
    $scope.possibleLocations = [];
    $rootScope.hasLocations = false;
    $rootScope.hasLocation = false;
    $scope.locationID = "";
    $rootScope.playlistURI = "";
    $rootScope.playlistData = null;
    $rootScope.votedFor = [];

    /* ---- QUEUE ---- */
    $rootScope.searching = false;
    $rootScope.NowPlaying = {
      "albumArt": "http://i.imgur.com/li9ObQP.jpg",
      "title": "Spectra",
      "artist": "Chipzel",
      "songPercent": 58
    }
    $rootScope.queue = [];

    if(!$scope.hasCoordinates)
      GetLocation();

    $rootScope.updateVotes = function () {
      $http({
        method: 'GET',
        url: 'https://puddlplayer.appspot.com/api/locations/update?playlist_uri='+$rootScope.playlistURI
      }).then(function successCallback(queueData) {
        console.log(queueData);

        for(var songIndex in queueData.data.indexes)
        {
          var votedFor = false;
          if($rootScope.votedFor.includes(queueData.data.indexes[songIndex]) && queueData.data.likes[songIndex] > 0)
            votedFor = true;

          var title = $rootScope.playlistData[queueData.data.indexes[songIndex]].track_name;
          if(title.length >= 16)
            title = title.substring(0,16) + "...";

          var artist = $rootScope.playlistData[queueData.data.indexes[songIndex]].artists;
          if(artist.length >= 16)
            artist = artist.substring(0,16) + "...";

          var newSong = {
            "albumArt": $rootScope.playlistData[queueData.data.indexes[songIndex]].album_art,
            "full_title": $rootScope.playlistData[queueData.data.indexes[songIndex]].track_name,
            "title": title,
            "full_artist": $rootScope.playlistData[queueData.data.indexes[songIndex]].artists,
            "artist": artist,
            "votes": queueData.data.likes[songIndex],
            "uri": $rootScope.playlistData[queueData.data.indexes[songIndex]].track_uri,
            "org_index": queueData.data.indexes[songIndex],
            "q_index": songIndex,
            "votedFor": votedFor
          }

          if(newSong.uri != $rootScope.NowPlaying.uri)
            $rootScope.queue[songIndex] = newSong;
        }

      }, function errorCallback(response) {

      });
    };

    $rootScope.updateCurrent = function () {
      $http({
        method: 'GET',
        url: 'https://puddlplayer.appspot.com/api/locations/playlist/current?playlist_uri='+$rootScope.playlistURI
      }).then(function successCallback(queueData) {
        console.log(queueData.data.track);
        var title = queueData.data.track.track_name;
        if(title.length >= 16)
          title = title.substring(0,16) + "...";

        var artist = queueData.data.track.artists;
        if(artist.length >= 16)
          artist = artist.substring(0,16) + "...";

        var newSong = {
          "albumArt": queueData.data.track.album_art,
          "full_title": queueData.data.track.track_name,
          "title": title,
          "full_artist": queueData.data.track.artists,
          "artist": artist,
          "votes": 0,
          "uri": queueData.data.track.track_uri,
          "org_index": queueData.data.track.track_index,
          "q_index": 0,
          "votedFor": false
        }

        $rootScope.NowPlaying = newSong;

      }, function errorCallback(response) {

      });
    };

    function GetLocation() {

      if (!navigator.geolocation){
        $scope.$apply(function(){
          $scope.locationError = "Geolocation is not supported by your browser";
          console.log(error);
        });
        return;
      }

      function success(position) {
        $scope.$apply(function(){
          $scope.coordinates = {
            "latitude": position.coords.latitude,
            "longitude": position.coords.longitude
          }
          $scope.hasCoordinates = true;
        });

        console.log($scope.coordinates);
        GetLocations();
      };

      function error(errCode) {
        $scope.$apply(function(){
          console.log(errCode);
          switch(errCode.code) {
            case 1:
              $scope.locationError = "User denied location request";
              break;
            case 2:
              $scope.locationError = "POSITION UNAVAILABLE";
              break;
            case 3:
              $scope.locationError = "TIMEOUT";
              break;
            default:
              $scope.locationError = "UNKNOWN ERROR";
              break;
          }
        });
      };

      navigator.geolocation.getCurrentPosition(success, error);
    }

    function GetLocations() {
      $http({
        method: 'GET',
        url: 'https://puddlplayer.appspot.com/api/locations/nearby?lat='+$scope.coordinates.latitude+'&lon='+$scope.coordinates.longitude
      }).then(function successCallback(response) {
        console.log(response);
        if(response.data.venues != null)
        {
          $rootScope.hasLocations = true;
          for(var place in response.data.venues)
          {
            $scope.possibleLocations.push(
              {
                "name" : response.data.venues[place].name,
                "icon" : "http://lorempixel.com/96/96/nightlife",
                "relativeDistance": "1",
                "location_id": response.data.venues[place].id
              }
            );
          }
        }
        else
        {
          $rootScope.hasLocations = true;
          $scope.locationError = "No venues found nearby.";
        }
      }, function errorCallback(response) {
        $scope.locationError = "UNKNOWN ERROR";
        console.log(response);
      });
    }
});



app.directive('header', function () {
    return {
        replace: true,
        templateUrl: "/directives/header.html",
        controller: ['$scope', '$filter', function ($scope, $filter) {

          $scope.flipSearch = function() {
            $scope.$root.searching = !$scope.$root.searching;
            console.log("Flipped Search");
          }

          $scope.getSearch = function() {
            return $scope.$root.searching;
          }

        }]
    }
});

app.directive('queueElement', function () {
    return {
      replace: true,
      templateUrl: "/directives/queueElement.html",
      scope: { song: '=song' },
      controller: ['$scope', '$rootScope', '$filter', '$http', function ($scope, $rootScope, $filter, $http) {

        $scope.handleVote = function() {
          if($scope.song.votedFor != true)
          {
            console.log($scope.song);

            $scope.song.votedFor = true;

            $rootScope.votedFor.push($scope.song.org_index);

            console.log($rootScope.votedFor);

            console.log('https://puddlplayer.appspot.com/api/web/like?playlist_uri='+$rootScope.playlistURI+'&track_uri='+$scope.song.uri);

            $http({
              method: 'GET',
              url: 'https://puddlplayer.appspot.com/api/web/like?playlist_uri='+$rootScope.playlistURI+'&track_uri='+$scope.song.uri
            }).then(function successCallback(queueData) {
              console.log(queueData);

              for(var songIndex in queueData.data.indexes)
              {
                var votedFor = false;
                if($rootScope.votedFor.includes(queueData.data.indexes[songIndex]) && queueData.data.likes[songIndex] > 0)
                  votedFor = true;

                var title = $rootScope.playlistData[queueData.data.indexes[songIndex]].track_name;
                if(title.length >= 16)
                  title = title.substring(0,16) + "...";

                var artist = $rootScope.playlistData[queueData.data.indexes[songIndex]].artists;
                if(artist.length >= 16)
                  artist = artist.substring(0,16) + "...";

                var newSong = {
                  "albumArt": $rootScope.playlistData[queueData.data.indexes[songIndex]].album_art,
                  "full_title": $rootScope.playlistData[queueData.data.indexes[songIndex]].track_name,
                  "title": title,
                  "full_artist": $rootScope.playlistData[queueData.data.indexes[songIndex]].artists,
                  "artist": artist,
                  "votes": queueData.data.likes[songIndex],
                  "uri": $rootScope.playlistData[queueData.data.indexes[songIndex]].track_uri,
                  "org_index": queueData.data.indexes[songIndex],
                  "q_index": songIndex,
                  "votedFor": votedFor
                }

                $rootScope.queue[songIndex] = newSong;
              }

            }, function errorCallback(response) {

            });
          }
        }

      }]
    }
});

app.directive('searchElement', function () {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: "/directives/searchElement.html",
      scope: { song: '=song' },
      controller: ['$scope', '$rootScope', '$filter', '$http', function ($scope, $rootScope, $filter, $http) {

        $scope.handleVote = function() {
          if($scope.song.votedFor != true)
          {
            $scope.$root.searching = false;
            $scope.song.votedFor = true;
            $rootScope.votedFor.push($scope.song.org_index);

            console.log($rootScope.votedFor);

            $http({
              method: 'GET',
              url: 'https://puddlplayer.appspot.com/api/web/like?playlist_uri='+$rootScope.playlistURI+'&track_uri='+$scope.song.uri
            }).then(function successCallback(queueData) {
              console.log(queueData);

              for(var songIndex in queueData.data.indexes)
              {
                var votedFor = false;
                if($rootScope.votedFor.includes(queueData.data.indexes[songIndex]) && queueData.data.likes[songIndex] > 0)
                  votedFor = true;

                var title = $rootScope.playlistData[queueData.data.indexes[songIndex]].track_name;
                if(title.length >= 16)
                  title = title.substring(0,16) + "...";

                var artist = $rootScope.playlistData[queueData.data.indexes[songIndex]].artists;
                if(artist.length >= 16)
                  artist = artist.substring(0,16) + "...";

                var newSong = {
                  "albumArt": $rootScope.playlistData[queueData.data.indexes[songIndex]].album_art,
                  "full_title": $rootScope.playlistData[queueData.data.indexes[songIndex]].track_name,
                  "title": title,
                  "full_artist": $rootScope.playlistData[queueData.data.indexes[songIndex]].artists,
                  "artist": artist,
                  "votes": queueData.data.likes[songIndex],
                  "uri": $rootScope.playlistData[queueData.data.indexes[songIndex]].track_uri,
                  "org_index": queueData.data.indexes[songIndex],
                  "q_index": songIndex,
                  "votedFor": votedFor
                }

                $rootScope.queue[songIndex] = newSong;
              }

            }, function errorCallback(response) {

            });
          }
        }

        $scope.setSearchText = function() {

        }

      }]
    }
});

app.directive('locationElement', function () {
    return {
      replace: true,
      templateUrl: "/directives/locationElement.html",
      scope: { location: '=location' },
      controller: ['$rootScope', '$scope', '$filter', '$http', function ($rootScope, $scope, $filter, $http) {

        $scope.setLocation = function() {
          console.log($scope.location);
          $http({
            method: 'GET',
            url: 'https://puddlplayer.appspot.com/api/locations/playlist?id='+$scope.location.location_id
          }).then(function successCallback(locationData) {
            console.log(locationData);
            $rootScope.hasLocation = true;
            $scope.locationID = $scope.location.location_id;
            $rootScope.playlistURI = locationData.data.playlist.playlist_uri;
            $rootScope.playlistData = locationData.data.playlist.tracks;

            $rootScope.updateCurrent();
            $rootScope.updateVotes();

          }, function errorCallback(response) {
            console.log(response);
          });
        }

      }]
    }
});
