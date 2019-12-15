import plist from 'fast-plist';
import { readFileSync } from 'fs';
import macOsVersion from 'macos-version';

/** @hidden */
let alfredVersion = 'unknown';
/** @hidden */
let workflowVersion = 'unknown';

try {
  workflowVersion = plist.parse(
    readFileSync(`${process.cwd()}/info.plist`, 'utf8')
  ).version;
} catch (error) {
  // Do nothing
}

try {
  alfredVersion = plist.parse(
    readFileSync('/Applications/Alfred 3.app/Contents/Info.plist', 'utf8')
  ).CFBundleShortVersionString;
} catch (error) {
  // Do nothing
}

try {
  if (alfredVersion === 'unknown') {
    alfredVersion = plist.parse(
      readFileSync('/Applications/Alfred.app/Contents/Info.plist', 'utf8')
    ).CFBundleShortVersionString;
  }
} catch (error) {
  // Do nothing
}

export const ENV = {
  OSX_VERSION: macOsVersion(),
  NODE_VERSION: process.version,
  ALFRED_VERSION: alfredVersion,
  WORKFLOW_VERSION: workflowVersion,
};
