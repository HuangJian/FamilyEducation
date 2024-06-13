#!/bin/bash

file='./content.txt'
# Function to read variables from a file
read_vars() {
    local file="$1"
    local line
    local var
    local value

    while IFS= read -r line; do
        if [[ "$line" =~ ^([^=]+)=(.*)$ ]]; then
            var="${BASH_REMATCH[1]}"
            value="${BASH_REMATCH[2]}"
            eval "export $var='$value'"
        fi
    done < "$file"
}

# Usage: read_vars /path/to/file.txt
read_vars $file

# echo $speed
# echo $times

content=$(sed '/^$/q' $file)
# echo $content

seq $times | xargs -I{} bash -c "say '${content}' -r ${speed} && sleep 1"
