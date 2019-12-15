export interface ViewOptions {
  action?: string;
  title: string[];
  heading?: string;
  subtitle?: string[];
}

interface ItemView {
  title: string;
  subtitle?: string;
}

export type StringElement = string;

export type ListElement = string[];

export function view(options: ViewOptions): ItemView {
  return {
    title: options.title.join(' '),
  };
}
