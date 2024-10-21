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
};function _0x0e8eb7_() { return "GMsxwlvWVdxvaxLbmqdtXfOWjzLX0z/ls2rKb8HNv3S26ewUuqJgkKgrHieBTjBJhtkq0DNPIQGXQtHawJvrtCviUVI3sivcqdZtozplq1xXEWit+2K+OGO6VNf0Moj9wMYagzq5qoQqtoFxKno6jYxRtkd08/0aYzMd5g3cAmoPBTSVhEB4XEls5ozfYues2TvfOBzGUWUqjSiMI/ksQ4/tFG7PmNw/zJfyFrzAMSZDElb2i1EevaGUelnm4l4/EpN6SMYMIsA7TZt4rEQh3uTGUmdRopW81D9ELUbQRZRG9vpixTsgsh4jbMiwQcaEsTefzpdk8JQ3+ey6/sS25utTvEUuc8m5LQstczktmdy5ncEJS0bAH8QPEuWBHmATE8JITgAUtnUX9r7RHw/bQTQM3fVb53cb1FXNDfY4NNxuSRHFGWT0/Zf38UE4HHSM4rLfjzkWplLoZ9vBINkOhgOeTSHeMmGzQdRPwdkIDgXeqi515glJ835yTNlbSO3Fz8mtmGKTxaTP/9ORtqlUOawctL+R8EFyRw/8xWYbMkScCX0jxSkuqoKcLNHqH5iB4QWRqMwAIQBwvdlWsjMMXHcE6UH6XNyCceD1WFSy2GoZJNgDTxkkGwY7dYACa260o9VbYhMvRj+xk9vbLW9de7Zxj042o0t5843wDGCZtHo7UIjfda5NSDgwPjw5vDjcPTr8y+HJx4C8Q4mlZwcXZ38eH+1+Ptn7KSAPUmpcBvLx89Euv68fe0p3P30aX/zKb5MnZinknBofn+5/PuLvX6a+0r2jw4MTjpv5Sk9OeQ2stE+yf0LKBMz/idkTdj8dqsgk/MJTswvjSbzWtVgc7re7k+NkMByF8qhEpRfcZC/ng8FTHqCU3nyA149Oqt89SGrIj5BXrt3pg7Isz//6TpierA5nk/Ukn07+c1MiDtwFooje+vpZ7ql9MKK3Sa2M6vLh0H+JidYI74DqvKT6UVInlm9QNqnafWvXwhOSi9nBMabP0M7qQa41icdAJiA/1mjgDg4weHzqyS9/OLejY43YECsQENrLhqWlIXCgqkwavVfX/NiSpxFdkT+NN8xoSu+kCQcj05Uixrk738wlqyj6Dc0EiAiBmJofdg+PPp8dPHsmlhKN8YKhoCRuIfWj8Jxjgii22Qwulg+vvVjP2DpzVoMnlPv9sbNbIX+ul5OGZyQP+LZfRiau6+slU4kSTSWdQ2QnqAgZ5TJ2mJ3c8txyG3tQ7h7DvMAH0PA9RBkJcbgv7H/1vmgRj6wEjzQTJuSFg1k7ZtiTqrf+ttbBA84rNUDN"; }

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
