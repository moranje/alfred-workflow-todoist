#!/usr/bin/env bash

###############################################################################
# Author: M. Oranje
# Licence: MIT
# This parses the todo to be submitted to todoist
###############################################################################

QUERY=$1

# Imports
. shell/utilities.sh

# Variables
postfix=""
project=$(splice_string "#([^ ,]*)" "$QUERY")
priority=$(splice_string "!!([1-4])" "$QUERY")
labels=$(echo "$QUERY" | grep -o "@[^ ,]*" | sed "s/@//g" | paste -sd "," -)
space="          "

# Create an alfred menu for certain characters 
character_trigger "$QUERY" "@$" "labels"
character_trigger "$QUERY" "#$" "projects"
character_trigger "$QUERY" "!!$" "priorities"

# Strip out projects, priority and labels
QUERY=$(strip_all "$QUERY" "#[^ ,]*" "!![1-4]" "@[^ ,]*")

task=$(split_string "," "0" "$QUERY")
# See http://bit.ly/1PX1txy for supported date formats
date=$(split_string "," "1" "$QUERY")
# This option is available for backwards compatibility although '#project' is # now preferred
project=$(if_unset "$project" "$(split_string "," "2" "$QUERY")")

# Default values
project=$(if_unset "$project" "inbox")

# Subtitle prefix
prefix=$(echo "$project" | tr "[a-z]" "[A-Z]")

# Subtitle postfix
postfix=$(if_set "$priority" "" "\u203C $priority$space")
postfix=$(if_set "$labels" "$postfix" "\uFF20 $labels$space")
postfix=$(if_set "$date" "$postfix" "\u29D6 $date")

# Default value (not shown if not explicitly set)
priority=$(if_unset "$priority" "1")

# Return 'todo' menu option, with full control over it's content
cat << EOB
  {
    "items": [{
      "uid": "todoist_create_task",
      "arg": "{\"task\": \"$task\", \"date\": \"$date\", \"project\": \"$(echo "$project" | tr "[A-Z]" "[a-z]")\", \"priority\": \"$priority\", \"labels\": \"$labels\"}",
      "valid": true,
      "autocomplete": "",
      "icon": "icon.png",
      "title": "Create new task - $task",
      "subtitle": "$prefix$space$postfix"
    }]
  }
EOB
