import open from 'open';

/**
 * Opens a url in the default browser.
 *
 * @param url The url that will be opened.
 */
export async function openUrl(url: string): Promise<void> {
  open(url);
}
