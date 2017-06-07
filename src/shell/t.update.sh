#!/usr/bin/env bash

###############################################################################
# Author: M. Oranje
# Licence: MIT
# Check for workflow updates
###############################################################################

# Imports
. shell/utilities.sh

# Variables
current=$(json_find "$(cat "package.json")" "version")
online_package=$(curl "https://raw.githubusercontent.com/moranje/alfred-workflow-todoist/master/src/package.json")
latest=$(json_find "$online_package" "version")

# Check if a new version of the workflow exists
# Yet to be implemented
if [ "${latest//\./}" -gt "${current//\./}" ]
then
  cat << EOB
    {
      "items": [{
        "arg": "update_workflow",
        "autocomplete": "",
        "icon": "icon.png",
        "title": "Update Alfred Workflow Todoist",
        "subtitle": "New: $latest          Current: $current"
      }]
    }
EOB
else
  cat << EOB
    {
      "items": [{
        "arg": "no_update",
        "autocomplete": "no_update",
        "icon": "icon.png",
        "valid": false,
        "title": "You have the latest version",
        "subtitle": "Online: $latest          Current: $current"
      }]
    }
EOB
fi