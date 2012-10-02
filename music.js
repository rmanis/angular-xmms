
angular.module('WebXMMS', ['ngResource']).
    factory('Playlist',
        function($resource) {
            var playlist = $resource('playlist.cgi', {},
                {
                    query: { method: 'GET', params: {}},
                    isArray: false
                });

            return playlist;
        });

function TunesCtrl($scope, Playlist) {
    var self = this;

    $scope.playlist = Playlist.query();

    $scope.playstatus = function (song, stat) {
        if (song.playing) {
            if (stat == "Stopped") {
                return "###";
            }
            return ">>>";
        }
        return "";
    }

    $scope.rowclass = function (song) {
        if (song.playing) {
            return "playing";
        }
        if ((song.tracknum - 1) % 2 == 0) {
            return "even";
        }
        return "odd";
    }
}
