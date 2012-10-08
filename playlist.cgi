#!/usr/bin/perl

@xmms = `COLUMNS=200 nyxmms2 list`;
@state = `nyxmms2 current -r 0`;
@music = ();

if ( @state[0] =~ /([^:]*):.*/ ) {
    $status = $1;
}

while (@xmms) {
    if ( @xmms[0] =~ /\s*(->)?(\[\d+.*\])\s*(.*) - (.*) \((.+:.+)\)/ ) {
        my $playing = $1;
        my $tracknum = $2;
        my $artist = $3;
        my $song = $4;
        my $time = $5;

        if ( $playing =~ /->/ ) {
            $playing = 'true'
        } else {
            $playing = 'false'
        }

        $artist =~ s/\\/\\\\/g;
        $song =~ s/\\/\\\\/g;
        $artist =~ s/"/\\"/g;
        $song =~ s/"/\\"/g;

        $tracknum =~ s/\[(\d+)\/\d+\]/\1/;

        push(@music, [$playing,$tracknum,$artist,$song,$time]);
        shift(@xmms);
    } elsif ( @xmms[0] =~ /\s*Total playtime: (.*)/ )  {
        $total = $1;
        shift(@xmms);
    } else {
        shift(@xmms);
    }
}

sub jsonifySong {
    my $song = shift;

    my ($playing, $tracknum, $artist, $title, $time) = @$song;

    return "{" . '"playing" : '  . "$playing" .
           "," . '"tracknum" : ' . "$tracknum" .
           "," . '"artist" : '   . "\"$artist\"" .
           "," . '"title" : '     . "\"$title\"" .
           "," . '"time" : '     . "\"$time\"" .
           "}";
}

sub printSongs {
    print '"songs" : ';
    print '[';
    print join(', ', map { jsonifySong($_) } @music);
    print ']';
}

sub printEverything {
    print "{";
    printSongs();
    print ",";
    print "\"timeLength\" : \"$total\"";
    print ",";
    print "\"status\" : \"$status\"";
    print "}\n";
}

print "Content-type: application/json\n\n";

printEverything();

