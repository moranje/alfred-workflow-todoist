# Changelog

### 3.0.0
- [FEATURE] Add labels to your tasks
- [FEATURE] Add a task to an existing project
- [BREAKING] Changed the API

### 2.0.1
- [FIX] Auto create missing workflow directory, thanks etaming!

### 2.0.0
- Rewrote nearly everything
- [BREAKING]: Removed osascript, file system operations are very clunky, and the documentation is poor.
- [BREAKING]: Instead used Node.js now, easy install provided
- [FIX]: Fixed listing function
- [FEATURE]: Easier configuration with `t:` options
- [FEATURE]: Auto migrate old settings
- [FEATURE]: Updated to Todoist API v7 

### 1.0.1
- [FIX] Undo bundle id change, since it's needed for updating packal

### 1.0.0   
- [BREAKING]: changed bundle id from `com.alfred-workflow-todoist` tot `com.moranje.alfred-workflow-todoist`
- [FEATURE]: Easier configuration with `todo:config {api token}, {language}, {max list items}`, see README.md for further reference

### 0.6.0
- [FEATURE]: List tasks using `todo` and mark a task done using navigation + ENTER

### 0.5.0
- initial release