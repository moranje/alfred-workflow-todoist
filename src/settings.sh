# Retrieve settings from settings.json

settings=`cat settings.json`

if [[ $1 && $2 ]]
then
  printf "{\n\t\"token\": \"$3\",\n\t\"language\": \"$1\",\n\t\"max_items\": \"$2\"\n}\n" > settings.json
else
  # $token
  regex="\"token\": \"([a-f0-9]+)\""
  if [[ $settings =~ $regex ]]
  then
    token="${BASH_REMATCH[1]}"
  fi

  # $language
  regex="\"language\": \"(en|da|pl|zh|ko|de|pt|ja|it|fr|sv|ru|es|nl)\""
  if [[ $settings =~ $regex ]]
  then
    language="${BASH_REMATCH[1]}"
  fi

  # $max_items
  regex="\"max_items\": \"([0-9]+)\""
  if [[ $settings =~ $regex ]]
  then
    max_items="${BASH_REMATCH[1]}"
  fi

  # $config_results
  config_results='{"items":[{"subtitle":"Must be 40 characters","title":"Set Todoist Token","autocomplete":":token","icon":"icon.png","valid":false}]}'

  # Clean up
  unset regex;
fi