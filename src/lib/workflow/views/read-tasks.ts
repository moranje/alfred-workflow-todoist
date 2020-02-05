import {
  ItemView,
  ListElement,
  StringElement,
  view,
  ViewOptions,
} from '@/lib/workflow';

const defaultAction: StringElement = 'COMPLETE';

const defaultTitle: ListElement = [];

const defaultHeading: StringElement = 'inbox';

const defaultSubtitle: ListElement = [];

/**
 * A view for listing tasks.
 *
 * @param options The view options.
 * @returns An `Item`-like object that can be merged into an `Item` instance.
 */
export default function readTasksView({
  action,
  heading,
  title,
  subtitle,
}: ViewOptions): ItemView {
  action = action || defaultAction;
  heading = heading || defaultHeading;
  title = title || defaultTitle;
  subtitle = subtitle || defaultSubtitle;

  return view({
    action,
    title,
    heading,
    subtitle,
  });
}
