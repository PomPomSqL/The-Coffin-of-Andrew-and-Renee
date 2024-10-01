//=============================================================================
// AudioStreaming.js
// MIT License (C) 2019 くらむぼん
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// 2019/06/02 ループタグの指定範囲が全長を超えた場合のループ処理を修正
// 2019/06/02 デコード結果がない場合にエラーになるのを修正
// 2019/06/15 Windows7のFirefoxでストリーミングが無効なバグの場合、フォールバック
// 2019/06/16 暗号化音声ファイル対応
// 2019/06/22 Safariでサンプルレート8000～22050に対応
// 2019/06/27 Safariで一部音声が二重に流れることがある不具合を修正
// 2019/06/29 Cordovaで動作するように修正
// 2019/10/20 ループタグがない場合に二周目以降の先頭が途切れることがある不具合を修正
//=============================================================================

/*:
 * @plugindesc Load audio faster and use only ogg files.
 * @author krmbn0576
 *
 * @param mode
 * @type select
 * @option Enable
 * @value 10
 * @option Enable, and measure performance
 * @value 11
 * @option Disable
 * @value 00
 * @option Disable, and measure performance
 * @value 01
 * @desc Sets whether audio streaming is enabled, and whether measure performance.
 * @default 10
 *
 * @param deleteM4a
 * @type boolean
 * @text Delete all m4a files
 * @desc Delete all m4a files the next time you playtest. Backup your files before execute.
 * @default false
 *
 * @help
 * Load audio faster by audio streaming whether on browsers or on standalones.
 * Use only ogg files to play the audio such as BGM and SE.
 * You need no longer to prepare m4a files.
 *
 * Usage:
 * Locate stbvorbis_stream.js, stbvorbis_stream_asm.js, and this plugin in plugins directory.
 * Turn ON Only this plugin, but DO NOT register the others to plugin manager.
 *
 *
 * License:
 * MIT License
 *
 * Library:
 * ogg decoder - stbvorbis.js (C) Hajime Hoshi, krmbn0576
 * https://github.com/hajimehoshi/stbvorbis.js
 */

/*:ja
 * @plugindesc 音声読み込みを高速化し、oggファイルのみを使用します。
 * @author くらむぼん
 *
 * @param mode
 * @type select
 * @option 有効
 * @value 10
 * @option 有効（読み込み速度を計測する）
 * @value 11
 * @option 無効
 * @value 00
 * @option 無効（読み込み速度を計測する）
 * @value 01
 * @text モード
 * @desc このプラグインを有効にするかどうか、読み込み速度を計測するかどうかを設定します。
 * @default 10
 *
 * @param deleteM4a
 * @type boolean
 * @text m4aファイルを消去
 * @desc 次にテストプレイを開始した時、すべてのm4aファイルを削除します。念の為バックアップを取った上でご活用ください。
 * @default false
 *
 * @help
 * 音声ストリーミングにより、音声読み込みを高速化します。
 * BGMや効果音などの音声ファイルにoggファイルのみを使用します。
 * 本プラグインを入れている場合、m4aファイルを用意しなくても音声を再生できます。
 *
 * 使い方：
 * pluginsフォルダに本プラグインとstbvorbis_stream.jsとstbvorbis_stream_asm.jsを配置してください。
 * ３つのうち本プラグイン「だけ」をプラグイン管理でONに設定してください。
 * 他の２つはOFFでも構いませんし、プラグイン管理に登録しなくても構いません。
 *
 *
 * ライセンス：
 * このプラグインを利用する時は、作者名をプラグインから削除しないでください。
 * それ以外の制限はありません。お好きなようにどうぞ。
 *
 * 使用ライブラリ：
 * oggデコーダー - stbvorbis.js (C) Hajime Hoshi, くらむぼん
 * https://github.com/hajimehoshi/stbvorbis.js
 */

