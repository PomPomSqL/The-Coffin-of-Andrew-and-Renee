//-----------------------------------------------------------------------------
//  Galv's Visual Novel Choices
//-----------------------------------------------------------------------------
//  For: RPGMAKER MV
//  GALV_VisualNovelChoices.js
//-----------------------------------------------------------------------------
//  2016-10-06 - Version 1.6 - hopefully fixed cache issue with MV update 1.5
//  2016-08-10 - Version 1.5 - fixed cache issue with MV update 1.3
//  2016-05-12 - Version 1.4 - vnbuttons img added to 'dont exclude' file list
//  2016-04-02 - Version 1.3 - change for compatibility with menu cursors
//  2016-03-21 - Version 1.2 - fixed color codes and compatibility with HIME's
//                           - choice plugins
//  2016-03-16 - Version 1.1 - added setting to make a gap between choices and
//                           - message box, added button setting for disabled
//                           - choices
//  2016-03-14 - Version 1.0 - release
//-----------------------------------------------------------------------------
// Terms can be found at:
// galvs-scripts.com
//-----------------------------------------------------------------------------

var Imported = Imported || {};
Imported.Galv_VisualNovelChoices = true;

var Galv = Galv || {};            // Galv's main object
Galv.VNC = Galv.VNC || {};        // Galv's stuff

//-----------------------------------------------------------------------------
/*:
 * @plugindesc (v.1.6) Changes how the "Choice" message boxes display to appear more like visual novels.
 * 
 * @author Galv - galvs-scripts.com
 *
 * @param Command Width
 * @desc Width of the choice commands. This must be equal to or less than the VNButtons.png width.
 * @default 700
 *
 * @param Command Height
 * @desc Width of the choice commands
 * @default 48
 *
 * @param Always Middle
 * @desc Display Choices in the middle regardless of the "Show Choices" window position. true or false
 * @default true
 *
 * @param Message Gap
 * @desc Distance the choices are displayed away from the message window
 * @default 0
 *
 * @param Disabled Button
 * @desc The row number used to display button for a disabled choice (if using a plugin that can disable choices)
 * @default 3
 *
 * @requiredAssets img/system/VNButtons
 *
 * @help
 *   Galv's Visual Novel Choices
 * ----------------------------------------------------------------------------
 * Displays choices in a more visual novel style. The image for the choice
 * buttons should be put in /img/system/ folder and should be named:
 * "VNButtons.png". It is a single file that contains each button one on top
 * of the other.
 * The Command Width and Command Height settings control the size of the 
 * buttons while Command Gap controls the space between them. Make sure the
 * "Command Width" plugin setting is equal to the graphic's pixel width.
 *
 * The first button image in the VNButtons file is button 0. This is the
 * cursor image that displays over the buttons. The default button used if
 * none are specified in the choice option text will be button 1 (below the
 * cursor image).
 *
 * Using \b[x] in the choice option text, you can specify a different button
 * graphic that choice (x being the row number) and the button.
 *
 * The "Disabled Button" option in the plugin setting is for if you are using
 * a different plugin that disables choice commands such as:
 * "Disabled Choice Conditions" by Hime.
 *
 * ----------------------------------------------------------------------------
 *  SCRIPT CALL:
 * ----------------------------------------------------------------------------
 *
 *        $gameSystem.vnChoices = status;      // status can be true or false
 */

//-----------------------------------------------------------------------------
//  CODE STUFFS
//-----------------------------------------------------------------------------

