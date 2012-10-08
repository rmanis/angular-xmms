
angular.module('WebXMMS', ['ngResource']).
    config(
        function($routeProvider) {
            $routeProvider.
                when('', { redirectTo: "/" }).
                otherwise({ controller: FileCtrl, templateUrl: 'filelist.html' });
        }).
    factory('Filelist',
        function($rootScope, $resource) {
            var filelist = $resource('files.cgi', {},
                {
                    query: { method: 'GET', params: {} },
                    isArray: false
                });
            return filelist;
        }).
    factory('Playlist',
        function($rootScope, $resource) {
            var service = {};
            var common = {
                    query: { method: 'GET', params: {} },
                    isArray: false
                }

            service.playlist = $resource('playlist.cgi', {}, common);
            service.adder = $resource('control.cgi', {}, common);

            service.update = function () {
                service.songs = service.playlist.query();
                $rootScope.$broadcast('update');
            };

            service.addSong = function (path, song) {
                service.songs = service.adder.query(
                    {
                        path: path,
                        cmd: 'add ' + song
                    });
                $rootScope.$broadcast('update');
            };

            service.command = function (path, cmd) {
                service.songs = service.adder.query(
                    {
                        path: path,
                        cmd: cmd
                    });
                $rootScope.$broadcast('update');
            };

            return service;
        });

function FileCtrl($rootScope, $scope, $location, Filelist, Playlist) {
    var path = $location.$$path;
    $rootScope.location = path;

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

    $scope.addSong = function(song) {
        Playlist.addSong(path, song);
    }

    $scope.addAll = function () {
        Playlist.command(path, 'addAll');
    }
}

function TunesCtrl($rootScope, $scope, Playlist) {
    $scope.$on('update', function () {
        $scope.playlist = Playlist.songs;
    });

    Playlist.update();

    $scope.playstatus = function (song, stat) {
        if (song.playing) {
            if (stat == "Stopped") {
                return "###";
            }
            return ">>>";
        }
        return "";
    }

    $scope.toggleString = function () {
        if (Playlist.songs.status == "Playing") {
            return "Pause";
        }
        return "Play";
    }

    $scope.command = function (cmd) {
        Playlist.command($rootScope.location, cmd);
    }
}
