#!/bin/bash

## usage: bash ./nce-reader.sh 13

lesson=$1
dir="$HOME/Downloads"
file="nce-lesson-${lesson}.mp3"
path="${dir}/${file}"
url="https://vedio.koolearn.com/upload/vedio/material/nce/nce1/meiyin/${lesson}.mp3"

# Check if the file already exists
if [ -e "$path" ]; then
    echo "File '$file' already exists. No download needed."
else
    echo "Downloading '$file' from '$url'..."
    curl -o "$path" "$url"

    # Check if the download was successful
    if [ $? -eq 0 ]; then
        echo "Downloaded '$file' to '$dir'."
    else
        echo "Failed to download '$file'."
    fi
fi

/Applications/mpv.app/Contents/MacOS/mpv \
    --shuffle \
    --loop=inf \
    $path
