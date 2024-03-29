#!/usr/bin/perl

# change this appropriately
$prefix = "/home/dmitri/Music/";

sub canonical_path {
    my $path = shift;
    my @path;

    foreach (File::Spec->splitdir($path)) {
        if ($_ eq '..') {
            if ($path[-1] eq '..') {
                push @path, $_;
            }
            else {
                pop @path;
            }
        }
        elsif ($_ ne '.') {
            push @path, $_;
        }
    }

    File::Spec->catdir(@path);
}

sub localize {
    my $file = shift;

    $file =~ s/%([A-Fa-f\d]{2})/chr hex $1/eg;
    $file =~ s/\+/ /g;

    my $path = canonical_path( $file );
    #print "mypath=$path\n";

    return substr($path, length($prefix));
}

sub unlocalize {
    my $file = shift;
    $file =~ s#^/##;

    return "$prefix$file";
}

return true;
