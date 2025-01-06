#!/usr/bin/env bash

# Function to show usage
show_usage() {
    echo "Usage: $0 [-o output_dir] [-c] input_file1 [input_file2 ...]"
    echo "  -o: Specify output directory (optional, default is current directory)"
    echo "  -c: Copy to clipboard (optional, only for the last processed file)"
    exit 1
}

# Function to process a single file
process_file() {
    local input_file="$1"
    local output_dir="$2"
    local copy_to_clipboard="$3"

    # Check if input file exists
    if [ ! -f "$input_file" ]; then
        echo "Error: The file $input_file does not exist." >&2
        return 1
    fi

    # Create temporary file
    local temp_file=$(mktemp)

    echo "Minifying JavaScript for $input_file..."
    # Minify JavaScript and capture any errors
    if ! uglifyjs "$input_file" -o "$temp_file" -c -m 2>/dev/null; then
        echo "Error: Failed to minify JavaScript for $input_file. Is the input valid JavaScript?" >&2
        rm "$temp_file"
        return 1
    fi

    # Read minified code
    local minified_code=$(cat "$temp_file")

    # Create bookmarklet
    local bookmarklet="javascript:(function(){$(printf '%s' "$minified_code" | jq -sRr @uri)})();"

    # Generate output filename
    local base_name=$(basename "$input_file" .js)
    local output_file="${output_dir}/${base_name}"

    # Save to output file
    echo "$bookmarklet" > "$output_file"
    echo "Bookmarklet saved to $output_file"

    # Copy to clipboard if it's the last file and -c option is set
    if $copy_to_clipboard; then
        if command -v pbcopy &> /dev/null; then
            echo "$bookmarklet" | pbcopy
            echo "Bookmarklet copied to clipboard"
        elif command -v xclip &> /dev/null; then
            echo "$bookmarklet" | xclip -selection clipboard
            echo "Bookmarklet copied to clipboard"
        else
            echo "Warning: Could not copy to clipboard. Neither pbcopy nor xclip is available." >&2
        fi
    fi

    # Clean up
    rm "$temp_file"
}

# Parse command line options
output_dir="."
copy_to_clipboard=false
while getopts ":o:c" opt; do
    case $opt in
        o) output_dir="$OPTARG" ;;
        c) copy_to_clipboard=true ;;
        \?) echo "Invalid option: -$OPTARG" >&2; show_usage ;;
    esac
done
shift $((OPTIND-1))

# Check if at least one input file is provided
if [ $# -eq 0 ]; then
    echo "Error: No input files specified." >&2
    show_usage
fi

# Check if uglifyjs is installed
if ! command -v uglifyjs &> /dev/null; then
    echo "Error: uglifyjs is not installed. Please install it with 'npm install -g uglify-js'" >&2
    exit 1
fi

# Create output directory if it doesn't exist
mkdir -p "$output_dir"

# Process each input file
for input_file in "$@"; do
    if [ "$input_file" = "${@: -1}" ] && $copy_to_clipboard; then
        # This is the last file and -c option is set
        process_file "$input_file" "$output_dir" true
    else
        process_file "$input_file" "$output_dir" false
    fi
done