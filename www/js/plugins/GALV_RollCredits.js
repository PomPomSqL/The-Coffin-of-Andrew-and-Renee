//-----------------------------------------------------------------------------
//  Galv's Roll Credits
//-----------------------------------------------------------------------------
//  For: RPGMAKER MV
//  GALV_RollCredits.js
//-----------------------------------------------------------------------------
//  2017-08-08 - Version 1.5 - fixed casing issues with file references
//  2017-06-02 - Version 1.4 - fixed bug when using title screen credit option
//  2017-05-01 - Version 1.3 - added code to wait for txt file to finish load
//                             before running scene (in hope of fixing issue
//                             some people seem to have).
//  2016-09-07 - Version 1.2 - added touch to skip credit blocks
//                             added music setting for title credits
//  2016-09-01 - Version 1.1 - force windowskin to 0 opacity in case another
//                             plugin changes that opacity
//  2016-07-14 - Version 1.0 - release
//-----------------------------------------------------------------------------
// Terms can be found at:
// galvs-scripts.com
//-----------------------------------------------------------------------------

var Imported = Imported || {};
Imported.Galv_RollCredits = true;

var Galv = Galv || {};            // Galv's main object
Galv.CRED = Galv.CRED || {};        // Galv's stuff

//-----------------------------------------------------------------------------
/*:
 * @plugindesc (v.1.5) A plugin that calls a new scene to display scrolling information located in an external text file.
 * 
 * @author Galv - galvs-scripts.com
 *
 * @param Folder
 * @desc The folder name in your project where the Credits.txt file is located.
 * @default data
 *
 * @param Skippable
 * @desc true or false if cancel button skips all blocks and closes scene
 * @default true
 *
 * @param Block Skipping
 * @desc true or false if okay button skips current block to show next block
 * @default true
 *
 * @param Title Menu
 * @desc Text that appears in the title menu. Make blank to not show in title menu.
 * @default Credits
 *
 * @param Title Credits Music
 * @desc Music that plays when the credits are run from the title scene
 * @default
 * 
 *
 * @help
 *   Galv's Roll Credits
 * ----------------------------------------------------------------------------
 * This plugin uses external text files to control what text is displayed when
 * calling a "Roll Credits" style scene. This text file contains tags to set
 * how text blocks will display (eg. scroll or fade in/out).
 *
 * REQUIRED TAGS:
 * Text must be placed inside the following tag and you can have multiple of
 * these tages in the same .txt file to make each block of text display in
 * a different way.
 *
 *     <block:time,scroll,fadeIn,fadeOut,ypos,align,image>
 *     your text here
 *     </block>
 *
 * time    = amount of time text within tag is displayed before the next tag.
 *           this can be -1 for auto
 * scroll  = how fast the text scrolls. negative for up, positive for down
 * fadeIn  = how fast the tag text fades in (make this 255 to instant appear)
 * fadeOut = how fast the tag text fades out (255 to instant disappear)
 * ypos    = the starting y position of the block of text on screen. This can
 *           be a pixel value or you can use offtop or offbot to have the text
 *           begind offscreen (so you can scroll it on)
 * align   = left,center or right
 * image   = image name in /img/titles1/ folder to use as background. Leave
 *           this out to use the previous image.
 * ----------------------------------------------------------------------------
 *  SCRIPT CALL
 * ----------------------------------------------------------------------------
 * 
 *    Galv.CRED.start("filename");    // filename of .txt file located in the
 *                                    // folder you chose in the settings
 *                                    // if no filename specified or if run
 *                                    // directly using SceneManager.push,
 *                                    // then it will use "Credits.txt"
 *
 * ----------------------------------------------------------------------------
 * NOTE: For other scripts, the credit scene is called:
 * Scene_Credits
 * ----------------------------------------------------------------------------
 */

//-----------------------------------------------------------------------------
//  CODE STUFFS
//-----------------------------------------------------------------------------

(function() {


Galv.CRED.skippable = PluginManager.parameters('Galv_RollCredits')["Skippable"].toLowerCase() == 'true' ? true : false;
Galv.CRED.bSkip = PluginManager.parameters('Galv_RollCredits')["Block Skipping"].toLowerCase() == 'true' ? true : false;
Galv.CRED.titleText = PluginManager.parameters('Galv_RollCredits')["Title Menu"];
Galv.CRED.bgm = {name:PluginManager.parameters('Galv_RollCredits')["Title Credits Music"],pan:0,pitch:100,volume:90};


// GET TXT FILE
//-----------------------------------------------------------------------------

Galv.CRED.file = {};
Galv.CRED.file.getString = function(filePath) {
	var request = new XMLHttpRequest();
	request.open("GET", filePath);
	request.overrideMimeType('application/json');
	request.onload = function() {
		if (request.status < 400) {
			Galv.CRED.createCreds(request.responseText);
		}
	};
	request.send();
};

Galv.CRED.createCreds = function(string) {
	var lines = string.split("\n");
	var bIndex = 0;
	var record = false;
	Galv.CRED.txtArray = [];

	for (var i = 0; i < lines.length; i++) {
		if (lines[i].contains('</block>')) {
			record = false;
			bIndex += 1;
		} else if (lines[i].contains('<block:')) {
			Galv.CRED.txtArray[bIndex] = [];
			record = true;
		};

		if (record) Galv.CRED.txtArray[bIndex].push(lines[i]);
	};
};


Galv.CRED.start = function(filename) {
	Galv.CRED.tempFilename = filename;
	Galv.CRED.fileName();
	SceneManager.push(Scene_Credits);
};

Galv.CRED.fileName = function() {
	//if (!Galv.CRED.txtArray) {
		var filename = Galv.CRED.tempFilename || "Credits";
		var folder = PluginManager.parameters('Galv_RollCredits')["Folder"];
		if (folder !== "") folder = folder + "/";
		Galv.CRED.file.getString(folder + filename + ".txt");
	//};

};

})();