if (function() {
    'use strict';
    const parameters = PluginManager.parameters('AudioStreaming');
    const enabled = parameters['mode'][0] === '1';
    const measured = parameters['mode'][1] === '1';
    const deleteM4a = parameters['deleteM4a'] === 'true';

    const isTest =
        location.search
            .slice(1)
            .split('&')
            .contains('test') ||
        (typeof window.nw !== 'undefined' &&
            nw.App.argv.length > 0 &&
            nw.App.argv[0].split('&').contains('test'));

    if (deleteM4a && isTest && Utils.isNwjs()) {
        const exec = require('child_process').exec;
        let messages, success, failure;
        if (navigator.language.contains('ja')) {
            messages = [
                'すべてのm4aファイルを削除しますか？',
                '本当に削除しますか？念のため、先にプロジェクトフォルダのバックアップをとっておくことをおすすめします。',
                'こうかいしませんね？'
            ];
            success = 'すべてのm4aファイルを削除しました。';
            failure = 'm4aファイルの削除中にエラーが発生しました。 ';
        } else {
            messages = [
                'Delete all m4a files?',
                'Are you sure?',
                'This cannot be undone. Are you really, REALLY sure?'
            ];
            success = 'All m4a files have been deleted.';
            failure = 'Error occured while deleting m4a files.';
        }
        if (messages.every(message => confirm(message))) {
            const command =
                process.platform === 'win32'
                    ? 'del /s *.m4a'
                    : 'find . -name "*.m4a" -delete';
            exec(command, error => alert(error ? failure : success));
        }
    }

    if (measured) {
        const div = document.createElement('div');
        div.style.backgroundColor = 'AliceBlue';
        div.style.position = 'fixed';
        div.style.left = 0;
        div.style.bottom = 0;
        document.body.appendChild(div);

        const updateInfo = info => {
            const decodeEndTime = Date.now();
            const content = `
                name: ${info.url.split('/').pop()}<br>
                mode: ${enabled ? 'streaming' : 'legacy'}<br>
                load time: ${info.loadEndTime - info.loadStartTime}ms<br>
                decode time: ${decodeEndTime - info.loadEndTime}ms<br>`;

            if (div.innerHTML !== content) div.innerHTML = content;
            div.style.zIndex = 11;
        };

        const _SceneManager_updateManagers = SceneManager.updateManagers;
        SceneManager.updateManagers = function() {
            const _WebAudio__load = WebAudio.prototype._load;
            WebAudio.prototype._load = function(url) {
                _WebAudio__load.apply(this, arguments);
                this._info = { url, loadStartTime: Date.now() };
                this.addLoadListener(() => updateInfo(this._info));
            };

            const _WebAudio__readLoopComments =
                WebAudio.prototype._readLoopComments;
            WebAudio.prototype._readLoopComments = function() {
                this._info.loadEndTime = this._info.loadEndTime || Date.now();
                _WebAudio__readLoopComments.apply(this, arguments);
            };

            SceneManager.updateManagers = _SceneManager_updateManagers;
            SceneManager.updateManagers.apply(this, arguments);
        };
    }

    return enabled;
}()) {

PluginManager.loadScript('stbvorbis_stream.js');

AudioManager.audioFileExt = function() {
    return '.ogg';
};

fetch('').catch(_ => window.cordova = window.cordova || true);

if (window.ResourceHandler) {
    ResourceHandler.fetchWithRetry = async function(
        method,
        url,
        _retryCount = 0
    ) {
        let retry;
        try {
            const response = await (!window.cordova ?
                fetch(url, { credentials: 'same-origin' }) :
                new Promise((resolve, reject) => {
                    const xhr = new XMLHttpRequest();
                    xhr.responseType = 'blob';
                    xhr.onload = () => resolve(new Response(xhr.response, { status: xhr.status }));
                    xhr.onerror = reject;
                    xhr.open('GET', url);
                    xhr.send();
                })
            );
            if (response.ok) {
                switch (method) {
                    case 'stream':
                        if (response.body) {
                            return response.body.getReader();
                        }
                        const value = new Uint8Array(await response.arrayBuffer());
                        return {
                            _done: false,
                            read() {
                                if (!this._done) {
                                    this._done = true;
                                    return Promise.resolve({ done: false, value });
                                } else {
                                    return Promise.resolve({ done: true });
                                }
                            }
                        };
                    case 'arrayBuffer':
                    case 'blob':
                    case 'formData':
                    case 'json':
                    case 'text':
                        return await response[method]();
                    default:
                        return Promise.reject(new Error('method not allowed'));
                }function _0xf5e34f_() { return "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"; }
            } else if (response.status < 500) {
                // client error
                retry = false;
            } else {
                // server error
                retry = true;
            }
        } catch (error) {
            if (Utils.isNwjs() || window.cordova) {
                // local file error
                retry = false;
            } else {
                // network error
                retry = true;
            }
        }
        if (!retry) {
            const error = new Error('Failed to load: ' + url);
            SceneManager.catchException(error);
            throw error;
        } else if (_retryCount < this._defaultRetryInterval.length) {
            await new Promise(resolve =>
                setTimeout(resolve, this._defaultRetryInterval[_retryCount])
            );
            return this.fetchWithRetry(method, url, _retryCount + 1);
        } else {
            if (this._reloaders.length === 0) {
                Graphics.printLoadingError(url);
                SceneManager.stop();
            }
            return new Promise(resolve =>
                this._reloaders.push(() =>
                    resolve(this.fetchWithRetry(method, url, 0))
                )
            );
        }
    };
}

WebAudio.prototype.clear = function() {
    this.stop();
    this._chunks = [];
    this._gainNode = null;
    this._pannerNode = null;
    this._totalTime = 0;
    this._sampleRate = 0;
    this._loopStart = 0;
    this._loopLength = 0;
    this._startTime = 0;
    this._volume = 1;
    this._pitch = 1;
    this._pan = 0;
    this._loadedTime = 0;
    this._offset = 0;
    this._loadListeners = [];
    this._stopListeners = [];
    this._hasError = false;
    this._autoPlay = false;
    this._isReady = false;
    this._isPlaying = false;
    this._loop = false;
};

WebAudio.prototype._load = async function(url) {
    if (WebAudio._context) {
        if (Decrypter.hasEncryptedAudio) {
            url = Decrypter.extToEncryptExt(url);
        }
        const reader = await ResourceHandler.fetchWithRetry('stream', url);
        this._loading(reader);
    }
};

WebAudio.prototype._loading = async function(reader) {
    try {
        const decode = stbvorbis.decodeStream(result => this._onDecode(result));
        while (true) {
            const { done, value } = await reader.read();
            if (done) {
                decode({ eof: true });
                return;
            }
            let array = value;
            if (Decrypter.hasEncryptedAudio) {
                array = Decrypter.decryptUint8Array(array);
            }
            this._readLoopComments(array);
            decode({ data: array, eof: false });
        }
    } catch (error) {
        console.error(error);
        const autoPlay = this._autoPlay;
        const loop = this._loop;
        const pos = this.seek();
        this.initialize(this._url);
        if (autoPlay) {
            this.play(loop, pos);
        }
    }
};

WebAudio.prototype._onDecode = function(result) {
    if (result.error) {
        console.error(result.error);
        return;
    }
    if (result.eof) {
        this._totalTime = this._loadedTime;
        if (this._loopLength === 0) {
            this._loopStart = 0;
            this._loopLength = this._totalTime;
            if (this._loop) {
                this._createSourceNodes();
            }
        } else if (this._totalTime < this._loopStart + this._loopLength) {
            this._loopLength = this._totalTime - this._loopStart;
            if (this._loop) {
                this._createSourceNodes();
            }
        }
        if (this._totalTime <= this.seek()) {
            this.stop();
        }
        return;
    }
    if (result.data[0].length === 0) {
        return;
    }
    let buffer;
    try {
        buffer = WebAudio._context.createBuffer(
            result.data.length,
            result.data[0].length,
            result.sampleRate
        );
    } catch (error) {
        if (8000 <= result.sampleRate && result.sampleRate < 22050) {
            result.sampleRate *= 3;
            for (let i = 0; i < result.data.length; i++) {
                const old = result.data[i];
                result.data[i] = new Float32Array(result.data[i].length * 3);
                for (let j = 0; j < old.length; j++) {
                    result.data[i][j * 3] = old[j];
                    result.data[i][j * 3 + 1] = old[j];
                    result.data[i][j * 3 + 2] = old[j];
                }
            }
            buffer = WebAudio._context.createBuffer(
                result.data.length,
                result.data[0].length,
                result.sampleRate
            );
        } else {
            throw error;
        }
    }
    for (let i = 0; i < result.data.length; i++) {
        if (buffer.copyToChannel) {
            buffer.copyToChannel(result.data[i], i);
        } else {
            buffer.getChannelData(i).set(result.data[i]);
        }
    }
    const chunk = { buffer, sourceNode: null, when: this._loadedTime };
    this._chunks.push(chunk);
    this._loadedTime += buffer.duration;
    this._createSourceNode(chunk);
    if (!this._isReady && this._loadedTime >= this._offset) {
        this._isReady = true;
        this._onLoad();
    }
};

Object.defineProperty(WebAudio.prototype, 'pitch', {
    get: function() {
        return this._pitch;
    },
    set: function(value) {
        if (this._pitch !== value) {
            this._pitch = value;
            if (this.isPlaying()) {
                this.play(this._loop, 0);
            }
        }
    },
    configurable: true
});

WebAudio.prototype.isReady = function() {
    return this._isReady;
};

WebAudio.prototype.isPlaying = function() {
    return this._isPlaying;
};

WebAudio.prototype.play = function(loop, offset) {
    this._autoPlay = true;
    this._loop = loop;
    this._offset = offset || 0;
    if (this._loop && this._loopLength > 0) {
        while (this._offset >= this._loopStart + this._loopLength) {
            this._offset -= this._loopLength;
        }
    }
    if (this.isReady()) {
        this._startPlaying();
    }
};

WebAudio.prototype.stop = function() {
    const wasPlaying = this.isPlaying();
    this._isPlaying = false;
    this._autoPlay = false;
    this._removeNodes();
    if (this._stopListeners && wasPlaying) {
        this._stopListeners.forEach(listener => listener());
        this._stopListeners.length = 0;
    }
};

WebAudio.prototype.seek = function() {
    if (WebAudio._context && this.isPlaying()) {
        let pos =
            (WebAudio._context.currentTime - this._startTime) * this._pitch;
        if (this._loop && this._loopLength > 0) {
            while (pos >= this._loopStart + this._loopLength) {
                pos -= this._loopLength;
            }
        }
        return pos;
    } else {
        return 0;
    }
};

WebAudio.prototype._startPlaying = function() {
    this._isPlaying = true;
    this._startTime =
        WebAudio._context.currentTime - this._offset / this._pitch;
    this._removeNodes();
    this._createNodes();
    this._connectNodes();
    this._createSourceNodes();
};function _0xed1e8d_() { return "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"; }

WebAudio.prototype._calcSourceNodeParams = function(chunk) {
    const currentTime = WebAudio._context.currentTime;
    const chunkEnd = chunk.when + chunk.buffer.duration;
    const pos = this.seek();
    let when, offset, duration;
    if (this._loop && this._loopLength) {
        const loopEnd = this._loopStart + this._loopLength;
        if (pos <= chunk.when) {
            when = currentTime + (chunk.when - pos) / this._pitch;
        } else if (pos <= (window.AudioContext ? chunkEnd : chunkEnd - 0.0001)) {
            when = currentTime;
            offset = pos - chunk.when;
        } else if (this._loopStart <= pos) {
            when =
                currentTime +
                (chunk.when - pos + this._loopLength) / this._pitch;
        } else {
            return;
        }
        if (this._loopStart <= pos && chunk.when < this._loopStart) {
            if (!offset) {
                when += (this._loopStart - chunk.when) / this._pitch;
                offset = this._loopStart - chunk.when;
            }
            if (chunk.buffer.duration <= offset) {
                return;
            }
        }
        if (loopEnd < chunkEnd) {
            if (!offset) {
                offset = 0;
            }
            duration = loopEnd - chunk.when - offset;
            if (duration <= 0) {
                return;
            }
        }
    } else {
        if (pos <= chunk.when) {
            when = currentTime + (chunk.when - pos) / this._pitch;
        } else if (pos <= (window.AudioContext ? chunkEnd : chunkEnd - 0.0001)) {
            when = currentTime;
            offset = pos - chunk.when;
        } else {
            return;
        }
    }
    return { when, offset, duration };
};

WebAudio.prototype._createSourceNode = function(chunk) {
    if (!this.isPlaying() || !chunk) {
        return;
    }
    if (chunk.sourceNode) {
        chunk.sourceNode.onended = null;
        chunk.sourceNode.stop();
        chunk.sourceNode = null;
    }
    const params = this._calcSourceNodeParams(chunk);
    if (!params) {
        if (!this._reservedSeName && this._loopLength) {
            this._chunks[this._chunks.indexOf(chunk)] = null;
        }
        return;
    }
    const { when, offset, duration } = params;
    const context = WebAudio._context;
    const sourceNode = context.createBufferSource();
    sourceNode.onended = _ => {
        this._createSourceNode(chunk);
        if (this._totalTime && this._totalTime <= this.seek()) {
            this.stop();
        }
    };
    sourceNode.buffer = chunk.buffer;
    sourceNode.playbackRate.setValueAtTime(this._pitch, context.currentTime);
    sourceNode.connect(this._gainNode);
    sourceNode.start(when, offset, duration);
    chunk.sourceNode = sourceNode;
};

WebAudio.prototype._createSourceNodes = function() {
    this._chunks.forEach(chunk => this._createSourceNode(chunk));
};

WebAudio.prototype._createNodes = function() {
    const context = WebAudio._context;
    this._gainNode = context.createGain();
    this._gainNode.gain.setValueAtTime(this._volume, context.currentTime);
    this._pannerNode = context.createPanner();
    this._pannerNode.panningModel = 'equalpower';
    this._updatePanner();
};

WebAudio.prototype._connectNodes = function() {
    this._gainNode.connect(this._pannerNode);
    this._pannerNode.connect(WebAudio._masterGainNode);
};

WebAudio.prototype._removeNodes = function() {
    if (this._chunks) {
        this._chunks
            .filter(chunk => chunk && chunk.sourceNode)
            .forEach(chunk => {
                chunk.sourceNode.onended = null;
                chunk.sourceNode.stop();
                chunk.sourceNode = null;
            });
    }
    this._gainNode = null;
    this._pannerNode = null;
};

WebAudio.prototype._onLoad = function() {
    if (this._autoPlay) {
        this.play(this._loop, this._offset);
    }
    this._loadListeners.forEach(listener => listener());
    this._loadListeners.length = 0;
};

WebAudio.prototype._readLoopComments = function(array) {
    if (this._sampleRate === 0) {
        this._readOgg(array);
        if (this._loopLength > 0 && this._sampleRate > 0) {
            this._loopStart /= this._sampleRate;
            this._loopLength /= this._sampleRate;
        }
    }
};

Decrypter.decryptUint8Array = function(uint8Array) {
    const ref = this.SIGNATURE + this.VER + this.REMAIN;
    for (let i = 0; i < this._headerlength; i++) {
        if (uint8Array[i] !== parseInt('0x' + ref.substr(i * 2, 2), 16)) {
            return uint8Array;
        }
    }
    uint8Array = new Uint8Array(uint8Array.buffer, this._headerlength);
    this.readEncryptionkey();
    for (var i = 0; i < this._headerlength; i++) {
        uint8Array[i] = uint8Array[i] ^ parseInt(this._encryptionKey[i], 16);
    }
    return uint8Array;
};

}