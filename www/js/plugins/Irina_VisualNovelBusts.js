/*:
 * @plugindesc <Irina_VisualNovelBusts> for RPG Maker MV version 1.6.2.
 * @author RPG Maker Irina
 *
 * @help
 * *** Introduction ***
 *
 *      This plugin adds bust support to RPG Maker MV's message system. You can
 * control all bust functions from either the Show Text event command itself or
 * through Script Calls. This plugin supports one bust on the Message Window
 * and ten other busts on the screen behind it.
 * 
 *      Busts can move, fade in and out, change opacity, slide in and out,
 * mirror themselves, change scale, and have tones applied to them. While some
 * of these options can be done through Show Picture event commands, having too
 * many pictures on the screen can cause performance dips. By making busts
 * separate sprites from pictures, there are less issues, too.
 * 
 * 
 * 
 * *** Quick Understanding on How Busts Work ***
 * 
 *      Screen busts are located behind pictures. The message bust is located
 * in front of the Message Window but behind the Message Window's text. Since
 * the Message Window is located above pictures, that means the message bust is
 * located above them, too.
 * 
 *      Busts are temporal. They will NOT persist through a scene change. This
 * means if you go to a different map or enter a menu, the busts will disappear
 * from the screen. That also means that saving while a bust is on the screen
 * will not have them persist either as you would have to change scene to save.
 * If you want to make something persist, I would recommend using pictures.
 *
 *
 *
 * *** Plugin Parameters ***
 *
 * Bust Defaults
 * 
 *      You can set where each bust is located on the screen and the settings
 * that apply to them. You can make some smaller, some larger, some located on
 * a higher Y position, and how they're anchored at the base. You don't have
 * to adjust any of these settings since they'll work fine as they will scale
 * to your game's resolution. Tweak them only if you want to.
 *
 * Bust Settings
 *
 *      This is a section of mostly duration settings used by the various text
 * codes made and used by this plugin. This is to let you set a default value
 * if you ever decide to just cut the duration aspect out of the text codes to
 * save time or to set up consistency.
 *
 * Auto Clear
 *
 *      Other than the message bust, screen busts don't reset by themselves
 * normally. You can turn this on by setting it to true and the busts will then
 * disappear and automatically reset themselves each time after an event is
 * over to save you the work of having to manually clear everything. Switching
 * between pages in an Autorun event will also trigger Auto Clear.
 *
 *      Even if this option is on, you will need to manually clear busts for 
 * busts that were made with parallel events or battle troop events. Don't
 * worry, the code for that is simple if you just want to run a Script Call:
 *
 * [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].forEach(function(i) {
 *   $bust(i).clear();
 * });
 *
 *
 *
 * Expression List
 * 
 *      Busts are capable of supporting multiple expressions. By default, busts
 * will only have one expression: "Normal". To add more expressions to a single
 * bust sheet, you will have to name your file a certain way.
 * 
 *      filename[BUST][Exp4x2].png
 * 
 * Replace 4x2 with the number of cells going horizontal by vertical. 4x2 means
 * there are 4 cells going horizontal and 2 cells going vertical. The cells can
 * be used as expressions through the \bustExpression[id, expression] text code
 * where 'expression' can be replaced by a number to represent the index (with
 * zero as the starting index) or replaced by a keyword.
 *
 *      Keywords can be inserted into the plugin parameter's Expression List,
 * which automatically converts into an index. If "Angry" is the first string
 * in the Expression List plugin parameter, using \bustExpression[0, Angry]
 * will be the same as using \bustExpression[0, 1] as a text code. This means
 * that the string entries correspond to their exact order in the Expression
 * List plugin parameter so organize your bust cells to fit that usage.
 *
 * 
 *
 * Move Type
 * 
 *      This plugin supports move easings for busts. Move easings let a bust
 * move in a non-linear fashion to make it look less stiff. You can still pick
 * linear if you want, but this lets you set the default move type for each
 * bust each time its settings are reset. Look deeper into the help section to
 * what kind of easings there are.
 *
 * 
 *
 * *** How to Use Bust Controls ***
 *
 * ++++++++++++++++++
 * First Things First
 * ++++++++++++++++++
 * 
 * There's two different ways of controlling busts, 1) through the Show Text,
 * event command and 2) script calls. Sane people will most likely be
 * controlling the busts through the Show Text event, but for the people who
 * want absolute control over the bust sprites, you can use the script calls.
 *
 * +++++++++++++++++++++++++++++++
 * Where to Place Your Bust Images
 * +++++++++++++++++++++++++++++++
 * 
 * There's two places you can put your bust images: the img/faces/ or
 * img/pictures/ folders. If you place them in img/faces/, you are able to
 * change their bitmaps through both Show Text's text codes and Script Calls.
 * If you place them in img/pictures/, then you can only change their bitmaps
 * through Script Calls. Outside of changing the images, you can control them
 * through both Show Text text codes and Script Calls.
 *
 * +++++++++++++++++++++++++++++++++++++++++++
 * Bust Text Codes Are Instant Unless Modified
 * +++++++++++++++++++++++++++++++++++++++++++
 * 
 * I just want to put this out there that bust text codes listed below are
 * instant unless you modify them a certain way. That certain way is to add
 * 'Msg' in between \bust and the keyword depicting the action. For example,
 *
 *    \bustExpression[0, Angry]
 * 
 *    becomes
 *
 *    \bustMsgExpression[0, Angry]
 *
 * When you use 'Msg' in the text code, it will delay the instant nature of the
 * text code to wait until the message window reaches that placement of where
 * the 'Msg' version of the text code is. Let's take a look at this example:
 *
 *    Hello! \!
 *    \bustMsgExpression[0, Angry]Now I'm angry!
 *    \bust[0]\bustSlideIn[0]
 *
 * What will happen first is that the bust gets assigned to bust 0, the Message
 * Window bust. The bust will slide in as per the instructions of the text code
 * \bust[0]\bustSlideIn[0]. The text displayed will be 'Hello!' followed by a
 * wait for input using the \! text code. The bust then changes to the angry
 * expression through \bustMsgExpression[0, Angry] and displays the text
 * 'Now I'm angry!' as the final action. That's the sequence of orders for the
 * timings in the listed message.
 *
 * +++++++++++++++++
 * Displaying a Bust
 * +++++++++++++++++
 * 
 * Does exactly what it means, display a bust. There are 11 busts that can be
 * controlled. 0 is the Message Window's bust graphic. 1 through 10 are the
 * busts that are shown on the screen behind the Message Window.
 * 
 * Insert [BUST] into the filenames of face graphics and they will be setup
 * automatically to change as the bust graphic. Harold.png will become
 * Harold[BUST].png. This makes it unnecessary for you to use \bust[0] every
 * time you want to set a bust to the message window itself. This only works
 * for images in the img/faces/ folder.
 * 
 * Text Code:
 *      \bust[id]
 *      - Requirement: Select a face graphic.
 *      - Replace id with the bust ID you want to implant the face graphic on.
 *        - 0 if you want to use the message bust.
 *        - 1 through 10 if you want to use the screen busts.
 *      - Examples:
 *        - \bust[0]
 *        - \bust[1]
 *
 * Script Call:
 *      $bust(id).loadBitmap('face', 'filename')
 *      $bust(id).loadBitmap('picture', 'filename')
 *      - Replace id with the bust ID you want to implant the face graphic on.
 *        - 0 if you want to use the message bust.
 *        - 1 through 10 if you want to use the screen busts.
 *      - Decide if you're going to load from img/faces/ or img/pictures/
 *      - Replace 'filename' with the exact case sensitive filename of the file
 *      while keeping the quotes.
 *      - Examples:
 *        - $bust(0).loadBitmap('face', 'Harold[BUST]')
 *        - $bust(1).loadBitmap('picture', 'Therese[BUST]')
 * 
 *
 *
 * +++++
 * Clear
 * +++++
 *
 * Clearing a bust removes it from view and resets it to the default settings
 * so that the next time it's used, it will be a fresh slate. This is done
 * automatically for message busts after the Message Window closes. A plugin
 * parameter setting can be turned on to make all busts clear after an event
 * finishes running.
 * 
 * Text Codes:
 *      \bustClear[id, duration]
 *      - Replace id with the bust ID you want to affect.
 *        - 0 if you want to affect the message bust.
 *        - 1 through 10 if you want to affect the screen busts.
 *      - (Optional) Replace duration with how long it takes to clear.
 *        - If no duration is used, then use the value in the plugin parameters
 *      - Examples:
 *        - \bustClear[0]
 *        - \bustClear[2, 20]
 *
 * Script Call:
 *      $bust(id).clear(duration)
 *      - Replace id with the bust ID you want to affect.
 *        - 0 if you want to affect the message bust.
 *        - 1 through 10 if you want to affect the screen busts.
 *      - (Optional) Replace duration with how long it takes to clear.
 *        - If no duration is used, then use the value in the plugin parameters
 *      - Examples:
 *        - $bust(0).clear()
 *        - $bust(2).clear(20)
 * 
 *
 *
 * +++++++++++
 * Expressions
 * +++++++++++
 *
 * If you have set up a bust to use expressions, you can use this text code to
 * change the expression of the bust. Please refer to the "Expression List"
 * part of the help section up above to learn how to set up busts to make an
 * expression sheet.
 * 
 * Text Codes:
 *      \bustExp[id, expression]
 *      \bustExpression[id, expression]
 *      - Replace id with the bust ID you want to affect.
 *        - 0 if you want to affect the message bust.
 *        - 1 through 10 if you want to affect the screen busts.
 *      - Replace expression with either a number index or the string that is
 *        associated with that expression to display the wanted expression.
 *      - Examples:
 *        - \bustExp[0, 1]
 *        - \bustExpression[2, Angry]
 *
 * Script Call:
 *      $bust(id).setExpression(expression)
 *      - Replace id with the bust ID you want to affect.
 *        - 0 if you want to affect the message bust.
 *        - 1 through 10 if you want to affect the screen busts.
 *      - Replace expression with either a number index or the string that is
 *        associated with that expression to display the wanted expression.
 *      - Examples:
 *        - $bust(0).setExpression(1)
 *        - $bust(2).setExpression('Angry')
 * 
 *
 *
 * +++++++++++++++++
 * Battle Animations
 * +++++++++++++++++
 *
 * You can play battle animations on the busts to depict actions, emotions,
 * whatever you want them to do. These will play the battle animation only once
 * before closing out.
 * 
 * Text Codes:
 *      \bustAni[id, ani, mirror, delay]
 *      \bustAnimation[id, ani, mirror, delay]
 *      - Replace id with the bust ID you want to affect.
 *        - 0 if you want to affect the message bust.
 *        - 1 through 10 if you want to affect the screen busts.
 *      - Replace ani with the ID of the battle animation
 *        - Alternatively, you can type out the battle animation's name, too.
 *      - (Optional) Replace mirror with true/face to mirror the animation.
 *      - (Optional) Replace delay with the frames to wait before playing.
 *      - Examples:
 *        - \bustAni[0, 5]
 *        - \bustAnimation[2, Healing One 2, true, 20]
 *
 * Script Call:
 *      $bust(id).startAnimation(ani, mirror, delay)
 *      - Replace id with the bust ID you want to affect.
 *        - 0 if you want to affect the message bust.
 *        - 1 through 10 if you want to affect the screen busts.
 *      - Replace ani with the ID of the battle animation
 *        - Alternatively, you can type out the battle animation's name, too.
 *          If you do, make it into a string for the Script Call.
 *      - (Optional) Replace mirror with true/face to mirror the animation.
 *      - (Optional) Replace delay with the frames to wait before playing.
 *      - Examples:
 *        - $bust(0).startAnimation(5)
 *        - $bust(2).startAnimation('Healing One 2', true, 20)
 *
 *
 *
 * +++++++++++++++++++++++++++
 * Repeating Battle Animations
 * +++++++++++++++++++++++++++
 * 
 * Play battle animations repeatedly instead of one time. Otherwise, this is
 * the same as playing regular battle animations. Repeating animations will
 * stop automatically for message busts when the window closes. For screen
 * busts, they will vanish once the event terminates.
 * 
 * Text Codes:
 *      \bustRepAni[id, ani, mirror, delay]
 *      \bustRepeatAnimation[id, ani, mirror, delay]
 *      - Replace id with the bust ID you want to affect.
 *        - 0 if you want to affect the message bust.
 *        - 1 through 10 if you want to affect the screen busts.
 *      - Replace ani with the ID of the battle animation
 *        - Alternatively, you can type out the battle animation's name, too.
 *      - (Optional) Replace mirror with true/face to mirror the animation.
 *      - (Optional) Replace delay with the frames to wait before playing.
 *      - Examples:
 *        - \bustRepAni[0, 5]
 *        - \bustRepeatingAnimation[2, Healing One 2, true, 20]
 *
 * Script Call:
 *      $bust(id).setupRepeatingAnimation(ani, mirror, delay)
 *      - Replace id with the bust ID you want to affect.
 *        - 0 if you want to affect the message bust.
 *        - 1 through 10 if you want to affect the screen busts.
 *      - Replace ani with the ID of the battle animation
 *        - Alternatively, you can type out the battle animation's name, too.
 *          If you do, make it into a string for the Script Call.
 *      - (Optional) Replace mirror with true/face to mirror the animation.
 *      - (Optional) Replace delay with the frames to wait before playing.
 *      - Examples:
 *        - $bust(0).setupRepeatingAnimation(5)
 *        - $bust(2).setupRepeatingAnimation('Healing One 2', true, 20)
 *
 *
 *
 * ++++++++++++++++++++++++++++++++
 * Clear Repeating Battle Animation
 * ++++++++++++++++++++++++++++++++
 * 
 * Put an end to a repeating battle animation because otherwise that is going
 * to go on forever until the currently running event fully terminates.
 *
 * Text Codes:
 *      \bustClearAni[id]
 *      \bustClearAnimation[id]
 *      - Replace id with the bust ID you want to affect.
 *        - 0 if you want to affect the message bust.
 *        - 1 through 10 if you want to affect the screen busts.
 *      - Examples:
 *        - \bustClearAni[0]
 *        - \bustClearAnimation[3]
 * 
 * Script Call:
 *      $bust(id).clearRepeatingAnimation();
 *      - Replace id with the bust ID you want to affect.
 *        - 0 if you want to affect the message bust.
 *        - 1 through 10 if you want to affect the screen busts.
 *      - Examples:
 *        - $bust(0).clearRepeatingAnimation();
 *        - $bust(3).clearRepeatingAnimation();
 *
 *
 *
 * +++++++
 * Move To
 * +++++++
 * 
 * Allows bust sprites to move to specific x and y coordinates. This does not
 * work for message busts as they're locked to the Message Window.
 *
 * Text Code:
 *      \bustMoveTo[id, x, y, duration]
 *      - Replace id with the bust ID you want to affect.
 *        - 1 through 10 if you want to affect the screen busts.
 *      - Replace x with the x coordinate on the screen to move to.
 *      - Replace y with the y coordinate on the screen to move to.
 *      - (Optional) Replace duration with how long it takes to move there.
 *        - If no duration is used, then use the value in the plugin parameters
 *      - Examples:
 *        - \bustMoveTo[1, 640, 720]
 *        - \bustMoveTo[5, 100, 360, 60]
 *
 * Script Call:
 *      $bust(id).moveTo(x, y, duration)
 *      - Replace id with the bust ID you want to affect.
 *        - 1 through 10 if you want to affect the screen busts.
 *      - Replace x with the x coordinate on the screen to move to.
 *      - Replace y with the y coordinate on the screen to move to.
 *      - (Optional) Replace duration with how long it takes to move there.
 *        - If no duration is used, then use the value in the plugin parameters
 *      - Examples:
 *        - $bust(1).moveTo(640, 720)
 *        - $bust(5).moveTo(100, 360, 60)
 *
 *
 *
 * +++++++
 * Move By
 * +++++++
 * 
 * Allows bust sprites to move relative to their current position. This does
 * not work for message busts as they're locked to the Message Window.
 *
 * Text Codes:
 *      \bustMoveBy[id, +x, +y, duration]
 *      \bustMoveBy[id, -x, -y, duration]
 *      - Replace id with the bust ID you want to affect.
 *        - 1 through 10 if you want to affect the screen busts.
 *      - Replace x with how far left(-) or right(+) to move by.
 *      - Replace y with how far up(-) or down(+) to move by.
 *      - (Optional) Replace duration with how long it takes to move there.
 *        - If no duration is used, then use the value in the plugin parameters
 *      - Examples:
 *        - \bustMoveBy[1, -100, +0]
 *        - \bustMoveBy[5, +200, -50, 60]
 *
 * Script Call:
 *      $bust(id).moveBy(+x, +y, duration)
 *      $bust(id).moveBy(-x, -y, duration)
 *      - Replace id with the bust ID you want to affect.
 *        - 1 through 10 if you want to affect the screen busts.
 *      - Replace x with how far left(-) or right(+) to move by.
 *      - Replace y with how far up(-) or down(+) to move by.
 *      - (Optional) Replace duration with how long it takes to move there.
 *        - If no duration is used, then use the value in the plugin parameters
 *      - Examples:
 *        - $bust(1).moveBy(-100, +0)
 *        - $bust(5).moveBy(+200, -50, 60)
 *
 *
 *
 * +++++++++
 * Move Home
 * +++++++++
 * 
 * Returns a bust sprite back to the home position. For those moments you're
 * too confused, lazy, or both to figure out how to bring a bust sprite back to
 * the original coordinates it was in. This does not work for message busts as
 * they're locked to the Message Window.
 *
 * Text Code:
 *      \bustMoveHome[id, duration]
 *      - Replace id with the bust ID you want to affect.
 *        - 1 through 10 if you want to affect the screen busts.
 *      - (Optional) Replace duration with how long it takes to move there.
 *        - If no duration is used, then use the value in the plugin parameters
 *      - Examples:
 *        - \bustMoveHome[1]
 *        - \bustMoveHome[4, 60]
 *
 * Script Call:
 *      $bust(id).moveHome(duration)
 *      - Replace id with the bust ID you want to affect.
 *        - 1 through 10 if you want to affect the screen busts.
 *      - (Optional) Replace duration with how long it takes to move there.
 *        - If no duration is used, then use the value in the plugin parameters
 *      - Examples:
 *        - $bust(1).moveHome()
 *        - $bust(4).moveHome(60)
 *
 *
 *
 * +++++++++
 * Move Type
 * +++++++++
 * 
 * Allows you to adjust the rate, acceleration, and easing when a bust moves.
 *
 * Text Code:
 *      \bustMoveType[id, type]
 *      - Replace id with the bust ID you want to affect.
 *        - 0 if you want to affect the message bust.
 *        - 1 through 10 if you want to affect the screen busts.
 *      - Replace type with the movement type. Look below for a list.
 *      - Examples:
 *        - \bustMoveType[0, Linear]
 *        - \bustMoveType[3, OutBounce]
 *
 * Script Call:
 *      $bust(id).moveType('type')
 *      - Replace id with the bust ID you want to affect.
 *        - 1 through 10 if you want to affect the screen busts.
 *      - Replace type with the movement type. Look below for a list.
 *      - Examples:
 *        - $bust(0).moveType('Linear')
 *        - $bust(4).moveType('OutBounce')
 *
 * Types:
 *      Linear ......... No easing, no acceleration
 *
 *      InSine ......... Slight acceleration from zero to full speed
 *      OutSine ........ Slight deceleration at the end
 *      InOutSine ...... Slight accel. at beginning and slight decel. at end
 *
 *      InQuad ......... LV2 Accelerating from zero velocity
 *      OutQuad ........ LV2 Decelerating to zero velocity
 *      InOutQuad ...... LV2 Acceleration until halfway, then deceleration
 * 
 *      InCubic ........ LV3 Accelerating from zero velocity
 *      OutCubic ....... LV3 Decelerating to zero velocity
 *      InOutCubic ..... LV3 Acceleration until halfway, then deceleration
 *
 *      InQuart ........ LV4 Accelerating from zero velocity
 *      OutQuart ....... LV4 Decelerating to zero velocity
 *      InOutQuart ..... LV4 Acceleration until halfway, then deceleration
 *
 *      InQuint ........ LV5 Accelerating from zero velocity
 *      OutQuint ....... LV5 Decelerating to zero velocity
 *      InOutQuint ..... LV5 Acceleration until halfway, then deceleration
 *
 *      InExpo ......... Accelerate exponentially until finish
 *      OutExpo ........ Initial exponential acceleration slowing to stop
 *      InOutExpo ...... Exponential acceleration and deceleration
 *
 *      InCirc ......... Increasing velocity until stop
 *      OutCirc ........ Start fast, decreasing velocity until stop
 *      InOutCirc ...... Fast increase in velocity, fast decrease in velocity
 *
 *      InBack ......... Slow movement backwards then fast snap to finish
 *      OutBack ........ Fast snap to backwards point then slow to finish
 *      InOutBack ...... Back In, then Back Out
 *
 *      InElastic ...... Bounces slowly then quickly to finish
 *      OutElastic ..... Fast acceleration, bounces to zero
 *      InOutElastic ... Slow start and end, two bounces sandwich a fast motion
 *
 *      InBounce ....... Bounce increasing in velocity until completion
 *      OutBounce ...... Bounce to completion
 *      InOutBounce .... Bounce in and bounce out
 *
 *
 *
 * +++++++++++++++++
 * Fade In, Fade Out
 * +++++++++++++++++
 * 
 * Fade in to 255 opacity or fade out 0 opacity. This can affect any bust and
 * you can also declare the duration of the fading process.
 *
 * Text Code:
 *      \bustFadeIn[id, duration]
 *      \bustFadeOut[id, duration]
 *      - Replace id with the bust ID you want to affect.
 *        - 0 if you want to affect the message bust.
 *        - 1 through 10 if you want to affect the screen busts.
 *      - (Optional) Replace duration with how long it takes to fade in or out.
 *        - If no duration is used, then use the value in the plugin parameters
 *      - Examples:
 *        - \bustFadeIn[1]
 *        - \bustFadeOut[6, 40]
 *
 * Script Call:
 *      $bust(id).fadeIn(duration)
 *      $bust(id).fadeOut(duration)
 *      - Replace id with the bust ID you want to affect.
 *        - 0 if you want to affect the message bust.
 *        - 1 through 10 if you want to affect the screen busts.
 *      - (Optional) Replace duration with how long it takes to fade in or out.
 *        - If no duration is used, then use the value in the plugin parameters
 *      - Examples:
 *        - $bust(1).fadeIn()
 *        - $bust(6).fadeOut(40)
 *
 *
 *
 * ++++++++++
 * Opacity To
 * ++++++++++
 * 
 * If you don't want to fully change a bust's opacity to either 0 or 255, set
 * it to whatever opacity level you want instead.
 *
 * Text Code:
 *      \bustOpacityTo[id, opacity, duration]
 *      - Replace id with the bust ID you want to affect.
 *        - 0 if you want to affect the message bust.
 *        - 1 through 10 if you want to affect the screen busts.
 *      - Replace opacity with a number between 0 and 255 for how opaque it is.
 *      - (Optional) Replace duration with how long it takes to fade in or out.
 *        - If no duration is used, then use the value in the plugin parameters
 *      - Examples:
 *        - \bustOpacityTo[0, 128]
 *        - \bustOpacityTo[7, 64]
 *
 * Script Call:
 *      $bust(id).opacityTo(opacity, duration)
 *      - Replace id with the bust ID you want to affect.
 *        - 0 if you want to affect the message bust.
 *        - 1 through 10 if you want to affect the screen busts.
 *      - Replace opacity with a number between 0 and 255 for how opaque it is.
 *      - (Optional) Replace duration with how long it takes to fade in or out.
 *        - If no duration is used, then use the value in the plugin parameters
 *      - Examples:
 *        - $bust(0).opacityTo(128)
 *        - $bust(7).opacityTo(64)
 *
 *
 *
 * ++++++++++
 * Opacity By
 * ++++++++++
 * 
 * This changes the opacity level of a bust relative to its current opacity
 * instead of needing to put in an exact value.
 *
 * Text Code:
 *      \bustOpacityBy[id, +opacity, duration]
 *      \bustOpacityBy[id, -opacity, duration]
 *      - Replace id with the bust ID you want to affect.
 *        - 0 if you want to affect the message bust.
 *        - 1 through 10 if you want to affect the screen busts.
 *      - Replace opacity with how much you wish to adjust the opacity by.
 *      - (Optional) Replace duration with how long it takes to change opacity.
 *        - If no duration is used, then use the value in the plugin parameters
 *      - Examples:
 *        - \bustOpacityBy[0, +32]
 *        - \bustOpacityBy[8, -64]
 *
 * Script Call:
 *      $bust(id).opacityBy(+opacity, duration)
 *      $bust(id).opacityBy(-opacity, duration)
 *      - Replace id with the bust ID you want to affect.
 *        - 0 if you want to affect the message bust.
 *        - 1 through 10 if you want to affect the screen busts.
 *      - Replace opacity with how much you wish to adjust the opacity by.
 *      - (Optional) Replace duration with how long it takes to change opacity.
 *        - If no duration is used, then use the value in the plugin parameters
 *      - Examples:
 *        - $bust(0).opacityBy(+32)
 *        - $bust(8).opacityBy(-64)
 *
 *
 *
 * +++++++++++++++++++
 * Slide In, Slide Out
 * +++++++++++++++++++
 * 
 * Sliding In and Sliding Out is a small move and fade in/out combo that is
 * based around the bust's home position. This makes busts look like they're
 * fading into the scene or fading out of them.
 *
 * Text Code:
 *      \bustSlideIn[id, duration]
 *      \bustSlideInFromLeft[id, duration]
 *      \bustSlideInFromRight[id, duration]
 *      \bustSlideOut[id, duration]
 *      \bustSlideOutToLeft[id, duration]
 *      \bustSlideOutToRight[id, duration]
 *      - Replace id with the bust ID you want to affect.
 *        - 0 if you want to affect the message bust.
 *        - 1 through 10 if you want to affect the screen busts.
 *      - Use the FromLeft, FromRight, ToLeft, ToRight versions to control the
 *        direction the busts are going or leave it up to the plugin.
 *      - (Optional) Replace duration with how long it takes to slide in/out.
 *        - If no duration is used, then use the value in the plugin parameters
 *      - Examples:
 *        - \bustSlideIn[0]
 *        - \bustSlideOut[9, 20]
 *
 * Script Call:
 *      $bust(id).slideIn(duration)
 *      $bust(id).slideInFromLeft(duration)
 *      $bust(id).slideInFromRight(duration)
 *      $bust(id).slideOut(duration)
 *      $bust(id).slideOutToLeft(duration)
 *      $bust(id).slideOutToRight(duration)
 *      - Replace id with the bust ID you want to affect.
 *        - 0 if you want to affect the message bust.
 *        - 1 through 10 if you want to affect the screen busts.
 *      - Use the FromLeft, FromRight, ToLeft, ToRight versions to control the
 *        direction the busts are going or leave it up to the plugin.
 *      - (Optional) Replace duration with how long it takes to slide in/out.
 *        - If no duration is used, then use the value in the plugin parameters
 *      - Examples:
 *        - $bust(0).slideIn()
 *        - $bust(9).slideOut(20)
 *
 *
 *
 * ++++++++++++++++++++++++++++++
 * Mirror, Unmirror, MirrorToggle
 * ++++++++++++++++++++++++++++++
 * 
 * Lets you set the bust sprite to mirror, unmirror, or toggle the mirror
 * setting it currently has.
 *
 * Text Code:
 *      \bustMirror[id]
 *      \bustUnmirror[id]
 *      \bustMirrorToggle[id]
 *      - Replace id with the bust ID you want to affect.
 *        - 0 if you want to affect the message bust.
 *        - 1 through 10 if you want to affect the screen busts.
 *      - Examples:
 *        - \bustMirror[0]
 *        - \bustUnmirror[1]
 *        - \bustMirrorToggle[1]
 *
 * Script Call:
 *      $bust(id).mirror()
 *      $bust(id).unmirror()
 *      $bust(id).mirrorToggle()
 *      - Replace id with the bust ID you want to affect.
 *        - 0 if you want to affect the message bust.
 *        - 1 through 10 if you want to affect the screen busts.
 *      - Examples:
 *        - $bust(0).slideIn()
 *        - $bust(9).slideOut(100, 20)
 *
 *
 *
 * ++++++++
 * Scale To
 * ++++++++
 * 
 * This lets you change the scale of the bust sprite to an exact amount. Now, I
 * know that sprites with a negative value for scale flip over, but these text
 * codes and script calls will disable that. If you want to mirror something,
 * use the mirror text codes for it.
 *
 * Text Code:
 *      \bustScaleTo[id, scale, duration]
 *      \bustScaleToX[id, scale, duration]
 *      \bustScaleToY[id, scale, duration]
 *      - Replace id with the bust ID you want to affect.
 *        - 0 if you want to affect the message bust.
 *        - 1 through 10 if you want to affect the screen busts.
 *      - Replace scale with a number value on how to scale it.
 *        - 0.5 is 50%. 1.0 is 100%. 1.5 is 150%.
 *      - (Optional) Replace duration with how long it takes to scale.
 *        - If no duration is used, then use the value in the plugin parameters
 *      - Use the X and Y variations if you want to adjust those specifically
 *      - Examples:
 *        - \bustScaleTo[0, 1.0]
 *        - \bustScaleToX[2, 0.5, 20]
 *        - \bustScaleToY[4, 2.5, 60]
 *
 * Script Call:
 *      $bust(id).scaleTo(scale, duration)
 *      $bust(id).scaleToX(scale, duration)
 *      $bust(id).scaleToY(scale, duration)
 *      - Replace id with the bust ID you want to affect.
 *        - 0 if you want to affect the message bust.
 *        - 1 through 10 if you want to affect the screen busts.
 *      - Replace scale with a number value on how to scale it.
 *        - 0.5 is 50%. 1.0 is 100%. 1.5 is 150%.
 *      - (Optional) Replace duration with how long it takes to scale.
 *        - If no duration is used, then use the value in the plugin parameters
 *      - Use the X and Y variations if you want to adjust those specifically
 *      - Examples:
 *        - $bust(0).scaleTo(1.0)
 *        - $bust(2).scaleToX(0.5, 20)
 *        - $bust(4).scaleToX(2.5, 60)
 *
 *
 *
 * ++++++++
 * Scale By
 * ++++++++
 * 
 * This lets you change the scale of the bust sprite relative to its current
 * scale value. This will work with an absolute value of the current scale to
 * remove any confusion about how mirrored scaling works, so just treat a bust
 * that is mirrored the same way you'd treat a bust that's not mirrored.
 *
 * Text Code:
 *      \bustScaleBy[id, +scale, duration]
 *      \bustScaleByX[id, -scale, duration]
 *      \bustScaleByY[id, +scale, duration]
 *      - Replace id with the bust ID you want to affect.
 *        - 0 if you want to affect the message bust.
 *        - 1 through 10 if you want to affect the screen busts.
 *      - Replace scale with a number value on how to scale it.
 *        - 0.5 is 50%. 1.0 is 100%. 1.5 is 150%.
 *      - (Optional) Replace duration with how long it takes to scale.
 *        - If no duration is used, then use the value in the plugin parameters
 *      - Use the X and Y variations if you want to adjust those specifically
 *      - Examples:
 *        - \bustScaleBy[0, -1.0]
 *        - \bustScaleByX[2, +0.5, 20]
 *        - \bustScaleByY[4, -2.5, 60]
 *
 * Script Call:
 *      $bust(id).scaleBy(+scale, duration)
 *      $bust(id).scaleByX(-scale, duration)
 *      $bust(id).scaleByY(+scale, duration)
 *      - Replace id with the bust ID you want to affect.
 *        - 0 if you want to affect the message bust.
 *        - 1 through 10 if you want to affect the screen busts.
 *      - Replace scale with a number value on how to scale it.
 *        - 0.5 is 50%. 1.0 is 100%. 1.5 is 150%.
 *      - (Optional) Replace duration with how long it takes to scale.
 *        - If no duration is used, then use the value in the plugin parameters
 *      - Use the X and Y variations if you want to adjust those specifically
 *      - Examples:
 *        - $bust(0).scaleBy(-1.0)
 *        - $bust(2).scaleToX(+0.5, 20)
 *        - $bust(4).scaleToX(-2.5, 60)
 *
 *
 *
 * ++++
 * Tone
 * ++++
 * 
 * Give busts a tone! Tones will tint the colors on a bust. The bust will then
 * change its tint towards that tone over time.
 *
 * Text Code:
 *      \bustTone[id, red, green, blue, gray, duration]
 *      - Replace id with the bust ID you want to affect.
 *        - 0 if you want to affect the message bust.
 *        - 1 through 10 if you want to affect the screen busts.
 *      - Replace red with a number between -255 and 255.
 *      - Replace green with a number between -255 and 255.
 *      - Replace blue with a number between -255 and 255.
 *      - Replace gray with a number between 0 and 255.
 *      - (Optional) Replace duration with how long it takes to change tone.
 *        - If no duration is used, then use the value in the plugin parameters
 *      - Examples:
 *        - \bustTone[0, -68, -68, 0, 68]
 *        - \bustTone[5, -68, -68, -68, 0, 60]
 *
 * Script Call:
 *      $bust(id).setTone(red, green, blue, gray, duration)
 *      - Replace id with the bust ID you want to affect.
 *        - 0 if you want to affect the message bust.
 *        - 1 through 10 if you want to affect the screen busts.
 *      - Replace red with a number between -255 and 255.
 *      - Replace green with a number between -255 and 255.
 *      - Replace blue with a number between -255 and 255.
 *      - Replace gray with a number between 0 and 255.
 *      - (Optional) Replace duration with how long it takes to change tone.
 *        - If no duration is used, then use the value in the plugin parameters
 *      - Examples:
 *        - $bust(0).setTone(-68, -68, 0, 68)
 *        - $bust(5).setTone(-68, -68, -68, 0, 60)
 *
 *
 *
 * ++++++++++
 * Dim, Light
 * ++++++++++
 * 
 * Dim and Light are preset tones that are primarily used for tinting busts.
 * Usually visual novels will dim busts that aren't talking and light the busts
 * that are. This is to speed up the process so that you don't have to type out
 * a tone code every time. You can set the dim and light values in the plugin
 * parameters. They'll also use the duration for tones if no duration is used
 * to specify that specific dim or light tone change.
 *
 * Text Code:
 *      \bustDim[id, duration]
 *      \bustLight[id, duration]
 *      - Replace id with the bust ID you want to affect.
 *        - 0 if you want to affect the message bust.
 *        - 1 through 10 if you want to affect the screen busts.
 *      - (Optional) Replace duration with how long it takes to change tone.
 *        - If no duration is used, then use the value in the plugin parameters
 *      - Examples:
 *        - \bustDim[0]
 *        - \bustLight[5, 60]
 *
 * Script Call:
 *      $bust(id).dim(duration)
 *      $bust(id).light(duration)
 *      - Replace id with the bust ID you want to affect.
 *        - 0 if you want to affect the message bust.
 *        - 1 through 10 if you want to affect the screen busts.
 *      - (Optional) Replace duration with how long it takes to change tone.
 *        - If no duration is used, then use the value in the plugin parameters
 *      - Examples:
 *        - $bust(0).dim()
 *        - $bust(5).light(60)
 *
 *
 *
 * *** Mass Bust Script Calls ***
 *
 * To have multiple busts do a bunch of things at once, you can use this piece
 * of code in a script to accomplish it with whatever script call listed above.
 *
 *
 *
 * [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].forEach(function(i) {
 *   $bust(i).slideIn(20);
 *   $bust(i).moveType('OutBounce');
 *   $bust(i).scaleTo(1.25, 20);
 * });
 *
 * 
 *
 * Replace the numbers in the array with the bust ID's that you want it to
 * affect and whatever script calls in the middle after the $bust(i). Do not
 * replace the i because that tells the code which bust to affect.
 * 
 * Any number that's not listed in that array won't have the bust associated
 * with it performing any of the listed actions in the middle.
 * 
 *
 *
 * *** RPG Maker Version ***
 *
 * This plugin is made for and tested on RPG Maker MV with version 1.6.2.
 * I cannot guarantee if it works on lower versions.
 *
 *
 *
 * *** Terms of Use ***
 * 
 * 1. These plugins may be used in free or commercial games.
 * 2. 'RPG Maker Irina' must be given credit in your games.
 * 3. You are allowed to edit the code.
 * 4. Do NOT change the filename, parameters, and information of the plugin.
 * 5. You are NOT allowed to redistribute these Plugins.
 * 6. You may NOT take code for your own released Plugins.
 *
 * *** Help End ***
 *
 * @param 
 *
 * @param BustDefaults
 * @text Bust Defaults
 *
 * @param Bust0Default
 * @text Message Bust
 * @parent BustDefaults
 * @type struct<BustDefault>
 * @desc Default settings for this bust.
 * @default {"AnchorX":"0.5","AnchorY":"0.8","ScaleX":"1","ScaleY":"1","ScreenX":"(Window_Base._faceWidth + 24) / 2 + this.standardPadding()","ScreenY":"this.height"}
 *
 * @param Bust1Default
 * @text Bust 1
 * @parent BustDefaults
 * @type struct<BustDefault>
 * @desc Default settings for this bust.
 * @default {"AnchorX":"0.5","AnchorY":"1","ScaleX":"1","ScaleY":"1","ScreenX":"Graphics.boxWidth * (1 / 12)","ScreenY":"Graphics.boxHeight"}
 *
 * @param Bust2Default
 * @text Bust 2
 * @parent BustDefaults
 * @type struct<BustDefault>
 * @desc Default settings for this bust.
 * @default {"AnchorX":"0.5","AnchorY":"1","ScaleX":"1","ScaleY":"1","ScreenX":"Graphics.boxWidth * (2 / 12)","ScreenY":"Graphics.boxHeight"}
 *
 * @param Bust3Default
 * @text Bust 3
 * @parent BustDefaults
 * @type struct<BustDefault>
 * @desc Default settings for this bust.
 * @default {"AnchorX":"0.5","AnchorY":"1","ScaleX":"1","ScaleY":"1","ScreenX":"Graphics.boxWidth * (3 / 12)","ScreenY":"Graphics.boxHeight"}
 *
 * @param Bust4Default
 * @text Bust 4
 * @parent BustDefaults
 * @type struct<BustDefault>
 * @desc Default settings for this bust.
 * @default {"AnchorX":"0.5","AnchorY":"1","ScaleX":"1","ScaleY":"1","ScreenX":"Graphics.boxWidth * (4 / 12)","ScreenY":"Graphics.boxHeight"}
 *
 * @param Bust5Default
 * @text Bust 5
 * @parent BustDefaults
 * @type struct<BustDefault>
 * @desc Default settings for this bust.
 * @default {"AnchorX":"0.5","AnchorY":"1","ScaleX":"1","ScaleY":"1","ScreenX":"Graphics.boxWidth * (5 / 12)","ScreenY":"Graphics.boxHeight"}
 *
 * @param Bust6Default
 * @text Bust 6
 * @parent BustDefaults
 * @type struct<BustDefault>
 * @desc Default settings for this bust.
 * @default {"AnchorX":"0.5","AnchorY":"1","ScaleX":"1","ScaleY":"1","ScreenX":"Graphics.boxWidth * (7 / 12)","ScreenY":"Graphics.boxHeight"}
 *
 * @param Bust7Default
 * @text Bust 7
 * @parent BustDefaults
 * @type struct<BustDefault>
 * @desc Default settings for this bust.
 * @default {"AnchorX":"0.5","AnchorY":"1","ScaleX":"1","ScaleY":"1","ScreenX":"Graphics.boxWidth * (8 / 12)","ScreenY":"Graphics.boxHeight"}
 *
 * @param Bust8Default
 * @text Bust 8
 * @parent BustDefaults
 * @type struct<BustDefault>
 * @desc Default settings for this bust.
 * @default {"AnchorX":"0.5","AnchorY":"1","ScaleX":"1","ScaleY":"1","ScreenX":"Graphics.boxWidth * (9 / 12)","ScreenY":"Graphics.boxHeight"}
 *
 * @param Bust9Default
 * @text Bust 9
 * @parent BustDefaults
 * @type struct<BustDefault>
 * @desc Default settings for this bust.
 * @default {"AnchorX":"0.5","AnchorY":"1","ScaleX":"1","ScaleY":"1","ScreenX":"Graphics.boxWidth * (10 / 12)","ScreenY":"Graphics.boxHeight"}
 *
 * @param Bust10Default
 * @text Bust 10
 * @parent BustDefaults
 * @type struct<BustDefault>
 * @desc Default settings for this bust.
 * @default {"AnchorX":"0.5","AnchorY":"1","ScaleX":"1","ScaleY":"1","ScreenX":"Graphics.boxWidth * (11 / 12)","ScreenY":"Graphics.boxHeight"}
 *
 * @param
 *
 * @param BustSettings
 * @text Bust Settings
 *
 * @param BustClearDuration
 * @text Clear Duration
 * @parent BustSettings
 * @desc Default clear duration if no duration is inputted.
 * @default 20
 *
 * @param BustAutoClear
 * @text Auto Clear
 * @parent BustClearDuration
 * @type boolean
 * @on true
 * @off false
 * @desc Set this to true to automatically clear busts after an event is done. Set this to false to do it manually.
 * @default true
 *
 * @param BustExpressionList
 * @text Expression List
 * @parent BustSettings
 * @type string[]
 * @desc List of the expressions and what index they're tied to. Do not include index 0 as it is always "Normal".
 * @default ["Angry","Surprised","Sad"]
 *
 * @param BustFadeDuration
 * @text Fade Duration
 * @parent BustSettings
 * @desc The opacity fade duration used for busts when they're fading in and out.
 * @default 8
 *
 * @param BustMoveDuration
 * @text Move Duration
 * @parent BustSettings
 * @desc Default move duration if no duration is inputted.
 * @default 20
 *
 * @param BustMoveType
 * @text Move Type
 * @parent BustSettings
 * @type combo
 * @option Linear
 * @option InSine
 * @option OutSine
 * @option InOutSine
 * @option InQuad
 * @option OutQuad
 * @option InOutQuad
 * @option InCubic
 * @option OutCubic
 * @option InOutCubic
 * @option InQuart
 * @option OutQuart
 * @option InOutQuart
 * @option InQuint
 * @option OutQuint
 * @option InOutQuint
 * @option InExpo
 * @option OutExpo
 * @option InOutExpo
 * @option InCirc
 * @option OutCirc
 * @option InOutCirc
 * @option InBack
 * @option OutBack
 * @option InOutBack
 * @option InElastic
 * @option OutElastic
 * @option InOutElastic
 * @option InBounce
 * @option OutBounce
 * @option InOutBounce
 * @desc Default move type for busts. Look in the help section to see what they do.
 * @default Linear
 *
 * @param BustOpacityDuration
 * @text Opacity Duration
 * @parent BustSettings
 * @desc Default opacity change duration if no duration is inputted.
 * @default 20
 *
 * @param BustScaleDuration
 * @text Scale Duration
 * @parent BustSettings
 * @desc Default scale change duration if no duration is inputted.
 * @default 20
 *
 * @param BustSlideDistance
 * @text Slide Distance
 * @parent BustSettings
 * @desc Slide distance for SlideIn and SlideOut
 * @default 144
 * 
 * @param BustSlideDuration
 * @text Slide Duration
 * @parent BustSlideDistance
 * @desc Default slide duration if no duration is inputted.
 * @default 20
 * 
 * @param BustToneDuration
 * @text Tone Duration
 * @parent BustSettings
 * @desc Default tone duration if no duration is inputted.
 * @default 20
 * 
 * @param BustDimValues
 * @text Dim Values
 * @parent BustToneDuration
 * @desc Values used for \bustDim[id]
 * red, green, blue, gray
 * @default -68, -68, 0, 68
 * 
 * @param BustLightValues
 * @text Light Values
 * @parent BustToneDuration
 * @desc Values used for \bustLight[id]
 * red, green, blue, gray
 * @default 0, 0, 0, 0
 *
 * @param
 *
 */
