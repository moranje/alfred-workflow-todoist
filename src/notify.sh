#!/usr/bin/env bash
# author: M. Oranje
# licence: MIT

MESSAGE="{query}"

# Remove escape characters
MESSAGE=${MESSAGE//\\}

if [ -z "$MESSAGE" ]
then
  osascript -e "display notification \"Let's get this party started\" with title \"That's it!\""
else
  # Safe from injections
  osascript \
  -e "on run(argv)" \
  -e "return display notification item 1 of argv with title \"Ouch! What happened?\"" \
  -e "end" \
  -- "$MESSAGE"
fi
