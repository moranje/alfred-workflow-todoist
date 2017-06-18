"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fuzzysearch_1 = require("./fuzzysearch");
var workflow_1 = require("./workflow");
var todoist_1 = require("./todoist");
var settings = require(process.env.HOME +
  "/Library/Application Support/Alfred 3/Workflow Data/com.alfred-workflow-todoist/settings.json");
var cache = require(settings.cache_path + "/todoist.json");
var priorities = [
  { urgency: "1" },
  { urgency: "2" },
  { urgency: "3" },
  { urgency: "4" }
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
function refreshCache() {
  todoist_1.getResources(
    settings.token,
    ["projects", "items", "labels"],
    function(err, data) {
      if (err) return workflow_1.writeError(err);
      var labelList = new workflow_1.List(
        data.labels.map(function(apiItem) {
          return todoist_1.labelAdapter(apiItem);
        })
      );
      var projectList = new workflow_1.List(
        data.projects.map(function(apiItem) {
          return todoist_1.projectAdapter(apiItem);
        })
      );
      var priorityList = new workflow_1.List(
        priorities.map(function(priority) {
          return todoist_1.priorityAdapter(priority);
        })
      );
      workflow_1.writeToFile(data, settings.cache_path + "/todoist.json");
      workflow_1.writeToFile(labelList, "menu/labels.json");
      workflow_1.writeToFile(projectList, "menu/projects.json");
      workflow_1.writeToFile(priorityList, "menu/priorities.json");
    }
  );
}
exports.refreshCache = refreshCache;
/**
 * Get a capped list of tasks from Todoist.
 *
 * @author moranje
 * @since  2016-07-03
 * @return {void}
 */
function getTasksCapped() {
  todoist_1.getResources(settings.token, ["items"], function(err, data) {
    if (err) return workflow_1.writeError(err);
    if (!Array.isArray(data.items)) return workflow_1.writeError(data);
    var list = new workflow_1.List(
      data.items.map(function(apiItem) {
        return todoist_1.taskAdapter(apiItem);
      })
    );
    return list.capAt(settings.max_items).write();
  });
}
exports.getTasksCapped = getTasksCapped;
/**
 * Search (fuzzy) the todoist tasks
 *
 * @author moranje
 * @since  2016-08-24
 * @param  {String}   query The search query string.
 * @return {void}
 */
function searchTasks(query) {
  todoist_1.getResources(settings.token, ["items"], function(err, data) {
    if (err) return workflow_1.writeError(err);
    if (!Array.isArray(data.items)) return workflow_1.writeError(data);
    var list = new workflow_1.List();
    data.items.forEach(function(task) {
      if (
        fuzzysearch_1.fuzzysearch(
          query.toLowerCase(),
          task.content.toLowerCase()
        )
      ) {
        list.add({ title: task.content });
      }
    });
    return list.write();
  });
}
exports.searchTasks = searchTasks;
/**
 * Get project id from Todoist.
 *
 * @author moranje
 * @param {String} name The project's name.
 * @since  2016-07-04
 * @return {void}
 */
function getProjectId(name) {
  todoist_1.getResources(settings.token, ["projects"], function(err, data) {
    if (err) return workflow_1.writeError(err);
    if (!Array.isArray(data.projects)) return workflow_1.writeError(data);
    var projects = {};
    data.projects.forEach(function(project) {
      projects[project.name.toLowerCase()] = project.id;
    });
    return workflow_1.write(projects[name.toLowerCase()]);
  });
}
exports.getProjectId = getProjectId;
/**
 * Get a list of labels ids from Todoist.
 *
 * @author moranje
 * @param {String} labelString The label names string.
 * @since  2016-07-04
 * @return {void}
 */
function getLabelIds(labelString) {
  todoist_1.getResources(settings.token, ["labels"], function(err, data) {
    if (err) return workflow_1.writeError(err);
    if (!Array.isArray(data.labels)) return workflow_1.writeError(data);
    var names = labelString.split(",");
    var labels = [];
    data.labels.forEach(function(label) {
      names.forEach(function(name) {
        if (labelString && name === label.name) {
          labels.push(label.id);
        }
      });
    });
    return workflow_1.write(labels);
  });
}
exports.getLabelIds = getLabelIds;
/**
 * Mark a todo item 'done'.
 *
 * @author moranje
 * @param {Number}    id The task's id.
 * @since  2016-07-03
 * @return {void}
 */
function markDone(id) {
  todoist_1.markTaskDone(id, settings.token, function(err, data) {
    if (err) return workflow_1.writeError(err);
    var string = JSON.stringify(data);
    var match;
    if (string.match(/"error":/)) {
      match = string.match(/"error": ?"(.*?)"/);
      workflow_1.writeError(match[1]);
    }
    // Notification message.
    workflow_1.write("Done, done and done!");
  });
}
exports.markDone = markDone;
