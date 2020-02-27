#!/bin/zsh
VERSION="$1"
FIRST_COMMIT="$2"
LAST_COMMIT="$3"

npx sentry-cli releases new "$VERSION" --finalize
npx sentry-cli releases set-commits "$VERSION" --commit
"moranje/alfred-workflow-todoist@$FIRST_COMMIT..$LAST_COMMIT"
npx sentry-cli releases files "$VERSION" upload ./dist/workflow/alfred-workflow-todoist.js '~/alfred-workflow-todoist.js'
npx sentry-cli releases files "$VERSION" upload-sourcemaps ./dist/workflow/alfred-workflow-todoist.js.map --rewrite
sentry-cli releases deploys "$VERSION" new -e production
