"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var https = require("https");
var querystring = require("querystring");
var settings = require(process.env.HOME +
  "/Library/Application Support/Alfred 3/Workflow Data/com.alfred-workflow-todoist/settings.json");
var cache = require(settings.cache_path + "/todoist.json");
/**
 * Build the url to the Todoist API.
 *
 * @author moranje
 * @since  2016-07-03
 * @param  {Object}   queryParams API params.
 * @return {Object}
 */
function buildUrl(queryParams) {
  return {
    hostname: "todoist.com",
    path: "/API/v7/sync?" + querystring.stringify(queryParams)
  };
}
/**
 * Generate a UUID.
 *
 * @author moranje
 * @since  2016-07-03
 * @return {String}
 */
function uuid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
/**
 * Create a subtitle string with the available information a task object.
 *
 * @author moranje
 * @since  2017-06-17
 * @param  {Object}      task A task object.
 * @return {String}                  A subtitle string.
 */
function taskString(task, projects, labels) {
  if (projects === void 0) {
    projects = [];
  }
  if (labels === void 0) {
    labels = [];
  }
  var space = "          ";
  var string = "";
  var projectName = "INBOX";
  var labelNames = [];
  labels.forEach(function(label) {
    task.labels.forEach(function(id) {
      if (id === label.id) {
        labelNames.push(label.name);
      }
    });
  });
  projects.forEach(function(project) {
    if (project.id === task.project_id) {
      projectName = "" + project.name.toUpperCase();
    }
  });
  string += "" + projectName + space;
  if (task.date_string) {
    string += "" + task.date_string + space;
  }
  if (task.priority > 1) {
    string += "\u203C " + task.priority + space;
  }
  if (labelNames.length > 0) {
    string += "\uFF20 " + labelNames.join(",") + space;
  }
  return string + " (\u21B5 to complete)";
}
/**
 * Async call to the Todoist API.
 *
 * @author moranje
 * @since  2016-07-03
 * @param  {Object}   queryParams The query parameters.
 * @param  {Function} fn          The  callback
 */
function api(queryParams, fn) {
  var req = https.get(buildUrl(queryParams), function(res) {
    var data = "";
    res.on("data", function(chunk) {
      data += chunk;
    });
    res.on("end", function() {
      fn(null, JSON.parse(data));
    });
    // Return response errors
    res.on("error", function(err) {
      fn(err);
    });
  });
  // Return request errors
  req.on("error", function(err) {
    fn(err);
  });
}
exports.api = api;
/**
 * Get one or more resources from the todoist API
 *
 * @author moranje
 * @since  2017-06-12
 * @param  {String}   token The Todoist API token.
 * @param  {Array}    types The resource types
 * @param  {Function} fn    The callback
 * @return {Object}         The API response
 */
function getResources(token, types, fn) {
  if (cache.seq_no_global) {
    return fn(cache);
  }
  return api(
    {
      token: token,
      seq_no: 0,
      resource_types: JSON.stringify(types)
    },
    fn
  );
}
exports.getResources = getResources;
/**
 * Mark a task 'done'.
 *
 * @author moranje
 * @since  2016-07-03
 * @param  {Number}   id      A task id.
 * @param  {String}   token   A Todoist token.
 * @param  {Function} fn      The fn callback.
 */
function markTaskDone(id, token, fn) {
  return api(
    {
      token: token,
      commands: JSON.stringify([
        {
          type: "item_close",
          uuid: uuid(),
          args: { id: +id }
        }
      ])
    },
    fn
  );
}
exports.markTaskDone = markTaskDone;
/**
 * Adapter for tasks retrieved from todoists API.
 *
 * @author moranje
 * @since  2017-06-17
 * @param  {Object}       tasks An item (task) object from todoist.
 * @return {WorkflowItem}             An Alfred workflow item.
 */
function taskAdapter(tasks, projects, labels) {
  return {
    title: tasks.content,
    subtitle: taskString(tasks, projects, labels),
    arg: JSON.stringify({ id: tasks.id }),
    valid: true
  };
}
exports.taskAdapter = taskAdapter;
/**
 * Adapter for projects retrieved from todoists API.
 *
 * @author moranje
 * @since  2017-06-17
 * @param  {Object}        apiResponse A project object from todoist.
 * @return {WorkflowItem}              An Alfred workflow item.
 */
function projectAdapter(apiResponse) {
  return {
    title: apiResponse.name,
    subtitle: "Add to " + apiResponse.name,
    arg: apiResponse.id,
    valid: false,
    autocomplete: apiResponse.name
  };
}
exports.projectAdapter = projectAdapter;
/**
 * Adapter for labels retrieved from todoists API.
 *
 * @author moranje
 * @since  2017-06-17
 * @param  {Object}        apiResponse A label object from todoist
 * @return {WorkflowItem}              An Alfred workflow item.
 */
function labelAdapter(apiResponse) {
  return {
    title: apiResponse.name,
    subtitle: "Add " + apiResponse.name + " to task",
    arg: apiResponse.id,
    valid: false,
    autocomplete: apiResponse.name
  };
}
exports.labelAdapter = labelAdapter;
/**
 * Adapter for a priority item.
 *
 * @author moranje
 * @since  2017-06-17
 * @param  {Object}          object A priority object.
 * @return {WorkflowItem}           An Alfred workflow item.
 */
function priorityAdapter(object) {
  return {
    title: object.urgency,
    subtitle: "Set task priority to " + object.urgency,
    valid: false,
    autocomplete: object.urgency
  };
}
exports.priorityAdapter = priorityAdapter;
