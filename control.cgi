#!/usr/bin/perl

# use File::Basename;

require "local.pl";
require "query.pl";
require "playlist.pl";

$musicpath = $query{'path'};
$command = $query{'cmd'};

$command =~ s/\+/ /g;
$musicpath =~ s/\+/ /g;

if( $command =~ /play|pause|stop|next|prev|toggle|(jump \d+)|(remove \d+)|clear/ ) {
    `nyxmms2 $command`;
}

if ( $command =~ /add (.*)/ ) {
    $mp3 = unlocalize("$musicpath/$1");
    `nyxmms2 add "$mp3"`;
}

if ( $command =~ /addAll/ ) {
    my $dir = unlocalize($musicpath);
    chdir "$dir";
    my @files = glob "*.mp3";
    for (@files) {
        `nyxmms2 add \"$_\"\n`;
    }
}

$musicpath =~ s/&/%26/;

print "Content-type: application/json\n\n";
print getPlaylistJson();

