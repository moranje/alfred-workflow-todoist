#!/usr/bin/env bash
# author: M. Oranje
# licence: MIT

# Create script folder, see https://developer.apple.com/library/mac/releasenotes/InterapplicationCommunication/RN-JavaScriptForAutomation/Articles/OSX10-10.html#//apple_ref/doc/uid/TP40014508-CH109-SW14

if [ ! -f first_run ]
then
  touch first_run
  mkdir -p ~/Library/Script\ Libraries/
  cp ./workflow-helper.scpt ~/Library/Script\ Libraries/workflow-helper.scpt
  cp ./workflow.scpt ~/Library/Script\ Libraries/workflow.scpt
  cp ./todoist.scpt ~/Library/Script\ Libraries/todoist.scpt
fi
