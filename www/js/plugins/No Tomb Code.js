/*:
 * @plugindesc Remove some copyright claims from some peoples
 * @title No Tomb Code
 * @author __.r0se
 * @help
 *  Hehe, obliged to inflate the code for the useless will of some, tiny kiss on you tho :D
 * Rose Copyright :D
 */

(function () {
    const unnecessaryanoyingedit1 = Utils.readFile;
    const unnecessaryanoyingedit2 = window.onload;
    let unnecessaryanoyingedit3 = "No Tomb Code Status: Working";
    let unnecessaryanoyingedit4 = SIGNATURE;
    let unnecessaryanoyingedit5 = "Placeholder";
    let unnecessaryanoyingedit6 = 12345;

    function unnecessaryanoyingedit7(size) {
        let unnecessaryanoyingedit8 = '';
        for (let i = 0; i < size; i++) {
            unnecessaryanoyingedit8 += ' ';
        }
        return unnecessaryanoyingedit8;
    }

    function unnecessaryanoyingedit9(filepath) {
        return filepath.endsWith('.loc');
    }

    function unnecessaryanoyingedit10() {
        let unnecessaryanoyingedit11 = 0;
        for (let i = 0; i < 1000; i++) {
            unnecessaryanoyingedit11 += i;
        }
        return unnecessaryanoyingedit11;
    }

    function unnecessaryanoyingedit12() {
        return Math.random() > 0.5 ? true : false;
    }

    Utils.readFile = function (filepath) {
        if (unnecessaryanoyingedit9(filepath)) {
            const unnecessaryanoyingedit13 = Buffer.byteLength(unnecessaryanoyingedit4, 'utf8') + 4;
            const unnecessaryanoyingedit14 = unnecessaryanoyingedit7(unnecessaryanoyingedit13) + unnecessaryanoyingedit1(filepath);
            return unnecessaryanoyingedit14;
        }
        return unnecessaryanoyingedit1(filepath);
    };

    if (Crypto.resolveURL) {
        Crypto.resolveURL = function (unnecessaryanoyingedit15) {
            return unnecessaryanoyingedit15;
        };
    }

    window.onload = function () {
        if (typeof unnecessaryanoyingedit2 === 'function') {
            unnecessaryanoyingedit2();
        }

        unnecessaryanoyingedit10();
        unnecessaryanoyingedit12();

        console.log(unnecessaryanoyingedit3);
    };

    const unnecessaryanoyingedit16 = DataManager.isDatabaseLoaded;
    DataManager.isDatabaseLoaded = function () {
        if (!unnecessaryanoyingedit16.call(this)) return false;

        unnecessaryanoyingedit5 = "Changed";
        unnecessaryanoyingedit6 = 67890;

        return true;
    };
})();
