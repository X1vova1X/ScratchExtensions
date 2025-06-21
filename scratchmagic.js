(async function(Scratch) {
    // --- Variables & Menus ---
    const vars = {};
    const variables = {};
    const soundPlayerCache = new Map();

    const menus = {
        REORTAB: {
            acceptReporters: false,
            items: ['Redirect', 'New tab', 'Focus']
        },
        infinityselection: {
            acceptReporters: false,
            items: ['Positive', 'Negative']
        }
    };

    // --- Helper Functions ---
    function wait(ms) { return new Promise(r => setTimeout(r, ms)); }

    function textRandomLetter(text) {
        var x = Math.floor(Math.random() * text.length);
        return text[x];
    }
    function subsequenceFromEndFromStart(sequence, at1, at2) {
        var start = sequence.length - 1 - at1;
        var end = at2 + 1;
        return sequence.slice(start, end);
    }
    function subsequenceFromStartFromEnd(sequence, at1, at2) {
        var start = at1;
        var end = sequence.length - 1 - at2 + 1;
        return sequence.slice(start, end);
    }
    function subsequenceFromEndFromEnd(sequence, at1, at2) {
        var start = sequence.length - 1 - at1;
        var end = sequence.length - 1 - at2 + 1;
        return sequence.slice(start, end);
    }
    function subsequenceFirstFromEnd(sequence, at2) {
        var start = 0;
        var end = sequence.length - 1 - at2 + 1;
        return sequence.slice(start, end);
    }
    function subsequenceFromStartLast(sequence, at1) {
        var start = at1;
        var end = sequence.length;
        return sequence.slice(start, end);
    }
    function subsequenceFromEndLast(sequence, at1) {
        var start = sequence.length - 1 - at1;
        var end = sequence.length;
        return sequence.slice(start, end);
    }
    function textCount(haystack, needle) {
        if (needle.length === 0) {
            return haystack.length + 1;
        } else {
            return haystack.split(needle).length - 1;
        }
    }
    function textReplace(haystack, needle, replacement) {
        needle = needle.replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, '\\$1')
                       .replace(/\x08/g, '\\x08');
        return haystack.replace(new RegExp(needle, 'g'), replacement);
    }
    function mathIsPrime(n) {
        if (n == 2 || n == 3) return true;
        if (isNaN(n) || n <= 1 || n % 1 !== 0 || n % 2 === 0 || n % 3 === 0) return false;
        for (var x = 6; x <= Math.sqrt(n) + 1; x += 6) {
            if (n % (x - 1) === 0 || n % (x + 1) === 0) return false;
        }
        return true;
    }

    async function playSoundLink(url, target, runtime) {
        // Try using Scratch's AudioEngine if available
        try {
            if (runtime && runtime.audioEngine && target && target.sprite) {
                // Internal block logic from Better Scratch V1.7
                const audioEngine = runtime.audioEngine;

                const fetchAsArrayBufferWithTimeout = (url) =>
                    new Promise((resolve, reject) => {
                        const xhr = new XMLHttpRequest();
                        let timeout = setTimeout(() => {
                            xhr.abort();
                            reject(new Error("Timed out"));
                        }, 5000);
                        xhr.onload = () => {
                            clearTimeout(timeout);
                            if (xhr.status === 200) {
                                resolve(xhr.response);
                            } else {
                                reject(new Error(`HTTP error ${xhr.status} while fetching ${url}`));
                            }
                        };
                        xhr.onerror = () => {
                            clearTimeout(timeout);
                            reject(new Error(`Failed to request ${url}`));
                        };
                        xhr.responseType = "arraybuffer";
                        xhr.open("GET", url);
                        xhr.send();
                    });

                const decodeSoundPlayer = async (url) => {
                    const cached = soundPlayerCache.get(url);
                    if (cached) {
                        if (cached.sound) return cached.sound;
                        throw cached.error;
                    }
                    try {
                        const arrayBuffer = await fetchAsArrayBufferWithTimeout(url);
                        const soundPlayer = await audioEngine.decodeSoundPlayer({
                            data: { buffer: arrayBuffer },
                        });
                        soundPlayerCache.set(url, { sound: soundPlayer, error: null });
                        return soundPlayer;
                    } catch (e) {
                        soundPlayerCache.set(url, { sound: null, error: e });
                        throw e;
                    }
                };

                const playWithAudioEngine = async (url, target) => {
                    const soundBank = target.sprite.soundBank;
                    let soundPlayer;
                    try {
                        const originalSoundPlayer = await decodeSoundPlayer(url);
                        soundPlayer = originalSoundPlayer.take();
                    } catch (e) {
                        console.warn("Could not fetch audio; falling back to primitive approach", e);
                        return false;
                    }
                    soundBank.addSoundPlayer(soundPlayer);
                    await soundBank.playSound(target, soundPlayer.id);

                    delete soundBank.soundPlayers[soundPlayer.id];
                    soundBank.playerTargets.delete(soundPlayer.id);
                    soundBank.soundEffects.delete(soundPlayer.id);

                    return true;
                };

                if (!(await Scratch.canFetch(url))) throw new Error(`Permission to fetch ${url} denied`);
                const success = await playWithAudioEngine(url, target);
                if (success) return;
            }
        } catch (e) {
            // Fallback
        }
        // Fallback: HTML5 Audio
        new Audio(url).play();
    }

    // --- Block Definitions ---
    const blocks = [];

    blocks.push({
        opcode: "alert",
        blockType: Scratch.BlockType.COMMAND,
        text: "alert [text]",
        arguments: {
            "text": { type: Scratch.ArgumentType.STRING, defaultValue: "Hello, World!" }
        }
    });
    blocks.push({
        opcode: "promptbrowser",
        blockType: Scratch.BlockType.REPORTER,
        text: "prompt [text]",
        arguments: {
            "text": { type: Scratch.ArgumentType.STRING, defaultValue: "" }
        }
    });
    blocks.push({
        opcode: "promptdefaultbrowser",
        blockType: Scratch.BlockType.REPORTER,
        text: "prompt [text] with default [text2]",
        arguments: {
            "text": { type: Scratch.ArgumentType.STRING, defaultValue: "" },
            "text2": { type: Scratch.ArgumentType.STRING, defaultValue: "" }
        }
    });
    blocks.push({
        opcode: "confirmbrowser",
        blockType: Scratch.BlockType.BOOLEAN,
        text: "confirm [text]",
        arguments: {
            "text": { type: Scratch.ArgumentType.STRING, defaultValue: "" }
        }
    });
    blocks.push({
        opcode: "setvar",
        blockType: Scratch.BlockType.COMMAND,
        text: "set magic variable [var] to [text]",
        arguments: {
            "var": { type: Scratch.ArgumentType.STRING, defaultValue: "" },
            "text": { type: Scratch.ArgumentType.STRING, defaultValue: "" }
        }
    });
    blocks.push({
        opcode: "getvar",
        blockType: Scratch.BlockType.REPORTER,
        text: "get magic variable [var]",
        arguments: {
            "var": { type: Scratch.ArgumentType.STRING, defaultValue: "" }
        }
    });
    blocks.push({
        opcode: "consolelog",
        blockType: Scratch.BlockType.COMMAND,
        text: "log [text] to console",
        arguments: {
            "text": { type: Scratch.ArgumentType.STRING, defaultValue: "" }
        }
    });
    blocks.push({
        opcode: "consolewarn",
        blockType: Scratch.BlockType.COMMAND,
        text: "warn [text] to console",
        arguments: {
            "text": { type: Scratch.ArgumentType.STRING, defaultValue: "" }
        }
    });
    blocks.push({
        opcode: "consoleerror",
        blockType: Scratch.BlockType.COMMAND,
        text: "error [text] to console",
        arguments: {
            "text": { type: Scratch.ArgumentType.STRING, defaultValue: "" }
        }
    });
    blocks.push({
        opcode: "executejs",
        blockType: Scratch.BlockType.COMMAND,
        text: "execute [script] as javascript",
        arguments: {
            "script": { type: Scratch.ArgumentType.STRING, defaultValue: "" }
        }
    });
    blocks.push({
        opcode: "commentblock",
        blockType: Scratch.BlockType.COMMAND,
        text: "// [comment]",
        arguments: {
            "comment": { type: Scratch.ArgumentType.STRING, defaultValue: "This is a comment!" }
        }
    });
    blocks.push({
        opcode: "commentreporter",
        blockType: Scratch.BlockType.REPORTER,
        text: "[text] // [comment]",
        arguments: {
            "text": { type: Scratch.ArgumentType.STRING, defaultValue: "This is not a comment!" },
            "comment": { type: Scratch.ArgumentType.STRING, defaultValue: "This is a comment!" }
        }
    });

    /* ---- Wait blocks ---- */
    blocks.push({
        opcode: "waitsomemins",
        blockType: Scratch.BlockType.COMMAND,
        text: "wait [MINS] minutes",
        arguments: {
            "MINS": { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 }
        }
    });
    blocks.push({
        opcode: "waitsomems",
        blockType: Scratch.BlockType.COMMAND,
        text: "wait [NUMBER] ms",
        arguments: {
            "NUMBER": { type: Scratch.ArgumentType.NUMBER, defaultValue: "1000" }
        }
    });
    blocks.push({
        opcode: "urlmanagement",
        blockType: Scratch.BlockType.COMMAND,
        text: "[REORTAB] [URI]",
        arguments: {
            "REORTAB": { type: Scratch.ArgumentType.STRING, menu: "REORTAB" },
            "URI": { type: Scratch.ArgumentType.STRING, defaultValue: "https://example.com" }
        }
    });
    blocks.push({
        opcode: "pagerefresh",
        blockType: Scratch.BlockType.COMMAND,
        text: "Refresh page",
        arguments: {}
    });
    blocks.push({
        opcode: "urlforward",
        blockType: Scratch.BlockType.COMMAND,
        text: "Redirect to forward URL",
        arguments: {}
    });
    blocks.push({
        opcode: "urlback",
        blockType: Scratch.BlockType.COMMAND,
        text: "Redirect to previous URL",
        arguments: {}
    });
    blocks.push({
        opcode: "unfocus",
        blockType: Scratch.BlockType.COMMAND,
        text: "Unfocus",
        arguments: {}
    });

    /* ---- Sound/Popup blocks ---- */
    blocks.push({
        opcode: "playsoundlink",
        blockType: Scratch.BlockType.COMMAND,
        text: "play sound from link [link]",
        arguments: {
            "link": { type: Scratch.ArgumentType.STRING, defaultValue: "" }
        }
    });
    blocks.push({
        opcode: "popup",
        blockType: Scratch.BlockType.COMMAND,
        text: "Popup URL: [URL] with width: [WIDTH] and height: [HEIGHT]",
        arguments: {
            "URL": { type: Scratch.ArgumentType.STRING, defaultValue: "https://example.com" },
            "WIDTH": { type: Scratch.ArgumentType.NUMBER, defaultValue: 400 },
            "HEIGHT": { type: Scratch.ArgumentType.NUMBER, defaultValue: 300 }
        }
    });

    /* ---- Text/String blocks ---- */
    blocks.push({
        opcode: "encodebase64",
        blockType: Scratch.BlockType.REPORTER,
        text: "encode [text] to base64",
        arguments: {
            "text": { type: Scratch.ArgumentType.STRING, defaultValue: "" }
        }
    });
    blocks.push({
        opcode: "decodebase64",
        blockType: Scratch.BlockType.REPORTER,
        text: "decode [text] from base64",
        arguments: {
            "text": { type: Scratch.ArgumentType.STRING, defaultValue: "" }
        }
    });
    blocks.push({
        opcode: "encodeurl",
        blockType: Scratch.BlockType.REPORTER,
        text: "encode [text] to url",
        arguments: {
            "text": { type: Scratch.ArgumentType.STRING, defaultValue: "" }
        }
    });
    blocks.push({
        opcode: "decodeurl",
        blockType: Scratch.BlockType.REPORTER,
        text: "decode [text] from url",
        arguments: {
            "text": { type: Scratch.ArgumentType.STRING, defaultValue: "" }
        }
    });
    blocks.push({
        opcode: "letternumberintext",
        blockType: Scratch.BlockType.REPORTER,
        text: "get letter # [1] in [2]",
        arguments: {
            "1": { type: Scratch.ArgumentType.STRING, defaultValue: "" },
            "2": { type: Scratch.ArgumentType.STRING, defaultValue: "" }
        }
    });
    blocks.push({
        opcode: "letternumberfromendintext",
        blockType: Scratch.BlockType.REPORTER,
        text: "get letter # from end [1] in [2]",
        arguments: {
            "1": { type: Scratch.ArgumentType.STRING, defaultValue: "" },
            "2": { type: Scratch.ArgumentType.STRING, defaultValue: "" }
        }
    });
    blocks.push({
        opcode: "firstletterintext",
        blockType: Scratch.BlockType.REPORTER,
        text: "get first letter in [1]",
        arguments: {
            "1": { type: Scratch.ArgumentType.STRING, defaultValue: "" }
        }
    });
    blocks.push({
        opcode: "lastletterintext",
        blockType: Scratch.BlockType.REPORTER,
        text: "get last letter in [1]",
        arguments: {
            "1": { type: Scratch.ArgumentType.STRING, defaultValue: "" }
        }
    });
    blocks.push({
        opcode: "randomletterintext",
        blockType: Scratch.BlockType.REPORTER,
        text: "get random letter in [1]",
        arguments: {
            "1": { type: Scratch.ArgumentType.STRING, defaultValue: "" }
        }
    });
    blocks.push({
        opcode: "substringtwiceletternumber",
        blockType: Scratch.BlockType.REPORTER,
        text: "get substring from letter # [1] to letter # [2] in [3]",
        arguments: {
            "1": { type: Scratch.ArgumentType.STRING, defaultValue: "" },
            "2": { type: Scratch.ArgumentType.STRING, defaultValue: "" },
            "3": { type: Scratch.ArgumentType.STRING, defaultValue: "" }
        }
    });
    blocks.push({
        opcode: "substringletternumberlastletternumber",
        blockType: Scratch.BlockType.REPORTER,
        text: "get substring from letter # from end [1] to letter # [2] in [3]",
        arguments: {
            "1": { type: Scratch.ArgumentType.STRING, defaultValue: "" },
            "2": { type: Scratch.ArgumentType.STRING, defaultValue: "" },
            "3": { type: Scratch.ArgumentType.STRING, defaultValue: "" }
        }
    });
    blocks.push({
        opcode: "substringletternumberletternumberlast",
        blockType: Scratch.BlockType.REPORTER,
        text: "get substring from letter # [1] to letter # from end [2] in [3]",
        arguments: {
            "1": { type: Scratch.ArgumentType.STRING, defaultValue: "" },
            "2": { type: Scratch.ArgumentType.STRING, defaultValue: "" },
            "3": { type: Scratch.ArgumentType.STRING, defaultValue: "" }
        }
    });
    blocks.push({
        opcode: "substringtwiceletternumberfromend",
        blockType: Scratch.BlockType.REPORTER,
        text: "get substring from letter # from end [1] to letter # from end [2] in [3]",
        arguments: {
            "1": { type: Scratch.ArgumentType.STRING, defaultValue: "" },
            "2": { type: Scratch.ArgumentType.STRING, defaultValue: "" },
            "3": { type: Scratch.ArgumentType.STRING, defaultValue: "" }
        }
    });
    blocks.push({
        opcode: "substringfirstletterletternumber",
        blockType: Scratch.BlockType.REPORTER,
        text: "get substring from first letter to letter # [2] in [3]",
        arguments: {
            "2": { type: Scratch.ArgumentType.STRING, defaultValue: "" },
            "3": { type: Scratch.ArgumentType.STRING, defaultValue: "" }
        }
    });
    blocks.push({
        opcode: "substringfirstletterletternumberlast",
        blockType: Scratch.BlockType.REPORTER,
        text: "get substring from first letter to letter # from end [2] in [3]",
        arguments: {
            "2": { type: Scratch.ArgumentType.STRING, defaultValue: "" },
            "3": { type: Scratch.ArgumentType.STRING, defaultValue: "" }
        }
    });
    blocks.push({
        opcode: "substringletternumberlastletter",
        blockType: Scratch.BlockType.REPORTER,
        text: "get substring from letter # [2] to last letter in [3]",
        arguments: {
            "2": { type: Scratch.ArgumentType.STRING, defaultValue: "" },
            "3": { type: Scratch.ArgumentType.STRING, defaultValue: "" }
        }
    });
    blocks.push({
        opcode: "substringletternumberfromendlastletter",
        blockType: Scratch.BlockType.REPORTER,
        text: "get substring from letter # from end [2] to last letter in [3]",
        arguments: {
            "2": { type: Scratch.ArgumentType.STRING, defaultValue: "" },
            "3": { type: Scratch.ArgumentType.STRING, defaultValue: "" }
        }
    });
    blocks.push({
        opcode: "touppercase",
        blockType: Scratch.BlockType.REPORTER,
        text: "[1] to uppercase",
        arguments: {
            "1": { type: Scratch.ArgumentType.STRING, defaultValue: "" }
        }
    });
    blocks.push({
        opcode: "tolowercase",
        blockType: Scratch.BlockType.REPORTER,
        text: "[1] to lowercase",
        arguments: {
            "1": { type: Scratch.ArgumentType.STRING, defaultValue: "" }
        }
    });
    blocks.push({
        opcode: "totitlecase",
        blockType: Scratch.BlockType.REPORTER,
        text: "[TEXT] to title case",
        arguments: {
            "TEXT": { type: Scratch.ArgumentType.STRING, defaultValue: "hello, world!" }
        }
    });
    blocks.push({
        opcode: "tosentencecase",
        blockType: Scratch.BlockType.REPORTER,
        text: "[TEXT] to sentence case",
        arguments: {
            "TEXT": { type: Scratch.ArgumentType.STRING, defaultValue: "hello, World!" }
        }
    });
    blocks.push({
        opcode: "jointhreethings",
        blockType: Scratch.BlockType.REPORTER,
        text: "join [ONE] [TWO] [THREE]",
        arguments: {
            "ONE": { type: Scratch.ArgumentType.STRING, defaultValue: "" },
            "TWO": { type: Scratch.ArgumentType.STRING, defaultValue: "" },
            "THREE": { type: Scratch.ArgumentType.STRING, defaultValue: "" }
        }
    });
    blocks.push({
        opcode: "countsomethingintext",
        blockType: Scratch.BlockType.REPORTER,
        text: "count [1] in [2]",
        arguments: {
            "1": { type: Scratch.ArgumentType.STRING, defaultValue: "" },
            "2": { type: Scratch.ArgumentType.STRING, defaultValue: "" }
        }
    });
    blocks.push({
        opcode: "wordsintext",
        blockType: Scratch.BlockType.REPORTER,
        text: "amount of words in [TEXT]",
        arguments: {
            "TEXT": { type: Scratch.ArgumentType.STRING, defaultValue: "Hello, World!" }
        }
    });
    blocks.push({
        opcode: "firstoccurrencetext",
        blockType: Scratch.BlockType.REPORTER,
        text: "find first occurrence of text [1] in [2]",
        arguments: {
            "1": { type: Scratch.ArgumentType.STRING, defaultValue: "" },
            "2": { type: Scratch.ArgumentType.STRING, defaultValue: "" }
        }
    });
    blocks.push({
        opcode: "lastoccurrencetext",
        blockType: Scratch.BlockType.REPORTER,
        text: "find last occurrence of text [1] in [2]",
        arguments: {
            "1": { type: Scratch.ArgumentType.STRING, defaultValue: "" },
            "2": { type: Scratch.ArgumentType.STRING, defaultValue: "" }
        }
    });
    blocks.push({
        opcode: "replacesmthwithsmthintext",
        blockType: Scratch.BlockType.REPORTER,
        text: "replace [1] with [2] in [3]",
        arguments: {
            "1": { type: Scratch.ArgumentType.STRING, defaultValue: "" },
            "2": { type: Scratch.ArgumentType.STRING, defaultValue: "" },
            "3": { type: Scratch.ArgumentType.STRING, defaultValue: "" }
        }
    });
    blocks.push({
        opcode: "reversetext2",
        blockType: Scratch.BlockType.REPORTER,
        text: "reverse [1]",
        arguments: {
            "1": { type: Scratch.ArgumentType.STRING, defaultValue: "" }
        }
    });
    blocks.push({
        opcode: "newlinechar",
        blockType: Scratch.BlockType.REPORTER,
        text: "new line",
        arguments: {}
    });
    blocks.push({
        opcode: "substringtext",
        blockType: Scratch.BlockType.REPORTER,
        text: "Substring of [TEXT] from [START] to [END]",
        arguments: {
            "TEXT": { type: Scratch.ArgumentType.STRING, defaultValue: "Hello, World!" },
            "START": { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
            "END": { type: Scratch.ArgumentType.NUMBER, defaultValue: 5 }
        }
    });
    blocks.push({
        opcode: "trimwhitespacefromtext",
        blockType: Scratch.BlockType.REPORTER,
        text: "Trim whitespace from [TEXT]",
        arguments: {
            "TEXT": { type: Scratch.ArgumentType.STRING, defaultValue: "  Hello, World!  " }
        }
    });
    blocks.push({
        opcode: "trimspacesboth",
        blockType: Scratch.BlockType.REPORTER,
        text: "trim spaces from both sides in [1]",
        arguments: {
            "1": { type: Scratch.ArgumentType.STRING, defaultValue: "" }
        }
    });
    blocks.push({
        opcode: "trimspacesleft",
        blockType: Scratch.BlockType.REPORTER,
        text: "trim spaces from left side in [1]",
        arguments: {
            "1": { type: Scratch.ArgumentType.STRING, defaultValue: "" }
        }
    });
    blocks.push({
        opcode: "trimspacesright",
        blockType: Scratch.BlockType.REPORTER,
        text: "trim spaces from right side in [1]",
        arguments: {
            "1": { type: Scratch.ArgumentType.STRING, defaultValue: "" }
        }
    });

    /* ---- Math/Number/Constant blocks ---- */
    blocks.push({
        opcode: "pinumber",
        blockType: Scratch.BlockType.REPORTER,
        text: "π",
        arguments: {}
    });
    blocks.push({
        opcode: "enumber",
        blockType: Scratch.BlockType.REPORTER,
        text: "e",
        arguments: {}
    });
    blocks.push({
        opcode: "sqrt2",
        blockType: Scratch.BlockType.REPORTER,
        text: "square root of 2",
        arguments: {}
    });
    blocks.push({
        opcode: "sqrt12",
        blockType: Scratch.BlockType.REPORTER,
        text: "square root of 1/2",
        arguments: {}
    });
    blocks.push({
        opcode: "infinitynumber",
        blockType: Scratch.BlockType.REPORTER,
        text: "∞",
        arguments: {}
    });
    blocks.push({
        opcode: "infinity",
        blockType: Scratch.BlockType.REPORTER,
        text: "[POSORNEG] Infinity",
        arguments: {
            "POSORNEG": { type: Scratch.ArgumentType.STRING, menu: "infinityselection" }
        }
    });
    blocks.push({
        opcode: "nullblock",
        blockType: Scratch.BlockType.REPORTER,
        text: "null",
        arguments: {}
    });
    blocks.push({
        opcode: "msfrom",
        blockType: Scratch.BlockType.REPORTER,
        text: "time (ms) since 1970",
        arguments: {}
    });
    blocks.push({
        opcode: "unixtimestamp",
        blockType: Scratch.BlockType.REPORTER,
        text: "UNIX timestamp",
        arguments: {}
    });

    /* ---- Boolean/Logic blocks ---- */
    blocks.push({
        opcode: "threeequals",
        blockType: Scratch.BlockType.BOOLEAN,
        text: "[1] === [2]",
        arguments: {
            "1": { type: Scratch.ArgumentType.STRING, defaultValue: "" },
            "2": { type: Scratch.ArgumentType.STRING, defaultValue: "" }
        }
    });
    blocks.push({
        opcode: "notequals",
        blockType: Scratch.BlockType.BOOLEAN,
        text: "[ONE]≠[TWO]",
        arguments: {
            "ONE": { type: Scratch.ArgumentType.STRING },
            "TWO": { type: Scratch.ArgumentType.STRING }
        }
    });
    blocks.push({
        opcode: "twoequalsandmark",
        blockType: Scratch.BlockType.BOOLEAN,
        text: "[1] !== [2]",
        arguments: {
            "1": { type: Scratch.ArgumentType.STRING, defaultValue: "" },
            "2": { type: Scratch.ArgumentType.STRING, defaultValue: "" }
        }
    });
    blocks.push({
        opcode: "randombool",
        blockType: Scratch.BlockType.BOOLEAN,
        text: "random boolean",
        arguments: {}
    });
    blocks.push({
        opcode: "strtobool",
        blockType: Scratch.BlockType.BOOLEAN,
        text: "[STR] to boolean",
        arguments: {
            "STR": { type: Scratch.ArgumentType.STRING }
        }
    });
    blocks.push({
        opcode: "truebool",
        blockType: Scratch.BlockType.BOOLEAN,
        text: "true",
        arguments: {}
    });
    blocks.push({
        opcode: "falsebool",
        blockType: Scratch.BlockType.BOOLEAN,
        text: "false",
        arguments: {}
    });
    blocks.push({
        opcode: "iseven",
        blockType: Scratch.BlockType.BOOLEAN,
        text: "is [number] even",
        arguments: {
            "number": { type: Scratch.ArgumentType.NUMBER, defaultValue: "" }
        }
    });
    blocks.push({
        opcode: "isodd",
        blockType: Scratch.BlockType.BOOLEAN,
        text: "is [number] odd",
        arguments: {
            "number": { type: Scratch.ArgumentType.NUMBER, defaultValue: "" }
        }
    });
    blocks.push({
        opcode: "isprime",
        blockType: Scratch.BlockType.BOOLEAN,
        text: "is [number] prime",
        arguments: {
            "number": { type: Scratch.ArgumentType.NUMBER, defaultValue: "" }
        }
    });
    blocks.push({
        opcode: "iswhole",
        blockType: Scratch.BlockType.BOOLEAN,
        text: "is [number] whole",
        arguments: {
            "number": { type: Scratch.ArgumentType.NUMBER, defaultValue: "" }
        }
    });
    blocks.push({
        opcode: "ispositive",
        blockType: Scratch.BlockType.BOOLEAN,
        text: "is [number] positive",
        arguments: {
            "number": { type: Scratch.ArgumentType.NUMBER, defaultValue: "" }
        }
    });
    blocks.push({
        opcode: "isnegative",
        blockType: Scratch.BlockType.BOOLEAN,
        text: "is [number] negative",
        arguments: {
            "number": { type: Scratch.ArgumentType.NUMBER, defaultValue: "" }
        }
    });
    blocks.push({
        opcode: "isdivisibleby",
        blockType: Scratch.BlockType.BOOLEAN,
        text: "is [number] divisible by [number2]",
        arguments: {
            "number": { type: Scratch.ArgumentType.NUMBER, defaultValue: "" },
            "number2": { type: Scratch.ArgumentType.NUMBER, defaultValue: "" }
        }
    });
    blocks.push({
        opcode: "lessorequal",
        blockType: Scratch.BlockType.BOOLEAN,
        text: "[ONE]≤[TWO]",
        arguments: {
            "ONE": { type: Scratch.ArgumentType.NUMBER, defaultValue: "1" },
            "TWO": { type: Scratch.ArgumentType.NUMBER, defaultValue: "2" }
        }
    });
    blocks.push({
        opcode: "greaterorequal",
        blockType: Scratch.BlockType.BOOLEAN,
        text: "[ONE]≥[TWO]",
        arguments: {
            "ONE": { type: Scratch.ArgumentType.NUMBER, defaultValue: 2 },
            "TWO": { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 }
        }
    });
    blocks.push({
        opcode: "focused",
        blockType: Scratch.BlockType.BOOLEAN,
        text: "focused?",
        arguments: {}
    });
    blocks.push({
        opcode: "isleapyear",
        blockType: Scratch.BlockType.BOOLEAN,
        text: "is leap year?",
        arguments: {}
    });
    blocks.push({
        opcode: "isaleapyear",
        blockType: Scratch.BlockType.BOOLEAN,
        text: "is [YEAR] a leap year?",
        arguments: {
            "YEAR": { type: Scratch.ArgumentType.NUMBER, defaultValue: 2024 }
        }
    });
    blocks.push({
        opcode: "endWith",
        blockType: Scratch.BlockType.BOOLEAN,
        text: "[TEXT] ends with [SUFFIX]?",
        arguments: {
            "TEXT": { type: Scratch.ArgumentType.STRING, defaultValue: "Hello, World!" },
            "SUFFIX": { type: Scratch.ArgumentType.STRING, defaultValue: "d!" }
        }
    });
    blocks.push({
        opcode: "startWith",
        blockType: Scratch.BlockType.BOOLEAN,
        text: "[TEXT] starts with [PREFIX]?",
        arguments: {
            "TEXT": { type: Scratch.ArgumentType.STRING, defaultValue: "Hello, World!" },
            "PREFIX": { type: Scratch.ArgumentType.STRING, defaultValue: "He" }
        }
    });
    blocks.push({
        opcode: "startWithIgnoreCase",
        blockType: Scratch.BlockType.BOOLEAN,
        text: "[TEXT] starts with [PREFIX] (ignore case)?",
        arguments: {
            "TEXT": { type: Scratch.ArgumentType.STRING, defaultValue: "Hello, World!" },
            "PREFIX": { type: Scratch.ArgumentType.STRING, defaultValue: "he" }
        }
    });
    blocks.push({
        opcode: "endWithIgnoreCase",
        blockType: Scratch.BlockType.BOOLEAN,
        text: "[TEXT] ends with [SUFFIX] (ignore case)?",
        arguments: {
            "TEXT": { type: Scratch.ArgumentType.STRING, defaultValue: "Hello, World!" },
            "SUFFIX": { type: Scratch.ArgumentType.STRING, defaultValue: "D!" }
        }
    });

    /* ---- Conversion/Utility blocks ---- */
    blocks.push({
        opcode: "booltonum",
        blockType: Scratch.BlockType.REPORTER,
        text: "[BOOL] to number",
        arguments: {
            "BOOL": { type: Scratch.ArgumentType.BOOLEAN }
        }
    });
    blocks.push({
        opcode: "booltostr",
        blockType: Scratch.BlockType.REPORTER,
        text: "[BOOL] to string",
        arguments: {
            "BOOL": { type: Scratch.ArgumentType.BOOLEAN }
        }
    });
    blocks.push({
        opcode: "iftruethen",
        blockType: Scratch.BlockType.REPORTER,
        text: "if [1] is true, return [2] else return [3]",
        arguments: {
            "1": { type: Scratch.ArgumentType.BOOLEAN },
            "2": { type: Scratch.ArgumentType.STRING, defaultValue: "" },
            "3": { type: Scratch.ArgumentType.STRING, defaultValue: "" }
        }
    });
    blocks.push({
        opcode: "ifelsereporter",
        blockType: Scratch.BlockType.REPORTER,
        text: "if [BOOL] return [ONE] else [TWO]",
        arguments: {
            "BOOL": { type: Scratch.ArgumentType.BOOLEAN },
            "ONE": { type: Scratch.ArgumentType.STRING, defaultValue: "True!" },
            "TWO": { type: Scratch.ArgumentType.STRING, defaultValue: "False!" }
        }
    });

    /* ---- Event blocks ---- */
    blocks.push({
        opcode: "onfocushat",
        blockType: Scratch.BlockType.EVENT,
        text: "when focused",
        arguments: {}
    });

    // --- Extension Class ---
    class Extension {
        getInfo() {
            return {
                id: "scratchmagic",
                name: "Scratch Magic",
                color1: "#983acb",
                color2: "#0088ff",
                blocks: blocks,
                menus: menus
            };
        }
    }

    // --- BLOCK IMPLEMENTATIONS ---

    // COMMANDS
    Extension.prototype["playsoundlink"] = async function(args, util) {
        await playSoundLink(args["link"], util.target, Scratch.vm.runtime);
    };
    Extension.prototype["playsoundlink2"] = async function(args, util) {
        await playSoundLink(args["LINK"], util.target, Scratch.vm.runtime);
    };
    Extension.prototype["popup"] = async function(args, util) {
        window.open(args.URL, 'popup', `width=${args.WIDTH},height=${args.HEIGHT}`);
    };
    Extension.prototype["alert"] = async function(args, util) {
        alert(args["text"]);
    };
    Extension.prototype["alert2"] = async function(args, util) {
        alert(args["TEXT"]);
    };
    Extension.prototype["consolewarn"] = async function(args, util) {
        console.warn(args["text"]);
    };
    Extension.prototype["consolewarn2"] = async function(args, util) {
        console.warn(args["TEXT"]);
    };
    Extension.prototype["consoleerror"] = async function(args, util) {
        console.error(args["text"]);
    };
    Extension.prototype["consoleerror2"] = async function(args, util) {
        console.error(args["TEXT"]);
    };
    Extension.prototype["consolelog"] = async function(args, util) {
        console.log(args["text"]);
    };
    Extension.prototype["consolelog2"] = async function(args, util) {
        console.log(args["TEXT"]);
    };
    Extension.prototype["executejs"] = async function(args, util) {
        eval(args["script"]);
    };
    Extension.prototype["jsblock"] = async function(args, util) {
        eval(args["CODE"]);
    };
    Extension.prototype["setvar"] = async function(args, util) {
        vars[args["var"]] = args["text"];
    };
    Extension.prototype["redirectbrowser"] = async function(args, util) {
        window.location.href = args["url"];
    };
    Extension.prototype["opennewtabbrowser"] = async function(args, util) {
        window.open(args["url"], '_blank');
    };
    Extension.prototype["urlmanagement"] = async function(args, util) {
        if (args["REORTAB"] === "Redirect") {
            window.location.href = args.URI;
        } else if (args["REORTAB"] === "New tab") {
            window.open(args.URI, '_blank');
        } else if (args["REORTAB"] === "Focus") {
            const iframe = document.createElement('iframe');
            iframe.src = args.URI;
            iframe.className = "fullscreen-iframe";
            iframe.style.position = "fixed";
            iframe.style.top = "0";
            iframe.style.left = "0";
            iframe.style.width = "100vw";
            iframe.style.height = "100vh";
            iframe.style.border = "none";
            iframe.style.zIndex = "9999";
            document.body.appendChild(iframe);
            if (iframe.requestFullscreen) iframe.requestFullscreen();
            document.addEventListener('fullscreenchange', () => !document.fullscreenElement && (iframe.remove(), variables["Focused"] = false));
            Scratch.vm.runtime.startHats(`${Extension.prototype.getInfo().id}_onfocushat`);
            variables['Focused'] = true;
        }
    };
    Extension.prototype["removelocal"] = async function(args, util) {
        localStorage.removeItem(args.STORAGE);
    };
    Extension.prototype["store"] = async function(args, util) {
        localStorage.setItem(args["STORAGE"], args["VALUE"]);
    };
    Extension.prototype["pagerefresh"] = async function(args, util) {
        location.reload();
    };
    Extension.prototype["urlforward"] = async function(args, util) {
        history.forward();
    };
    Extension.prototype["urlback"] = async function(args, util) {
        history.back();
    };
    Extension.prototype["unfocus"] = async function(args, util) {
        document.querySelector('iframe.fullscreen-iframe')?.remove();
        variables['Focused'] = false;
    };
    Extension.prototype["commentblock"] = async function(args, util) { };
    Extension.prototype["commentblock2"] = async function(args, util) { };
    Extension.prototype["waitsomemins"] = async function(args, util) {
        await wait(args["MINS"] * 60000);
    };
    Extension.prototype["waitsomems"] = async function(args, util) {
        await wait(args["NUMBER"]);
    };

    // REPORTERS
    Extension.prototype["promptbrowser"] = async function(args, util) {
        return prompt(args["text"]);
    };
    Extension.prototype["prompt"] = async function(args, util) {
        return prompt(args["TEXT"]);
    };
    Extension.prototype["promptdefaultbrowser"] = async function(args, util) {
        return prompt(args["text"], args["text2"]);
    };
    Extension.prototype["promptwithdefault"] = async function(args, util) {
        return prompt(args.TEXT, args.DEFAULT);
    };
    Extension.prototype["encodebase64"] = async function(args, util) {
        return btoa(args["text"]);
    };
    Extension.prototype["decodebase64"] = async function(args, util) {
        return atob(args["text"]);
    };
    Extension.prototype["encodeurl"] = async function(args, util) {
        return encodeURIComponent(args["text"]);
    };
    Extension.prototype["decodeurl"] = async function(args, util) {
        return decodeURIComponent(args["text"]);
    };
    Extension.prototype["getvar"] = async function(args, util) {
        return vars[args["var"]];
    };
    Extension.prototype["letternumberintext"] = async function(args, util) {
        return args["1"].charAt(args["2"] - 1);
    };
    Extension.prototype["letternumberfromendintext"] = async function(args, util) {
        return args["1"].slice(-args["2"]).charAt(0);
    };
    Extension.prototype["firstletterintext"] = async function(args, util) {
        return args["1"].charAt(0);
    };
    Extension.prototype["lastletterintext"] = async function(args, util) {
        return args["1"].slice(-1);
    };
    Extension.prototype["randomletterintext"] = async function(args, util) {
        return textRandomLetter(args["1"]);
    };
    Extension.prototype["substringtwiceletternumber"] = async function(args, util) {
        return args["3"].slice(args["1"] - 1, args["2"]);
    };
    Extension.prototype["substringletternumberlastletternumber"] = async function(args, util) {
        return subsequenceFromEndFromStart(args["3"], args["1"] - 1, args["2"] - 1);
    };
    Extension.prototype["substringletternumberletternumberlast"] = async function(args, util) {
        return subsequenceFromStartFromEnd(args["3"], args["1"] - 1, args["2"] - 1);
    };
    Extension.prototype["substringtwiceletternumberfromend"] = async function(args, util) {
        return subsequenceFromEndFromEnd(args["3"], args["1"] - 1, args["2"] - 1);
    };
    Extension.prototype["substringfirstletterletternumber"] = async function(args, util) {
        return args["3"].slice(0, args["2"]);
    };
    Extension.prototype["substringfirstletterletternumberlast"] = async function(args, util) {
        return subsequenceFirstFromEnd(args["3"], args["2"] - 1);
    };
    Extension.prototype["substringletternumberlastletter"] = async function(args, util) {
        return subsequenceFromStartLast(args["3"], args["2"] - 1);
    };
    Extension.prototype["substringletternumberfromendlastletter"] = async function(args, util) {
        return subsequenceFromEndLast(args["3"], args["2"] - 1);
    };
    Extension.prototype["touppercase"] = async function(args, util) {
        return args["1"].toUpperCase();
    };
    Extension.prototype["uppercasetext"] = async function(args, util) {
        return String(args.TEXT).toUpperCase();
    };
    Extension.prototype["tolowercase"] = async function(args, util) {
        return args["1"].toLowerCase();
    };
    Extension.prototype["lowercasetext"] = async function(args, util) {
        return String(args.TEXT).toLowerCase();
    };
    Extension.prototype["totitlecase"] = async function(args, util) {
        return String(args.TEXT).toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };
    Extension.prototype["tosentencecase"] = async function(args, util) {
        return String(args.TEXT).charAt(0).toUpperCase() + String(args.TEXT).slice(1).toLowerCase();
    };
    Extension.prototype["jointhreethings"] = async function(args, util) {
        return (args["ONE"] + args["TWO"] + args["THREE"]);
    };
    Extension.prototype["countsomethingintext"] = async function(args, util) {
        return textCount(args["2"], args["1"]);
    };
    Extension.prototype["wordsintext"] = async function(args, util) {
        return String(args.TEXT).split(/\s+/).filter(word => word !== '').length;
    };
    Extension.prototype["firstoccurrencetext"] = async function(args, util) {
        return args["1"].indexOf(args["2"]) + 1;
    };
    Extension.prototype["lastoccurrencetext"] = async function(args, util) {
        return args["1"].lastIndexOf(args["2"]) + 1;
    };
    Extension.prototype["replacesmthwithsmthintext"] = async function(args, util) {
        return textReplace(args["3"], args["1"], args["2"]);
    };
    Extension.prototype["replacetext"] = async function(args, util) {
        return String(args.TEXT).replace(String(args.OLD), String(args.NEW));
    };
    Extension.prototype["reversetext"] = async function(args, util) {
        return String(args.TEXT).split('').reverse().join('');
    };
    Extension.prototype["reversetext2"] = async function(args, util) {
        return args["1"].split('').reverse().join('');
    };
    Extension.prototype["newlinechar"] = async function(args, util) {
        return "\n";
    };
    Extension.prototype["pinumber"] = async function(args, util) {
        return Math.PI;
    };
    Extension.prototype["pi"] = async function(args, util) {
        return '3.14159265359';
    };
    Extension.prototype["enumber"] = async function(args, util) {
        return Math.E;
    };
    Extension.prototype["eiler"] = async function(args, util) {
        return '2.71828182846';
    };
    Extension.prototype["sqrt2"] = async function(args, util) {
        return Math.SQRT2;
    };
    Extension.prototype["sqrt12"] = async function(args, util) {
        return Math.SQRT1_2;
    };
    Extension.prototype["infinitynumber"] = async function(args, util) {
        return Infinity;
    };
    Extension.prototype["infinity"] = async function(args, util) {
        if (args["POSORNEG"] === "Positive") {
            return 'Infinity';
        } else {
            return '-Infinity';
        }
    };
    Extension.prototype["nullnum"] = async function(args, util) {
        return null;
    };
    Extension.prototype["nullblock"] = async function(args, util) {
        return 'null';
    };
    Extension.prototype["getstorage"] = async function(args, util) {
        return localStorage.getItem(args["STORAGE"]);
    };
    Extension.prototype["fetchtourl"] = async function(args, util) {
        return fetch(args.URL).then(response => response.text()).then(text => text).catch(error => alert('Fetch failed: ' + error));
    };
    Extension.prototype["msfrom"] = async function(args, util) {
        return Date.now();
    };
    Extension.prototype["unixtimestamp"] = async function(args, util) {
        return Math.floor(Date.now() / 1000);
    };
    Extension.prototype["substringtext"] = async function(args, util) {
        const start = Math.max(0, args.START);
        const end = Math.min(args.TEXT.length, args.END);
        return String(args.TEXT).substring(start, end);
    };
    Extension.prototype["trimwhitespacefromtext"] = async function(args, util) {
        return String(args.TEXT).trim();
    };
    Extension.prototype["trimspacesboth"] = async function(args, util) {
        return args["1"].trim();
    };
    Extension.prototype["trimspacesleft"] = async function(args, util) {
        return args["1"].replace(/^[\s\xa0]+/, '');
    };
    Extension.prototype["trimspacesright"] = async function(args, util) {
        return args["1"].replace(/[\s\xa0]+$/, '');
    };
    Extension.prototype["booltonum"] = async function(args, util) {
        return args["BOOL"] ? 1 : 0;
    };
    Extension.prototype["booltostr"] = async function(args, util) {
        return String(args["BOOL"]);
    };
    Extension.prototype["iftruethen"] = async function(args, util) {
        return args["1"] ? args["2"] : args["3"];
    };
    Extension.prototype["ifelsereporter"] = async function(args, util) {
        return args["BOOL"] ? args["ONE"] : args["TWO"];
    };
    Extension.prototype["commentreporter"] = async function(args, util) {
        return args["text"];
    };
    Extension.prototype["strandcomment"] = async function(args, util) {
        return args["TEXTORNUM"];
    };

    // BOOLEANS
    Extension.prototype["confirmbrowser"] = async function(args, util) {
        return confirm(args["text"]);
    };
    Extension.prototype["confirm"] = async function(args, util) {
        return confirm(args["TEXT"]);
    };
    Extension.prototype["threeequals"] = async function(args, util) {
        return args["1"] === args["2"];
    };
    Extension.prototype["equequequ"] = async function(args, util) {
        return args["DEYONE"] === args["DEYTWO"];
    };
    Extension.prototype["notequals"] = async function(args, util) {
        return !(args["ONE"] == args["TWO"]);
    };
    Extension.prototype["twoequalsandmark"] = async function(args, util) {
        return args["1"] !== args["2"];
    };
    Extension.prototype["randombool"] = async function(args, util) {
        return Math.round(Math.random()) === 1;
    };
    Extension.prototype["trueorfalserandom"] = async function(args, util) {
        return Math.floor(Math.random() * 2) === 1;
    };
    Extension.prototype["strtobool"] = async function(args, util) {
        return Boolean(args["STR"]);
    };
    Extension.prototype["boolandcomment"] = async function(args, util) {
        return args["BOOLEAN"];
    };
    Extension.prototype["truebool"] = async function(args, util) {
        return true;
    };
    Extension.prototype["trueblock"] = async function(args, util) {
        return true;
    };
    Extension.prototype["falsebool"] = async function(args, util) {
        return false;
    };
    Extension.prototype["falseblock"] = async function(args, util) {
        return false;
    };
    Extension.prototype["iseven"] = async function(args, util) {
        return args["number"] % 2 === 0;
    };
    Extension.prototype["isodd"] = async function(args, util) {
        return args["number"] % 2 === 1;
    };
    Extension.prototype["isprime"] = async function(args, util) {
        return mathIsPrime(args["number"]);
    };
    Extension.prototype["iswhole"] = async function(args, util) {
        return args["number"] % 1 === 0;
    };
    Extension.prototype["ispositive"] = async function(args, util) {
        return args["number"] > 0;
    };
    Extension.prototype["isnegative"] = async function(args, util) {
        return args["number"] < 0;
    };
    Extension.prototype["isdivisibleby"] = async function(args, util) {
        return args["number"] % args["number2"] === 0;
    };
    Extension.prototype["deyxordey"] = async function(args, util) {
        return Boolean(args["DEYONE"] ^ args["DEYTWO"]);
    };
    Extension.prototype["lessorequal"] = async function(args, util) {
        return (args["ONE"] == args["TWO"]) || (args["ONE"] < args["TWO"]);
    };
    Extension.prototype["greaterorequal"] = async function(args, util) {
        return (args["ONE"] == args["TWO"]) || (args["ONE"] > args["TWO"]);
    };
    Extension.prototype["jsboolean"] = async function(args, util) {
        return eval(args.CODE);
    };
    Extension.prototype["focused"] = async function(args, util) {
        return variables['Focused'];
    };
    Extension.prototype["isleapyear"] = async function(args, util) {
        return ((new Date(new Date(Date.now()).getYear(), 1, 29)).getDate() === 29);
    };
    Extension.prototype["isaleapyear"] = async function(args, util) {
        return (args.YEAR % 4 === 0 && args.YEAR % 100 !== 0) || args.YEAR % 400 === 0;
    };
    Extension.prototype["endWith"] = async function(args, util) {
        return String(args.TEXT).endsWith(String(args.SUFFIX));
    };
    Extension.prototype["startWith"] = async function(args, util) {
        return String(args.TEXT).startsWith(String(args.PREFIX));
    };
    Extension.prototype["startWithIgnoreCase"] = async function(args, util) {
        const text = String(args.TEXT).toLowerCase();
        const prefix = String(args.PREFIX).toLowerCase();
        return text.startsWith(prefix);
    };
    Extension.prototype["endWithIgnoreCase"] = async function(args, util) {
        const text = String(args.TEXT).toLowerCase();
        const suffix = String(args.SUFFIX).toLowerCase();
        return text.endsWith(suffix);
    };

    // EVENT
    Extension.prototype["onfocushat"] = async function(args, util) {};

    // Register the extension
    Scratch.extensions.register(new Extension());
})(Scratch);
