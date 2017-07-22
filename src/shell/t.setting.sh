#!/usr/bin/env bash

###############################################################################
# author: M. Oranje
# licence: MIT
# Update a setting with a new value
###############################################################################

setting_name="$1"
setting="$2"
match="$3"
success_message="$4"
error_message="$5"
settings_path="$6/settings.json"

# Imports
. shell/utilities.sh

settings=$(cat "$settings_path")
notification="$error_message"

if [[ $setting =~ $match ]]
then

  # Replace variable in settings.json
  json_update "$settings" "$setting_name" "$setting" > "$settings_path"
  notification="$success_message"
fi

echo -n "$notification"
