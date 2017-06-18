import fs = require('fs');
import { fuzzysearch as fuzzy } from './fuzzysearch';
import { writeToFile, List, write, writeError } from './workflow';
import {
  getResources,
  markTaskDone,
  taskAdapter,
  labelAdapter,
  projectAdapter,
  priorityAdapter
} from './todoist';

const settings = require(`${process.env
  .HOME}/Library/Application Support/Alfred 3/Workflow Data/com.alfred-workflow-todoist/settings.json`);
const cache = require(`${settings.cache_path}/todoist.json`);
let priorities = [
  { urgency: '1' },
  { urgency: '2' },
  { urgency: '3' },
  { urgency: '4' }
];

// ############################################################################
// # Workflow API calls
// ############################################################################

/**
 * Refreshes the Todoist data cache.
 *
 * @author moranje
 * @since  2016-08-24
 * @return {void}
 */
export function refreshCache(): void {
  getResources(settings.token, ['projects', 'items', 'labels'], (err, data) => {
    if (err) return writeError(err);
    let labelList = new List(
      data.labels.map((apiItem: any) => labelAdapter(apiItem))
    );
    let projectList = new List(
      data.projects.map((apiItem: any) => projectAdapter(apiItem))
    );
    let priorityList = new List(
      priorities.map((priority: any) => priorityAdapter(priority))
    );

    writeToFile(data, `${settings.cache_path}/todoist.json`);
    writeToFile(labelList, 'menu/labels.json');
    writeToFile(projectList, 'menu/projects.json');
    writeToFile(priorityList, 'menu/priorities.json');
  });
}

/**
 * Get a capped list of tasks from Todoist.
 *
 * @author moranje
 * @since  2016-07-03
 * @return {void}
 */
export function getTasksCapped(): void {
  getResources(settings.token, ['items'], (err, data) => {
    if (err) return writeError(err);
    if (!Array.isArray(data.items)) return writeError(data);
    var list = new List(data.items.map((apiItem: any) => taskAdapter(apiItem)));

    return list.capAt(settings.max_items).write();
  });
}

/**
 * Search (fuzzy) the todoist tasks
 *
 * @author moranje
 * @since  2016-08-24
 * @param  {String}   query The search query string.
 * @return {void}
 */
export function searchTasks(query: string): void {
  getResources(settings.token, ['items'], (err, data) => {
    if (err) return writeError(err);
    if (!Array.isArray(data.items)) return writeError(data);

    let list = new List();

    data.items.forEach((task: any) => {
      if (fuzzy(query.toLowerCase(), task.content.toLowerCase())) {
        list.add({ title: task.content });
      }
    });

    return list.write();
  });
}

/**
 * Get project id from Todoist.
 *
 * @author moranje
 * @param {String} name The project's name.
 * @since  2016-07-04
 * @return {void}
 */
export function getProjectId(name: string): void {
  getResources(settings.token, ['projects'], (err, data) => {
    if (err) return writeError(err);
    if (!Array.isArray(data.projects)) return writeError(data);

    let projects: any = {};

    data.projects.forEach((project: any) => {
      projects[project.name.toLowerCase()] = project.id;
    });

    return write(projects[name.toLowerCase()]);
  });
}

/**
 * Get a list of labels ids from Todoist.
 *
 * @author moranje
 * @param {String} labelString The label names string.
 * @since  2016-07-04
 * @return {void}
 */
export function getLabelIds(labelString: string): void {
  getResources(settings.token, ['labels'], (err, data) => {
    if (err) return writeError(err);
    if (!Array.isArray(data.labels)) return writeError(data);

    var names: Array<string> = labelString.split(',');
    var labels: Array<number> = [];

    data.labels.forEach((label: any) => {
      names.forEach(name => {
        if (labelString && name === label.name) {
          labels.push(label.id);
        }
      });
    });

    return write(labels);
  });
}

/**
 * Mark a todo item 'done'.
 *
 * @author moranje
 * @param {Number}    id The task's id.
 * @since  2016-07-03
 * @return {void}
 */
export function markDone(id: number): void {
  markTaskDone(id, settings.token, (err, data) => {
    if (err) return writeError(err);
    var string = JSON.stringify(data);
    var match;

    if (string.match(/"error":/)) {
      match = string.match(/"error": ?"(.*?)"/);
      writeError(match[1]);
    }

    // Notification message.
    write('Done, done and done!');
  });
}
