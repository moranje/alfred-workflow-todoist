#!/usr/bin/env bash

###############################################################################
# Author: M. Oranje
# Licence: MIT
###############################################################################

export PATH="$PATH:$node_path:/usr/local/bin:/usr/bin"

if which node > /dev/null; then
  :
else
cat << EOB
{
  "items": [
    {
      "title": "You don't have Node.js installed",
      "subtitle": "You need it for this workflow to work. Read the docs for more information.",
      "quicklookurl": "https://github.com/moranje/alfred-workflow-todoist#installation",
      "valid": false
    },
  ],
}
EOB
  exit 0
fi
