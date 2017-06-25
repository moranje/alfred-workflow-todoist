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
 * @return {String}                 Stringified output.
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
  console.log("Error:", JSON.stringify(output));
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
  /**
     * Set workflow item title.
     *
     * @author moranje
     * @since  2017-06-20
     * @param  {String}   title The title name.
     */
  Item.prototype.setTitle = function(title) {
    this.title = title;
  };
  /**
     * Set workflow item subtitle.
     *
     * @author moranje
     * @since  2017-06-20
     * @param  {String}   subtitle The subtitle name.
     */
  Item.prototype.setSubtitle = function(subtitle) {
    this.subtitle = subtitle;
  };
  /**
     * Set workflow item argument.
     *
     * @author moranje
     * @since  2017-06-20
     * @param  {String}   arg The workflow argument.
     */
  Item.prototype.setArg = function(arg) {
    this.arg = arg;
  };
  /**
     * Output item instance to console.
     *
     * @author moranje
     * @since  2017-06-20
     */
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
  /**
     * Add a workflow item to the list.
     *
     * @author moranje
     * @since  2017-06-20
     * @param  {WorkflowItem} item An Alfred workflow item.
     */
  List.prototype.add = function(item) {
    this.items.push(new Item(item));
  };
  /**
     * Return a list with a secified number of items.
     *
     * @author moranje
     * @since  2017-06-20
     * @param  {Number}   number The amount of items.
     * @return {List}            A List instance.
     */
  List.prototype.capAt = function(number) {
    return new List(this.items.slice(0, number));
  };
  /**
     * Output list instance to console.
     *
     * @author moranje
     * @since  2017-06-20
     */
  List.prototype.write = function() {
    write({ items: this.items });
  };
  return List;
})();
exports.List = List;
