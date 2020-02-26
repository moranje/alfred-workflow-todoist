import settingsStore from '@/lib/stores/settings-store';

import { init } from '../sentry';

jest.mock('@/lib/stores/settings-store');
jest.mock('@sentry/node');

describe('unit: Sentry', () => {
  it('should not return a Sentry instance when error_tracking is false', () => {
    expect.assertions(1);

    settingsStore('reset');
    const Sentry = init();

    expect(Sentry).toBeNull();
  });

  it('should return a Sentry error_tracking is true', () => {
    expect.assertions(1);

    settingsStore('').set('error_tracking', true);
    const Sentry = init();

    expect(Sentry).not.toBeNull();
  });
});
