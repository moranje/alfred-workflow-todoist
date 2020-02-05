import { LOCAL_FIXTURES } from '@/tests/helpers/fixtures';

export class CacheStore extends Map {
  /**
   *
   */
  constructor() {
    super();

    this.set('task', LOCAL_FIXTURES.tasks);
    this.set('project', LOCAL_FIXTURES.projects);
    this.set('label', LOCAL_FIXTURES.labels);
    this.set('section', LOCAL_FIXTURES.sections);
  }
}
