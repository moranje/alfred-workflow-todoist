"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var crypto = require("crypto");
var fs = require("fs");
/**
 * Output to the workflow console
 *
 * @author moranje
 * @since  2017-06-12
 * @param  {Object|String}   output Any output.
 * @return {String}          Stringified output.
 */
function write(output) {
  return console.log(JSON.stringify(output));
}
exports.write = write;
/**
 * A error wrapper for write.
 *
 * @author moranje
 * @since  2017-06-12
 * @param  {Object|String} output The error
 * @return {String}               The error string output
 */
function writeError(output) {
  console.error("Error", JSON.stringify(output));
}
exports.writeError = writeError;
/**
 * Sugar for serializing files
 *
 * @author moranje
 * @since  2017-06-11
 * @param  {Object}   data The object to serialize.
 * @param  {String}   path The path to serialize to.
 * @return {void}
 */
function writeToFile(data, path) {
  fs.writeFile(path, JSON.stringify(data), function(err) {
    if (err) return writeError(err);
  });
}
exports.writeToFile = writeToFile;
/**
 * Class item
 *
 * @author moranje
 * @since  2017-06-12
 * @param  {Object} options Item options
 * @return {Item}           A workflow item
 */
var Item = (function() {
  function Item(options) {
    if (!options.title) {
      throw new Error("Items need at least a title to work");
    }
    this.title = options.title;
    // Optional values
    this.uid =
      options.uid ||
      crypto.createHash("md5").update(options.title).digest("hex");
    this.arg = options.arg || "";
    this.type = options.type || "default";
    this.valid = options.valid !== undefined ? options.valid : true;
    this.autocomplete = options.autocomplete || "";
    this.icon = options.icon || "icon.png";
    this.subtitle = options.subtitle || "Hit ENTER";
  }
  Item.prototype.setTitle = function(title) {
    this.title = title;
  };
  Item.prototype.setSubtitle = function(subtitle) {
    this.subtitle = subtitle;
  };
  Item.prototype.setArg = function(arg) {
    this.arg = arg;
  };
  Item.prototype.write = function() {
    write(this);
  };
  return Item;
})();
exports.Item = Item;
/**
 * Class list
 *
 * @author moranje
 * @since  2017-06-12
 * @param  {Object}      items An array of items
 * @return {List}              A list of items
 */
var List = (function() {
  function List(items) {
    if (items === void 0) {
      items = [];
    }
    var _this = this;
    this.items = [];
    items.forEach(function(item) {
      _this.items.push(new Item(item));
    });
  }
  List.prototype.add = function(item) {
    this.items.push(new Item(item));
  };
  List.prototype.capAt = function(number) {
    return new List(this.items.slice(0, number));
  };
  List.prototype.write = function() {
    write({ items: this.items });
  };
  return List;
})();
exports.List = List;
