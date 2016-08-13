# Retrieve settings from settings.json

settings_path="$alfred_workflow_data/settings.json"
settings=`cat "$settings_path"`

# if there are two arguments $1 hold the key and $2 hold the value
if [[ $1 && $2 ]]
then
  regex="(.+)\"$1\": \"[^\"]*\"(,?.+)"
  if [[ $settings =~ $regex ]]
  then
    echo "${BASH_REMATCH[1]}\"$1\": \"$2\"${BASH_REMATCH[2]}" > "$settings_path"
    echo "Stored $1 entry"
  else
    echo "Error: Could not store $1 entry"
  fi
else
  # $token
  regex='"token": "([a-f0-9]+)"'
  if [[ $settings =~ $regex ]]
  then
    token="${BASH_REMATCH[1]}"
  fi

  # $language
  regex='"language": "(en|da|pl|zh|ko|de|pt|ja|it|fr|sv|ru|es|nl)"'
  if [[ $settings =~ $regex ]]
  then
    language="${BASH_REMATCH[1]}"
  fi

  # $max_items
  regex='"max_items": "([0-9]+)"'
  if [[ $settings =~ $regex ]]
  then
    max_items="${BASH_REMATCH[1]}"
  fi

  # $config_results
  config_results='{"items":[{"subtitle":"Must be 40 characters","title":"Set Todoist Token","autocomplete":":token","icon":"icon.png","valid":false}]}'

  # Clean up
  unset settings_path;
  unset settings;
fi