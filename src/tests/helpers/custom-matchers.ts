/** Global: expect */
import toBeAlfredListOfLength from '@/tests/helpers/matchers/to-be-alfred-list-of-length';
import toBeValidAlfredList from '@/tests/helpers/matchers/to-be-valid-alfred-list';
import toContainAllAlfredItemsWith from '@/tests/helpers/matchers/to-contain-all-alfred-items-with';

if (expect !== undefined) {
  expect.extend({
    toBeValidAlfredList,
    toBeAlfredListOfLength,
    toContainAllAlfredItemsWith,
  });
} else {
  console.error("Unable to find Jest's global expect.");
}
