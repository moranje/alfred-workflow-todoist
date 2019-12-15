import { view, StringElement, ListElement, ViewOptions } from '../view';
import { Item } from '@/workflow';

const action: StringElement = 'complete';

let title: ListElement = [];

let heading: StringElement = 'inbox';

let subtitle: ListElement = [];

export default function editView(options: ViewOptions, item: Item): Item {
  title = options?.title || title;
  heading = options?.heading || heading;
  subtitle = options?.subtitle || subtitle;

  return Object.assign(
    item,
    view({
      action,
      title,
      heading,
      subtitle,
    })
  );
}
