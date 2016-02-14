# ALFRED TODOIST WORKFLOW
Add tasks to your [Todoist](https://todoist.com/ "Todoist") inbox or list upcoming tasks straight from [Alfred](https://www.alfredapp.com "Alfred"). I nicked the idea from [Ruben Schmidtmann](https://github.com/rubenschmidtmann "Ruben Schmidtmann")'s [todoist-alfred-workflow](https://github.com/rubenschmidtmann/todoist-alfred-workflow "todoist-alfred-workflow"), and further expanded on it. It uses Todoist `v6` API.

The task listing feature relies on javascript (sorry no PHP, perl of ruby foo) which means it works from Yosemite and up. The task adding feature should work on any Mac OSX version.

## Installation
[Download](https://github.com/moranje/alfred-workflow-todoist/raw/master/dist/Alfred%20Workflow%20Todoist.alfredworkflow) and import workflow.

## Configuration
![](https://raw.githubusercontent.com/moranje/alfred-workflow-todoist/master/images/config.png "Configuration image")  

**One Time Config**  
`todo:config {api token}, {language}, {max list items}`  
Example: _todo:config 2d2e2a334c5f36e7a7c43b46e, nl, 9_

### Token*
Your Todoist api token, get it from Todoist Preferences => Account => API-token (should be 40 charcters)

### Language*
This is relevant for parsing date strings ('tomorrow @ 9pm', in `en`). Valid languages are: `en`, `da`, `pl`, `zh`, `ko`, `de`, `pt`, `ja`, `it`, `fr`, `sv`, `ru`, `es`, `nl`.

### Max List Items*
This parameter limits the amount of tasks shown when using the `todo` command.

\* All of these are required!

## Usage
![](https://raw.githubusercontent.com/moranje/alfred-workflow-todoist/master/images/add-task.png "Add a task to your Todoist Inbox")  

**Add a task**  
`todo {task}, {date}, {priority}`  
Example: _todo Get milk, tomorrow @ 9, 3_  

### Task
Can be any string as long as there are no comma's in it. Markdown in the string will be parsed, but anything else won't.

### Date
See the [Todoist documentation](https://support.todoist.com/hc/en-us/articles/205325931-Dates-and-Times "Todoist documentation") for supported date formats.

### Priority
A number between 1 and 4, where 1 is the lowest and 4 would be the highest priority.

Use a comma to separate the parameters, leading or trailing whitespace is ignored. If you wish to change the delimiter with which the parameters (task, date and priority) are separated, you'll need to change a line in the bash script. For instance if you'd like to use ';' as a delimiter, change:  
```bash
IFS=',' read -r -a SPLIT <<< "{query}"
```  
to:    
```bash
IFS=':' read -r -a SPLIT <<< "{query}"
```  

![](https://raw.githubusercontent.com/moranje/alfred-workflow-todoist/master/images/list-tasks.png "List your Todoist tasks ")  

**View and mark done**  
`todo` + navigate and hit ENTER  

## Changelog
View [CHANGELOG.md](https://raw.githubusercontent.com/moranje/alfred-workflow-todoist/master/CHANGELOG.md "Changelog")

## License
The MIT License (MIT)

Copyright (c) 2016 [Martien Oranje](https://github.com/moranje)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
