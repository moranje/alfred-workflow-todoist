#!/usr/bin/env bash
# author: M. Oranje
# licence: MIT

# The {query} is interpolated by alfred to contain the query string.
# The first item in the query will be the task, the second will be the date
# string and the third will be the priority.
IFS=',' read -r -a SPLIT <<< "{query}"

# If all goes well this variable stays empty
ABORT=""

# The pipe to xargs is meant to remove trailing and leading whitespace
TOKEN=$(echo "${SPLIT[0]}" | xargs)
LANGUAGE=$(echo "${SPLIT[1]}" | xargs)
MAX_ITEMS=$(echo "${SPLIT[2]}" | xargs)

# An API token should be 40 characters of hexadecimal values
if [[ ! "$TOKEN" =~ ^[0-9a-f]{40}$ ]]
then
  ABORT="Not a valid api token ($TOKEN)\n"
fi

# Change language to lowercase
LANGUAGE=$(echo $LANGUAGE | tr '[:upper:]' '[:lower:]');
if [[ ! "$LANGUAGE" =~ ^en|da|pl|zh|ko|de|pt|ja|it|fr|sv|ru|es|nl$ ]]
then
  ABORT="$ABORT\Todoist doesn\'t support the language ($LANGUAGE)\n"
fi

# Should hold an integer (number) value
if [[ ! "$MAX_ITEMS" =~ ^[0-9]+$ ]]
then
  ABORT="$ABORT\The max items to show must be a valid number ($MAX_ITEMS)"
fi

if [ -n "$ABORT" ]
then
  printf "$ABORT"
else
  # Create data storage directory
  mkdir -p "$alfred_workflow_data"

  # Overwrite older entries if they exist
  printf "{\"token\":\"$TOKEN\",\"language\":\"$LANGUAGE\",\"maxItems\":\"$MAX_ITEMS\"}" >| "$alfred_workflow_data/.workflowrc"
fi
