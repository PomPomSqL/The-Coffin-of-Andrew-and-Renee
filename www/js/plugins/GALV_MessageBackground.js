//-----------------------------------------------------------------------------
//  Galv's Message Background
//-----------------------------------------------------------------------------
//  For: RPGMAKER MV
//  Galv_MessageBackground.js
//-----------------------------------------------------------------------------
//  2017-12-08 - Version 2.0 - fix for changing scenes mid-message bug
//  2017-01-31 - Version 1.9 - fixed battle messages that broke last update
//  2017-01-22 - Version 1.8 - made compatible with default startZoom function
//  2016-11-13 - Version 1.7 - fix if game can end while a message is open
//  2016-09-16 - Version 1.6 - made objects available publicly
//  2016-05-04 - Version 1.5 - fix an issue that kept dim window showing
//  2016-04-02 - Version 1.4 - compatibilty fix for Message Styles plugin
//  2015-10-30 - Version 1.3 - removed accidental code + compatiblity change
//  2015-10-27 - Version 1.2 - fixed a bug with images showing over top
//  2015-10-26 - Version 1.1 - fixed bug with variable setting
//  2015-10-25 - Version 1.0 - release
//-----------------------------------------------------------------------------
// Terms can be found at:
// galvs-scripts.com
//-----------------------------------------------------------------------------

var Imported = Imported || {};
Imported.Galv_MessageBackground = true;

var Galv = Galv || {};        // Galv's main object
Galv.MBG = Galv.MBG || {};    // Galv's Message Background stuff
Galv.Mstyle = Galv.Mstyle || {};  // Compatibility
//-----------------------------------------------------------------------------
/*:
 * @plugindesc (v.2.0) Displays an image behind messages in place of the windowskin
 * 
 * @author Galv - galvs-scripts.com
 *
 * @param Image Variable ID
 * @desc Variable used to determine which image to display
 * /img/system/msgimg_X.png - where X is the variable's value
 * @default 1
 *
 * @param Disable Switch ID
 * @desc Turn this switch ON usig control switches to disable the
 * message image and revert back to windowskin (make 0 to not use)
 * @default 1
 *
 * @help
 *   Galv's Message Background
 * ----------------------------------------------------------------------------
 * Set the variable ID number you would like to use in the settings.
 * This is the in-game variable that you wil change with "Control Variables"
 * event command. (Default is variable 1, which has a value of 0 by default)
 * This will select images from your project's folders:
 * /img/system/msgimg_X.png - where X is the variable's value
 *
 * You can also set a switch ID in the settings. If you choose a switch, then
 * during the game you can turn that switch number ON with "Control Switches"
 * to disable the background image and go back to using default windowskin.
 * This defaults to 0 meaning do not use this option.
 *
 * This 'Show Message' settings of "window", "Dim" and "Tranparent" have an
 * effect on the message background image. Window shows image normally, Dim
 * shows the image partially transparent and Transparent makes it invisible.
 */


//-----------------------------------------------------------------------------
//  CODE STUFFS
//-----------------------------------------------------------------------------