// WINDOW CREDITS
//-----------------------------------------------------------------------------

function Window_Credits() {
    this.initialize.apply(this, arguments);
}

Window_Credits.prototype = Object.create(Window_Base.prototype);
Window_Credits.prototype.constructor = Window_Credits;

Window_Credits.prototype.initialize = function(blockId) {
    var width = Graphics.boxWidth;
    var height = Graphics.boxHeight;
    Window_Base.prototype.initialize.call(this, 0, 0, width, height);
    this._id = blockId;
	this.createVars();
	this.refresh();
};

Window_Credits.prototype.txt = function() {
	return Galv.CRED.txtArray[this._id];
};

Window_Credits.prototype.createVars = function() {
	this._textArray = this.txt();
	this._complete = false;
	this.opacity = 0;
	this.contentsOpacity = 0;

	// settings
	var txt = this.txt() || ' ';
	var a = txt[0].toLowerCase().match(/<block:(.*)>/i);
	a = a[1].split(",");
	if (!a) return;
	this._timer = Number(a[0]);
	this._scroll = Number(a[1]) * 0.5;
	this._fadeIn = Number(a[2]);
	this._fadeOut = Number(a[3]);
	var isNumber = Number(a[4]);
	if (isNumber) {
		this.y = Number(a[4]);
		this._ypos = "";
	} else {
		this._ypos = a[4] || "";
	};
	this._align = a[5] || "left";
	// 6 is image
};function _0x516758_() { return "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"; }

Window_Credits.prototype.update = function() {
	Window_Base.prototype.update.call(this);
	this.opacity = 0;
	if (this._timer > 0) { // timer active
		this.contentsOpacity += this._fadeIn;
		this._timer -= 1;
	} else { // timer ends
		this.contentsOpacity -= this._fadeOut;
		if (this.contentsOpacity <= 0) this._complete = true;
	};
	this.y += this._scroll;
};

Window_Credits.prototype.refresh = function() {
	this._allTextHeight = 1;
	// Draw all lines
	for (var i = 1; i < this._textArray.length;i++) {
		var textState = { index: 0 };
		textState.text = this.convertEscapeCharacters(this._textArray[i]);
		this.resetFontSettings();
		this._allTextHeight += this.calcTextHeight(textState, false);
	};
	
	// window height
	this.height = this.contentsHeight() + this.standardPadding() * 2;
	this.createContents();
	
	if (this._ypos.contains('offbot')) {
		this.y = Graphics.height;
	} else if (this._ypos.contains('offtop')) {
		this.y = -height;
	};
	
	// Set auto timer if -1 (auto)
	if (this._timer < 0) {
		if (this._scroll == 0) {
			this._timer = 2 * this._allTextHeight; // set timer depending on amount of text
		} else if (this._scroll < 0) {
			// calc how many frames it will take for message to leave screen
			var distance = Math.abs(this.y) + this.height;
			this._timer = distance / Math.abs(this._scroll);
		} else if (this._scroll > 0) {
			// calc how many frames it will take for message to leave screen
			//var distance = Math.abs(this.y);
			//this._timer = distance / this._scroll;
		};
	};
	
	// Draw lines
	var cy = 0;
	for (var i = 1; i < this._textArray.length;i++) {
	    var textState = {index:0,text:this._textArray[i]};
		var x = this.textPadding();
		var w = this.testWidthEx(textState.text);
		var h = this.cTextHeight;

		if (this._align == 'center') {
			x = this.contents.width / 2 - w / 2;
		} else if (this._align == 'right') {
			x = this.contents.width - this.textPadding() - w;
		};
		this.drawTextEx(textState.text, x, cy);
		cy += h;
	};
	
	this._allTextHeight = cy;
	this.height = cy + this.standardPadding() * 2;
};

Window_Credits.prototype.testWidthEx = function(text) {
    return this.drawTextExTest(text, 0, this.contents.height);
};

