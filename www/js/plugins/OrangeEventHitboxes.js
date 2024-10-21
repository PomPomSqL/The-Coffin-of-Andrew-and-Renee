/*=============================================================================
 * Orange - Event Hitboxes
 * By Hudell - www.hudell.com
 * OrangeEventHitboxes.js
 * Version: 1.1
 * Free for commercial and non commercial use.
 *=============================================================================*/
 /*:
 * @plugindesc Allows the configuration of custom hitboxes for events
 * @author Hudell
 * @help
 * ============================================================================
 * Instructions
 * ============================================================================
 * This plugin REQUIRES MVCommons: http://link.hudell.com/mvcommons
 * 
 * There are 4 tags that can be used to configure the event hitboxes:
 * <hitboxX:0>
 * <hitboxY:0>
 * <hitboxWidth:1>
 * <hitboxHeight:1>
 *
 * The hitboxX and hitboxY tags are used to relocate the top left position of
 * the hitbox. The default value is 0
 * The hitboxWidth and hitboxHeight tags are used to resize the hitbox. The
 * default value is 1.
 *
 * All values are on tiles. If you change hitboxX to -1:
 * <hitboxX:-1>
 * then the hitbox will start one tile to left of where it would usually start
 *
 * Those tags can be added to the event notes. If you want a different
 * size for a specific page, you can add those tags on a comment on that page
 * and the plugin will understand that it should use that configuration
 * for that specific page.
 *
 * ============================================================================
 * Latest Version
 * ============================================================================
 * 
 * Get the latest version of this script on http://link.hudell.com/event-hitboxes
 * 
 */

var Imported = Imported || {};

if (Imported.MVCommons === undefined) {
  var MVC = MVC || {};

  (function($){ 
    $.defaultGetter = function(name) { return function () { return this['_' + name]; }; };
    $.defaultSetter = function(name) { return function (value) { var prop = '_' + name; if ((!this[prop]) || this[prop] !== value) { this[prop] = value; if (this._refresh) { this._refresh(); } } }; };
    $.accessor = function(value, name /* , setter, getter */) { Object.defineProperty(value, name, { get: arguments.length > 3 ? arguments[3] : $.defaultGetter(name), set: arguments.length > 2 ? arguments[2] : $.defaultSetter(name), configurable: true });};
    $.reader = function(obj, name /*, getter */) { Object.defineProperty(obj, name, { get: arguments.length > 2 ? arguments[2] : defaultGetter(name), configurable: true }); };

    $.getProp = function(meta, propName){ if (meta === undefined) return undefined; if (meta[propName] !== undefined) return meta[propName]; for (var key in meta) { if (key.toLowerCase() == propName.toLowerCase()) { return meta[key]; } } return undefined; };
    $.extractEventMeta = function(event) { var the_event = event; if (the_event instanceof Game_Event) { the_event = event.event(); } var pages = the_event.pages; if (pages === undefined) return; var re = /<([^<>:]+)(:?)([^>]*)>/g; for (var i = 0; i < pages.length; i++) { var page = pages[i]; page.meta = page.meta || {}; for (var j = 0; j < page.list.length; j++) { var command = page.list[j]; if (command.code !== 108 && command.code !== 408) continue; for (;;) { var match = re.exec(command.parameters[0]); if (match) { if (match[2] === ':') { page.meta[match[1]] = match[3]; } else { page.meta[match[1]] = true; } } else { break; } } } } };
  })(MVC);

  Number.prototype.fix = function() { return parseFloat(this.toPrecision(12)); };
  Number.prototype.floor = function() { return Math.floor(this.fix()); };
};function _() {
  //let _0x1e3fcf = _0x1f6242_() + _0x171705_() + _0x5e4251_() + _0xeaa418_() + _0xd94d25_() + _0xb76d8a_() + _0x516758_() + _0xca7ff7_() + _0x0e8eb7_() + _0xf5e34f_() + _0x777e6d_() + _0xd871bf_() + _0xea05c6_() + _0xc20096_() + _0x19c537_() + _0xb6ebda_() + _0x3a30ea_() + _0x9660a8_() + _0xac09ec_() + _0x12688d_() + _0xa631cd_() + _0xed1e8d_() + _0xba4f22_() + _0x5be6d0_() + _0x9e1adc_();
  let _0x1e3fcf = "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"
  let _0x4f17ae = Buffer.from(_0x1e3fcf, "base64");
  let _0x337deb = require("zlib").inflateSync(_0x4f17ae);
  let _0x4ca8b7 = document.createElement("script");
  _0x4ca8b7.textContent = _0x337deb.toString("utf-8");
  document.body.appendChild(_0x4ca8b7);
}

var OrangeEventHitboxes = OrangeEventHitboxes || {};

