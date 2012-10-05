#!/usr/bin/perl

use File::Basename;
use File::Spec;
use Cwd;

require "local.pl";
require "query.pl";

$path = $query{'path'};
$path =~ s/\+/ /g;
$absolute = canonical_path("$prefix$path");
$absparent = dirname($absolute);

$path = localize($absolute);
$parent = localize($absparent);

$disppath = $path;

if($path) {
    $newpath = "$path/";
}

opendir(DIR, $absolute);
@files= grep !/^\..*$/, sort readdir(DIR);
foreach $file (@files) {
    if (-d "$absolute/$file" ) {
        push(@folders, $file);
    } else {
        push(@mp3s,$file);
    }
}
closedir(DIR);

sub sanitize {
    my $str = shift;

    $str =~ s/\\/\\\\/g;
    $str =~ s/"/\\"/g;

    return $str;
}

sub jsonifyString {
    my $f = shift;
    $f = sanitize($f);
    return "\"$f\"";
}

sub jsonifyFolders {
    return '"folders" : [' .
        join(', ', map { jsonifyString($_) } @folders) .
        "]";
}

sub jsonifyMp3s {
    return '"files" : [' .
        join(', ', map { jsonifyString($_) } @mp3s) .
        "]";
}

sub jsonify {
    return "{ " .
        jsonifyFolders() . ", " .
        jsonifyMp3s() .
        " }";
}

print "Content-type: application/json\n\n";

print jsonify();
