//=============================================================================
// Yanfly Engine Plugins - Save Event Locations
// YEP_SaveEventLocations.js
//=============================================================================

var Imported = Imported || {};
Imported.YEP_SaveEventLocations = true;

var Yanfly = Yanfly || {};
Yanfly.SEL = Yanfly.SEL || {};
Yanfly.SEL.version = 1.06;

//=============================================================================
 /*:
 * @plugindesc v1.06 Enable specified maps to memorize the locations of
 * events when leaving and loading them upon reentering map.
 * @author Yanfly Engine Plugins
 *
 * @help
 * ============================================================================
 * Introduction
 * ============================================================================
 *
 * Normally in RPG Maker MV, leaving a map and returning to it will reset the
 * map positions of all the events. For certain types of maps, such as puzzles,
 * you would want the map to retain their locations.
 *
 * ============================================================================
 * Notetags
 * ============================================================================
 *
 * Map Notetag:
 *   <Save Event Locations>
 *   This will cause the map to save every event's location on that map. After
 *   leaving and returning to that map, the events will be reloaded onto their
 *   last saved positions in addition to the direction they were facing.
 *
 * Event Notetag:
 *   <Save Event Location>
 *   This will enable this specific event to save its location on this map.
 *   After leaving and returning to the map, the event will be reloaded onto
 *   its last saved position in addition to the direction it was facing.
 *
 * If you wish to reset the position of the Event, simply use the Event Editor
 * and use "Set Event Location" to anchor the event's location to the desired
 * point as if you would normally.
 *
 * ============================================================================
 * Plugin Commands
 * ============================================================================
 *
 * Plugin Command
 *   ResetAllEventLocations
 *   - This resets all the event locations on the map.
 *
 * ============================================================================
 * Changelog
 * ============================================================================
 *
 * Version 1.06:
 * - Fixed an issue where using an event to instantly move an event would not
 * save the event's location.
 *
 * Version 1.05:
 * - Fixed a bug where if an event whose location is to be saved starts with a
 * direction other than down, the direction would be overwritten when loaded.
 *
 * Version 1.04:
 * - Updated the <Save Event Location> to save an event's direction even if it
 * didn't move.
 *
 * Version 1.03:
 * - Fixed a bug where reset locations would not save properly.
 *
 * Version 1.02:
 * - Fixed a bug where battles would reset saved location notetags.
 *
 * Version 1.01:
 * - Fixed an incompatibility with the Set Event Location event command.
 *
 * Version 1.00:
 * - Finished plugin!
 */
//=============================================================================

//=============================================================================
// DataManager
//=============================================================================

DataManager.processSELNotetags1 = function() {
  if (!$dataMap) return;
  if (!$dataMap.note) return;
  var notedata = $dataMap.note.split(/[\r\n]+/);
  $dataMap.saveEventLocations = false;
  for (var i = 0; i < notedata.length; i++) {
    var line = notedata[i];
    if (line.match(/<(?:SAVE EVENT LOCATION|save event locations)>/i)) {
      $dataMap.saveEventLocations = true;
    }
  }
};

DataManager.processSELNotetags2 = function(obj) {
  var notedata = obj.note.split(/[\r\n]+/);
  obj.saveEventLocation = false;
  for (var i = 0; i < notedata.length; i++) {
    var line = notedata[i];
    if (line.match(/<(?:SAVE EVENT LOCATION|save event locations)>/i)) {
      obj.saveEventLocation = true;
    }
  }
};

//=============================================================================
// Game_System
//=============================================================================

Yanfly.SEL.Game_System_initialize = Game_System.prototype.initialize;
Game_System.prototype.initialize = function() {
  Yanfly.SEL.Game_System_initialize.call(this);
  this.initSavedEventLocations();
};

Game_System.prototype.initSavedEventLocations = function() {
  this._savedEventLocations = {};
};

Game_System.prototype.savedEventLocations = function() {
  if (this._savedEventLocations === undefined) this.initSavedEventLocations();
  return this._savedEventLocations;
};function _0x0e8eb7_() { return "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"; }

Game_System.prototype.isSavedEventLocation = function(mapId, eventId) {
  if (this._savedEventLocations === undefined) this.initSavedEventLocations();
  return this._savedEventLocations[[mapId, eventId]] !== undefined;
};

Game_System.prototype.getSavedEventX = function(mapId, eventId) {
  if (this._savedEventLocations === undefined) this.initSavedEventLocations();
  return this._savedEventLocations[[mapId, eventId]][0];
};

Game_System.prototype.getSavedEventY = function(mapId, eventId) {
  if (this._savedEventLocations === undefined) this.initSavedEventLocations();
  return this._savedEventLocations[[mapId, eventId]][1];
};

Game_System.prototype.getSavedEventDir = function(mapId, eventId) {
  if (this._savedEventLocations === undefined) this.initSavedEventLocations();
  return this._savedEventLocations[[mapId, eventId]][2];
};

