import { Notification } from '@/workflow';

export class Writable {
  //* NOTE: Should be able to accept an array of type any, accept this warning
  write(...params: any[]): void {
    const args: (string | Error | null)[] = params.length > 0 ? params : [this];
    const [firstArg] = args;

    if (firstArg instanceof Error) {
      return new Notification(firstArg).write();
    }

    //* NOTE: Should accept type any argument, accept this warning
    const mapped: string[] = args.map((arg: any) => {
      if (typeof arg === 'object') {
        return JSON.stringify(arg, null, '\t');
      }

      if (arg == null) {
        return '';
      }

      return arg;
    });

    return console.log(...mapped);
  }
}