(function() {


Galv.VNC.width = Number(PluginManager.parameters('Galv_VisualNovelChoices')["Command Width"]);
Galv.VNC.height = Number(PluginManager.parameters('Galv_VisualNovelChoices')["Command Height"]);
Galv.VNC.alwaysMid = PluginManager.parameters('Galv_VisualNovelChoices')["Always Middle"].toLowerCase() == 'true' ? true : false;
Galv.VNC.msgGap = Number(PluginManager.parameters('Galv_VisualNovelChoices')["Message Gap"]);
Galv.VNC.disableBtn = Number(PluginManager.parameters('Galv_VisualNovelChoices')["Disabled Button"]);

// Cache
Galv.VNC.Scene_Boot_loadSystemImages = Scene_Boot.loadSystemImages;
Scene_Boot.loadSystemImages = function() {
    ImageManager.reserveSystem('VNButtons');
	Galv.VNC.Scene_Boot_loadSystemImages.call(this);
};


// Choice stuff
Galv.VNC.Game_System_initialize = Game_System.prototype.initialize;
Game_System.prototype.initialize = function() {
	Galv.VNC.Game_System_initialize.call(this);
	this.vnChoices = true;
};

// Overwrite
Window_ChoiceList.prototype.textHeight = Window_ChoiceList.prototype.lineHeight;
Galv.VNC.Window_ChoiceList_lineHeight = Window_ChoiceList.prototype.lineHeight;
Window_ChoiceList.prototype.lineHeight = function() {return $gameSystem.vnChoices ? Galv.VNC.height : Galv.VNC.Window_ChoiceList_lineHeight.call(this);};
Galv.VNC.Window_ChoiceList_itemHeight = Window_ChoiceList.prototype.itemHeight;
Window_ChoiceList.prototype.itemHeight = function() {return $gameSystem.vnChoices ? Galv.VNC.height : Galv.VNC.Window_ChoiceList_itemHeight.call(this);};

Galv.VNC.Window_ChoiceList_drawItem = Window_ChoiceList.prototype.drawItem;
Window_ChoiceList.prototype.drawItem = function(index) {
	if ($gameSystem.vnChoices) {
		var rect = this.itemRectForText(index);
		this.drawButton(index,rect.y);
		if (index === this._index) this.drawButton(index,rect.y,true);
		var offset = (this.lineHeight() - this.textHeight()) * 0.5;
		this.drawTextEx(this.commandName(index), rect.x, rect.y + offset);
	} else {
		Galv.VNC.Window_ChoiceList_drawItem.call(this,index);
	};
};

// @FIX - Kit9 Studio LTD  (2023)
// Coffin of Andy and Leyley

// Message window needs to be refreshed
// for positions to be corrected after
// another window command executes.

Galv.VNC.Window_ChoiceList_updatePlacement = Window_ChoiceList.prototype.updatePlacement;
Window_ChoiceList.prototype.updatePlacement = function() {

	this._messageWindow.updatePlacement();

	Galv.VNC.Window_ChoiceList_updatePlacement.call(this);
	if ($gameSystem.vnChoices && Galv.VNC.alwaysMid) {
		this.x = (Graphics.boxWidth - this.width) / 2;
	};
	if (this._messageWindow.y >= Graphics.boxHeight / 2) {
		this.y -= Galv.VNC.msgGap;
    } else {
        this.y += Galv.VNC.msgGap;
    };
};

Galv.VNC.Window_ChoiceList__refreshCursor = Window_ChoiceList.prototype._refreshCursor;
Window_ChoiceList.prototype._refreshCursor = function() {
	if ($gameSystem.vnChoices) {
		this._windowCursorSprite.opacity = 0;
	} else {
		Galv.VNC.Window_ChoiceList__refreshCursor.call(this);
	};
};

Window_ChoiceList.prototype.drawButton = function(index,y,cursor) {
    var bitmap = ImageManager.loadSystem('VNButtons');
    var pw = Galv.VNC.width;
    var ph = Galv.VNC.height;

    var sx = 0;
	if (cursor) {
		var bgId = 0;
	} else {
		if (this._list[index].enabled === false) {
			var bgId = Galv.VNC.disableBtn;
		} else {
			var bgId = this.choice_background[index] ? this.choice_background[index] : 1;
		};
	};
    var sy = bgId * ph;
    this.contents.blt(bitmap, sx, sy, pw, ph, 0, y);
};

Galv.VNC.Window_ChoiceList_start = Window_ChoiceList.prototype.start;
Window_ChoiceList.prototype.start = function() {
	this.setupVNChoices();
	Galv.VNC.Window_ChoiceList_start.call(this);
};

Window_ChoiceList.prototype.setupVNChoices = function() {
	this.ChoiceSprites = [];
	this.choice_background = [];
	this._vnIndex = this._index;
    if ($gameSystem.vnChoices) {
      this.opacity = 0;
	} else {
      this.opacity = 255;
	};
};

Galv.VNC.Window_ChoiceList_update = Window_ChoiceList.prototype.update;
Window_ChoiceList.prototype.update = function() {
	Galv.VNC.Window_ChoiceList_update.call(this);
	if (this._vnIndex != this._index) {
		this.refresh();
		this._vnIndex = this._index;
	}
};


Galv.VNC.Window_ChoiceList_updateBackground = Window_ChoiceList.prototype.updateBackground;
Window_ChoiceList.prototype.updateBackground = function() {
	if ($gameSystem.vnChoices) {
		this._background = 2;
   	 	this.setBackgroundType(this._background);
	} else {
		Galv.VNC.Window_ChoiceList_updateBackground.call(this);
	};
    
};


Galv.VNC.Window_ChoiceList_convertEscapeCharacters = Window_ChoiceList.prototype.convertEscapeCharacters;
Window_ChoiceList.prototype.convertEscapeCharacters = function(text,index) {
	text = text.replace(/\\/g, '\x1b');
	text = text.replace(/\x1b\x1b/g, '\\');
	text = text.replace(/\x1bB\[(\d+)\]/gi, function() {
		this.choice_background[index] = parseInt(arguments[1]);
        return "";
    }.bind(this));
	
	return Galv.VNC.Window_ChoiceList_convertEscapeCharacters.call(this,text);
};

Window_ChoiceList.prototype.itemRectForText = function(index) {
    var rect = this.itemRect(index);
	if ($gameSystem.vnChoices) {

		var txt = $gameMessage._choices[index];
		
		// count icon code
		var icons = txt.match(/\\i\[/g) || txt.match(/\\I\[/g);
		icons = icons ? icons.length * 36 : 0;
		
		txt = this.convertEscapeCharacters(txt,index);
		txt = txt.replace(/i\[\d*\]/g,"");
		txt = txt.replace(/I\[\d*\]/g,"");
		
		txt = txt.replace(/c\[\d*\]/g,"");
		txt = txt.replace(/C\[\d*\]/g,"");
		var txtSize = this.textWidth(txt) + icons;

		rect.x = (Galv.VNC.width - txtSize) / 2;
	} else {
		rect.x += this.textPadding();
	};
	rect.width -= this.textPadding() * 2;
	return rect;
};

Window_ChoiceList.prototype.windowWidth = function() {
    var width = this.maxChoiceWidth() + this.padding * 2;
    return Math.min(width, Graphics.boxWidth);
};

Galv.VNC.Window_ChoiceList_maxChoiceWidth = Window_ChoiceList.prototype.maxChoiceWidth;
Window_ChoiceList.prototype.maxChoiceWidth = function() {
	if ($gameSystem.vnChoices) {
		return Galv.VNC.width;
	} else {
		return Galv.VNC.Window_ChoiceList_maxChoiceWidth.call(this);
	};
};


})();