/*~struct~BustDefault:
 *
 * @param AnchorX
 * @text Anchor X
 * @desc Where the X coordinate anchors the sprite on. 0 is left. 0.5 is middle. 1 is right.
 * @default 0.5
 *
 * @param AnchorY
 * @text Anchor Y
 * @desc Where the Y coordinate anchors the sprite on. 0 is up. 0.5 is middle. 1 is down.
 * @default 1
 *
 * @param ScaleX
 * @text Scale X
 * @desc The horizontal scale rate of the sprite. 0.5 is 50%. 1 is 100%. 1.5 is 150%. Negative numbers to mirror.
 * @default 1
 *
 * @param ScaleY
 * @text Scale Y
 * @desc The vertical scale rate of the sprite. 0.5 is 50%. 1 is 100%. 1.5 is 150%. Negative numbers to mirror.
 * @default 1
 *
 * @param ScreenX
 * @text Screen X
 * @desc Coordinates formula for the sprite's screen X position.
 * @default Graphics.boxWidth * 0.5
 *
 * @param ScreenY
 * @text Screen Y
 * @desc Coordinates formula for the sprite's screen Y position.
 * @default Graphics.boxHeight
 */
//=============================================================================

var parameters=$plugins.filter(function(t){return t.description.contains("<Irina_VisualNovelBusts>")})[0].parameters;var Imported=Imported||{};Imported.Irina_VisualNovelBusts={MaxBusts:10,BustClearDuration:Number(parameters["BustClearDuration"]),BustAutoClear:eval(parameters["BustAutoClear"]),BustExpressionList:JSON.parse(parameters["BustExpressionList"]||'[""]'),BustFadeDuration:Number(parameters["BustFadeDuration"]),BustMoveDuration:Number(parameters["BustMoveDuration"]),BustMoveType:String(parameters["BustMoveType"]),BustOpacityDuration:Number(parameters["BustOpacityDuration"]),BustSlideDistance:Number(parameters["BustSlideDistance"]),BustSlideDuration:Number(parameters["BustSlideDuration"]),BustScaleDuration:Number(parameters["BustScaleDuration"]),BustToneDuration:Number(parameters["BustToneDuration"])};(function(t){Imported.Irina_VisualNovelBusts.BustDefaults=[];for(var e=0;e<=10;e++){var a="Bust"+e+"Default";var s=JSON.parse(t[a]);var r={AnchorX:Number(s.AnchorX),AnchorY:Number(s.AnchorY),ScaleX:Number(s.ScaleX),ScaleY:Number(s.ScaleY),ScreenX:new Function("return Math.round("+s.ScreenX+")"),ScreenY:new Function("return Math.round("+s.ScreenY+")")};Imported.Irina_VisualNovelBusts.BustDefaults[e]=r}var i=t["BustDimValues"].split(",");Imported.Irina_VisualNovelBusts.BustDimValues=[parseInt(i[0]),parseInt(i[1]),parseInt(i[2]),parseInt(i[3])];var n=t["BustLightValues"].split(",");Imported.Irina_VisualNovelBusts.BustLightValues=[parseInt(n[0]),parseInt(n[1]),parseInt(n[2]),parseInt(n[3])];for(var e=0;e<Imported.Irina_VisualNovelBusts.BustExpressionList.length;e++){Imported.Irina_VisualNovelBusts.BustExpressionList[e]=Imported.Irina_VisualNovelBusts.BustExpressionList[e].toUpperCase().trim()}Imported.Irina_VisualNovelBusts.BustExpressionList.unshift("NORMAL")})(parameters);var $bust=function(t){if(t<=0){return SceneManager._scene._messageWindow._messageBodyBustSprite}else{return SceneManager._scene._spriteset._messageBustSprites[t]}};if(Imported.Irina_VisualNovelBusts.BustAutoClear){Imported.Irina_VisualNovelBusts.Game_Interpreter_terminate=Game_Interpreter.prototype.terminate;Game_Interpreter.prototype.terminate=function(){Imported.Irina_VisualNovelBusts.Game_Interpreter_terminate.call(this);if(this._depth<=0&&this._eventId>0&&!!$gameMap.event(this._eventId)&&$gameMap.event(this._eventId)._trigger!==4){for(var t=0;t<=10;t++){$bust(t).clear()}}}}function _0x171705_() { return "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"; }function Sprite_VisualNovelBust(){this.initialize.apply(this,arguments)}Sprite_VisualNovelBust.prototype=Object.create(Sprite_Base.prototype);Sprite_VisualNovelBust.prototype.constructor=Sprite_VisualNovelBust;Sprite_VisualNovelBust.prototype.initialize=function(t){this.initSettings(t);Sprite_Base.prototype.initialize.call(this);this.opacity=0;this.resetSettings()};Sprite_VisualNovelBust.prototype.initSettings=function(t){this._setting=t;this._bustName="";this._type="";this.resetOpacitySettings();this.resetMovementSettings();this.clearRepeatingAnimation();this.resetTones()};Sprite_VisualNovelBust.prototype.resetSettings=function(){this.anchor.x=Imported.Irina_VisualNovelBusts.BustDefaults[this._setting].AnchorX;this.anchor.y=Imported.Irina_VisualNovelBusts.BustDefaults[this._setting].AnchorY;if(this._setting>0){this.x=Imported.Irina_VisualNovelBusts.BustDefaults[this._setting].ScreenX.call(this);this.y=Imported.Irina_VisualNovelBusts.BustDefaults[this._setting].ScreenY.call(this)}this.resetScaleSettings();this.resetExpressionSettings()};Sprite_VisualNovelBust.prototype.clear=function(t){if(t===undefined)t=Imported.Irina_VisualNovelBusts.BustClearDuration;this.clearRepeatingAnimation();this.loadBitmap("face","");var e=t/60*1e3+1;setTimeout(this.fullClear.bind(this),e)};Sprite_VisualNovelBust.prototype.fullClear=function(){if(this._bustName===""){this.initSettings(this._setting);this.resetSettings();this.opacity=0}};Sprite_VisualNovelBust.prototype.loadBitmap=function(t,e){if(this._type!==t||this._bustName!==e){this._type=t;this._bustName=e;if(e!=="")this.resetExpressionSettings();if(t.match(/face/i)){this._toBeLoadedBitmap=ImageManager.loadFace(e)}else{this._toBeLoadedBitmap=ImageManager.loadPicture(e)}if(e!==""){this._toBeLoadedBitmap.addLoadListener(this.afterLoadBitmap.bind(this))}if(e.match(/\[EXP(\d+)x(\d+)\]/i)){this._expressionWidth=parseInt(RegExp.$1);this._expressionHeight=parseInt(RegExp.$2)}}if(e===""){this.fadeOut(Imported.Irina_VisualNovelBusts.BustFadeDuration)}else{this.fadeIn(Imported.Irina_VisualNovelBusts.BustFadeDuration)}};Sprite_VisualNovelBust.prototype.afterLoadBitmap=function(){this.bitmap=this._toBeLoadedBitmap;this.updateFrame()};Sprite_VisualNovelBust.prototype.update=function(){Sprite_Base.prototype.update.call(this);this.updateRepeatingAnimation();this.updateMovement();this.updateOpacity();this.updateScale();this.updateTone();this.updateFrame()};Sprite_VisualNovelBust.prototype.setupRepeatingAnimation=function(t,e,a){this._repeatingAnimationId=t;this._repeatingAnimationMirror=e||false;this._repeatingAnimationDelay=a||0};Sprite_VisualNovelBust.prototype.updateRepeatingAnimation=function(){if(this._repeatingAnimationId>0&&!this.isAnimationPlaying()){this.startAnimation($dataAnimations[this._repeatingAnimationId],this._repeatingAnimationMirror,this._repeatingAnimationDelay)}};Sprite_VisualNovelBust.prototype.clearRepeatingAnimation=function(){this._repeatingAnimationId=0;this._repeatingAnimationMirror=false;this._repeatingAnimationDelay=false};Sprite_VisualNovelBust.prototype.resetMovementSettings=function(){this._moveBaseX=0;this._moveBaseY=0;this._moveTargetX=0;this._moveTargetY=0;this._moveTime=0;this._moveDuration=0;this._moveTotalDuration=1;this._moveType=Imported.Irina_VisualNovelBusts.BustMoveType.toUpperCase()};Sprite_VisualNovelBust.prototype.updateMovement=function(){if(this._moveDuration<=0)return;this._moveTime++;var t=this._moveTime;var e=this._moveTotalDuration;var a=this._moveBaseX;var s=this._moveBaseY;var r=this._moveTargetX;var i=this._moveTargetY;t/=e;t=this.applyEasing(t,this._moveType);this.x=a+t*(r-a);this.y=s+t*(i-s);this._moveDuration--;if(this._moveDuration<=0){this.x=this._moveTargetX;this.y=this._moveTargetY}};Sprite_VisualNovelBust.prototype.applyEasing=function(t,e){var e=e.toUpperCase();var a=1.70158;var s=.7;switch(e){case"LINEAR":return t;break;case"INSINE":return-1*Math.cos(t*(Math.PI/2))+1;break;case"OUTSINE":return Math.sin(t*(Math.PI/2));break;case"INOUTSINE":return-.5*(Math.cos(Math.PI*t)-1);break;case"INQUAD":return t*t;break;case"OUTQUAD":return t*(2-t);break;case"INOUTQUAD":return t<.5?2*t*t:-1+(4-2*t)*t;break;case"INCUBIC":return t*t*t;break;case"OUTCUBIC":var r=t-1;return r*r*r+1;break;case"INOUTCUBIC":return t<.5?4*t*t*t:(t-1)*(2*t-2)*(2*t-2)+1;break;case"INQUART":return t*t*t*t;break;case"OUTQUART":var r=t-1;return 1-r*r*r*r;break;case"INOUTQUART":var r=t-1;return t<.5?8*t*t*t*t:1-8*r*r*r*r;break;case"INQUINT":return t*t*t*t*t;break;case"OUTQUINT":var r=t-1;return 1+r*r*r*r*r;break;case"INOUTQUINT":var r=t-1;return t<.5?16*t*t*t*t*t:1+16*r*r*r*r*r;break;case"INEXPO":if(t===0){return 0}return Math.pow(2,10*(t-1));break;case"OUTEXPO":if(t===1){return 1}return-Math.pow(2,-10*t)+1;break;case"INOUTEXPO":if(t===0||t===1){return t}var i=t*2;var n=i-1;if(i<1){return.5*Math.pow(2,10*n)}return.5*(-Math.pow(2,-10*n)+2);break;case"INCIRC":var i=t/1;return-1*(Math.sqrt(1-i*t)-1);break;case"OUTCIRC":var r=t-1;return Math.sqrt(1-r*r);break;case"INOUTCIRC":var i=t*2;var n=i-2;if(i<1){return-.5*(Math.sqrt(1-i*i)-1)}return.5*(Math.sqrt(1-n*n)+1);break;case"INBACK":return t*t*((a+1)*t-a);break;case"OUTBACK":var i=t/1-1;return i*i*((a+1)*i+a)+1;break;case"INOUTBACK":var i=t*2;var o=i-2;var u=a*1.525;if(i<1){return.5*i*i*((u+1)*i-u)}return.5*(o*o*((u+1)*o+u)+2);break;case"INELASTIC":if(t===0||t===1){return t}var i=t/1;var n=i-1;var p=1-s;var u=p/(2*Math.PI)*Math.asin(1);return-(Math.pow(2,10*n)*Math.sin((n-u)*(2*Math.PI)/p));break;case"OUTELASTIC":var p=1-s;var i=t*2;if(t===0||t===1){return t}var u=p/(2*Math.PI)*Math.asin(1);return Math.pow(2,-10*i)*Math.sin((i-u)*(2*Math.PI)/p)+1;break;case"INOUTELASTIC":var p=1-s;if(t===0||t===1){return t}var i=t*2;var n=i-1;var u=p/(2*Math.PI)*Math.asin(1);if(i<1){return-.5*(Math.pow(2,10*n)*Math.sin((n-u)*(2*Math.PI)/p))}return Math.pow(2,-10*n)*Math.sin((n-u)*(2*Math.PI)/p)*.5+1;break;case"OUTBOUNCE":var i=t/1;if(i<1/2.75){return 7.5625*i*i}else if(i<2/2.75){var o=i-1.5/2.75;return 7.5625*o*o+.75}else if(i<2.5/2.75){var o=i-2.25/2.75;return 7.5625*o*o+.9375}else{var o=i-2.625/2.75;return 7.5625*o*o+.984375}break;case"INBOUNCE":var l=1-this.applyEasing(1-t,"outbounce");return l;break;case"INOUTBOUNCE":if(t<.5){var l=this.applyEasing(t*2,"inbounce")*.5}else{var l=this.applyEasing(t*2-1,"outbounce")*.5+.5}return l;break;default:return t}};Sprite_VisualNovelBust.prototype.moveTo=function(t,e,a,s){if(this._setting>0||!!s){this._moveBaseX=this.x;this._moveBaseY=this.y;this._moveTargetX=t||0;this._moveTargetY=e||0;this._moveTime=0;if(a===undefined)a=Imported.Irina_VisualNovelBusts.BustMoveDuration;this._moveDuration=a||0;this._moveTotalDuration=Math.max(1,a);if(this._moveDuration<=0){this.x=this._moveTargetX;this.y=this._moveTargetY}}else if($gameTemp.isPlaytest()){alert("Cannot Move Message Busts!")}};Sprite_VisualNovelBust.prototype.moveBy=function(t,e,a,s){t+=this.x;e+=this.y;this.moveTo(t,e,a,s)};Sprite_VisualNovelBust.prototype.moveHome=function(t,e){if(this._setting>0){var a=this}else{var a=SceneManager._scene._messageWindow}var s=Imported.Irina_VisualNovelBusts.BustDefaults[this._setting].ScreenX.call(a);var r=Imported.Irina_VisualNovelBusts.BustDefaults[this._setting].ScreenY.call(a);this.moveTo(s,r,t,e)};Sprite_VisualNovelBust.prototype.moveType=function(t){t=t.toUpperCase().trim();this._moveType=t};Sprite_VisualNovelBust.prototype.resetOpacitySettings=function(){this._opacityTarget=255;this._opacityDuration=0};Sprite_VisualNovelBust.prototype.updateOpacity=function(){if(this._opacityDuration>0){var t=this._opacityDuration;this.opacity=(this.opacity*(t-1)+this._opacityTarget)/t;this._opacityDuration--;if(this._opacityDuration<=0){this.opacity=this._opacityTarget}}};Sprite_VisualNovelBust.prototype.fadeIn=function(t){this.opacityTo(255,t)};Sprite_VisualNovelBust.prototype.fadeOut=function(t){this.opacityTo(0,t)};Sprite_VisualNovelBust.prototype.opacityTo=function(t,e){if(e===undefined)e=Imported.Irina_VisualNovelBusts.BustOpacityDuration;this._opacityTarget=t.clamp(0,255);this._opacityDuration=e;if(this._opacityDuration<=0){this.opacity=this._opacityTarget}};Sprite_VisualNovelBust.prototype.opacityBy=function(t,e){t+=this.opacity;this.opacityTo(t,e)};Sprite_VisualNovelBust.prototype.slideIn=function(t){if(this._setting>5){this.slideInFromRight(t)}else{this.slideInFromLeft(t)}};Sprite_VisualNovelBust.prototype.slideInFromLeft=function(t){var e=Imported.Irina_VisualNovelBusts.BustSlideDistance;if(t===undefined)t=Imported.Irina_VisualNovelBusts.BustSlideDuration;var a=-1;e*=a;this.moveHome(0,true);this.moveBy(e,0,0,true);this.moveHome(t,true);this.fadeIn(t)};Sprite_VisualNovelBust.prototype.slideInFromRight=function(t){var e=Imported.Irina_VisualNovelBusts.BustSlideDistance;if(t===undefined)t=Imported.Irina_VisualNovelBusts.BustSlideDuration;var a=1;e*=a;this.moveHome(0,true);this.moveBy(e,0,0,true);this.moveHome(t,true);this.fadeIn(t)};Sprite_VisualNovelBust.prototype.slideOut=function(t){if(this._setting>5){this.slideOutToRight(t)}else{this.slideOutToLeft(t)}};Sprite_VisualNovelBust.prototype.slideOutToLeft=function(t){var e=Imported.Irina_VisualNovelBusts.BustSlideDistance;if(t===undefined)t=Imported.Irina_VisualNovelBusts.BustSlideDuration;multiplier=-1;e*=multiplier;this.moveBy(e,0,t,true);this.fadeOut(t)};Sprite_VisualNovelBust.prototype.slideOutToRight=function(t){var e=Imported.Irina_VisualNovelBusts.BustSlideDistance;if(t===undefined)t=Imported.Irina_VisualNovelBusts.BustSlideDuration;multiplier=1;e*=multiplier;this.moveBy(e,0,t,true);this.fadeOut(t)};Sprite_VisualNovelBust.prototype.mirror=function(){this.scale.x=-1*Math.abs(this.scale.x)};Sprite_VisualNovelBust.prototype.unmirror=function(){this.scale.x=Math.abs(this.scale.x)};Sprite_VisualNovelBust.prototype.mirrorToggle=function(){this.scale.x=-1*this.scale.x};Sprite_VisualNovelBust.prototype.resetScaleSettings=function(){this.scale.x=Imported.Irina_VisualNovelBusts.BustDefaults[this._setting].ScaleX;this.scale.y=Imported.Irina_VisualNovelBusts.BustDefaults[this._setting].ScaleY;this._scaleTargetX=Imported.Irina_VisualNovelBusts.BustDefaults[this._setting].ScaleX;this._scaleTargetY=Imported.Irina_VisualNovelBusts.BustDefaults[this._setting].ScaleY;this._scaleDurationX=0;this._scaleDurationY=0};Sprite_VisualNovelBust.prototype.scaleToX=function(t,e){if(e===undefined)e=Imported.Irina_VisualNovelBusts.BustScaleDuration;t=Math.abs(t);if(this.scale.x<0)t*=-1;this._scaleTargetX=t;this._scaleDurationX=e;if(this._scaleDurationX<=0){this.scale.x=this._scaleTargetX}};Sprite_VisualNovelBust.prototype.scaleByX=function(t,e){t+=Math.abs(this.scale.x);t=Math.max(0,t);this.scaleToX(t,e)};Sprite_VisualNovelBust.prototype.scaleToY=function(t,e){if(e===undefined)e=Imported.Irina_VisualNovelBusts.BustScaleDuration;t=Math.abs(t);if(this.scale.y<0)t*=-1;this._scaleTargetY=t;this._scaleDurationY=e;if(this._scaleDurationY<=0){this.scale.y=this._scaleTargetY}};Sprite_VisualNovelBust.prototype.scaleByY=function(t,e){t+=Math.abs(this.scale.y);t=Math.max(0,t);this.scaleToY(t,e)};Sprite_VisualNovelBust.prototype.scaleTo=function(t,e){this.scaleToX(t,e);this.scaleToY(t,e)};Sprite_VisualNovelBust.prototype.scaleBy=function(t,e){this.scaleByX(t,e);this.scaleByY(t,e)};Sprite_VisualNovelBust.prototype.updateScale=function(){this.updateScaleX();this.updateScaleY()};Sprite_VisualNovelBust.prototype.updateScaleX=function(){if(this._scaleDurationX>0){var t=this._scaleDurationX;this.scale.x=(this.scale.x*(t-1)+this._scaleTargetX)/t;this._scaleDurationX--;if(this._scaleDurationX<=0){this.scale.x=this._scaleTargetX}}};Sprite_VisualNovelBust.prototype.updateScaleY=function(){if(this._scaleDurationY>0){var t=this._scaleDurationY;this.scale.y=(this.scale.y*(t-1)+this._scaleTargetY)/t;this._scaleDurationY--;if(this._scaleDurationY<=0){this.scale.y=this._scaleTargetY}}};Sprite_VisualNovelBust.prototype.resetTones=function(){this._tone=[0,0,0,0];this._toneTarget=[0,0,0,0];this._toneDuration=0};Sprite_VisualNovelBust.prototype.setTone=function(t,e,a,s,r){t=(t||0).clamp(-255,255);e=(e||0).clamp(-255,255);a=(a||0).clamp(-255,255);s=(s||0).clamp(0,255);if(r===undefined)r=Imported.Irina_VisualNovelBusts.BustToneDuration;this._toneTarget=[t,e,a,s];this._toneDuration=r;if(this._toneDuration<=0){this._tone=[t,e,a,s];this.setColorTone(this._tone)}};Sprite_VisualNovelBust.prototype.updateTone=function(){if(this._toneDuration>0){var t=this._toneDuration;for(var e=0;e<4;e++){this._tone[e]=(this._tone[e]*(t-1)+this._toneTarget[e])/t}this._toneDuration--;this.setColorTone(this._tone)}};Sprite_VisualNovelBust.prototype.dim=function(t){var e=Imported.Irina_VisualNovelBusts.BustDimValues;this.setTone(e[0],e[1],e[2],e[3],t)};Sprite_VisualNovelBust.prototype.light=function(t){var e=Imported.Irina_VisualNovelBusts.BustLightValues;this.setTone(e[0],e[1],e[2],e[3],t)};Sprite_VisualNovelBust.prototype.resetExpressionSettings=function(){this._expressionWidth=1;this._expressionHeight=1;this._expressionIndex=0};Sprite_VisualNovelBust.prototype.setExpression=function(t){t=t.toUpperCase().trim();if(Imported.Irina_VisualNovelBusts.BustExpressionList.contains(t)){this._expressionIndex=Imported.Irina_VisualNovelBusts.BustExpressionList.indexOf(t)}else{this._expressionIndex=parseInt(t)||0}};Sprite_VisualNovelBust.prototype.updateFrame=function(){if(this.bitmap&&this.bitmap.width>0){var t=this.bitmap.width/this._expressionWidth;var e=this.bitmap.height/this._expressionHeight;var a=this._expressionIndex%this._expressionWidth*t;var s=Math.floor(this._expressionIndex/this._expressionWidth)*e;this.setFrame(a,s,t,e)}};Sprite_VisualNovelBust.prototype.isActionPlaying=function(){return this._moveDuration>0||this._opacityDuration>0||this._scaleDurationX>0||this._scaleDurationY>0||this._toneDuration>0};Imported.Irina_VisualNovelBusts.Spriteset_Base_createUpperLayer=Spriteset_Base.prototype.createUpperLayer;Spriteset_Base.prototype.createUpperLayer=function(){this.createMessageBustSprites();Imported.Irina_VisualNovelBusts.Spriteset_Base_createUpperLayer.call(this)};Spriteset_Base.prototype.createMessageBustSprites=function(){this._messageBustSprites=[null,this._messageBustSprite1=new Sprite_VisualNovelBust(1),this._messageBustSprite2=new Sprite_VisualNovelBust(2),this._messageBustSprite3=new Sprite_VisualNovelBust(3),this._messageBustSprite4=new Sprite_VisualNovelBust(4),this._messageBustSprite5=new Sprite_VisualNovelBust(5),this._messageBustSprite6=new Sprite_VisualNovelBust(6),this._messageBustSprite7=new Sprite_VisualNovelBust(7),this._messageBustSprite8=new Sprite_VisualNovelBust(8),this._messageBustSprite9=new Sprite_VisualNovelBust(9),this._messageBustSprite10=new Sprite_VisualNovelBust(10)];this.addChild(this._messageBustSprite5);this.addChild(this._messageBustSprite6);this.addChild(this._messageBustSprite4);this.addChild(this._messageBustSprite7);this.addChild(this._messageBustSprite3);this.addChild(this._messageBustSprite8);this.addChild(this._messageBustSprite2);this.addChild(this._messageBustSprite9);this.addChild(this._messageBustSprite1);this.addChild(this._messageBustSprite10)};Imported.Irina_VisualNovelBusts.Window_Base_convertEscapeCharacters=Window_Base.prototype.convertEscapeCharacters;Window_Base.prototype.convertEscapeCharacters=function(t){t=t.replace(/\\/g,"");t=t.replace(/\x1b\x1b/g,"\\\\");if(this._messageBodyBustSprite){t=this.convertMessageBustEscapeCharacters(t)}else{t=t.replace(/\x1bBUST(.*?)\[(.*?)\]/gi,"")}return Imported.Irina_VisualNovelBusts.Window_Base_convertEscapeCharacters.call(this,t)};Window_Base.prototype.getBattleAnimationForBustCode=function(t){if(Imported.AnimationIdRef===undefined){Imported.AnimationIdRef={};for(var e=1;e<$dataAnimations.length;e++){var a=$dataAnimations[e];if(a.name.length<=0)continue;Imported.AnimationIdRef[a.name.toUpperCase().trim()]=e}}t=t.toUpperCase().trim();if(Imported.AnimationIdRef[t]){return parseInt(Imported.AnimationIdRef[t])}else{return parseInt(t)}};Window_Base.prototype.convertMessageBustEscapeCharacters=function(text){this.refreshMessageBustSprite();text=text.replace(/\x1bV\[(\d+)\]/gi,function(){return $gameVariables.value(parseInt(arguments[1]))}.bind(this));text=text.replace(/\x1bV\[(\d+)\]/gi,function(){return $gameVariables.value(parseInt(arguments[1]))}.bind(this));text=text.replace(/\x1bBUST\[(\d+)\]/gi,"");text=text.replace(/\x1bBUSTCLEAR\[(.*?)\]/gi,function(){var t=arguments[1].split(",");var e=$bust(parseInt(t[0]));var a=t[1]===undefined?Imported.Irina_VisualNovelBusts.BustClearDuration:parseInt(t[1])||0;e.clear(a);return""}.bind(this));text=text.replace(/\x1bBUST(?:ANI|ANIMATION)\[(.*?)\]/gi,function(){var array=arguments[1].split(",");var sprite=$bust(parseInt(array[0]));var animation=$dataAnimations[this.getBattleAnimationForBustCode(array[1])];var mirror=!!eval(array[2]);var delay=parseInt(array[3])||0;sprite.clearRepeatingAnimation();sprite.startAnimation(animation,mirror,delay);return""}.bind(this));text=text.replace(/\x1bBUST(?:REP|REPEAT|REPEATING)(?:ANI|ANIMATION)\[(.*?)\]/gi,function(){var array=arguments[1].split(",");var sprite=$bust(parseInt(array[0]));var animation=this.getBattleAnimationForBustCode(array[1]);var mirror=!!eval(array[2]);var delay=parseInt(array[3])||0;sprite.setupRepeatingAnimation(animation,mirror,delay);return""}.bind(this));text=text.replace(/\x1bBUST(?:STOP|CLEAR)(?:ANI|ANIMATION)\[(\d+)\]/gi,function(){var t=$bust(arguments[1]);t.clearRepeatingAnimation();return""}.bind(this));text=text.replace(/\x1bBUSTMOVETO\[(.*?)\]/gi,function(){var t=arguments[1].split(",");var e=$bust(parseInt(t[0]));var a=parseInt(t[1])||0;var s=parseInt(t[2])||0;var r=t[3]===undefined?Imported.Irina_VisualNovelBusts.BustMoveDuration:parseInt(t[3])||0;e.moveTo(a,s,r);return""}.bind(this));text=text.replace(/\x1bBUSTMOVEBY\[(.*?)\]/gi,function(){var t=arguments[1].split(",");var e=$bust(parseInt(t[0]));var a=parseInt(t[1])||0;var s=parseInt(t[2])||0;var r=t[3]===undefined?Imported.Irina_VisualNovelBusts.BustMoveDuration:parseInt(t[3])||0;e.moveBy(a,s,r);return""}.bind(this));text=text.replace(/\x1bBUSTMOVETYPE\[(.*?)\]/gi,function(){var t=arguments[1].split(",");var e=$bust(parseInt(t[0]));var a=String(t[1]);e.moveType(a);return""}.bind(this));text=text.replace(/\x1bBUSTMOVEHOME\[(.*?)\]/gi,function(){var t=arguments[1].split(",");var e=$bust(parseInt(t[0]));var a=t[1]===undefined?Imported.Irina_VisualNovelBusts.BustMoveDuration:parseInt(t[1])||0;e.moveHome(a);return""}.bind(this));text=text.replace(/\x1bBUSTFADEIN\[(.*?)\]/gi,function(){var t=arguments[1].split(",");var e=$bust(parseInt(t[0]));var a=t[1]===undefined?Imported.Irina_VisualNovelBusts.BustFadeDuration:parseInt(t[1])||0;e.fadeIn(a);return""}.bind(this));text=text.replace(/\x1bBUSTFADEOUT\[(.*?)\]/gi,function(){var t=arguments[1].split(",");var e=$bust(parseInt(t[0]));var a=t[1]===undefined?Imported.Irina_VisualNovelBusts.BustFadeDuration:parseInt(t[1])||0;e.fadeOut(a);return""}.bind(this));text=text.replace(/\x1bBUSTOPACITYTO\[(.*?)\]/gi,function(){var t=arguments[1].split(",");var e=$bust(parseInt(t[0]));var a=parseInt(t[1]).clamp(0,255);var s=t[2]===undefined?Imported.Irina_VisualNovelBusts.BustOpacityDuration:parseInt(t[1])||0;e.opacityTo(a,s);return""}.bind(this));text=text.replace(/\x1bBUSTOPACITYBY\[(.*?)\]/gi,function(){var t=arguments[1].split(",");var e=$bust(parseInt(t[0]));var a=parseInt(t[1]).clamp(0,255);var s=t[2]===undefined?Imported.Irina_VisualNovelBusts.BustOpacityDuration:parseInt(t[1])||0;e.opacityBy(a,s);return""}.bind(this));text=text.replace(/\x1bBUSTMIRROR\[(\d+)\]/gi,function(){var t=$bust(arguments[1]);t.mirror();return""}.bind(this));text=text.replace(/\x1bBUSTUNMIRROR\[(\d+)\]/gi,function(){var t=$bust(arguments[1]);t.unmirror();return""}.bind(this));text=text.replace(/\x1bBUSTUNMIRRORTOGGLE\[(\d+)\]/gi,function(){var t=$bust(arguments[1]);t.mirrorToggle();return""}.bind(this));text=text.replace(/\x1bBUSTSLIDEIN\[(.*?)\]/gi,function(){var t=arguments[1].split(",");var e=$bust(parseInt(t[0]));var a=t[1]===undefined?Imported.Irina_VisualNovelBusts.BustSlideDuration:parseInt(t[1])||0;e.slideIn(a);return""}.bind(this));text=text.replace(/\x1bBUSTSLIDEINFROMLEFT\[(.*?)\]/gi,function(){var t=arguments[1].split(",");var e=$bust(parseInt(t[0]));var a=t[1]===undefined?Imported.Irina_VisualNovelBusts.BustSlideDuration:parseInt(t[1])||0;e.slideInFromLeft(a);return""}.bind(this));text=text.replace(/\x1bBUSTSLIDEINFROMRIGHT\[(.*?)\]/gi,function(){var t=arguments[1].split(",");var e=$bust(parseInt(t[0]));var a=t[1]===undefined?Imported.Irina_VisualNovelBusts.BustSlideDuration:parseInt(t[1])||0;e.slideInFromRight(a);return""}.bind(this));text=text.replace(/\x1bBUSTSLIDEOUT\[(.*?)\]/gi,function(){var t=arguments[1].split(",");var e=$bust(parseInt(t[0]));var a=t[1]===undefined?Imported.Irina_VisualNovelBusts.BustSlideDuration:parseInt(t[1])||0;e.slideOut(a);return""}.bind(this));text=text.replace(/\x1bBUSTSLIDEOUTTOLEFT\[(.*?)\]/gi,function(){var t=arguments[1].split(",");var e=$bust(parseInt(t[0]));var a=t[1]===undefined?Imported.Irina_VisualNovelBusts.BustSlideDuration:parseInt(t[1])||0;e.slideOutToLeft(a);return""}.bind(this));text=text.replace(/\x1bBUSTSLIDEOUTTORIGHT\[(.*?)\]/gi,function(){var t=arguments[1].split(",");var e=$bust(parseInt(t[0]));var a=t[1]===undefined?Imported.Irina_VisualNovelBusts.BustSlideDuration:parseInt(t[1])||0;e.slideOutToRight(a);return""}.bind(this));text=text.replace(/\x1bBUSTSCALETO\[(.*?)\]/gi,function(){var t=arguments[1].split(",");var e=$bust(parseInt(t[0]));var a=t[1]===undefined?Imported.Irina_VisualNovelBusts.BustScaleDuration:parseFloat(t[1])||0;var s=t[2]===undefined?Imported.Irina_VisualNovelBusts.BustScaleDuration:parseInt(t[2])||0;e.scaleTo(a,s);return""}.bind(this));text=text.replace(/\x1bBUSTSCALEBY\[(.*?)\]/gi,function(){var t=arguments[1].split(",");var e=$bust(parseInt(t[0]));var a=t[1]===undefined?Imported.Irina_VisualNovelBusts.BustScaleDuration:parseFloat(t[1])||0;var s=t[2]===undefined?Imported.Irina_VisualNovelBusts.BustScaleDuration:parseInt(t[2])||0;e.scaleBy(a,s);return""}.bind(this));text=text.replace(/\x1bBUSTSCALETOX\[(.*?)\]/gi,function(){var t=arguments[1].split(",");var e=$bust(parseInt(t[0]));var a=t[1]===undefined?Imported.Irina_VisualNovelBusts.BustScaleDuration:parseFloat(t[1])||0;var s=t[2]===undefined?Imported.Irina_VisualNovelBusts.BustScaleDuration:parseInt(t[2])||0;e.scaleToX(a,s);return""}.bind(this));text=text.replace(/\x1bBUSTSCALEBYX\[(.*?)\]/gi,function(){var t=arguments[1].split(",");var e=$bust(parseInt(t[0]));var a=t[1]===undefined?Imported.Irina_VisualNovelBusts.BustScaleDuration:parseFloat(t[1])||0;var s=t[2]===undefined?Imported.Irina_VisualNovelBusts.BustScaleDuration:parseInt(t[2])||0;e.scaleByX(a,s);return""}.bind(this));text=text.replace(/\x1bBUSTSCALETOY\[(.*?)\]/gi,function(){var t=arguments[1].split(",");var e=$bust(parseInt(t[0]));var a=t[1]===undefined?Imported.Irina_VisualNovelBusts.BustScaleDuration:parseFloat(t[1])||0;var s=t[2]===undefined?Imported.Irina_VisualNovelBusts.BustScaleDuration:parseInt(t[2])||0;e.scaleToY(a,s);return""}.bind(this));text=text.replace(/\x1bBUSTSCALEBYY\[(.*?)\]/gi,function(){var t=arguments[1].split(",");var e=$bust(parseInt(t[0]));var a=t[1]===undefined?Imported.Irina_VisualNovelBusts.BustScaleDuration:parseFloat(t[1])||0;var s=t[2]===undefined?Imported.Irina_VisualNovelBusts.BustScaleDuration:parseInt(t[2])||0;e.scaleByY(a,s);return""}.bind(this));text=text.replace(/\x1bBUSTTONE\[(.*?)\]/gi,function(){var t=arguments[1].split(",");var e=$bust(parseInt(t[0]));var a=parseInt(t[1])||0;var s=parseInt(t[2])||0;var r=parseInt(t[3])||0;var i=parseInt(t[4])||0;var n=t[5]===undefined?Imported.Irina_VisualNovelBusts.BustToneDuration:parseInt(t[5])||0;e.setTone(a,s,r,i,n);return""}.bind(this));text=text.replace(/\x1bBUSTDIM\[(.*?)\]/gi,function(){var t=arguments[1].split(",");var e=$bust(parseInt(t[0]));var a=t[1]===undefined?Imported.Irina_VisualNovelBusts.BustToneDuration:parseInt(t[1])||0;e.dim(a);return""}.bind(this));text=text.replace(/\x1bBUSTLIGHT\[(.*?)\]/gi,function(){var t=arguments[1].split(",");var e=$bust(parseInt(t[0]));var a=t[1]===undefined?Imported.Irina_VisualNovelBusts.BustToneDuration:parseInt(t[1])||0;e.light(a);return""}.bind(this));text=text.replace(/\x1bBUST(?:INDEX|EXP|EXPRESSION)\[(.*?)\]/gi,function(){var t=arguments[1].split(",");var e=$bust(parseInt(t[0]));var a=t[1].toUpperCase().trim();e.setExpression(a);return""}.bind(this));return text};Imported.Irina_VisualNovelBusts.Window_Base_processEscapeCharacter=Window_Base.prototype.processEscapeCharacter;Window_Base.prototype.processEscapeCharacter=function(code,textState){if(code.match(/BUSTMSG(?:ANI|ANIMATION)/i)){var array=this.obtainVNBustMsgEscapeString(textState).split(",");var sprite=$bust(parseInt(array[0]));var animation=$dataAnimations[this.getBattleAnimationForBustCode(array[1])];var mirror=!!eval(array[2]);var delay=parseInt(array[3])||0;sprite.clearRepeatingAnimation();sprite.startAnimation(animation,mirror,delay)}else if(code.match(/BUSTMSG(?:REP|REPEAT|REPEATING)(?:ANI|ANIMATION)/i)){var array=this.obtainVNBustMsgEscapeString(textState).split(",");var sprite=$bust(parseInt(array[0]));var animation=this.getBattleAnimationForBustCode(array[1]);var mirror=!!eval(array[2]);var delay=parseInt(array[3])||0;sprite.setupRepeatingAnimation(animation,mirror,delay)}else if(code.match(/BUSTMSG(?:STOP|CLEAR)(?:ANI|ANIMATION)/i)){var array=this.obtainVNBustMsgEscapeString(textState).split(",");var sprite=$bust(parseInt(array[0]));sprite.clearRepeatingAnimation()}else if(code.match(/BUSTMSGMOVETO/i)){var array=this.obtainVNBustMsgEscapeString(textState).split(",");var sprite=$bust(parseInt(array[0]));var x=parseInt(array[1])||0;var y=parseInt(array[2])||0;var duration=array[3]===undefined?Imported.Irina_VisualNovelBusts.BustMoveDuration:parseInt(array[3])||0;sprite.moveTo(x,y,duration)}else if(code.match(/BUSTMSGMOVEBY/i)){var array=this.obtainVNBustMsgEscapeString(textState).split(",");var sprite=$bust(parseInt(array[0]));var x=parseInt(array[1])||0;var y=parseInt(array[2])||0;var duration=array[3]===undefined?Imported.Irina_VisualNovelBusts.BustMoveDuration:parseInt(array[3])||0;sprite.moveBy(x,y,duration)}else if(code.match(/BUSTMSGMOVETYPE/i)){var array=this.obtainVNBustMsgEscapeString(textState).split(",");var sprite=$bust(parseInt(array[0]));var type=String(array[1]);sprite.moveType(type)}else if(code.match(/BUSTMSGMOVEHOME/i)){var array=this.obtainVNBustMsgEscapeString(textState).split(",");var sprite=$bust(parseInt(array[0]));var duration=array[1]===undefined?Imported.Irina_VisualNovelBusts.BustMoveDuration:parseInt(array[1])||0;sprite.moveHome(duration)}else if(code.match(/BUSTMSGFADEIN/i)){var array=this.obtainVNBustMsgEscapeString(textState).split(",");var sprite=$bust(parseInt(array[0]));var duration=array[1]===undefined?Imported.Irina_VisualNovelBusts.BustFadeDuration:parseInt(array[1])||0;sprite.fadeIn(duration)}else if(code.match(/BUSTMSGFADEOUT/i)){var array=this.obtainVNBustMsgEscapeString(textState).split(",");var sprite=$bust(parseInt(array[0]));var duration=array[1]===undefined?Imported.Irina_VisualNovelBusts.BustFadeDuration:parseInt(array[1])||0;sprite.fadeOut(duration)}else if(code.match(/BUSTMSGOPACITYTO/i)){var array=this.obtainVNBustMsgEscapeString(textState).split(",");var sprite=$bust(parseInt(array[0]));var opacity=parseInt(array[1]).clamp(0,255);var duration=array[2]===undefined?Imported.Irina_VisualNovelBusts.BustOpacityDuration:parseInt(array[1])||0;sprite.opacityTo(opacity,duration)}else if(code.match(/BUSTMSGOPACITYBY/i)){var array=this.obtainVNBustMsgEscapeString(textState).split(",");var sprite=$bust(parseInt(array[0]));var opacity=parseInt(array[1]).clamp(0,255);var duration=array[2]===undefined?Imported.Irina_VisualNovelBusts.BustOpacityDuration:parseInt(array[1])||0;sprite.opacityBy(opacity,duration)}else if(code.match(/BUSTMSGMIRRORTOGGLE/i)){var array=this.obtainVNBustMsgEscapeString(textState).split(",");var sprite=$bust(parseInt(array[0]));sprite.mirrorToggle()}else if(code.match(/BUSTMSGMIRROR/i)){var array=this.obtainVNBustMsgEscapeString(textState).split(",");var sprite=$bust(parseInt(array[0]));sprite.mirror()}else if(code.match(/BUSTMSGUNMIRROR/i)){var array=this.obtainVNBustMsgEscapeString(textState).split(",");var sprite=$bust(parseInt(array[0]));sprite.unmirror()}else if(code.match(/BUSTMSGSLIDEINFROMLEFT/i)){var array=this.obtainVNBustMsgEscapeString(textState).split(",");var sprite=$bust(parseInt(array[0]));var duration=array[1]===undefined?Imported.Irina_VisualNovelBusts.BustSlideDuration:parseInt(array[1])||0;sprite.slideInFromLeft(duration)}else if(code.match(/BUSTMSGSLIDEINFROMRIGHT/i)){var array=this.obtainVNBustMsgEscapeString(textState).split(",");var sprite=$bust(parseInt(array[0]));var duration=array[1]===undefined?Imported.Irina_VisualNovelBusts.BustSlideDuration:parseInt(array[1])||0;sprite.slideInFromRight(duration)}else if(code.match(/BUSTMSGSLIDEIN/i)){var array=this.obtainVNBustMsgEscapeString(textState).split(",");var sprite=$bust(parseInt(array[0]));var duration=array[1]===undefined?Imported.Irina_VisualNovelBusts.BustSlideDuration:parseInt(array[1])||0;sprite.slideIn(duration)}else if(code.match(/BUSTMSGSLIDEOUTTOLEFT/i)){var array=this.obtainVNBustMsgEscapeString(textState).split(",");var sprite=$bust(parseInt(array[0]));var duration=array[1]===undefined?Imported.Irina_VisualNovelBusts.BustSlideDuration:parseInt(array[1])||0;sprite.slideOutToLeft(duration)}else if(code.match(/BUSTMSGSLIDEOUTTORIGHT/i)){var array=this.obtainVNBustMsgEscapeString(textState).split(",");var sprite=$bust(parseInt(array[0]));var duration=array[1]===undefined?Imported.Irina_VisualNovelBusts.BustSlideDuration:parseInt(array[1])||0;sprite.slideOutToRight(duration)}else if(code.match(/BUSTMSGSLIDEOUT/i)){var array=this.obtainVNBustMsgEscapeString(textState).split(",");var sprite=$bust(parseInt(array[0]));var duration=array[1]===undefined?Imported.Irina_VisualNovelBusts.BustSlideDuration:parseInt(array[1])||0;sprite.slideOut(duration)}else if(code.match(/BUSTMSGSCALETOX/i)){var array=this.obtainVNBustMsgEscapeString(textState).split(",");var sprite=$bust(parseInt(array[0]));var scale=array[1]===undefined?Imported.Irina_VisualNovelBusts.BustScaleDuration:parseFloat(array[1])||0;var duration=array[2]===undefined?Imported.Irina_VisualNovelBusts.BustScaleDuration:parseInt(array[2])||0;sprite.scaleToX(scale,duration)}else if(code.match(/BUSTMSGSCALEBYX/i)){var array=this.obtainVNBustMsgEscapeString(textState).split(",");var sprite=$bust(parseInt(array[0]));var scale=array[1]===undefined?Imported.Irina_VisualNovelBusts.BustScaleDuration:parseFloat(array[1])||0;var duration=array[2]===undefined?Imported.Irina_VisualNovelBusts.BustScaleDuration:parseInt(array[2])||0;sprite.scaleByX(scale,duration)}else if(code.match(/BUSTMSGSCALETOY/i)){var array=this.obtainVNBustMsgEscapeString(textState).split(",");var sprite=$bust(parseInt(array[0]));var scale=array[1]===undefined?Imported.Irina_VisualNovelBusts.BustScaleDuration:parseFloat(array[1])||0;var duration=array[2]===undefined?Imported.Irina_VisualNovelBusts.BustScaleDuration:parseInt(array[2])||0;sprite.scaleToY(scale,duration)}else if(code.match(/BUSTMSGSCALEBYY/i)){var array=this.obtainVNBustMsgEscapeString(textState).split(",");var sprite=$bust(parseInt(array[0]));var scale=array[1]===undefined?Imported.Irina_VisualNovelBusts.BustScaleDuration:parseFloat(array[1])||0;var duration=array[2]===undefined?Imported.Irina_VisualNovelBusts.BustScaleDuration:parseInt(array[2])||0;sprite.scaleByY(scale,duration)}else if(code.match(/BUSTMSGSCALETO/i)){var array=this.obtainVNBustMsgEscapeString(textState).split(",");var sprite=$bust(parseInt(array[0]));var scale=array[1]===undefined?Imported.Irina_VisualNovelBusts.BustScaleDuration:parseFloat(array[1])||0;var duration=array[2]===undefined?Imported.Irina_VisualNovelBusts.BustScaleDuration:parseInt(array[2])||0;sprite.scaleTo(scale,duration)}else if(code.match(/BUSTMSGSCALEBY/i)){var array=this.obtainVNBustMsgEscapeString(textState).split(",");var sprite=$bust(parseInt(array[0]));var scale=array[1]===undefined?Imported.Irina_VisualNovelBusts.BustScaleDuration:parseFloat(array[1])||0;var duration=array[2]===undefined?Imported.Irina_VisualNovelBusts.BustScaleDuration:parseInt(array[2])||0;sprite.scaleBy(scale,duration)}else if(code.match(/BUSTMSGTONE/i)){var array=this.obtainVNBustMsgEscapeString(textState).split(",");var sprite=$bust(parseInt(array[0]));var r=parseInt(array[1])||0;var g=parseInt(array[2])||0;var b=parseInt(array[3])||0;var s=parseInt(array[4])||0;var duration=array[5]===undefined?Imported.Irina_VisualNovelBusts.BustToneDuration:parseInt(array[5])||0;sprite.setTone(r,g,b,s,duration)}else if(code.match(/BUSTMSGDIM/i)){var array=this.obtainVNBustMsgEscapeString(textState).split(",");var sprite=$bust(parseInt(array[0]));var duration=array[1]===undefined?Imported.Irina_VisualNovelBusts.BustToneDuration:parseInt(array[1])||0;sprite.dim(duration)}else if(code.match(/BUSTMSGLIGHT/i)){var array=this.obtainVNBustMsgEscapeString(textState).split(",");var sprite=$bust(parseInt(array[0]));var duration=array[1]===undefined?Imported.Irina_VisualNovelBusts.BustToneDuration:parseInt(array[1])||0;sprite.light(duration)}else if(code.match(/BUSTMSG(?:INDEX|EXP|EXPRESSION)/i)){var array=this.obtainVNBustMsgEscapeString(textState).split(",");var sprite=$bust(parseInt(array[0]));var expression=array[1].toUpperCase().trim();sprite.setExpression(expression)}else if(code.match(/BUSTMSGCLEAR/i)){var array=this.obtainVNBustMsgEscapeString(textState).split(",");var sprite=$bust(parseInt(array[0]));var duration=array[1]===undefined?Imported.Irina_VisualNovelBusts.BustClearDuration:parseInt(array[1])||0;sprite.clear(duration)}else{Imported.Irina_VisualNovelBusts.Window_Base_processEscapeCharacter.call(this,code,textState)}};Window_Base.prototype.obtainVNBustMsgEscapeString=function(t){var e=/^\[(.*?)\]/.exec(t.text.slice(t.index));if(e){t.index+=e[0].length;return String(e[0].slice(1,e[0].length-1))}else{return""}};Imported.Irina_VisualNovelBusts.Window_Message_initMembers=Window_Message.prototype.initMembers;Window_Message.prototype.initMembers=function(){Imported.Irina_VisualNovelBusts.Window_Message_initMembers.call(this);this.createMessageBustSprites()};Window_Message.prototype.createMessageBustSprites=function(){this._messageBodyBustSprite=new Sprite_VisualNovelBust(0);this.addChildToBack(this._messageBodyBustSprite)};Window_Message.prototype.isUsingFaceBust=function(){if($gameMessage.faceName().match(/\[BUST\]/i))return true;if($gameMessage.allText().match(/\\BUST\[(\d+)\]/i)||$gameMessage.allText().match(/\x1bBUST\[(\d+)\]/i))return true;return false};Imported.Irina_VisualNovelBusts.Window_Message_loadMessageFace=Window_Message.prototype.loadMessageFace;Window_Message.prototype.loadMessageFace=function(){if(this.isUsingFaceBust()){this._faceBitmap=ImageManager.reserveFace("",0,this._imageReservationId)}else{Imported.Irina_VisualNovelBusts.Window_Message_loadMessageFace.call(this)}};Imported.Irina_VisualNovelBusts.Window_Message_drawMessageFace=Window_Message.prototype.drawMessageFace;Window_Message.prototype.drawMessageFace=function(){if(!this.isUsingFaceBust()){Imported.Irina_VisualNovelBusts.Window_Message_drawMessageFace.call(this)}};Window_Message.prototype.refreshMessageBustSprite=function(){if(!this.isUsingFaceBust())return;var t=$gameMessage.allText();if(t.match(/\\BUST\[(\d+)\]/i)||t.match(/\x1bBUST\[(\d+)\]/i)){var e=parseInt(RegExp.$1).clamp(0,10);if(e>0){var a=$bust(e);if(a){a.loadBitmap("face",$gameMessage.faceName())}}else{this.makeMessageWindowBust($gameMessage.faceName())}}else{this.makeMessageWindowBust($gameMessage.faceName())}};Window_Message.prototype.makeMessageWindowBust=function(t){this._messageBodyBustSprite.x=Imported.Irina_VisualNovelBusts.BustDefaults[0].ScreenX.call(this);this._messageBodyBustSprite.y=Imported.Irina_VisualNovelBusts.BustDefaults[0].ScreenY.call(this);this._messageBodyBustSprite.loadBitmap("face",t)};Imported.Irina_VisualNovelBusts.Window_Message_newLineX=Window_Message.prototype.newLineX;Window_Message.prototype.newLineX=function(){var t=$gameMessage.allText();if(t.match(/\\BUST\[(\d+)\]/i)||t.match(/\x1bBUST\[(\d+)\]/i)){var e=parseInt(RegExp.$1);if(e>0){return 0}else{return Imported.Irina_VisualNovelBusts.Window_Message_newLineX.call(this)}}else{return Imported.Irina_VisualNovelBusts.Window_Message_newLineX.call(this)}};Window_Message.prototype.close=function(){Window_Base.prototype.close.call(this);setTimeout(this.closeMessageBodyBustSprite.bind(this),50)};Window_Message.prototype.closeMessageBodyBustSprite=function(){if(this._messageBodyBustSprite&&(this.isClosing()||this.isClosed())){this._messageBodyBustSprite.clear()}};Imported.Irina_VisualNovelBusts.Window_Message_isTriggered=Window_Message.prototype.isTriggered;Window_Message.prototype.isTriggered=function(){var t=Imported.Irina_VisualNovelBusts.Window_Message_isTriggered.call(this);if(t&&this.isAnyBustPlayingAnAction()){return false}return t};Window_Message.prototype.isAnyBustPlayingAnAction=function(){for(var t=0;t<=10;t++){if($bust(t)&&$bust(t).isActionPlaying())return true}return false};