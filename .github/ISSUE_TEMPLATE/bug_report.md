---
name: Bug report
about: Create a report to help improve the workflow
---

### Description

A clear and concise description of what the bug is.

### Steps to reproduce

Steps to reproduce the behavior:

1. Alfred input '...'
2. Click on '....'
3. See error

### Expected behavior

A clear and concise description of what you expected to happen.

### Error logs

STEPS:

1. Open workflows tab in Alfred
2. Select `Alfred Workflow Todoist`
3. Select `Toggle debugging mode` in de upper right corner
4. Set logging to `All information` 5. Rerun query

Log:

```
ALFRED WORKFLOW TODOIST
----------------------------------------
os: macOS <version>
query: {"content":"<title>","priority":1}
node.js: <version>
alfred: <version>
workflow: <version>
Stack: HTTPError: Response code 400 (Bad Request)
 ...
```

### Additional context

Add any other context about the problem here.
