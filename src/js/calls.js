var fs = require('fs');
var todoist = require('./todoist');
var fuzzy = require('./fuzzysearch');

var DATA_PATH =
  process.env.HOME +
  '/Library/Application Support/Alfred 3/Workflow Data/com.alfred-workflow-todoist';
var CACHE_PATH =
  process.env.HOME +
  '/Library/Caches/com.runningwithcrayons.Alfred-3/Workflow Data/com.alfred-workflow-todoist';

var settings = require(DATA_PATH + '/settings.json');
var cache = require(CACHE_PATH + '/todoist.json');
var priorities = {
  priority: [
    { urgency: '1' },
    { urgency: '2' },
    { urgency: '3' },
    { urgency: '4' }
  ]
};

/**
 * A simple 'echo' function.
 *
 * @author moranje <martieno@gmail.com>
 * @since  2016-07-03
 * @param  {*}   response Any response text.
 * @return {String}
 */
function echo(response) {
  console.log(JSON.stringify(response));
}

function serialize(data, path) {
  fs.writeFile(path, JSON.stringify(data), function(err) {
    if (err) return console.log(err);
  });
}

/**
 * Generic error handler
 *
 * @author moranje <martieno@gmail.com>
 * @since  2016-08-25
 * @param  {Error}   err An error object
 * @return {String}
 */
function error(err) {
  // The 'Error' suffix signals something has failed to the notification
  // handler
  return console.log('Error', err);
}

// /**
//  * Create Alfred list style JSON output for tasks.
//  *
//  * @author moranje <martieno@gmail.com>
//  * @since  2016-07-03
//  * @return {Object}
//  */
// function optionList(list) {
//   if (!Array.isArray(list)) return error('Expected list to be an array.');

//   var options = {
//     items: []
//   };

//   list.forEach(function(item, index) {
//     options.items.push(
//       item({
//         uid: index,
//         arg: item.id,
//         title: item.content,
//         subtitle: 'Hit ENTER to mark it zero (err.. done)'
//       })
//     );
//   });

//   return options;
// }

function item(options) {
  if (options.valid === '' || options.valid === null) {
    options.valid = true;
  }

  return {
    uid: options.uid || '',
    arg: options.arg || '',
    valid: options.valid,
    autocomplete: options.autocomplete || '',
    icon: options.icon || 'icon.png',
    title: options.title || '',
    subtitle: options.subtitle || 'Hit ENTER'
  };
}

function itemList(list, group, key, valid) {
  if (!Array.isArray(list[group])) return error('Expected an array.');
  var menu = [];

  list[group].forEach(function(groupItem, index) {
    menu.push(
      item({
        uid: index + groupItem[key],
        arg: JSON.stringify(groupItem),
        title: groupItem[key],
        valid: valid,
        autocomplete: groupItem[key]
      })
    );
  });

  return { items: menu };
}

function cappedItemList(list, group) {
  var list = itemList.apply(null, arguments);
  var cappedList = {};
  cappedList[group] = list[group].slice(0, settings.max_items);
  // return echo(list);

  return echo(cappedList);
}

/**
 * Refreshes the Todoist data cache.
 *
 * @author moranje <martieno@gmail.com>
 * @since  2016-08-24
 * @return {String}
 */
function refreshCache() {
  todoist.getAll(
    settings.token,
    function(data) {
      serialize(data, CACHE_PATH + '/todoist.json');
      serialize(itemList(data, 'labels', 'name', false), 'menu/labels.json');
      serialize(
        itemList(data, 'projects', 'name', false),
        'menu/projects.json'
      );
      serialize(
        itemList(priorities, 'priority', 'urgency', false),
        'menu/priorities.json'
      );
    },
    error
  );
}

/**
 * Get a capped list of tasks from Todoist.
 *
 * @author moranje <martieno@gmail.com>
 * @since  2016-07-03
 * @return {Object}
 */
function getTasksCapped() {
  todoist.getTasks(settings.token, function(data) {
    if (!Array.isArray(data.items)) return error(data);

    return cappedItemList(data, 'items', 'content');
  });
}

/**
 * Search (fuzzy) the todoist tasks
 *
 * @author moranje <martieno@gmail.com>
 * @since  2016-08-24
 * @param  {String}   query The search query string.
 * @return {Object}
 */
function searchTasks(query) {
  var list = [];

  todoist.getTasks(settings.token, function(data) {
    if (!Array.isArray(data.items)) return error(data);

    data.items.forEach(function(task, index) {
      if (fuzzy(query.toLowerCase(), task.content.toLowerCase())) {
        list.push(task);
      }
    });

    return echo(itemList({ items: list }, 'items', 'content'));
  });
}

/**
 * Get a list of projects from Todoist.
 *
 * @author moranje <martieno@gmail.com>
 * @param {String} name The project's name.
 * @since  2016-07-04
 * @return {Object}
 */
function getProjects(name) {
  todoist.getProjects(
    settings.token,
    function(data) {
      if (!Array.isArray(data.projects)) return error(data);

      var projects = {};

      data.projects.forEach(function(project, index) {
        projects[project.name.toLowerCase()] = project.id;
      });

      if (name) {
        return echo(projects[name]);
      }

      return echo(projects);
    },
    error
  );
}

/**
 * Get a list of labels from Todoist.
 *
 * @author moranje <martieno@gmail.com>
 * @param {String} string The label names string.
 * @since  2016-07-04
 * @return {Object}
 */
function getLabels(string) {
  todoist.getLabels(
    settings.token,
    function(data) {
      if (!Array.isArray(data.labels)) return error(data);

      var names = string.split(',');
      var labels = [];

      data.labels.forEach(function(label, index) {
        names.forEach(function(name) {
          if (string && name === label.name) {
            labels.push(label.id);
          }
        });
      });

      return echo(labels);
    },
    error
  );
}

/**
 * Mark a todo item 'done'.
 *
 * @author moranje <martieno@gmail.com>
 * @param {String|Number} id The task's id.
 * @since  2016-07-03
 * @return {String}
 */
function markDone(id) {
  todoist.markTaskDone(
    id,
    settings.token,
    function(res) {
      var string = JSON.stringify(res);
      var match;

      if (string.match(/"error":/)) {
        match = string.match(/"error": ?"(.*?)"/);
        error(match[1]);
      }

      // Notification message.
      echo('Done, done and done!');
    },
    error
  );
}

module.exports = {
  refreshCache: refreshCache,
  getTasksCapped: getTasksCapped,
  searchTasks: searchTasks,
  getProjects: getProjects,
  getLabels: getLabels,
  markDone: markDone
};