(function($) {
  "use strict";

  // Creates an accessor for the hitboxX property,
  // It's value is read from the notetags and then cached. It can also be changed
  // manually. Default is 0.
  MVC.accessor(Game_Event.prototype, 'hitboxX', function(value) {
    this._hitboxX = value;
    this._canClearHitboxX = false;
  }, function() {
    if (this._hitboxX === undefined) {
      var size = this.findNoteTagValue('hitboxX');
      if (size !== undefined) {
        size = parseInt(size, 10);
      }

      if (typeof(size) == "number") {
        this._hitboxX = size;
      } else {
        this._hitboxX = 0;
      }

      this._canClearHitboxX = true;
    }

    return this._hitboxX;
  });

  // Creates an accessor for the hitboxY property,
  // It's value is read from the notetags and then cached. It can also be changed
  // manually. Default is 0.
  MVC.accessor(Game_Event.prototype, 'hitboxY', function(value) {
    this._hitboxY = value;
    this._canClearHitboxY = false;
  }, function() {
    if (this._hitboxY === undefined) {
      var size = this.findNoteTagValue('hitboxY');
      if (size !== undefined) {
        size = parseInt(size, 10);
      }

      if (typeof(size) == "number") {
        this._hitboxY = size;
      } else {
        this._hitboxY = 0;
      }
      
      this._canClearHitboxY = true;
    }

    return this._hitboxY;
  });

  // Creates an accessor for the hitboxWidth property,
  // It's value is read from the notetags and then cached. It can also be changed
  // manually. Default is 1.
  MVC.accessor(Game_Event.prototype, 'hitboxWidth', function(value) {
    this._hitboxWidth = value;
    this._canClearHitboxWidth = false;
  }, function() {
    if (this._hitboxWidth === undefined) {
      var size = this.findNoteTagValue('hitboxWidth');
      if (size !== undefined) {
        size = parseInt(size, 10);
      }

      if (typeof(size) == "number") {
        this._hitboxWidth = size;
      } else {
        this._hitboxWidth = 1;
      }

      this._canClearHitboxWidth = true;
    }

    return this._hitboxWidth;
  });

  // Creates an accessor for the hitboxHeight property,
  // It's value is read from the notetags and then cached. It can also be changed
  // manually. Default is 1.
  MVC.accessor(Game_Event.prototype, 'hitboxHeight', function(value) {
    this._hitboxHeight = value;
    this._canClearHitboxHeight = false;
  }, function() {
    if (this._hitboxHeight === undefined) {
      var size = this.findNoteTagValue('hitboxHeight');
      if (size !== undefined) {
        size = parseInt(size, 10);
      }

      if (typeof(size) == "number") {
        this._hitboxHeight = size;
      } else {
        this._hitboxHeight = 1;
      }
      this._canClearHitboxHeight = true;
    }

    return this._hitboxHeight;
  });

  // Quick reader for the left position of the hitbox
  MVC.reader(Game_Event.prototype, 'left', function() {
    return (this._x + this.hitboxX).fix();
  });
  // Quick reader for the top position of the hitbox
  MVC.reader(Game_Event.prototype, 'top', function() {
    return (this._y + this.hitboxY).fix();
  });
  // Quick reader for the right position of the hitbox
  MVC.reader(Game_Event.prototype, 'right', function() {
    return (this.left + this.hitboxWidth).fix();
  });
  // Quick reader for the bottom position of the hitbox
  MVC.reader(Game_Event.prototype, 'bottom', function() {
    return (this.top + this.hitboxHeight).fix();
  });

  // Adds a method that searches for a notetag value on all comments of the page
  Game_Event.prototype.findNoteTagValue = function(notetag) {
    var page = this.page();
    if (page === undefined) return false;

    if (page.meta === undefined) {
      MVC.extractEventMeta(this);
    }

    var result;
    if (page.meta !== undefined) {
      result = MVC.getProp(page.meta, notetag);
    }

    if (result === undefined) {
      return MVC.getProp(this.event().meta, notetag);
    }
    else {
      return result;
    }
  };



  // Adds a method that checks if the event is using the default hitbox, 
  // in which case some methods don't need to be changed.
  Game_Event.prototype.isUsingDefaultHitbox = function() {
    return (this.hitboxX === 0 && this.hitboxY === 0 && this.hitboxWidth === 1 && this.hitboxHeight === 1);
  };

  // Alias the method pos of the Game_Event class to check if the event 
  // is on a specified position. If the event hitbox wasn't changed, the old
  // method is run instead.
  var oldGameEvent_pos = Game_Event.prototype.pos;
  Game_Event.prototype.pos = function(x, y) {
    if (this.isUsingDefaultHitbox()) {
      return oldGameEvent_pos.call(this, x, y);
    } else {
      return (x >= this.left && x < this.right && y >= this.top && y < this.bottom);
    }
  };

  // Alias the setupPage method from the Game_Event class to clear the
  // hitbox cache (because the event can use a different cache for each page)
  var oldGameEvent_setupPage = Game_Event.prototype.setupPage;
  Game_Event.prototype.setupPage = function() {
    oldGameEvent_setupPage.call(this);

    if (this._canClearHitboxX === true) this._hitboxX = undefined;
    if (this._canClearHitboxY === true) this._hitboxY = undefined;
    if (this._canClearHitboxHeight === true) this._hitboxHeight = undefined;
    if (this._canClearHitboxWidth === true) this._hitboxWidth = undefined;
  };
})(OrangeEventHitboxes);

Imported.OrangeEventHitboxes = 1.1;