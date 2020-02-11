import { exec } from 'shelljs';
import pkg from './package.json';

exec(
  `/usr/libexec/PlistBuddy -c "Set version ${pkg.version}" "dist/workflow/info.plist"`,
  {
    silent: true,
  }
);

exec(
  `/usr/libexec/PlistBuddy -c "Set :variables:node_flags" "dist/workflow/info.plist"`,
  {
    silent: true,
  }
);

exec(
  `/usr/libexec/PlistBuddy -c "Set :variables:node_path" "dist/workflow/info.plist"`,
  {
    silent: true,
  }
);