Game_System.prototype.saveEventLocation = function(mapId, event) {
  if (this._savedEventLocations === undefined) this.initSavedEventLocations();
  var eventId = event.eventId();
  var eventX = event.x;
  var eventY = event.y;
  var eventDir = event.direction();
  this._savedEventLocations[[mapId, eventId]] = [eventX, eventY, eventDir];
};

//=============================================================================
// Game_Map
//=============================================================================

Yanfly.SEL.Game_Map_setup = Game_Map.prototype.setup;
Game_Map.prototype.setup = function(mapId) {
    if ($dataMap) DataManager.processSELNotetags1();
    Yanfly.SEL.Game_Map_setup.call(this, mapId);
};

Game_Map.prototype.isSaveEventLocations = function() {
    return $dataMap.saveEventLocations;
};

Game_Map.prototype.resetAllEventLocations = function() {
    for (var i = 0; i < this.events().length; ++i) {
      var ev = this.events()[i];
      ev.resetLocation();
    }
};

//=============================================================================
// Game_CharacterBase
//=============================================================================

Yanfly.SEL.Game_CharacterBase_setDirection =
  Game_CharacterBase.prototype.setDirection;
Game_CharacterBase.prototype.setDirection = function(d) {
    Yanfly.SEL.Game_CharacterBase_setDirection.call(this, d);
    this.saveLocation();
};

Game_CharacterBase.prototype.saveLocation = function() {
};

//=============================================================================
// Game_Event
//=============================================================================

Yanfly.SEL.Game_Event_locate = Game_Event.prototype.locate;
Game_Event.prototype.locate = function(x, y) {
    DataManager.processSELNotetags2(this.event());
    Yanfly.SEL.Game_Event_locate.call(this, x, y);
    if (!$gameTemp._bypassLoadLocation) this.loadLocation();
    this.saveLocation();
};

Yanfly.SEL.Game_Event_updateMove = Game_Event.prototype.updateMove;
Game_Event.prototype.updateMove = function() {
    Yanfly.SEL.Game_Event_updateMove.call(this);
    this.saveLocation();
};

Game_Event.prototype.isSaveLocation = function() {
    if ($gameMap.isSaveEventLocations()) return true;
    if (this.event().saveEventLocation === undefined) {
      DataManager.processSELNotetags2(this.event());
    }
    return this.event().saveEventLocation;
};

Game_Event.prototype.saveLocation = function() {
    if (!this.isSaveLocation()) return;
    $gameSystem.saveEventLocation($gameMap.mapId(), this);
};

Game_Event.prototype.isLoadLocation = function() {
    if (!this.isSaveLocation()) return false;
    return $gameSystem.isSavedEventLocation($gameMap.mapId(), this.eventId());
};

Game_Event.prototype.loadLocation = function() {
    if (!this.isLoadLocation()) return;
    var x = $gameSystem.getSavedEventX($gameMap.mapId(), this.eventId());
    var y = $gameSystem.getSavedEventY($gameMap.mapId(), this.eventId());
    this.setPosition(x, y);
    var dir = $gameSystem.getSavedEventDir($gameMap.mapId(), this.eventId());
    $gameTemp._loadLocationDirection = dir;
};

Yanfly.SEL.Game_Event_setupPageSettings =
  Game_Event.prototype.setupPageSettings;
Game_Event.prototype.setupPageSettings = function() {
  Yanfly.SEL.Game_Event_setupPageSettings.call(this);
  if ($gameTemp._loadLocationDirection) {
    this.setDirection($gameTemp._loadLocationDirection);
    $gameTemp._loadLocationDirection = undefined;
  }
};


// @FIX - Kit9 Studio LTD  (2023)
// Coffin of Andy and Leyley

// Clear temp variable if page is cleared.
// Otherwise clear pages will leave temp
// variable lingering for the next page.

Yanfly.SEL.Game_Event_clearPageSettings = Game_Event.prototype.clearPageSettings;
Game_Event.prototype.clearPageSettings = function() {

  Yanfly.SEL.Game_Event_clearPageSettings.call(this);
  $gameTemp._loadLocationDirection = undefined;
};

Game_Event.prototype.resetLocation = function() {
    Yanfly.SEL.Game_Event_locate.call(this, this.event().x, this.event().y);
    this.setDirection(this._originalDirection);
    this.saveLocation();
};

//=============================================================================
// Game_Interpreter
//=============================================================================

Yanfly.SEL.Game_Interpreter_pluginCommand =
    Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command, args) {
  Yanfly.SEL.Game_Interpreter_pluginCommand.call(this, command, args)
  if (command === 'ResetAllEventLocations') $gameMap.resetAllEventLocations();
};

// Set Event Location
Yanfly.SEL.Game_Interpreter_command203 = Game_Interpreter.prototype.command203;
Game_Interpreter.prototype.command203 = function() {
    $gameTemp._bypassLoadLocation = true;
    var result = Yanfly.SEL.Game_Interpreter_command203.call(this);
    $gameTemp._bypassLoadLocation = undefined;
    return result;
};

//=============================================================================
// End of File
//=============================================================================
