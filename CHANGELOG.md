Changelog
=========

### 3.1.5

-	[FEATURE] Task information is shown in subtitles when a new task is created a a task search is performed
-	[FEATURE] Projects are now parsed with `#` notation in task creation
-	[FEATURE] Dropdown menu's for projects, labels and priorities in task creation
-	[FEATURE] Added update checking with `t:update`
-	[FEATURE] Changing to item_close to support recurring task completion @stphnlwlsh
-	[CHORE] Switched to [typescript](https://www.typescriptlang.org/index.html)
-	[STATISTICS] Statistics added to get feedback on Node.js usage, version and to get an idea of which settings (token excluded) are used. Activated only one time with `t` command.

### 3.1.4

-	[FIX] Introduced a bug in last version where labels and projects weren't added to a task

### 3.1.3

-	[FIX] Fixed a bug where adding a task would fail if node.js wasn't installed

### 3.1.2

-	[FIX] Add a an error response when the add task fails  
-	[FIX] Refresh cache after a task is added  
-	[FIX] Fixed last path issue thanks @WillPlatnick

### 3.1.1

-	[FIX] resolve to user home dir instead of my own

### 3.1.0

-	[FEATURE] `todos + {query}` (todo search) command added, now you can fuzzy search your tasks.  
-	[FEATURE] caching! Cache is refreshed on hitting `t`. Everything should run a little faster now.  
-	[CHANGE] running `todos` without a query will list your todos (this feature used to be under `todo`\)

### 3.0.0

-	[FEATURE] Add labels to your tasks
-	[FEATURE] Add a task to an existing project
-	[BREAKING] Changed the API

### 2.0.1

-	[FIX] Auto create missing workflow directory, thanks etaming!

### 2.0.0

-	Rewrote nearly everything
-	[BREAKING]: Removed osascript, file system operations are clunky, and the documentation is poor.
-	[BREAKING]: Instead used Node.js now, easy install provided
-	[FIX]: Fixed listing function
-	[FEATURE]: Easier configuration with `t:` options
-	[FEATURE]: Auto migrate old settings
-	[FEATURE]: Updated to Todoist API v7

### 1.0.1

-	[FIX] Undo bundle id change, since it's needed for updating packal

### 1.0.0 

-	[BREAKING]: changed bundle id from `com.alfred-workflow-todoist` tot `com.moranje.alfred-workflow-todoist`
-	[FEATURE]: Easier configuration with `todo:config {api token}, {language}, {max list items}`, see README.md for further reference

### 0.6.0

-	[FEATURE]: List tasks using `todo` and mark a task done using navigation + ENTER

### 0.5.0

-	initial release
