/**
 * A fuzzy search algorithm for strings that returns whether or not a match was
 * found.
 *
 * @author moranje
 * @since  2017-06-16
 * @param  {string}   needle   The characters to match.
 * @param  {string}   haystack The string to match to.
 * @return {Boolean}
 */
export function fuzzysearch(needle: string, haystack: string) {
  if (needle.length > haystack.length) {
    return false;
  }

  if (needle.length === haystack.length) {
    return needle === haystack;
  }

  outer: for (var i = 0, j = 0; i < needle.length; i++) {
    var needleChar = needle.charCodeAt(i);

    while (j < haystack.length) {
      if (haystack.charCodeAt(j++) === needleChar) {
        continue outer;
      }
    }

    return false;
  }

  return true;
}
