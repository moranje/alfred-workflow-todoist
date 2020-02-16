import { spyOnImplementing } from 'jest-mock-process';

import * as cli from '@/lib/cli-args';

export function callWith(
  name:
    | 'read'
    | 'parse'
    | 'readSettings'
    | 'openUrl'
    | 'create'
    | 'remove'
    | 'writeSetting'
    | 'refreshCache',
  args: any
): void {
  spyOnImplementing(cli, 'getCurrentCall', () => ({
    name,
    args,
  }));
}

export function setUserFacingCall(isUserFacing: boolean): void {
  spyOnImplementing(cli, 'isUserFacingCall', () => isUserFacing);
}

export const maybeMockRestore = (a: any): void =>
  a.mockRestore && typeof a.mockRestore === 'function'
    ? a.mockRestore()
    : undefined;
