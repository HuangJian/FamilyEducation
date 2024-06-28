#!/bin/bash

lesson=$1
url="https://vedio.koolearn.com/upload/vedio/material/nce/nce1/meiyin/${lesson}.mp3"

/Applications/mpv.app/Contents/MacOS/mpv \
    --shuffle \
    --loop=inf \
    $url
