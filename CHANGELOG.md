# [5.7.0](https://github.com/moranje/alfred-workflow-todoist/compare/v5.6.5...v5.7.0) (2019-03-16)


### Features

* **parser:** add support for scripts other than latin ([b12ce3d](https://github.com/moranje/alfred-workflow-todoist/commit/b12ce3d)), closes [#105](https://github.com/moranje/alfred-workflow-todoist/issues/105)
* **todoist:** add japanese timestamp translations ([44b47dd](https://github.com/moranje/alfred-workflow-todoist/commit/44b47dd))

## [5.6.5](https://github.com/moranje/alfred-workflow-todoist/compare/v5.6.4...v5.6.5) (2018-12-05)


### Bug Fixes

* fix missing new invocation in cache module (probably harmless) ([4777b2f](https://github.com/moranje/alfred-workflow-todoist/commit/4777b2f))

## [5.6.4](https://github.com/moranje/alfred-workflow-todoist/compare/v5.6.3...v5.6.4) (2018-11-11)


### Bug Fixes

* allow labels to be hyphenated ([ae309ef](https://github.com/moranje/alfred-workflow-todoist/commit/ae309ef)), closes [#50](https://github.com/moranje/alfred-workflow-todoist/issues/50)

## [5.6.3](https://github.com/moranje/alfred-workflow-todoist/compare/v5.6.2...v5.6.3) (2018-10-27)


### Bug Fixes

* add valid error handler fot task creation logic ([13446cc](https://github.com/moranje/alfred-workflow-todoist/commit/13446cc))

## [5.6.2](https://github.com/moranje/alfred-workflow-todoist/compare/v5.6.1...v5.6.2) (2018-10-27)


### Bug Fixes

* completing a task now closes a task instead of deleting it ([a0c71f8](https://github.com/moranje/alfred-workflow-todoist/commit/a0c71f8)), closes [#47](https://github.com/moranje/alfred-workflow-todoist/issues/47)

## [5.6.1](https://github.com/moranje/alfred-workflow-todoist/compare/v5.6.0...v5.6.1) (2018-10-15)


### Bug Fixes

* broken import references ([25728ab](https://github.com/moranje/alfred-workflow-todoist/commit/25728ab))
* update cache after task creation or completion ([6172d28](https://github.com/moranje/alfred-workflow-todoist/commit/6172d28)), closes [#44](https://github.com/moranje/alfred-workflow-todoist/issues/44)

# [5.6.0](https://github.com/moranje/alfred-workflow-todoist/compare/v5.5.0...v5.6.0) (2018-10-14)


### Bug Fixes

* prevent error message on notification without url ([40d821a](https://github.com/moranje/alfred-workflow-todoist/commit/40d821a))


### Features

* add label and project suggestions on task creation ([9478347](https://github.com/moranje/alfred-workflow-todoist/commit/9478347))
* allow created tasks to assign project and labels ([550b15b](https://github.com/moranje/alfred-workflow-todoist/commit/550b15b))

# [5.5.0](https://github.com/moranje/alfred-workflow-todoist/compare/v5.4.5...v5.5.0) (2018-10-10)


### Bug Fixes

* automatically create missing folders for workflow files ([6640fb8](https://github.com/moranje/alfred-workflow-todoist/commit/6640fb8))


### Features

* respect `cache_timeout` setting ([bf18000](https://github.com/moranje/alfred-workflow-todoist/commit/bf18000))
* respect `language` setting when creating a task ([c09a903](https://github.com/moranje/alfred-workflow-todoist/commit/c09a903))

## [5.4.5](https://github.com/moranje/alfred-workflow-todoist/compare/v5.4.4...v5.4.5) (2018-10-10)


### Bug Fixes

* **settings:** validation: allow uuid to be made up out `A-F` chars ([951bcf3](https://github.com/moranje/alfred-workflow-todoist/commit/951bcf3))

## [5.4.4](https://github.com/moranje/alfred-workflow-todoist/compare/v5.4.3...v5.4.4) (2018-10-09)


### Bug Fixes

* add extra space to prevent item list from remaining open ([d96b517](https://github.com/moranje/alfred-workflow-todoist/commit/d96b517))
* allows for token setting to be empty (initial state) ([4140290](https://github.com/moranje/alfred-workflow-todoist/commit/4140290))
* setting validation errors ([302d9b7](https://github.com/moranje/alfred-workflow-todoist/commit/302d9b7))

## [5.4.3](https://github.com/moranje/alfred-workflow-todoist/compare/v5.4.2...v5.4.3) (2018-10-08)


### Bug Fixes

* handle unknown settings in settings.json ([0680885](https://github.com/moranje/alfred-workflow-todoist/commit/0680885)), closes [#40](https://github.com/moranje/alfred-workflow-todoist/issues/40) [#41](https://github.com/moranje/alfred-workflow-todoist/issues/41)

## [5.4.2](https://github.com/moranje/alfred-workflow-todoist/compare/v5.4.1...v5.4.2) (2018-10-07)


### Bug Fixes

* more consistent caching of todoist API calls ([f397593](https://github.com/moranje/alfred-workflow-todoist/commit/f397593))

## [5.4.1](https://github.com/moranje/alfred-workflow-todoist/compare/v5.4.0...v5.4.1) (2018-10-07)


### Bug Fixes

* add es version of lodash ([46d7ae3](https://github.com/moranje/alfred-workflow-todoist/commit/46d7ae3))


### Reverts

* files went missing after a failing build ([7c4af52](https://github.com/moranje/alfred-workflow-todoist/commit/7c4af52))

# [5.4.0](https://github.com/moranje/alfred-workflow-todoist/compare/v5.3.2...v5.4.0) (2018-10-07)


### Bug Fixes

* once again add missing file ([dc6379a](https://github.com/moranje/alfred-workflow-todoist/commit/dc6379a))


### Features

* cache Todoist API calls ([0946caa](https://github.com/moranje/alfred-workflow-todoist/commit/0946caa))

## [5.3.2](https://github.com/moranje/alfred-workflow-todoist/compare/v5.3.1...v5.3.2) (2018-10-07)


### Bug Fixes

* add missing files ([23bda15](https://github.com/moranje/alfred-workflow-todoist/commit/23bda15))

## [5.3.1](https://github.com/moranje/alfred-workflow-todoist/compare/v5.3.0...v5.3.1) (2018-10-07)


### Bug Fixes

* add missing refrence ([53b13cc](https://github.com/moranje/alfred-workflow-todoist/commit/53b13cc))

# [5.3.0](https://github.com/moranje/alfred-workflow-todoist/compare/v5.2.0...v5.3.0) (2018-10-07)


### Bug Fixes

* **notifications:** notifications not being shown ([d158f02](https://github.com/moranje/alfred-workflow-todoist/commit/d158f02))
* **settings:** fix silent failure when applying a setting ([8b113fc](https://github.com/moranje/alfred-workflow-todoist/commit/8b113fc)), closes [#40](https://github.com/moranje/alfred-workflow-todoist/issues/40)
* **testing:** `npm run debug` now works as intended ([58c07ba](https://github.com/moranje/alfred-workflow-todoist/commit/58c07ba))


### Features

* tasks are now (fuzzily) searchable ([d4cfc5f](https://github.com/moranje/alfred-workflow-todoist/commit/d4cfc5f))

# [5.2.0](https://github.com/moranje/alfred-workflow-todoist/compare/v5.1.3...v5.2.0) (2018-10-06)


### Bug Fixes

* better error logging ([bd7c907](https://github.com/moranje/alfred-workflow-todoist/commit/bd7c907))


### Features

* **workflow:** notification now links to created task ([244eb95](https://github.com/moranje/alfred-workflow-todoist/commit/244eb95))

## [5.1.3](https://github.com/moranje/alfred-workflow-todoist/compare/v5.1.2...v5.1.3) (2018-10-05)


### Bug Fixes

* not being able to define a workflow setting ([5c042ea](https://github.com/moranje/alfred-workflow-todoist/commit/5c042ea))

## [5.1.2](https://github.com/moranje/alfred-workflow-todoist/compare/v5.1.1...v5.1.2) (2018-10-04)


### Bug Fixes

* unwanted deletion of plist and icon files ([9093f6f](https://github.com/moranje/alfred-workflow-todoist/commit/9093f6f))

## [5.1.1](https://github.com/moranje/alfred-workflow-todoist/compare/v5.1.0...v5.1.1) (2018-10-04)


### Bug Fixes

* **workflow:** invalid reference to package.json ([a8a9ccf](https://github.com/moranje/alfred-workflow-todoist/commit/a8a9ccf))

# [5.1.0](https://github.com/moranje/alfred-workflow-todoist/compare/v5.0.5...v5.1.0) (2018-10-04)


### Features

* **workflow:** better error reporting ([52c132b](https://github.com/moranje/alfred-workflow-todoist/commit/52c132b))

## [5.0.5](https://github.com/moranje/alfred-workflow-todoist/compare/v5.0.4...v5.0.5) (2018-10-03)


### Bug Fixes

* the .aflredworkflow not being updated ([fac7e6f](https://github.com/moranje/alfred-workflow-todoist/commit/fac7e6f))

## [5.0.4](https://github.com/moranje/alfred-workflow-todoist/compare/v5.0.3...v5.0.4) (2018-10-03)


### Bug Fixes

* include version number in workflow ([01d56d3](https://github.com/moranje/alfred-workflow-todoist/commit/01d56d3))

## [5.0.3](https://github.com/moranje/alfred-workflow-todoist/compare/v5.0.2...v5.0.3) (2018-10-02)


### Bug Fixes

* hopefully fixes automated version bumping in package.json ([1c631cd](https://github.com/moranje/alfred-workflow-todoist/commit/1c631cd))

## [5.0.2](https://github.com/moranje/alfred-workflow-todoist/compare/v5.0.1...v5.0.2) (2018-10-02)


### Bug Fixes

* asset folder not being created on ci server ([49f97b2](https://github.com/moranje/alfred-workflow-todoist/commit/49f97b2))

## [5.0.1](https://github.com/moranje/alfred-workflow-todoist/compare/v5.0.0...v5.0.1) (2018-10-02)


### Bug Fixes

* remove alfred environmental variables from scripts ([4d41f23](https://github.com/moranje/alfred-workflow-todoist/commit/4d41f23))
* remove dependancy on workflow environmental viariables ([b47028d](https://github.com/moranje/alfred-workflow-todoist/commit/b47028d))
