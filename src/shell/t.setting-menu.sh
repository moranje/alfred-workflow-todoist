# Imports
. shell/utilities.sh

# Setting menu options
items=""

if [[ token == *$1* || $1 == *token* ]]
then
  if [[ $2 =~ ^[0-9a-f]{40}$ ]]
  then
    token="$2"
  else
    token="choose a valid token"
  fi
  
  items="$items$(workflow_item "Store token" "Token: $token" "t:token" "token $2" "{\"file\":\"t.setting.sh\",\"call\":\"token\",\"argument\":\"$token\",\"match\":\"^[0-9a-f]{40}$\",\"success\":\"New token stored\",\"error\":\"Error: not a valid token\"}"),"
fi

if [[ $1 == *language* || language == *$1* ]]
then
  if [[ $2 =~ ^(en|da|pl|zh|ko|de|pt|ja|it|fr|sv|ru|es|nl)$ ]]
  then
    language="$2"
  else
    language="choose a valid language"
  fi
  
  items="$items$(workflow_item "Store language" "Language: $language" "t:language" "language $2" "{\"file\":\"t.setting.sh\",\"call\":\"language\",\"argument\":\"$language\",\"match\":\"^(en|da|pl|zh|ko|de|pt|ja|it|fr|sv|ru|es|nl)$\",\"success\":\"Language set to $language\",\"error\":\"Error: invalid language\"}"),"
fi

if [[ items == *$1* || $1 == *items*  ]]
then
  if [[ $2 =~ ^[0-9]+$ ]]
  then
    amount="$2"
  else
    amount="choose a valid number"
  fi
  
  items="$items$(workflow_item "Store max. items shown" "Maximum items: $amount" "t:max_items" "items $2" "{\"file\":\"t.setting.sh\",\"call\":\"max_items\",\"argument\":\"$amount\",\"match\":\"^[0-9]+$\",\"success\":\"Max. items is now $amount\",\"error\":\"Error: not a valid number\"}"),"
fi

if [[ node == *$1* || $1 == *node*  ]]
then
  items="$items$(workflow_item "Install Node.js" "Won't install anything if a node.js version is already present" "t:node" "node" "{\"file\":\"t.node.sh\"}"),"
fi

if [ -n "$items" ]
then
  items="${items%?}"
fi

echo '{"items":['"$items"']}'
