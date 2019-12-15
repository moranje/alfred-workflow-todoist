import { Writable } from '@/workflow';
import md5 from 'md5';

type ModifierKey = 'cmd' | 'alt' | 'ctrl' | 'shift' | 'fn';

interface ModifierOptions {
  valid: boolean;
  arg: string;
  subtitle: string;
  icon?: {
    type?: string;
    path?: string;
  };
  variables: {
    [key: string]: string;
  };
}

interface ItemOptions {
  uid?: string;
  title: string;
  subtitle?: string;
  icon?: {
    type?: string;
    path?: string;
  };
  arg?: string;
  type?: 'default' | 'file' | 'file:skipcheck';
  valid?: boolean;
  autocomplete?: string;
  match?: string;
  mod?: Record<ModifierKey, ModifierOptions>;
  text?: {
    copy: string;
    largetype: string;
  };
  quicklookurl?: string;
}

export interface Item extends ItemOptions, Writable {}

export class Item extends Writable {
  constructor({
    uid = void 0,
    title = '',
    subtitle = void 0,
    icon = { path: 'icon.png' },
    arg = void 0,
    type = 'default',
    valid = true,
    autocomplete = void 0,
    match = void 0,
    mod = void 0,
    text = void 0,
    quicklookurl = void 0,
  }: ItemOptions) {
    super();

    Object.assign(this, {
      uid: uid || md5(title + subtitle),
      subtitle,
      icon,
      arg: typeof 'object' ? JSON.stringify(arg) : arg,
      type,
      valid,
      autocomplete,
      match,
      mod,
      text,
      quicklookurl,
    });
  }
}
