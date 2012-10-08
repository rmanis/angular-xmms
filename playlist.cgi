#!/usr/bin/perl

require "playlist.pl";

print "Content-type: application/json\n\n";

print getPlaylistJson();

