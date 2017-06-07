#!/usr/bin/env bash

###############################################################################
# Author: M. Oranje
# Licence: MIT
###############################################################################

notification="Error: node.js was already installed"

if ! type "node" > /dev/null
then

  if ! type "brew" > /dev/null
  then
    # install homebrew
    /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
  fi  

  # update home brew's formula's
  brew update > /dev/null

  # install node.js
  brew install node > /dev/null

  if type "node" > /dev/null
  then
    notification="Node.js succesfully installed"
  else
    notification="Error: tried to install node but failed"
  fi
fi

echo -n "$notification"