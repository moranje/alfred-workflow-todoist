#!/usr/bin/env bash

###############################################################################
# Author: M. Oranje
# Licence: MIT
# This silently configures the workflow and in theory only needs to run once
###############################################################################

# Constants
DATA_PATH=$1
CACHE_PATH=$2
SETTINGS_PATH="$DATA_PATH/settings.json"
TODOIST_CACHE="$CACHE_PATH/todoist.json"

# Imports
. shell/utilities.sh

# Variables
language="en"
max_items="9"
anonymous_statistics="true"
package=$(cat "package.json")
settings=$(cat "$SETTINGS_PATH")
version=$(json_find "$package" "version")

###############################################################################
# Configure default settings
###############################################################################

# Check if a workflow data folder exists
if [ ! -d "$DATA_PATH" ]
then
  # create workflow data directory
  mkdir -p "$DATA_PATH"
fi

# Create a default token setting
if [ "$(json_find "$settings" "token")" == "FALSE" ]
then
  settings=$(json_create "$settings" "token" "")
fi

# Create a default language setting
if [ "$(json_find "$settings" "language")" = "FALSE" ]
then
  settings=$(json_create "$settings" "language" "$language")
fi

# Create a default max_items setting
if [ "$(json_find "$settings" "max_items")" = "FALSE" ]
then
  settings=$(json_create "$settings" "max_items" "$max_items")
fi

# Create a default version setting
if [ "$(json_find "$settings" "version")" = "FALSE" ]
then
  settings=$(json_create "$settings" "version" "$version")
fi

# Create a default anonymous_statistics setting
if [ "$(json_find "$settings" "anonymous_statistics")" = "FALSE" ]
then
  settings=$(json_create "$settings" "anonymous_statistics" "$anonymous_statistics")
fi

# Create a default data_path setting
if [ "$(json_find "$settings" "data_path")" = "FALSE" ]
then
  settings=$(json_create "$settings" "data_path" "$DATA_PATH")
fi

# Create a default cache_path setting
if [ "$(json_find "$settings" "cache_path")" = "FALSE" ]
then
  settings=$(json_create "$settings" "cache_path" "$CACHE_PATH")
fi

# Create a default token setting
if [ "$(json_find "$settings" "uuid")" == "FALSE" ]
then
  settings=$(json_create "$settings" "uuid" "$(uuidgen)")
fi

echo "$settings" > "$SETTINGS_PATH"

###############################################################################
# Create and refresh todoist cache
###############################################################################

# Check if a workflow cache folder exists
if [ ! -d "$CACHE_PATH" ]
then
  # create workflow cache folder
  mkdir -p "$CACHE_PATH"
fi

# Check if a menu cache folder exists
if [ ! -d "menu" ]
then
  # create menu cache folder
  mkdir -p "menu"
fi

# create a todoist.json if one doesn't exist in $CACHE_PATH
if [ ! -f "$TODOIST_CACHE" ]
then
  echo "{}" > "$TODOIST_CACHE"
fi

# Refresh Todoist data cache
if [ -f "/usr/local/bin/node" ]
then
  /usr/local/bin/node js/index.js "refreshCache"
fi

###############################################################################
# Anonymous statistics
###############################################################################

if [[ "$(json_find "$settings" "anonymous_statistics")" = "true" && "$(json_find "$package" "first")" = "true" ]]
then
  uuid=$(json_find "$settings" "uuid")
  curl -Ls "https://script.google.com/macros/s/AKfycbwB-_8anBZGdTKZYUXNfMp86KkEA8Ht1W88TCNlsyehRwrPZoY/exec?uuid=$uuid&language=$language&max_items=$max_items&version=$version"
  json_update "$package" "first" "false" > "package.json"
fi
