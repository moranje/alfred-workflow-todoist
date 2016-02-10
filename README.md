# ALFRED TODOIST WORKFLOW
Add tasks to your [Todoist][1] inbox or list upcoming tasks straight from [Alfred][2]. I nicked the idea from [Ruben Schmidtmann][3]'s [todoist-alfred-workflow][4], and further expanded on it. It uses Todoist `v6` API.

The task listing feature relies on javascript (sorry no PHP, perl of ruby foo) which means it works from Yosemite and up. The task adding feature should work on any Mac OSX version.

## Installation
[download][5] and import workflow.

## Configuration
1. * replace `TOKEN=<your api token>` in the bash file with your Todoist api token (get it from Todoist Preferences =\> Account =\> API-token)
	* replace the `DATE_LANG="nl"` to match your locale (valid languages are: : `en`, `da`, `pl`, `zh`, `ko`, `de`, `pt`, `ja`, `it`, `fr`, `sv`, `ru`, `es`, `nl`)
2. * insert your here `var CONFIG = { token: '<your api token>' }` (leave the quotes)
	* if you want to show more (or less) tasks, change the `var CONFIG = { maxItems: 10 }` to the desired amount.
3. If you need to use another hotkey, change it here.
4. If you need to change the trigger keyword to something else that `todo` do it here.

## Usage

**Add a task**
`⌘T {task}, {date}, {priority} `
`todo {task}, {date}, {priority}`
Example: _todo Get milk, tomorrow @ 9, 3_

### Task
Can be any string as long as there are no comma's in it. Markdown in the string will be parsed, but anything else won't.

### Date
See the [Todoist documentation][6] for supported date formats.

### Priority
A number between 1 and 4, where 1 is the lowest and 4 would be the highest priority.

Use a comma to separate the parameters, leading or trailing whitespace is ignored. If you wish to change the delimiter with which the parameters (task, date and priority) are separated, you'll need to change a line in the bash script. For instance if you'd like to use ';' as a delimiter, change:
	IFS=',' read -r -a SPLIT <<< "{query}"
to:
	IFS=':' read -r -a SPLIT <<< "{query}"

**View and mark done**
`⌘⇧T ` + navigate and hit ENTER
`todo` + navigate and hit ENTER

## License
The MIT License (MIT)

Copyright (c) 2016 [Martien Oranje][7]

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

[1]:	https://todoist.com/ "Todoist"
[2]:	https://www.alfredapp.com "Alfred"
[3]:	https://github.com/rubenschmidtmann "Ruben Schmidtmann"
[4]:	https://github.com/rubenschmidtmann/todoist-alfred-workflow "todoist-alfred-workflow"
[5]:	https://github.com/moranje/alfred-workflow-todoist/blob/master/dist/alfred-workflow-todoist.alfredworkflow?raw=true
[6]:	https://support.todoist.com/hc/en-us/articles/205325931-Dates-and-Times "Todoist documentation"
[7]:	https://github.com/moranje