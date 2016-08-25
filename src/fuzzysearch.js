'use strict';

function fuzzysearch( needle, haystack ) {
  if ( needle.length > haystack.length ) {
    return false;
  }

  if ( needle.length === haystack.length ) {
    return needle === haystack;
  }

  outer: for ( var i = 0, j = 0; i < needle.length; i++ ) {
    var needleChar = needle.charCodeAt( i );

    while ( j < haystack.length ) {
      if ( haystack.charCodeAt( j++ ) === needleChar ) {
        continue outer;
      }
    }

    return false;
  }

  return true;
}

module.exports = fuzzysearch;