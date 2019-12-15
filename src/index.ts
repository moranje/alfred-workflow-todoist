import '@babel/polyfill';
import 'loud-rejection/register';
import { autoUpdate, checkForWorkflowUpdate } from './lib/updater';
import { checkCacheExpired } from './lib/cache';
import { handleError } from './lib/error';
import command, { MethodName } from './lib/command';

const argv: string[] = Object.assign([], process.argv);
argv.splice(0, 2);
const methodName = argv.shift() as MethodName;
const query = argv.join(' ');

/**
 * Updater and cache refresh only runs when user hasn't input anything yet
 */
if (query.trim() !== '') {
  try {
    checkCacheExpired();
    checkForWorkflowUpdate();
    autoUpdate();
  } catch (error) {
    handleError(error);
  }
}

/**
 * Command distribution
 */
try {
  command(methodName, query);
} catch (error) {
  handleError(error);
}