(function() {
	Galv.MBG.v = Number(PluginManager.parameters('Galv_MessageBackground')["Image Variable ID"]);
	Galv.MBG.s = Number(PluginManager.parameters('Galv_MessageBackground')["Disable Switch ID"]);
	Galv.MBG.disable = false;
	Galv.MBG.window = null;
	

Galv.MBG.Scene_Map_create = Scene_Map.prototype.create;
Scene_Map.prototype.create = function() {
	Galv.MBG.disable = false;
	Galv.MBG.window = null;
	Galv.MBG.Scene_Map_create.call(this);
};


// ---------------- WINDOW MESSAGE

// WINDOW MESSAGE START MESSAGE - MOD
Galv.MBG.Window_Message_startMessage = Window_Message.prototype.startMessage;
Window_Message.prototype.startMessage = function() {
	// Create graphic when window is displayed
	if (Galv.Mstyle.target) {
		Galv.MBG.disable = true;
	} else {
		Galv.MBG.disable = false;
	};
	
	Galv.MBG.window = this;
	Galv.MBG.Window_Message_startMessage.call(this);
};

// WINDOW MESSAGE SET BACKGROUND TYPE

Galv.MBG.Window_Message_setBackgroundType = Window_Message.prototype.setBackgroundType;
Window_Message.prototype.setBackgroundType = function(type) {
	if (Galv.Mstyle.target) {
		this.opacity = Galv.Mstyle.opacity;
	} else if (!$gameSwitches.value(Galv.MBG.s)) {
		this.opacity = 0;
		this.hideBackgroundDimmer();
		return;
	};
	Galv.MBG.Window_Message_setBackgroundType.call(this,type);
};



// ---------------- SCENE MAP

Galv.MBG.Scene_Map_createWindowLayer = Scene_Map.prototype.createWindowLayer;
Scene_Map.prototype.createWindowLayer = function() {
	this._msgBgSprite = new Sprite_GalvMsgBg();
	this._msgBgSprite.z = -1000;
	this.addChild(this._msgBgSprite);
	Galv.MBG.Scene_Map_createWindowLayer.call(this);
};


// ---------------- SCENE BATTLE

Galv.MBG.Scene_Battle_createWindowLayer = Scene_Battle.prototype.createWindowLayer;
Scene_Battle.prototype.createWindowLayer = function() {
	this._msgBgSprite = new Sprite_GalvMsgBg();
	this._msgBgSprite.z = -1000;
	this.addChild(this._msgBgSprite);
	Galv.MBG.Scene_Battle_createWindowLayer.call(this);
};

})();

// ---------------- SPRITE GALVMSGBG - NEW

function Sprite_GalvMsgBg() {
    this.initialize.apply(this, arguments);
}

Sprite_GalvMsgBg.prototype = Object.create(Sprite.prototype);
Sprite_GalvMsgBg.prototype.constructor = Sprite_GalvMsgBg;

Sprite_GalvMsgBg.prototype.initialize = function() {
    Sprite.prototype.initialize.call(this);
	this.opacity = 0;
	this.loadBitmap();
    this.update();
};

Sprite_GalvMsgBg.prototype.update = function() {
    Sprite.prototype.update.call(this);
    if (Galv.MBG.window) this.controlBitmap() ;
};

Sprite_GalvMsgBg.prototype.loadBitmap = function() {
	this.imageID = $gameVariables.value(Galv.MBG.v);
    this.bitmap = ImageManager.loadSystem('msgimg_' + this.imageID);
	this.x = 0
	this.z = 10;
	this.maxopac = 255;
};

Sprite_GalvMsgBg.prototype.controlBitmap = function() {
	if ($gameSwitches.value(Galv.MBG.s) || Galv.MBG.window.openness <= 0 || Galv.MBG.disable) {
		this.opacity = 0;
		this.maxopac = 255;
		return;
	};
    if (this.imageID != $gameVariables.value(Galv.MBG.v)) this.loadBitmap();  // If image changed, reload bitmap

	// Control image opacity
	switch ($gameMessage.background()) {
	case 0:
	// Window
		this.opacity = Math.min(Galv.MBG.window._openness,this.maxopac);
		break;
	case 1:
	// Dim
		this.opacity = Galv.MBG.window._openness * 0.5;
		this.maxopac = this.opacity;
		break;
	case 2:
	// Transparent
		this.opacity = 0;
		this.maxopac = 0;
		break;
	};
	
	// Don't change y value if closing as it reverts to positiontype 2
	if (Galv.MBG.window.isClosing()) return;
	
	// Control image position
	switch ($gameMessage.positionType()) {
	case 0:
	//top
		this.y = -(this.bitmap.height * 0.333);
		break;
	case 1:
	// middle
		this.y = (Graphics.boxHeight / 2) - (this.bitmap.height / 2)
		break;
	case 2:
	//bottom
		this.y = Graphics.boxHeight - (this.bitmap.height * 0.666);
		break;
	};
};

