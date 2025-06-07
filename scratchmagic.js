(async function(Scratch) {
  const blocks = [];
  const vars = {};
  const menus = {};

  function wait(m) {
    return new Promise((r) => setTimeout(() => r(), m));
  }

  

  class Extension {
    getInfo() {
      return {
        "id": "scratchmagic",
        "name": "Scratch Magic",
        "color1": "#983acb",
        "blocks": blocks,
        "menus": menus,
      }
    }
  }
  
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
  var end = sequence.length - 1 + 1;
  return sequence.slice(start, end);
}

function subsequenceFromEndLast(sequence, at1) {
  var start = sequence.length - 1 - at1;
  var end = sequence.length - 1 + 1;
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
  // https://en.wikipedia.org/wiki/Primality_test#Naive_methods
  if (n == 2 || n == 3) {
    return true;
  }
  // False if n is NaN, negative, is 1, or not whole.
  // And false if n is divisible by 2 or 3.
  if (isNaN(n) || n <= 1 || n % 1 !== 0 || n % 2 === 0 || n % 3 === 0) {
    return false;
  }
  // Check all the numbers of form 6k +/- 1, up to sqrt(n).
  for (var x = 6; x <= Math.sqrt(n) + 1; x += 6) {
    if (n % (x - 1) === 0 || n % (x + 1) === 0) {
      return false;
    }
  }
  return true;
}



blocks.push({
  opcode: "scratchmagic_Block_playsoundlink",
  blockType: Scratch.BlockType.COMMAND,
  text: "play sound from link [link]",
  arguments: {
      "link": {
      type: Scratch.ArgumentType.STRING,
      defaultValue: ``
    },

  },
  disableMonitor: false
});
Extension.prototype["scratchmagic_Block_playsoundlink"] = async function(args, util) {
  const localVars = {};
    new Audio(args["link"]).play();

};


blocks.push({
  opcode: "scratchmagic_Block_alertbrowser",
  blockType: Scratch.BlockType.COMMAND,
  text: "alert [text]",
  arguments: {
      "text": {
      type: Scratch.ArgumentType.STRING,
      defaultValue: ``
    },

  },
  disableMonitor: false
});
Extension.prototype["scratchmagic_Block_alertbrowser"] = async function(args, util) {
  const localVars = {};
    alert(args["text"]);

};


blocks.push({
  opcode: "scratchmagic_Block_confirmbrowser",
  blockType: Scratch.BlockType.BOOLEAN,
  text: "confirm [text]",
  arguments: {
      "text": {
      type: Scratch.ArgumentType.STRING,
      defaultValue: ``
    },

  },
  disableMonitor: false
});
Extension.prototype["scratchmagic_Block_confirmbrowser"] = async function(args, util) {
  const localVars = {};
    return confirm(args["text"]);
};


blocks.push({
  opcode: "scratchmagic_Block_promptbrowser",
  blockType: Scratch.BlockType.REPORTER,
  text: "prompt [text]",
  arguments: {
      "text": {
      type: Scratch.ArgumentType.STRING,
      defaultValue: ``
    },

  },
  disableMonitor: false
});
Extension.prototype["scratchmagic_Block_promptbrowser"] = async function(args, util) {
  const localVars = {};
    return prompt(args["text"]);
};


blocks.push({
  opcode: "scratchmagic_Block_promptdefaultbrowser",
  blockType: Scratch.BlockType.REPORTER,
  text: "prompt [text] with default [text2]",
  arguments: {
      "text": {
      type: Scratch.ArgumentType.STRING,
      defaultValue: ``
    },
  "text2": {
      type: Scratch.ArgumentType.STRING,
      defaultValue: ``
    },

  },
  disableMonitor: false
});
Extension.prototype["scratchmagic_Block_promptdefaultbrowser"] = async function(args, util) {
  const localVars = {};
    return prompt(args["text"], args["text2"]);
};


blocks.push({
  opcode: "scratchmagic_Block_redirectbrowser",
  blockType: Scratch.BlockType.COMMAND,
  text: "redirect to [url]",
  arguments: {
      "url": {
      type: Scratch.ArgumentType.STRING,
      defaultValue: `https://connor.ct.ws`
    },

  },
  disableMonitor: false
});
Extension.prototype["scratchmagic_Block_redirectbrowser"] = async function(args, util) {
  const localVars = {};
    window.location.href = args["url"];

};


blocks.push({
  opcode: "scratchmagic_Block_opennewtabbrowser",
  blockType: Scratch.BlockType.COMMAND,
  text: "open [url] in a new tab",
  arguments: {
      "url": {
      type: Scratch.ArgumentType.STRING,
      defaultValue: `https://connor.ct.ws`
    },

  },
  disableMonitor: false
});
Extension.prototype["scratchmagic_Block_opennewtabbrowser"] = async function(args, util) {
  const localVars = {};
    window.open(args["url"], '_blank');

};


blocks.push({
  opcode: "scratchmagic_Block_encodebase64",
  blockType: Scratch.BlockType.REPORTER,
  text: "encode [text] to base64",
  arguments: {
      "text": {
      type: Scratch.ArgumentType.STRING,
      defaultValue: ``
    },

  },
  disableMonitor: false
});
Extension.prototype["scratchmagic_Block_encodebase64"] = async function(args, util) {
  const localVars = {};
    return btoa(args["text"]);
};


blocks.push({
  opcode: "scratchmagic_Block_decodebase64",
  blockType: Scratch.BlockType.REPORTER,
  text: "decode [text] from base64",
  arguments: {
      "text": {
      type: Scratch.ArgumentType.STRING,
      defaultValue: ``
    },

  },
  disableMonitor: false
});
Extension.prototype["scratchmagic_Block_decodebase64"] = async function(args, util) {
  const localVars = {};
    return atob(args["text"]);
};


blocks.push({
  opcode: "scratchmagic_Block_encodeurl",
  blockType: Scratch.BlockType.REPORTER,
  text: "encode [text] to url",
  arguments: {
      "text": {
      type: Scratch.ArgumentType.STRING,
      defaultValue: ``
    },

  },
  disableMonitor: false
});
Extension.prototype["scratchmagic_Block_encodeurl"] = async function(args, util) {
  const localVars = {};
    return encodeURIComponent(args["text"]);
};


blocks.push({
  opcode: "scratchmagic_Block_decodeurl",
  blockType: Scratch.BlockType.REPORTER,
  text: "decode [text] from url",
  arguments: {
      "text": {
      type: Scratch.ArgumentType.STRING,
      defaultValue: ``
    },

  },
  disableMonitor: false
});
Extension.prototype["scratchmagic_Block_decodeurl"] = async function(args, util) {
  const localVars = {};
    return decodeURIComponent(args["text"]);
};


blocks.push({
  opcode: "scratchmagic_Block_executejs",
  blockType: Scratch.BlockType.COMMAND,
  text: "execute [script] as javascript",
  arguments: {
      "script": {
      type: Scratch.ArgumentType.STRING,
      defaultValue: ``
    },

  },
  disableMonitor: false
});
Extension.prototype["scratchmagic_Block_executejs"] = async function(args, util) {
  const localVars = {};
    eval(args["script"]);

};


blocks.push({
  opcode: "scratchmagic_Block_executejsreporter",
  blockType: Scratch.BlockType.REPORTER,
  text: "execute [script] as javascript",
  arguments: {
      "script": {
      type: Scratch.ArgumentType.STRING,
      defaultValue: ``
    },

  },
  disableMonitor: false
});
Extension.prototype["scratchmagic_Block_executejsreporter"] = async function(args, util) {
  const localVars = {};
    return eval(args["script"]);
};


blocks.push({
  opcode: "scratchmagic_Block_commentblock",
  blockType: Scratch.BlockType.COMMAND,
  text: "// [comment]",
  arguments: {
      "comment": {
      type: Scratch.ArgumentType.STRING,
      defaultValue: `This is a comment!`
    },

  },
  disableMonitor: false
});
Extension.prototype["scratchmagic_Block_commentblock"] = async function(args, util) {
  const localVars = {};

};


blocks.push({
  opcode: "scratchmagic_Block_commentreporter",
  blockType: Scratch.BlockType.REPORTER,
  text: "[text] // [comment]",
  arguments: {
      "text": {
      type: Scratch.ArgumentType.STRING,
      defaultValue: `This is not a comment!`
    },
  "comment": {
      type: Scratch.ArgumentType.STRING,
      defaultValue: `This is a comment!`
    },

  },
  disableMonitor: false
});
Extension.prototype["scratchmagic_Block_commentreporter"] = async function(args, util) {
  const localVars = {};
    return args["text"];
};


blocks.push({
  opcode: "scratchmagic_Block_setvar",
  blockType: Scratch.BlockType.COMMAND,
  text: "set magic variable [var] to [text]",
  arguments: {
      "var": {
      type: Scratch.ArgumentType.STRING,
      defaultValue: ``
    },
  "text": {
      type: Scratch.ArgumentType.STRING,
      defaultValue: ``
    },

  },
  disableMonitor: false
});
Extension.prototype["scratchmagic_Block_setvar"] = async function(args, util) {
  const localVars = {};
    vars[args["var"]] = args["text"];

};


blocks.push({
  opcode: "scratchmagic_Block_getvar",
  blockType: Scratch.BlockType.REPORTER,
  text: "get magic variable [var]",
  arguments: {
      "var": {
      type: Scratch.ArgumentType.STRING,
      defaultValue: ``
    },

  },
  disableMonitor: false
});
Extension.prototype["scratchmagic_Block_getvar"] = async function(args, util) {
  const localVars = {};
    return vars[args["var"]];
};


blocks.push({
  opcode: "scratchmagic_Block_threeequals",
  blockType: Scratch.BlockType.BOOLEAN,
  text: "[1] === [2]",
  arguments: {
      "1": {
      type: Scratch.ArgumentType.STRING,
      defaultValue: ``
    },
  "2": {
      type: Scratch.ArgumentType.STRING,
      defaultValue: ``
    },

  },
  disableMonitor: false
});
Extension.prototype["scratchmagic_Block_threeequals"] = async function(args, util) {
  const localVars = {};
    return args["1"] === args["2"];
};


blocks.push({
  opcode: "scratchmagic_Block_twoequalsandmark",
  blockType: Scratch.BlockType.BOOLEAN,
  text: "[1] !== [2]",
  arguments: {
      "1": {
      type: Scratch.ArgumentType.STRING,
      defaultValue: ``
    },
  "2": {
      type: Scratch.ArgumentType.STRING,
      defaultValue: ``
    },

  },
  disableMonitor: false
});
Extension.prototype["scratchmagic_Block_twoequalsandmark"] = async function(args, util) {
  const localVars = {};
    return args["1"] !== args["2"];
};


blocks.push({
  opcode: "scratchmagic_Block_randombool",
  blockType: Scratch.BlockType.BOOLEAN,
  text: "random boolean",
  arguments: {

  },
  disableMonitor: true
});
Extension.prototype["scratchmagic_Block_randombool"] = async function(args, util) {
  const localVars = {};
    return (Math.round(Math.random()) === 1);
};


blocks.push({
  opcode: "scratchmagic_Block_firstoccurrencetext",
  blockType: Scratch.BlockType.REPORTER,
  text: "find first occurrence of text [1] in [2]",
  arguments: {
      "1": {
      type: Scratch.ArgumentType.STRING,
      defaultValue: ``
    },
  "2": {
      type: Scratch.ArgumentType.STRING,
      defaultValue: ``
    },

  },
  disableMonitor: false
});
Extension.prototype["scratchmagic_Block_firstoccurrencetext"] = async function(args, util) {
  const localVars = {};
    return args["1"].indexOf(args["2"]) + 1;
};


blocks.push({
  opcode: "scratchmagic_Block_lastoccurrencetext",
  blockType: Scratch.BlockType.REPORTER,
  text: "find last occurrence of text [1] in [2]",
  arguments: {
      "1": {
      type: Scratch.ArgumentType.STRING,
      defaultValue: ``
    },
  "2": {
      type: Scratch.ArgumentType.STRING,
      defaultValue: ``
    },

  },
  disableMonitor: false
});
Extension.prototype["scratchmagic_Block_lastoccurrencetext"] = async function(args, util) {
  const localVars = {};
    return args["1"].lastIndexOf(args["2"]) + 1;
};


blocks.push({
  opcode: "scratchmagic_Block_letternumberintext",
  blockType: Scratch.BlockType.REPORTER,
  text: "get letter # [1] in [2]",
  arguments: {
      "1": {
      type: Scratch.ArgumentType.STRING,
      defaultValue: ``
    },
  "2": {
      type: Scratch.ArgumentType.STRING,
      defaultValue: ``
    },

  },
  disableMonitor: false
});
Extension.prototype["scratchmagic_Block_letternumberintext"] = async function(args, util) {
  const localVars = {};
    return args["1"].charAt((args["2"] - 1));
};


blocks.push({
  opcode: "scratchmagic_Block_letternumberfromendintext",
  blockType: Scratch.BlockType.REPORTER,
  text: "get letter # from end [1] in [2]",
  arguments: {
      "1": {
      type: Scratch.ArgumentType.STRING,
      defaultValue: ``
    },
  "2": {
      type: Scratch.ArgumentType.STRING,
      defaultValue: ``
    },

  },
  disableMonitor: false
});
Extension.prototype["scratchmagic_Block_letternumberfromendintext"] = async function(args, util) {
  const localVars = {};
    return args["1"].slice((-args["2"])).charAt(0);
};


blocks.push({
  opcode: "scratchmagic_Block_firstletterintext",
  blockType: Scratch.BlockType.REPORTER,
  text: "get first letter in [1]",
  arguments: {
      "1": {
      type: Scratch.ArgumentType.STRING,
      defaultValue: ``
    },

  },
  disableMonitor: false
});
Extension.prototype["scratchmagic_Block_firstletterintext"] = async function(args, util) {
  const localVars = {};
    return args["1"].charAt(0);
};


blocks.push({
  opcode: "scratchmagic_Block_lastletterintext",
  blockType: Scratch.BlockType.REPORTER,
  text: "get last letter in [1]",
  arguments: {
      "1": {
      type: Scratch.ArgumentType.STRING,
      defaultValue: ``
    },

  },
  disableMonitor: false
});
Extension.prototype["scratchmagic_Block_lastletterintext"] = async function(args, util) {
  const localVars = {};
    return args["1"].slice(-1);
};


blocks.push({
  opcode: "scratchmagic_Block_randomletterintext",
  blockType: Scratch.BlockType.REPORTER,
  text: "get random letter in [1]",
  arguments: {
      "1": {
      type: Scratch.ArgumentType.STRING,
      defaultValue: ``
    },
  "2": {
      type: Scratch.ArgumentType.STRING,
      defaultValue: ``
    },

  },
  disableMonitor: false
});
Extension.prototype["scratchmagic_Block_randomletterintext"] = async function(args, util) {
  const localVars = {};
    return textRandomLetter(args["1"]);
};


blocks.push({
  opcode: "scratchmagic_Block_substringtwiceletternumber",
  blockType: Scratch.BlockType.REPORTER,
  text: "get substring from letter # [1] to letter # [2] in [3]",
  arguments: {
      "1": {
      type: Scratch.ArgumentType.STRING,
      defaultValue: ``
    },
  "2": {
      type: Scratch.ArgumentType.STRING,
      defaultValue: ``
    },
  "3": {
      type: Scratch.ArgumentType.STRING,
      defaultValue: ``
    },

  },
  disableMonitor: false
});
Extension.prototype["scratchmagic_Block_substringtwiceletternumber"] = async function(args, util) {
  const localVars = {};
    return args["3"].slice((args["1"] - 1), args["2"]);
};


blocks.push({
  opcode: "scratchmagic_Block_substringletternumberlastletternumber",
  blockType: Scratch.BlockType.REPORTER,
  text: "get substring from letter # from end [1] to letter # [2] in [3]",
  arguments: {
      "1": {
      type: Scratch.ArgumentType.STRING,
      defaultValue: ``
    },
  "2": {
      type: Scratch.ArgumentType.STRING,
      defaultValue: ``
    },
  "3": {
      type: Scratch.ArgumentType.STRING,
      defaultValue: ``
    },

  },
  disableMonitor: false
});
Extension.prototype["scratchmagic_Block_substringletternumberlastletternumber"] = async function(args, util) {
  const localVars = {};
    return subsequenceFromEndFromStart(args["3"], (args["1"] - 1), (args["2"] - 1));
};


blocks.push({
  opcode: "scratchmagic_Block_substringletternumberletternumberlast",
  blockType: Scratch.BlockType.REPORTER,
  text: "get substring from letter # [1] to letter # from end [2] in [3]",
  arguments: {
      "1": {
      type: Scratch.ArgumentType.STRING,
      defaultValue: ``
    },
  "2": {
      type: Scratch.ArgumentType.STRING,
      defaultValue: ``
    },
  "3": {
      type: Scratch.ArgumentType.STRING,
      defaultValue: ``
    },

  },
  disableMonitor: false
});
Extension.prototype["scratchmagic_Block_substringletternumberletternumberlast"] = async function(args, util) {
  const localVars = {};
    return subsequenceFromStartFromEnd(args["3"], (args["1"] - 1), (args["2"] - 1));
};


blocks.push({
  opcode: "scratchmagic_Block_substringtwiceletternumberfromend",
  blockType: Scratch.BlockType.REPORTER,
  text: "get substring from letter # from end [1] to letter # from end [2] in [3]",
  arguments: {
      "1": {
      type: Scratch.ArgumentType.STRING,
      defaultValue: ``
    },
  "2": {
      type: Scratch.ArgumentType.STRING,
      defaultValue: ``
    },
  "3": {
      type: Scratch.ArgumentType.STRING,
      defaultValue: ``
    },

  },
  disableMonitor: false
});
Extension.prototype["scratchmagic_Block_substringtwiceletternumberfromend"] = async function(args, util) {
  const localVars = {};
    return subsequenceFromEndFromEnd(args["3"], (args["1"] - 1), (args["2"] - 1));
};


blocks.push({
  opcode: "scratchmagic_Block_substringfirstletterletternumber",
  blockType: Scratch.BlockType.REPORTER,
  text: "get substring from first letter to letter # [2] in [3]",
  arguments: {
      "2": {
      type: Scratch.ArgumentType.STRING,
      defaultValue: ``
    },
  "3": {
      type: Scratch.ArgumentType.STRING,
      defaultValue: ``
    },

  },
  disableMonitor: false
});
Extension.prototype["scratchmagic_Block_substringfirstletterletternumber"] = async function(args, util) {
  const localVars = {};
    return args["3"].slice(0, args["2"]);
};


blocks.push({
  opcode: "scratchmagic_Block_substringfirstletterletternumberlast",
  blockType: Scratch.BlockType.REPORTER,
  text: "get substring from first letter to letter # from end [2] in [3]",
  arguments: {
      "2": {
      type: Scratch.ArgumentType.STRING,
      defaultValue: ``
    },
  "3": {
      type: Scratch.ArgumentType.STRING,
      defaultValue: ``
    },

  },
  disableMonitor: false
});
Extension.prototype["scratchmagic_Block_substringfirstletterletternumberlast"] = async function(args, util) {
  const localVars = {};
    return subsequenceFirstFromEnd(args["3"], (args["2"] - 1));
};


blocks.push({
  opcode: "scratchmagic_Block_substringletternumberlastletter",
  blockType: Scratch.BlockType.REPORTER,
  text: "get substring from letter # [2] to last letter in [3]",
  arguments: {
      "2": {
      type: Scratch.ArgumentType.STRING,
      defaultValue: ``
    },
  "3": {
      type: Scratch.ArgumentType.STRING,
      defaultValue: ``
    },

  },
  disableMonitor: false
});
Extension.prototype["scratchmagic_Block_substringletternumberlastletter"] = async function(args, util) {
  const localVars = {};
    return subsequenceFromStartLast(args["3"], (args["2"] - 1));
};


blocks.push({
  opcode: "scratchmagic_Block_substringletternumberfromendlastletter",
  blockType: Scratch.BlockType.REPORTER,
  text: "get substring from letter # from end [2] to last letter in [3]",
  arguments: {
      "2": {
      type: Scratch.ArgumentType.STRING,
      defaultValue: ``
    },
  "3": {
      type: Scratch.ArgumentType.STRING,
      defaultValue: ``
    },

  },
  disableMonitor: false
});
Extension.prototype["scratchmagic_Block_substringletternumberfromendlastletter"] = async function(args, util) {
  const localVars = {};
    return subsequenceFromEndLast(args["3"], (args["2"] - 1));
};


blocks.push({
  opcode: "scratchmagic_Block_touppercase",
  blockType: Scratch.BlockType.REPORTER,
  text: "[1] to uppercase",
  arguments: {
      "1": {
      type: Scratch.ArgumentType.STRING,
      defaultValue: ``
    },

  },
  disableMonitor: false
});
Extension.prototype["scratchmagic_Block_touppercase"] = async function(args, util) {
  const localVars = {};
    return args["1"].toUpperCase();
};


blocks.push({
  opcode: "scratchmagic_Block_tolowercase",
  blockType: Scratch.BlockType.REPORTER,
  text: "[1] to lowercase",
  arguments: {
      "1": {
      type: Scratch.ArgumentType.STRING,
      defaultValue: ``
    },

  },
  disableMonitor: false
});
Extension.prototype["scratchmagic_Block_tolowercase"] = async function(args, util) {
  const localVars = {};
    return args["1"].toLowerCase();
};


blocks.push({
  opcode: "scratchmagic_Block_trimspacesboth",
  blockType: Scratch.BlockType.REPORTER,
  text: "trim spaces from both sides in [1]",
  arguments: {
      "1": {
      type: Scratch.ArgumentType.STRING,
      defaultValue: ``
    },

  },
  disableMonitor: false
});
Extension.prototype["scratchmagic_Block_trimspacesboth"] = async function(args, util) {
  const localVars = {};
    return args["1"].trim();
};


blocks.push({
  opcode: "scratchmagic_Block_trimspacesleft",
  blockType: Scratch.BlockType.REPORTER,
  text: "trim spaces from left side in [1]",
  arguments: {
      "1": {
      type: Scratch.ArgumentType.STRING,
      defaultValue: ``
    },

  },
  disableMonitor: false
});
Extension.prototype["scratchmagic_Block_trimspacesleft"] = async function(args, util) {
  const localVars = {};
    return args["1"].replace(/^[\s\xa0]+/, '');
};


blocks.push({
  opcode: "scratchmagic_Block_trimspacesright",
  blockType: Scratch.BlockType.REPORTER,
  text: "trim spaces from right side in [1]",
  arguments: {
      "1": {
      type: Scratch.ArgumentType.STRING,
      defaultValue: ``
    },

  },
  disableMonitor: false
});
Extension.prototype["scratchmagic_Block_trimspacesright"] = async function(args, util) {
  const localVars = {};
    return args["1"].replace(/[\s\xa0]+$/, '');
};


blocks.push({
  opcode: "scratchmagic_Block_countsomethingintext",
  blockType: Scratch.BlockType.REPORTER,
  text: "count [1] in [2]",
  arguments: {
      "1": {
      type: Scratch.ArgumentType.STRING,
      defaultValue: ``
    },
  "2": {
      type: Scratch.ArgumentType.STRING,
      defaultValue: ``
    },

  },
  disableMonitor: false
});
Extension.prototype["scratchmagic_Block_countsomethingintext"] = async function(args, util) {
  const localVars = {};
    return textCount(args["2"], args["1"]);
};


blocks.push({
  opcode: "scratchmagic_Block_replacesmthwithsmthintext",
  blockType: Scratch.BlockType.REPORTER,
  text: "replace [1] with [2] in [3]",
  arguments: {
      "1": {
      type: Scratch.ArgumentType.STRING,
      defaultValue: ``
    },
  "2": {
      type: Scratch.ArgumentType.STRING,
      defaultValue: ``
    },
  "3": {
      type: Scratch.ArgumentType.STRING,
      defaultValue: ``
    },

  },
  disableMonitor: false
});
Extension.prototype["scratchmagic_Block_replacesmthwithsmthintext"] = async function(args, util) {
  const localVars = {};
    return textReplace(args["3"], args["1"], args["2"]);
};


blocks.push({
  opcode: "scratchmagic_Block_reversetext",
  blockType: Scratch.BlockType.REPORTER,
  text: "reverse [1]",
  arguments: {
      "1": {
      type: Scratch.ArgumentType.STRING,
      defaultValue: ``
    },

  },
  disableMonitor: false
});
Extension.prototype["scratchmagic_Block_reversetext"] = async function(args, util) {
  const localVars = {};
    return args["1"].split('').reverse().join('');
};


blocks.push({
  opcode: "scratchmagic_Block_newlinechar",
  blockType: Scratch.BlockType.REPORTER,
  text: "new line",
  arguments: {

  },
  disableMonitor: true
});
Extension.prototype["scratchmagic_Block_newlinechar"] = async function(args, util) {
  const localVars = {};
    return "\n";
};


blocks.push({
  opcode: "scratchmagic_Block_pinumber",
  blockType: Scratch.BlockType.REPORTER,
  text: "π",
  arguments: {

  },
  disableMonitor: true
});
Extension.prototype["scratchmagic_Block_pinumber"] = async function(args, util) {
  const localVars = {};
    return Math.PI;
};


blocks.push({
  opcode: "scratchmagic_Block_enumber",
  blockType: Scratch.BlockType.REPORTER,
  text: "e",
  arguments: {

  },
  disableMonitor: true
});
Extension.prototype["scratchmagic_Block_enumber"] = async function(args, util) {
  const localVars = {};
    return Math.E;
};


blocks.push({
  opcode: "scratchmagic_Block_infinitynumber",
  blockType: Scratch.BlockType.REPORTER,
  text: "∞",
  arguments: {

  },
  disableMonitor: true
});
Extension.prototype["scratchmagic_Block_infinitynumber"] = async function(args, util) {
  const localVars = {};
    return Infinity;
};


blocks.push({
  opcode: "scratchmagic_Block_sqrt2",
  blockType: Scratch.BlockType.REPORTER,
  text: "square root of 2",
  arguments: {

  },
  disableMonitor: true
});
Extension.prototype["scratchmagic_Block_sqrt2"] = async function(args, util) {
  const localVars = {};
    return Math.SQRT2;
};


blocks.push({
  opcode: "scratchmagic_Block_sqrt12",
  blockType: Scratch.BlockType.REPORTER,
  text: "square root of 1/2",
  arguments: {

  },
  disableMonitor: true
});
Extension.prototype["scratchmagic_Block_sqrt12"] = async function(args, util) {
  const localVars = {};
    return Math.SQRT1_2;
};


blocks.push({
  opcode: "scratchmagic_Block_iseven",
  blockType: Scratch.BlockType.REPORTER,
  text: "is [number] even",
  arguments: {
      "number": {
      type: Scratch.ArgumentType.NUMBER,
      defaultValue: ``
    },

  },
  disableMonitor: true
});
Extension.prototype["scratchmagic_Block_iseven"] = async function(args, util) {
  const localVars = {};
    return args["number"] % 2 === 0;
};


blocks.push({
  opcode: "scratchmagic_Block_isodd",
  blockType: Scratch.BlockType.REPORTER,
  text: "is [number] odd",
  arguments: {
      "number": {
      type: Scratch.ArgumentType.NUMBER,
      defaultValue: ``
    },

  },
  disableMonitor: true
});
Extension.prototype["scratchmagic_Block_isodd"] = async function(args, util) {
  const localVars = {};
    return args["number"] % 2 === 1;
};


blocks.push({
  opcode: "scratchmagic_Block_isprime",
  blockType: Scratch.BlockType.REPORTER,
  text: "is [number] prime",
  arguments: {
      "number": {
      type: Scratch.ArgumentType.NUMBER,
      defaultValue: ``
    },

  },
  disableMonitor: true
});
Extension.prototype["scratchmagic_Block_isprime"] = async function(args, util) {
  const localVars = {};
    return mathIsPrime(args["number"]);
};


blocks.push({
  opcode: "scratchmagic_Block_iswhole",
  blockType: Scratch.BlockType.REPORTER,
  text: "is [number] whole",
  arguments: {
      "number": {
      type: Scratch.ArgumentType.NUMBER,
      defaultValue: ``
    },

  },
  disableMonitor: true
});
Extension.prototype["scratchmagic_Block_iswhole"] = async function(args, util) {
  const localVars = {};
    return args["number"] % 1 === 0;
};


blocks.push({
  opcode: "scratchmagic_Block_ispositive",
  blockType: Scratch.BlockType.REPORTER,
  text: "is [number] positive",
  arguments: {
      "number": {
      type: Scratch.ArgumentType.NUMBER,
      defaultValue: ``
    },

  },
  disableMonitor: true
});
Extension.prototype["scratchmagic_Block_ispositive"] = async function(args, util) {
  const localVars = {};
    return args["number"] > 0;
};


blocks.push({
  opcode: "scratchmagic_Block_isnegative",
  blockType: Scratch.BlockType.REPORTER,
  text: "is [number] negative",
  arguments: {
      "number": {
      type: Scratch.ArgumentType.NUMBER,
      defaultValue: ``
    },

  },
  disableMonitor: true
});
Extension.prototype["scratchmagic_Block_isnegative"] = async function(args, util) {
  const localVars = {};
    return args["number"] < 0;
};


blocks.push({
  opcode: "scratchmagic_Block_isdivisibleby",
  blockType: Scratch.BlockType.REPORTER,
  text: "is [number] divisible by [number2]",
  arguments: {
      "number": {
      type: Scratch.ArgumentType.NUMBER,
      defaultValue: ``
    },
  "number2": {
      type: Scratch.ArgumentType.NUMBER,
      defaultValue: ``
    },

  },
  disableMonitor: true
});
Extension.prototype["scratchmagic_Block_isdivisibleby"] = async function(args, util) {
  const localVars = {};
    return args["number"] % args["number2"] === 0;
};


blocks.push({
  opcode: "scratchmagic_Block_roundup",
  blockType: Scratch.BlockType.REPORTER,
  text: "round [number] up",
  arguments: {
      "number": {
      type: Scratch.ArgumentType.NUMBER,
      defaultValue: ``
    },

  },
  disableMonitor: true
});
Extension.prototype["scratchmagic_Block_roundup"] = async function(args, util) {
  const localVars = {};
    return Math.ceil(args["number"]);
};


blocks.push({
  opcode: "scratchmagic_Block_rounddown",
  blockType: Scratch.BlockType.REPORTER,
  text: "round [number] down",
  arguments: {
      "number": {
      type: Scratch.ArgumentType.NUMBER,
      defaultValue: ``
    },

  },
  disableMonitor: true
});
Extension.prototype["scratchmagic_Block_rounddown"] = async function(args, util) {
  const localVars = {};
    return Math.floor(args["number"]);
};


blocks.push({
  opcode: "scratchmagic_Block_truebool",
  blockType: Scratch.BlockType.BOOLEAN,
  text: "true",
  arguments: {

  },
  disableMonitor: true
});
Extension.prototype["scratchmagic_Block_truebool"] = async function(args, util) {
  const localVars = {};
    return true;
};


blocks.push({
  opcode: "scratchmagic_Block_falsebool",
  blockType: Scratch.BlockType.BOOLEAN,
  text: "false",
  arguments: {

  },
  disableMonitor: true
});
Extension.prototype["scratchmagic_Block_falsebool"] = async function(args, util) {
  const localVars = {};
    return false;
};


blocks.push({
  opcode: "scratchmagic_Block_nullnum",
  blockType: Scratch.BlockType.REPORTER,
  text: "null",
  arguments: {

  },
  disableMonitor: true
});
Extension.prototype["scratchmagic_Block_nullnum"] = async function(args, util) {
  const localVars = {};
    return null;
};


blocks.push({
  opcode: "scratchmagic_Block_iftruethen",
  blockType: Scratch.BlockType.REPORTER,
  text: "if [1] is true, return [2] else return [3]",
  arguments: {
      "1": {
      type: Scratch.ArgumentType.BOOLEAN,
      defaultValue: ``
    },
  "2": {
      type: Scratch.ArgumentType.STRING,
      defaultValue: ``
    },
  "3": {
      type: Scratch.ArgumentType.STRING,
      defaultValue: ``
    },

  },
  disableMonitor: true
});
Extension.prototype["scratchmagic_Block_iftruethen"] = async function(args, util) {
  const localVars = {};
    return args["1"] ? args["2"] : args["3"];
};


blocks.push({
  opcode: "scratchmagic_Block_consolelog",
  blockType: Scratch.BlockType.COMMAND,
  text: "log [text] to console",
  arguments: {
      "text": {
      type: Scratch.ArgumentType.STRING,
      defaultValue: ``
    },

  },
  disableMonitor: false
});
Extension.prototype["scratchmagic_Block_consolelog"] = async function(args, util) {
  const localVars = {};
    console.log(args['text']);

};


blocks.push({
  opcode: "scratchmagic_Block_consolewarn",
  blockType: Scratch.BlockType.COMMAND,
  text: "warn [text] to console",
  arguments: {
      "text": {
      type: Scratch.ArgumentType.STRING,
      defaultValue: ``
    },

  },
  disableMonitor: false
});
Extension.prototype["scratchmagic_Block_consolewarn"] = async function(args, util) {
  const localVars = {};
    console.warn(args['text']);

};


blocks.push({
  opcode: "scratchmagic_Block_consoleerror",
  blockType: Scratch.BlockType.COMMAND,
  text: "error [text] to console",
  arguments: {
      "text": {
      type: Scratch.ArgumentType.STRING,
      defaultValue: ``
    },

  },
  disableMonitor: false
});
Extension.prototype["scratchmagic_Block_consoleerror"] = async function(args, util) {
  const localVars = {};
    console.error(args['text']);

};
  Scratch.extensions.register(new Extension());
})(Scratch);
