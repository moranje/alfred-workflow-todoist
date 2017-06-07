#!/usr/bin/env bash

###############################################################################
# Author: M. Oranje
# Licence: MIT
# This adds a task to todoist
###############################################################################

# Constants
QUERY=$1
DATA_PATH=$2
SETTINGS_PATH="$DATA_PATH/settings.json"

# Imports
. shell/utilities.sh

# Variables
settings=$(cat "$SETTINGS_PATH")
token=$(json_find "$settings" "token")
language=$(json_find "$settings" "language")
uuid=$(uuidgen)
task=$(json_find "$QUERY" "task")
date=$(json_find "$QUERY" "date")
project=$(json_find "$QUERY" "project")
priority=$(json_find "$QUERY" "priority")
labels=$(json_find "$QUERY" "labels") # Array

# This part relies on Node.js because it interacts with a JSON API
label_ids="[]"
if [ -f "/usr/bin/env node" ]
then
  project_id=$(/usr/bin/env node js/index.js "getProjects" "$project")
  label_ids=$(/usr/bin/env node js/index.js "getLabels" "$labels")
fi

# Adding task
command='[{"type": "item_add", "temp_id": "", "uuid": "'$uuid'", "args": {"content": "'$task'", "date_string":"'$date'", "project_id":"'$project_id'", "labels":"'$label_ids'", "priority":"'$priority'", "date_lang": "'$language'"}}]'

# Add Task through Todoist API
response=$(curl -s https://todoist.com/API/v7/sync -d token="$token" -d commands="$command")

err='"error": ?"(.*)"'
if [[ $response =~ $err ]]
then
  echo -n "Error: ${BASH_REMATCH[1]}"

  # Refresh Todoist data cache
  if [ -f "/usr/bin/env node" ]
  then
    /usr/bin/env node index.js "refreshCache"
  fi
else
  echo -n "Task was added to $project"
fi