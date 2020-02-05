import { GetResourceByName } from 'todoist-rest-api';

/**
 * Utility types.
 */
export type GetStoreItemType<T extends Array<any>> = T extends (infer U)[]
  ? U
  : never;

/**
 * Module Types.
 */
export type ResourceName = 'task' | 'project' | 'label' | 'comment' | 'section';
export type Store = {
  [Name in ResourceName]: GetResourceByName<Name>[];
};
