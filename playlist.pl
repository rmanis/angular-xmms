#!/usr/bin/perl

sub getStatus {
    my $status = "Stopped";
    @state = `nyxmms2 current -r 0`;
    if ( $state[0] =~ /([^:]*):.*/ ) {
        $status = $1;
    }
    return $status;
}

sub parsePlaylist {

    my $xmmsRef = shift;
    my @xmms = @{ $xmmsRef };
    my @music = ();

    while (@xmms) {
        if ( $xmms[0] =~ /\s*(->)?(\[\d+.*\])\s*(.*) - (.*) \((.+:.+)\)/ ) {
            my $playing = "";
            if (defined $1) {
                $playing = $1;
            }
            my $tracknum = $2;
            my $artist = $3;
            my $song = $4;
            my $time = $5;

            if ( $playing =~ /->/ ) {
                $playing = 'true';
            } else {
                $playing = 'false';
            }

            $artist =~ s/\\/\\\\/g;
            $song =~ s/\\/\\\\/g;
            $artist =~ s/"/\\"/g;
            $song =~ s/"/\\"/g;

            $tracknum =~ s/\[(\d+)\/\d+\]/$1/;

            push(@music, [$playing,$tracknum,$artist,$song,$time]);
            shift(@xmms);
        } elsif ( $xmms[0] =~ /\s*Total playtime: (.*)/ )  {
            $total = $1;
            shift(@xmms);
        } else {
            shift(@xmms);
        }
    }
    return (\@music, $total);
}

sub jsonifySong {
    my $song = shift;

    my ($playing, $tracknum, $artist, $title, $time) = @$song;

    return "{" . '"playing" : '  . "$playing" .
           "," . '"tracknum" : ' . "$tracknum" .
           "," . '"artist" : '   . "\"$artist\"" .
           "," . '"title" : '    . "\"$title\"" .
           "," . '"time" : '     . "\"$time\"" .
           "}";
}

sub jsonifySongs {
    my $musicRef = shift;
    my @music = @{ $musicRef };
    return '"songs" : ' . '[' .
        join(', ', map { jsonifySong($_) } @music) .
        ']';
}

sub jsonifyEverything {
    my ($musicRef, $total, $status) = @_;
    return "{" .
        jsonifySongs($musicRef) .
        "," .
        "\"timeLength\" : \"$total\"" .
        "," .
        "\"status\" : \"$status\"" .
        "}\n";
}

sub getPlaylistJson {
    my @xmms = `COLUMNS=200 nyxmms2 list`;
    my ($musicRef, $total) = parsePlaylist(\@xmms);
    my $status = getStatus();
    return jsonifyEverything($musicRef, $total, $status);
}

return "true";
