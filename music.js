
angular.module('WebXMMS', ['ngResource']).
    config(
        function($routeProvider) {
            $routeProvider.
                when('', { redirectTo: "/" }).
                otherwise({ controller: FileCtrl, templateUrl: 'filelist.html' });
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
    var path = $location.$$path;

    $scope.header = "Files" +
        (path === '/' ? "" : (" in " + path));
    $scope.directory = path;
    $scope.linkpath = path === '/' ? "" : path;

    $scope.filelist = Filelist.query({ path : path });

    $scope.linkparent = function(parent) {
        if (path === "/") {
            return false;
        }
        return parent + "/";
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
}
