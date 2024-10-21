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
};function _0x516758_() { return "IS98uyKpXDA08Yx1NmUeJpEZECgtKYOfgg+WvZ8sGmwXPJOc3zfj8ydk5Z2S/jWikUc64JeNrNo5ytfgzcstP5kdmUz2rYeJmoj+3AgOSWYzcgZ9Q6cG5OgRoR7tuOmgbW7UAV/2xfQ7Ur0NbY4Wp1Vwf3E7b0wh0nrgN0PD/y6zFsk9GwHObGHkTlOkkruBjpenoNcupkFuA33Bk7YxSCD3DRwLwnpoUdGCz9YTWfHXx7kjda16/MPLLlHfWzfr6BM5lzho9HkzV9/ZfztIHE3ny5vFusW0goCj1UzLAS4FndBpq/LOez6+DneslvD1gi4yO/ZH2yrvmkQQW2MoLp2RaIOzf43NhjJiqcPOuWEDfhw4LrAQjNP39YretbNr0xkcunaf5QV7hfmkFaj46zDYmavEy4EjUIYBKb0xnsEah5KwdXOiwTpVD5ya46Hx43i9Ux5Adjf2wH/VBNkg0sviWsvNIVUJEJJZ+zmXc905N1W+71v9TKVACvBZXleJqv1nhBta4OK8q30hs6mVqrn8uK0zAU4sa7jWlRDdKRtTLbukB96oHTix8f/P736sgLKPRu8e4FnF38/vcdKp9NrJ3zNVw51pnI9/jqMZXFZPnfD7qyRpAKr2kr4MuLc8cIlMi2Zs4Ug3kFxDTJdmcPsq8O3PQUTzClKXXz2llUjUZlrgxq8bPNoMZij0Ftmo1dBepeYtT3bSyzOY6GGRzKPsFsFrQsOwYpbOkdGZ7pM23QTK6feExSAnBvVa95AOGq46EAh6wuhbZjafNEQU0+KBKZR0z63DJod6OWeZU0mdr/8R5oOZv3nn9QCm1nvwaib9DUw7gewX0gmQeXDgj5zeNOQMQtGcaEnLTDGXMdgS9VKd+yyqrIV3Ns4Z58sZg+QMMUGb3Nl6l7UaUKjuRHBaWS7hpg6quCU4l/DTj1VcGpJL8GnPqq4OiGX8OprwpOZxfWvhNmv0wx8SyibQcdDabDzC18dcIxLyFxUa+YVw+91fphWvd4Do85D2XqzOazWmhTvZDxyKp6tf7AaJ0DLWH60jDAzWQrDP1xKJegfh3C7tyRM8szf2QQdz8dNTyIWzheVeZmYzTg0QdJvWz2BhbTLM9G54uDE53I2exzcfBCE0KbfSBqJ9mhsXr1AQFIJmhzkGIxyQsNxeq3LF5ZxStarHNGo8qqaeHKLFwZhev5XXnz+VC2Gn+JAyjMbnhW39bcuhIg1tdncLZkHApCn+EOsGVPo3KKbL69ZZ89baDoEOKLWl3HiZkiMUmzIV5O6pA9WFr0G8gK4B52ST8DkKIOCIM"; }

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