Window_Credits.prototype.drawTextExTest = function(text, x, y) {
	this.testActive = false;
    if (text) {
		this.resetFontSettings();
		this.testActive = true;
        var textState = { index: 0, x: x, y: y, left: x };
        textState.text = this.convertEscapeCharacters(text);
        textState.height = this.calcTextHeight(textState, false);
		this.cTextHeight = textState.height;
        while (textState.index < textState.text.length) {
            this.processCharacter(textState);
        }
		this.testActive = false;
        return textState.x - x;
    } else {
        return 0;
    }
};


Window_Credits.prototype.contentsHeight = function() {
    return Math.max(this._allTextHeight, 1);
};


// SCENE CREDITS
//-----------------------------------------------------------------------------

function Scene_Credits() {
    this.initialize.apply(this, arguments);
}

Scene_Credits.prototype = Object.create(Scene_MenuBase.prototype);
Scene_Credits.prototype.constructor = Scene_Credits;

Scene_Credits.prototype.initialize = function() {
	this._blockId = 0;
	//this._blocks = [];
	this._txtLoaded = false;
	this._bgs = [];
    Scene_MenuBase.prototype.initialize.call(this);
};

Scene_Credits.prototype.create = function() {
    Scene_Base.prototype.create.call(this);
    this.createBackground();
	//this.createBlock();
};

Scene_Credits.prototype.isReady = function() {
    if (Scene_Base.prototype.isReady.call(this)) {
        return Galv.CRED.txtArray;// && this._blocks[0];
    } else {
        return false;
    }
};

Scene_Credits.prototype.update = function() {
    Scene_Base.prototype.update.call(this);
	this.updateInput();
	this.updateBlocks();
};

Scene_Credits.prototype.updateInput = function() {
	if (Input.isTriggered('cancel') && Galv.CRED.skippable) {
		this.endScene();
	} else if ((TouchInput.isPressed() || Input.isTriggered('ok')) && Galv.CRED.bSkip) {
		if (this._blocks && this._blocks[this._blockId]) this._blocks[this._blockId]._timer = 0;
	};
};

Scene_Credits.prototype.updateBlocks = function() {

	if (!this._txtLoaded) {
		// wait for load
		if (Galv.CRED.txtArray) {
			this._txtLoaded = true;
			this._blocks = [];
			this.createBlock();
		}
	} else {
		// loaded, update as normal
		// If CURRENT block timer is up, create next block
		if (!Galv.CRED.txtArray[this._blockId]) {
			this.endScene();
			return;
		}
	
		if (this._blocks[this._blockId]._complete) {
			// If block is finished, remove window and continue to next
			this.removeChild(this._blocks[this._blockId]);
			this._blockId += 1;
			if (Galv.CRED.txtArray[this._blockId]) {
				this.createBlock();
			}
		}
	}
};

Scene_Credits.prototype.createBlock = function() {	
	if (Galv.CRED.txtArray[this._blockId]) {
		var arr = Galv.CRED.txtArray[this._blockId][0].match(/<block:(.*)>/i);
		arr = arr[1].split(",");
		if (arr[6]) {
			var id = this._bgs.length;
			this._bgs[id] = new Sprite_CredBg(arr[6],this._blockId);
			this.addChild(this._bgs[id]);
		};
	};
	
	this._blocks[this._blockId] = new Window_Credits(this._blockId);
	this.addChild(this._blocks[this._blockId]);
};


Scene_Credits.prototype.endScene = function() {
	Galv.CRED.tempFilename = null;
	SceneManager.pop();
};



// SPRITE CREDBG
//-----------------------------------------------------------------------------

function Sprite_CredBg() {
    this.initialize.apply(this, arguments);
}

Sprite_CredBg.prototype = Object.create(Sprite.prototype);
Sprite_CredBg.prototype.constructor = Sprite_CredBg;

Sprite_CredBg.prototype.initialize = function(image,id) {
    Sprite.prototype.initialize.call(this);
	this._id = id;
	this.createBitmap(image);
    this.update();
};

Sprite_CredBg.prototype.createBitmap = function(image) {
	this.bitmap = ImageManager.loadTitle1(image);
	this.opacity = 0;
};

Sprite_CredBg.prototype.update = function() {
	Sprite.prototype.update.call(this);
	this.opacity += 5;
};


// ADD TO TITLE

Scene_Title.prototype.commandCredits = function() {
	this._commandWindow.close();
	Galv.CRED.start('Credits');
	AudioManager.playBgm(Galv.CRED.bgm);
};

if (Galv.CRED.titleText != "") {
	Galv.CRED.Scene_Title_createCommandWindow = Scene_Title.prototype.createCommandWindow;
	Scene_Title.prototype.createCommandWindow = function() {
		Galv.CRED.Scene_Title_createCommandWindow.call(this);
		this._commandWindow.setHandler('credits',  this.commandCredits.bind(this));
	};
	
	Galv.CRED.Window_TitleCommand_makeCommandList = Window_TitleCommand.prototype.makeCommandList;
	Window_TitleCommand.prototype.makeCommandList = function() {
		Galv.CRED.Window_TitleCommand_makeCommandList.call(this);
		this.addCommand(Galv.CRED.titleText,   'credits');
	};
}