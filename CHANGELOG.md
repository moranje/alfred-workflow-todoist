# [6.0.0-beta.1](https://github.com/moranje/alfred-workflow-todoist/compare/v5.8.4...v6.0.0-beta.1) (2020-02-26)

### Bug Fixes

- **settings:** rename annonymous_statistics to error_tracking ([3816345](https://github.com/moranje/alfred-workflow-todoist/commit/3816345b65d0db316ed2df84da908f212abaecd3))
- api filter requests being broken ([3b344a1](https://github.com/moranje/alfred-workflow-todoist/commit/3b344a10a5741030e281b0077f6d8e8c28834bd7))
- **build:** possibly fix version number not updated in alfred workflow ([ac02c22](https://github.com/moranje/alfred-workflow-todoist/commit/ac02c22f62e2ebbc0e2a69d4878d58b867e367a6))
- **cache:** cache always being reset ([d83408e](https://github.com/moranje/alfred-workflow-todoist/commit/d83408e0a066545b1c0db26fe2962a49ed93054d))
- **cache:** handle empty resource lists ([af89785](https://github.com/moranje/alfred-workflow-todoist/commit/af89785f5a1c4ffc1bedc1cdaf05c858c145b706))
- **cache:** issue where cache timestamps wouldn't be updated once created ([5156040](https://github.com/moranje/alfred-workflow-todoist/commit/515604085198124165424037aa4c31b4cbeae9e1))
- **commands:** [#151](https://github.com/moranje/alfred-workflow-todoist/issues/151) don't rely on alfred input filtering, remove uids ([92d9ac4](https://github.com/moranje/alfred-workflow-todoist/commit/92d9ac44d58761ea74216f54eea83a73101e7015))
- **commands:** certain characters not (" and \) being parsed ([d53d68f](https://github.com/moranje/alfred-workflow-todoist/commit/d53d68f699c214d1048d98d80bc224b97377b73e))
- **commands:** error when trying to retrieve a non existent project ([42e0009](https://github.com/moranje/alfred-workflow-todoist/commit/42e0009d794f9ab6c62002b0e6d8163b5ca41fa9))
- **project:** unhelpful error message when missing todoist token in settings ([5a0af91](https://github.com/moranje/alfred-workflow-todoist/commit/5a0af91b49b0c5b83ad73cb1fec768233e19df64))
- **settings:** [#152](https://github.com/moranje/alfred-workflow-todoist/issues/152) settings break with multiple consecutive spaces ([b3f2f2a](https://github.com/moranje/alfred-workflow-todoist/commit/b3f2f2a678e61d30a490d23e84028f1d6efe1e6d))
- **todoist:** task cache not being refreshed ([179c0bc](https://github.com/moranje/alfred-workflow-todoist/commit/179c0bcc67a0b1e3d7c5e55fb7e5d732f2065fbb))
- alfred workflow version is the same as the release version again ([0ce67a3](https://github.com/moranje/alfred-workflow-todoist/commit/0ce67a37d97a6dc8df26e13165350f09c96a3786))
- updater not picking up new prereleases, please update manually ([fdcb793](https://github.com/moranje/alfred-workflow-todoist/commit/fdcb793369000b580217db4a58311816503bb5c3))
- updater not storing last update timestamp ([35ff532](https://github.com/moranje/alfred-workflow-todoist/commit/35ff5328bd4bc789a7929e1c30fe03694c2c305d))

### Features

- **commands:** [#13](https://github.com/moranje/alfred-workflow-todoist/issues/13) sort by due date by default ([32044b0](https://github.com/moranje/alfred-workflow-todoist/commit/32044b072c20b949af05aebfcf6083e5e453e9aa))
- **commands:** filter tasks directly through Todoist ([f9bd460](https://github.com/moranje/alfred-workflow-todoist/commit/f9bd460a2c9a03f0d4efe92ffe6612fa1d6d231e)), closes [#13](https://github.com/moranje/alfred-workflow-todoist/issues/13) [#20](https://github.com/moranje/alfred-workflow-todoist/issues/20) [#72](https://github.com/moranje/alfred-workflow-todoist/issues/72)
- **parser:** reimplement date from now for timestamped tasks ([cd090d8](https://github.com/moranje/alfred-workflow-todoist/commit/cd090d8a26486bd36dc266582c0bc02469f9f9ef))
- **project:** full rewrite ([2849c8a](https://github.com/moranje/alfred-workflow-todoist/commit/2849c8a081f4254610ac41125c79fed9a55e557d)), closes [#128](https://github.com/moranje/alfred-workflow-todoist/issues/128) [#126](https://github.com/moranje/alfred-workflow-todoist/issues/126) [#20](https://github.com/moranje/alfred-workflow-todoist/issues/20) [#124](https://github.com/moranje/alfred-workflow-todoist/issues/124) [#128](https://github.com/moranje/alfred-workflow-todoist/issues/128) [#126](https://github.com/moranje/alfred-workflow-todoist/issues/126) [#124](https://github.com/moranje/alfred-workflow-todoist/issues/124) [#20](https://github.com/moranje/alfred-workflow-todoist/issues/20)
- **project:** provide a useful error as a list item when node.js is not installed ([e039157](https://github.com/moranje/alfred-workflow-todoist/commit/e0391577db34aa353fd1458698e7304a51821303))

### BREAKING CHANGES

- **project:** Improve string parsing, now requires id for project, labels and sections

# [6.0.0-alpha.10](https://github.com/moranje/alfred-workflow-todoist/compare/v6.0.0-alpha.9...v6.0.0-alpha.10) (2020-02-25)

### Bug Fixes

- api filter requests being broken ([3b344a1](https://github.com/moranje/alfred-workflow-todoist/commit/3b344a10a5741030e281b0077f6d8e8c28834bd7))
- **todoist:** task cache not being refreshed ([179c0bc](https://github.com/moranje/alfred-workflow-todoist/commit/179c0bcc67a0b1e3d7c5e55fb7e5d732f2065fbb))

# [6.0.0-alpha.9](https://github.com/moranje/alfred-workflow-todoist/compare/v6.0.0-alpha.8...v6.0.0-alpha.9) (2020-02-22)

### Bug Fixes

- **commands:** certain characters not (" and \) being parsed ([d53d68f](https://github.com/moranje/alfred-workflow-todoist/commit/d53d68f699c214d1048d98d80bc224b97377b73e))

### Features

- **commands:** filter tasks directly through Todoist ([f9bd460](https://github.com/moranje/alfred-workflow-todoist/commit/f9bd460a2c9a03f0d4efe92ffe6612fa1d6d231e)), closes [#13](https://github.com/moranje/alfred-workflow-todoist/issues/13) [#20](https://github.com/moranje/alfred-workflow-todoist/issues/20) [#72](https://github.com/moranje/alfred-workflow-todoist/issues/72)

# [6.0.0-alpha.8](https://github.com/moranje/alfred-workflow-todoist/compare/v6.0.0-alpha.7...v6.0.0-alpha.8) (2020-02-16)

### Bug Fixes

- **cache:** cache always being reset ([d83408e](https://github.com/moranje/alfred-workflow-todoist/commit/d83408e0a066545b1c0db26fe2962a49ed93054d))

### Features

- **commands:** [#13](https://github.com/moranje/alfred-workflow-todoist/issues/13) sort by due date by default ([32044b0](https://github.com/moranje/alfred-workflow-todoist/commit/32044b072c20b949af05aebfcf6083e5e453e9aa))

# [6.0.0-alpha.7](https://github.com/moranje/alfred-workflow-todoist/compare/v6.0.0-alpha.6...v6.0.0-alpha.7) (2020-02-16)

### Bug Fixes

- **cache:** handle empty resource lists ([af89785](https://github.com/moranje/alfred-workflow-todoist/commit/af89785f5a1c4ffc1bedc1cdaf05c858c145b706))
- **cache:** issue where cache timestamps wouldn't be updated once created ([5156040](https://github.com/moranje/alfred-workflow-todoist/commit/515604085198124165424037aa4c31b4cbeae9e1))

### Features

- **parser:** reimplement date from now for timestamped tasks ([cd090d8](https://github.com/moranje/alfred-workflow-todoist/commit/cd090d8a26486bd36dc266582c0bc02469f9f9ef))

# [6.0.0-alpha.6](https://github.com/moranje/alfred-workflow-todoist/compare/v6.0.0-alpha.5...v6.0.0-alpha.6) (2020-02-13)

### Bug Fixes

- **commands:** error when trying to retrieve a non existent project ([42e0009](https://github.com/moranje/alfred-workflow-todoist/commit/42e0009d794f9ab6c62002b0e6d8163b5ca41fa9))
- **settings:** [#152](https://github.com/moranje/alfred-workflow-todoist/issues/152) settings break with multiple consecutive spaces ([b3f2f2a](https://github.com/moranje/alfred-workflow-todoist/commit/b3f2f2a678e61d30a490d23e84028f1d6efe1e6d))

# [6.0.0-alpha.5](https://github.com/moranje/alfred-workflow-todoist/compare/v6.0.0-alpha.4...v6.0.0-alpha.5) (2020-02-12)

### Bug Fixes

- updater not storing last update timestamp ([35ff532](https://github.com/moranje/alfred-workflow-todoist/commit/35ff5328bd4bc789a7929e1c30fe03694c2c305d))
- **commands:** [#151](https://github.com/moranje/alfred-workflow-todoist/issues/151) don't rely on alfred input filtering, remove uids ([92d9ac4](https://github.com/moranje/alfred-workflow-todoist/commit/92d9ac44d58761ea74216f54eea83a73101e7015))

# [6.0.0-alpha.4](https://github.com/moranje/alfred-workflow-todoist/compare/v6.0.0-alpha.3...v6.0.0-alpha.4) (2020-02-11)

### Bug Fixes

- updater not picking up new prereleases, please update manually ([fdcb793](https://github.com/moranje/alfred-workflow-todoist/commit/fdcb793369000b580217db4a58311816503bb5c3))
- **project:** unhelpful error message when missing todoist token in settings ([5a0af91](https://github.com/moranje/alfred-workflow-todoist/commit/5a0af91b49b0c5b83ad73cb1fec768233e19df64))

# [6.0.0-alpha.3](https://github.com/moranje/alfred-workflow-todoist/compare/v6.0.0-alpha.2...v6.0.0-alpha.3) (2020-02-08)

### Bug Fixes

- alfred workflow version is the same as the release version again ([0ce67a3](https://github.com/moranje/alfred-workflow-todoist/commit/0ce67a37d97a6dc8df26e13165350f09c96a3786))

# [6.0.0-alpha.2](https://github.com/moranje/alfred-workflow-todoist/compare/v6.0.0-alpha.1...v6.0.0-alpha.2) (2020-02-08)

### Bug Fixes

- **build:** possibly fix version number not updated in alfred workflow ([ac02c22](https://github.com/moranje/alfred-workflow-todoist/commit/ac02c22f62e2ebbc0e2a69d4878d58b867e367a6))

# [6.0.0-alpha.1](https://github.com/moranje/alfred-workflow-todoist/compare/v5.8.4...v6.0.0-alpha.1) (2020-02-08)

### Features

- **project:** full rewrite ([2849c8a](https://github.com/moranje/alfred-workflow-todoist/commit/2849c8a081f4254610ac41125c79fed9a55e557d)), closes [#128](https://github.com/moranje/alfred-workflow-todoist/issues/128) [#126](https://github.com/moranje/alfred-workflow-todoist/issues/126) [#20](https://github.com/moranje/alfred-workflow-todoist/issues/20) [#124](https://github.com/moranje/alfred-workflow-todoist/issues/124) [#128](https://github.com/moranje/alfred-workflow-todoist/issues/128) [#126](https://github.com/moranje/alfred-workflow-todoist/issues/126) [#124](https://github.com/moranje/alfred-workflow-todoist/issues/124) [#20](https://github.com/moranje/alfred-workflow-todoist/issues/20)
- **project:** provide a useful error as a list item when node.js is not installed ([e039157](https://github.com/moranje/alfred-workflow-todoist/commit/e0391577db34aa353fd1458698e7304a51821303))

### BREAKING CHANGES

- **project:** Improve string parsing, now requires id for project, labels and sections

## [5.8.4](https://github.com/moranje/alfred-workflow-todoist/compare/v5.8.3...v5.8.4) (2019-12-15)

### Bug Fixes

- **alfred:** notifications not showing in Alfred v4 ([93c7307](https://github.com/moranje/alfred-workflow-todoist/commit/93c7307137983647183171b07ba2a04008b18407)), closes [#125](https://github.com/moranje/alfred-workflow-todoist/issues/125)
- **dependency:** lower required node.js to v10.x ([a222d5d](https://github.com/moranje/alfred-workflow-todoist/commit/a222d5d50d4c1d3b943b13b7332eedf6f403ace6))
- **settings:** no update notifications for alfa and beta releases ([1ad3186](https://github.com/moranje/alfred-workflow-todoist/commit/1ad31860379f108025f51c5a1bbcfe8ed5a4d868))

## [5.8.3](https://github.com/moranje/alfred-workflow-todoist/compare/v5.8.2...v5.8.3) (2019-08-04)

### Bug Fixes

- **project:** update to stable todoist v1 rest api ([7f3f34a](https://github.com/moranje/alfred-workflow-todoist/commit/7f3f34a)), closes [#113](https://github.com/moranje/alfred-workflow-todoist/issues/113)
- **tests:** failing test suite due a bug in nock under node 12 ([42cc96d](https://github.com/moranje/alfred-workflow-todoist/commit/42cc96d))
- **todoist:** support emoticons/emoji ([bfdce97](https://github.com/moranje/alfred-workflow-todoist/commit/bfdce97)), closes [#112](https://github.com/moranje/alfred-workflow-todoist/issues/112)

## [5.8.2](https://github.com/moranje/alfred-workflow-todoist/compare/v5.8.1...v5.8.2) (2019-04-22)

### Bug Fixes

- **parser:** add all language scripts in a more robust way ([b5fd7b4](https://github.com/moranje/alfred-workflow-todoist/commit/b5fd7b4)), closes [#111](https://github.com/moranje/alfred-workflow-todoist/issues/111)
- **parser:** use es5 compatible robust script parsing ([0b22006](https://github.com/moranje/alfred-workflow-todoist/commit/0b22006)), closes [#111](https://github.com/moranje/alfred-workflow-todoist/issues/111)

## [5.8.1](https://github.com/moranje/alfred-workflow-todoist/compare/v5.8.0...v5.8.1) (2019-04-05)

### Bug Fixes

- **project:** empty files constant on fresh install ([ea7ad1f](https://github.com/moranje/alfred-workflow-todoist/commit/ea7ad1f)), closes [#109](https://github.com/moranje/alfred-workflow-todoist/issues/109)

# [5.8.0](https://github.com/moranje/alfred-workflow-todoist/compare/v5.7.1...v5.8.0) (2019-03-30)

### Bug Fixes

- **project:** tests failing due to faulty notifier reference ([236a369](https://github.com/moranje/alfred-workflow-todoist/commit/236a369))

### Features

- **project:** periodic checks for workflow updates ([e9f4262](https://github.com/moranje/alfred-workflow-todoist/commit/e9f4262)), closes [#108](https://github.com/moranje/alfred-workflow-todoist/issues/108)

## [5.7.1](https://github.com/moranje/alfred-workflow-todoist/compare/v5.7.0...v5.7.1) (2019-03-26)

### Bug Fixes

- **project:** failing node.js check ([c9409d9](https://github.com/moranje/alfred-workflow-todoist/commit/c9409d9))
- **project:** return useful error message when node.js is missing ([a8a966e](https://github.com/moranje/alfred-workflow-todoist/commit/a8a966e)), closes [#107](https://github.com/moranje/alfred-workflow-todoist/issues/107)
- **project:** return useful error when API key is missing ([7fbc41b](https://github.com/moranje/alfred-workflow-todoist/commit/7fbc41b)), closes [#106](https://github.com/moranje/alfred-workflow-todoist/issues/106)

# [5.7.0](https://github.com/moranje/alfred-workflow-todoist/compare/v5.6.5...v5.7.0) (2019-03-16)

### Features

- **parser:** add support for scripts other than latin ([b12ce3d](https://github.com/moranje/alfred-workflow-todoist/commit/b12ce3d)), closes [#105](https://github.com/moranje/alfred-workflow-todoist/issues/105)
- **todoist:** add japanese timestamp translations ([44b47dd](https://github.com/moranje/alfred-workflow-todoist/commit/44b47dd))

## [5.6.5](https://github.com/moranje/alfred-workflow-todoist/compare/v5.6.4...v5.6.5) (2018-12-05)

### Bug Fixes

- fix missing new invocation in cache module (probably harmless) ([4777b2f](https://github.com/moranje/alfred-workflow-todoist/commit/4777b2f))

## [5.6.4](https://github.com/moranje/alfred-workflow-todoist/compare/v5.6.3...v5.6.4) (2018-11-11)

### Bug Fixes

- allow labels to be hyphenated ([ae309ef](https://github.com/moranje/alfred-workflow-todoist/commit/ae309ef)), closes [#50](https://github.com/moranje/alfred-workflow-todoist/issues/50)

## [5.6.3](https://github.com/moranje/alfred-workflow-todoist/compare/v5.6.2...v5.6.3) (2018-10-27)

### Bug Fixes

- add valid error handler fot task creation logic ([13446cc](https://github.com/moranje/alfred-workflow-todoist/commit/13446cc))

## [5.6.2](https://github.com/moranje/alfred-workflow-todoist/compare/v5.6.1...v5.6.2) (2018-10-27)

### Bug Fixes

- completing a task now closes a task instead of deleting it ([a0c71f8](https://github.com/moranje/alfred-workflow-todoist/commit/a0c71f8)), closes [#47](https://github.com/moranje/alfred-workflow-todoist/issues/47)

## [5.6.1](https://github.com/moranje/alfred-workflow-todoist/compare/v5.6.0...v5.6.1) (2018-10-15)

### Bug Fixes

- broken import references ([25728ab](https://github.com/moranje/alfred-workflow-todoist/commit/25728ab))
- update cache after task creation or completion ([6172d28](https://github.com/moranje/alfred-workflow-todoist/commit/6172d28)), closes [#44](https://github.com/moranje/alfred-workflow-todoist/issues/44)

# [5.6.0](https://github.com/moranje/alfred-workflow-todoist/compare/v5.5.0...v5.6.0) (2018-10-14)

### Bug Fixes

- prevent error message on notification without url ([40d821a](https://github.com/moranje/alfred-workflow-todoist/commit/40d821a))

### Features

- add label and project suggestions on task creation ([9478347](https://github.com/moranje/alfred-workflow-todoist/commit/9478347))
- allow created tasks to assign project and labels ([550b15b](https://github.com/moranje/alfred-workflow-todoist/commit/550b15b))

# [5.5.0](https://github.com/moranje/alfred-workflow-todoist/compare/v5.4.5...v5.5.0) (2018-10-10)

### Bug Fixes

- automatically create missing folders for workflow files ([6640fb8](https://github.com/moranje/alfred-workflow-todoist/commit/6640fb8))

### Features

- respect `cache_timeout` setting ([bf18000](https://github.com/moranje/alfred-workflow-todoist/commit/bf18000))
- respect `language` setting when creating a task ([c09a903](https://github.com/moranje/alfred-workflow-todoist/commit/c09a903))

## [5.4.5](https://github.com/moranje/alfred-workflow-todoist/compare/v5.4.4...v5.4.5) (2018-10-10)

### Bug Fixes

- **settings:** validation: allow uuid to be made up out `A-F` chars ([951bcf3](https://github.com/moranje/alfred-workflow-todoist/commit/951bcf3))

## [5.4.4](https://github.com/moranje/alfred-workflow-todoist/compare/v5.4.3...v5.4.4) (2018-10-09)

### Bug Fixes

- add extra space to prevent item list from remaining open ([d96b517](https://github.com/moranje/alfred-workflow-todoist/commit/d96b517))
- allows for token setting to be empty (initial state) ([4140290](https://github.com/moranje/alfred-workflow-todoist/commit/4140290))
- setting validation errors ([302d9b7](https://github.com/moranje/alfred-workflow-todoist/commit/302d9b7))

## [5.4.3](https://github.com/moranje/alfred-workflow-todoist/compare/v5.4.2...v5.4.3) (2018-10-08)

### Bug Fixes

- handle unknown settings in settings.json ([0680885](https://github.com/moranje/alfred-workflow-todoist/commit/0680885)), closes [#40](https://github.com/moranje/alfred-workflow-todoist/issues/40) [#41](https://github.com/moranje/alfred-workflow-todoist/issues/41)

## [5.4.2](https://github.com/moranje/alfred-workflow-todoist/compare/v5.4.1...v5.4.2) (2018-10-07)

### Bug Fixes

- more consistent caching of todoist API calls ([f397593](https://github.com/moranje/alfred-workflow-todoist/commit/f397593))

## [5.4.1](https://github.com/moranje/alfred-workflow-todoist/compare/v5.4.0...v5.4.1) (2018-10-07)

### Bug Fixes

- add es version of lodash ([46d7ae3](https://github.com/moranje/alfred-workflow-todoist/commit/46d7ae3))

### Reverts

- files went missing after a failing build ([7c4af52](https://github.com/moranje/alfred-workflow-todoist/commit/7c4af52))

# [5.4.0](https://github.com/moranje/alfred-workflow-todoist/compare/v5.3.2...v5.4.0) (2018-10-07)

### Bug Fixes

- once again add missing file ([dc6379a](https://github.com/moranje/alfred-workflow-todoist/commit/dc6379a))

### Features

- cache Todoist API calls ([0946caa](https://github.com/moranje/alfred-workflow-todoist/commit/0946caa))

## [5.3.2](https://github.com/moranje/alfred-workflow-todoist/compare/v5.3.1...v5.3.2) (2018-10-07)

### Bug Fixes

- add missing files ([23bda15](https://github.com/moranje/alfred-workflow-todoist/commit/23bda15))

## [5.3.1](https://github.com/moranje/alfred-workflow-todoist/compare/v5.3.0...v5.3.1) (2018-10-07)

### Bug Fixes

- add missing refrence ([53b13cc](https://github.com/moranje/alfred-workflow-todoist/commit/53b13cc))

# [5.3.0](https://github.com/moranje/alfred-workflow-todoist/compare/v5.2.0...v5.3.0) (2018-10-07)

### Bug Fixes

- **notifications:** notifications not being shown ([d158f02](https://github.com/moranje/alfred-workflow-todoist/commit/d158f02))
- **settings:** fix silent failure when applying a setting ([8b113fc](https://github.com/moranje/alfred-workflow-todoist/commit/8b113fc)), closes [#40](https://github.com/moranje/alfred-workflow-todoist/issues/40)
- **testing:** `npm run debug` now works as intended ([58c07ba](https://github.com/moranje/alfred-workflow-todoist/commit/58c07ba))

### Features

- tasks are now (fuzzily) searchable ([d4cfc5f](https://github.com/moranje/alfred-workflow-todoist/commit/d4cfc5f))

# [5.2.0](https://github.com/moranje/alfred-workflow-todoist/compare/v5.1.3...v5.2.0) (2018-10-06)

### Bug Fixes

- better error logging ([bd7c907](https://github.com/moranje/alfred-workflow-todoist/commit/bd7c907))

### Features

- **workflow:** notification now links to created task ([244eb95](https://github.com/moranje/alfred-workflow-todoist/commit/244eb95))

## [5.1.3](https://github.com/moranje/alfred-workflow-todoist/compare/v5.1.2...v5.1.3) (2018-10-05)

### Bug Fixes

- not being able to define a workflow setting ([5c042ea](https://github.com/moranje/alfred-workflow-todoist/commit/5c042ea))

## [5.1.2](https://github.com/moranje/alfred-workflow-todoist/compare/v5.1.1...v5.1.2) (2018-10-04)

### Bug Fixes

- unwanted deletion of plist and icon files ([9093f6f](https://github.com/moranje/alfred-workflow-todoist/commit/9093f6f))

## [5.1.1](https://github.com/moranje/alfred-workflow-todoist/compare/v5.1.0...v5.1.1) (2018-10-04)

### Bug Fixes

- **workflow:** invalid reference to package.json ([a8a9ccf](https://github.com/moranje/alfred-workflow-todoist/commit/a8a9ccf))

# [5.1.0](https://github.com/moranje/alfred-workflow-todoist/compare/v5.0.5...v5.1.0) (2018-10-04)

### Features

- **workflow:** better error reporting ([52c132b](https://github.com/moranje/alfred-workflow-todoist/commit/52c132b))

## [5.0.5](https://github.com/moranje/alfred-workflow-todoist/compare/v5.0.4...v5.0.5) (2018-10-03)

### Bug Fixes

- the .aflredworkflow not being updated ([fac7e6f](https://github.com/moranje/alfred-workflow-todoist/commit/fac7e6f))

## [5.0.4](https://github.com/moranje/alfred-workflow-todoist/compare/v5.0.3...v5.0.4) (2018-10-03)

### Bug Fixes

- include version number in workflow ([01d56d3](https://github.com/moranje/alfred-workflow-todoist/commit/01d56d3))

## [5.0.3](https://github.com/moranje/alfred-workflow-todoist/compare/v5.0.2...v5.0.3) (2018-10-02)

### Bug Fixes

- hopefully fixes automated version bumping in package.json ([1c631cd](https://github.com/moranje/alfred-workflow-todoist/commit/1c631cd))

## [5.0.2](https://github.com/moranje/alfred-workflow-todoist/compare/v5.0.1...v5.0.2) (2018-10-02)

### Bug Fixes

- asset folder not being created on ci server ([49f97b2](https://github.com/moranje/alfred-workflow-todoist/commit/49f97b2))

## [5.0.1](https://github.com/moranje/alfred-workflow-todoist/compare/v5.0.0...v5.0.1) (2018-10-02)

### Bug Fixes

- remove alfred environmental variables from scripts ([4d41f23](https://github.com/moranje/alfred-workflow-todoist/commit/4d41f23))
- remove dependancy on workflow environmental viariables ([b47028d](https://github.com/moranje/alfred-workflow-todoist/commit/b47028d))
