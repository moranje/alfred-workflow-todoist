#!/usr/bin/env bash
# author: M. Oranje
# licence: MIT

# Add your API key here
TOKEN=`grep -Eo '"[a-f0-9]{40}"' "$alfred_workflow_data/.workflowrc" | cut -d '"' -f2`
DATE_LANG=`grep -Eo '"en|da|pl|zh|ko|de|pt|ja|it|fr|sv|ru|es|nl"' "$alfred_workflow_data/.workflowrc" | cut -d '"' -f2`

echo "$TOKEN"
echo "$DATE_LANG"

# Create UUID
UUID=$(uuidgen)

# The {query} is interpolated by alfred to contain the query string.
# The first item in the query will be the task, the second will be the date
# string and the third will be the priority.
IFS=',' read -r -a SPLIT <<< "{query}"

# The pipe to xargs is meant to remove trailing and leading whitespace
TASK=$(echo "${SPLIT[0]}" | xargs)
# See http://bit.ly/1PX1txy for suppoted date formats
DATE=$(echo "${SPLIT[1]}" | xargs)
# A number between 1 and 4, 4 being highest priority.
PRIORITY=$(echo "${SPLIT[2]}" | xargs)
if [[ ! "$PRIORITY" =~ ^[1-4]$ ]]
then
  PRIORITY="1"
fi

# Adding task
COMMAND='[{"type": "item_add", "temp_id": "", "uuid": "'$UUID'", "args": {"content": "'$TASK'", "date_string":"'$DATE'", "priority":"'$PRIORITY'", "date_lang": "'$DATE_LANG'"}}]'

# Add Task through Todoist API
curl https://todoist.com/API/v6/sync \
    -d token=$TOKEN \
    -d commands="$COMMAND"
