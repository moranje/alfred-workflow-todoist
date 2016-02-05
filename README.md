# ALFRED TODOIST WORKFLOW
Add a task to your [Todoist](https://todoist.com/ "Todoist") inbox from [Alfred](https://www.alfredapp.com "Alfred"). I nicked the idea from [Ruben Schmidtmann](https://github.com/rubenschmidtmann "Ruben Schmidtmann")'s [todoist-alfred-workflow](https://github.com/rubenschmidtmann/todoist-alfred-workflow "todoist-alfred-workflow"), and expanded on it a little. It uses Todoist `v6` API.

## Installation
1. [download](https://github.com/moranje/alfred-workflow-todoist/blob/master/dist/alfred-workflow-todoist.alfredworkflow?raw=true) and import workflow
2. replace `TOKEN=<your api key>` in the bash file with your Todoist api key (get it from Todoist Preferences =\> Account =\> API-token)
3. replace the `DATE_LANG="nl"` to match your locale (valid languages are: : `en`, `da`, `pl`, `zh`, `ko`, `de`, `pt`, `ja`, `it`, `fr`, `sv`, `ru`, `es`, `nl`)

## Usage
`todo {task}, {date}, {priority}`

### Task
Can be any string as long as there are no comma's in it. Markdown in the string will be parsed, but anything else won't.

### Date
See the [Todoist documentation](https://support.todoist.com/hc/en-us/articles/205325931-Dates-and-Times "Todoist documentation") for supported date formats.

### Priority
A number between 1 and 4, where 1 is the lowest and 4 would be the highest priority.

Use a comma to separate the parameters, leading or trailing whitespace is ignored. If you wish to change the delimiter with which the parameters (task, date and priority) are separated, you'll need to change a line in the bash script. For instance if you'd like to use ';' as a delimeter, change:
	IFS=',' read -r -a SPLIT <<< "{query}"
to:
	IFS=':' read -r -a SPLIT <<< "{query}"

## What I haven't figured out
1. ** More parameters..** not sure if the added complexity of defining tasks is worth the tradeoff
2. ** Defining ue date's **, simple date's like `Today`, `Monday` look simple enough, but more complex date's like `Mon 07 Aug 2006 12:34:56` are no fun to type out. Plus they'd have to be in UTC time.
3. **Adding labels to a task **, can only be assigned through their id's. I haven't figured out how to set them using their named values (I don't go around remembering their id's).
4. ** Adding a task to a project **, just no idea...

## License
The MIT License (MIT)

Copyright (c) [2016](#) [Martien Oranje](#)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
