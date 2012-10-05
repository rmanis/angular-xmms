
angular.module('WebXMMS', ['ngResource']).
    config(
        function($routeProvider) {
            $routeProvider.
                when('/:path', { controller: FileCtrl, templateUrl: 'filelist.html' }).
                otherwise({ redirectTo: '/' });
        }).
    factory('Filelist',
        function($resource) {
            var filelist = $resource('files.cgi', {},
                {
                    query: { method: 'GET', params: {} },
                    isArray: false
                });
            return filelist;
        }).
    factory('Playlist',
        function($resource) {
            var playlist = $resource('playlist.cgi', {},
                {
                    query: { method: 'GET', params: {} },
                    isArray: false
                });

            return playlist;
        });

function FileCtrl($scope, $location, Filelist) {
    $scope.directory = 'test';

    $scope.filelist = Filelist.query();

    var even = false;
    $scope.rowclass = function () {
        even = !even;
        return even ? "even" : "odd";
    }
}

function TunesCtrl($scope, Playlist) {
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
