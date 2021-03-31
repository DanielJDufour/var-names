const alphabet_lower = "abcdefghijklmnopqrstuvwxyz";
const alphabet_upper = alphabet_lower.toUpperCase();

const DEFAULT_CHARS = Array.from(alphabet_upper + alphabet_lower);

const DEFAULT_LANG = "JS";

const DEFAULT_MAX_COUNT = 1e6;

const RESERVED_WORDS = {
  // prettier-ignore
  JS: [
    "abstract", "alert", "all", "anchor", "anchors", "area", "arguments", "assign", "Array", "await",
    "boolean", "blur", "break", "button", "byte",
    "case", "catch", "char", "checkbox", "class", "clearInterval", "clearTimeout", "clientInformation", "close", "closed", "confirm", "const", "constructor", "continue", "crypto",
    "Date", "debugger", "decodeURI", "decodeURIComponent", "default", "defaultStatus", "delete", "do", "document", "double",
    "element", "elements", "else", "embed", "embeds", "encodeURI", "encodeURIComponent", "enum", "escape", "eval", "event", "export", "extends",
    "false", "fileUpload", "final", "finally", "float", "focus", "for", "form", "forms", "frame", "frameRate", "frames", "function",
    "getClass", "goto",
    "hasOwnProperty", "hidden", "history",
    "if", "image", "images", "implements", "import", "in", "Infinity", "innerHeight", "innerWidth", "instanceof", "int", "interface", "isFinite", "isNaN", "isPrototypeOf",
    "java", "javaClass", "JavaArray", "JavaObject", "JavaPackage",
    "layer", "layers", "length", "let", "link", "location", "long",
    "Math", "mimeTypes", "module",
    "name", "NaN", "native", "navigate", "navigator", "new", "null", "Number",
    "offscreenBuffering", "Object", "open", "opener", "option", "outerHeight", "outerWidth",
    "package", "packages", "pageXOffset", "pageYOffset", "parent", "parseFloat", "parseInt", "password", "pkcs11", "plugin", "private", "prompt", "propertyIsEnum", "protected", "prototype", "public",
    "radio", "reset", "return",
    "screenX", "screenY", "scroll", "secure", "select", "self", "setInterval", "setTimeout", "short", "static", "status", "String", "submit", "super", "switch", "synchronized",
    "text", "textarea", "this", "throw", "throws", "top", "toString", "transient", "true", "try", "typeof",
    "undefined", "unescape", "untaint",
    "valueOf", "var", "void", "volatile",
    "while", "with", "window",
    "yield"
  ],
};

function* genVarNames(
  {
    chars = DEFAULT_CHARS,
    debug = false,
    language = DEFAULT_LANG,
    max_count = DEFAULT_MAX_COUNT,
  } = {
    chars: DEFAULT_CHARS,
    debug: false,
    language: DEFAULT_LANG,
    max_count: DEFAULT_MAX_COUNT,
  }
) {
  const reserved_words = new Set(RESERVED_WORDS[language]);

  let count = 0;
  let indexes = [-1];
  let i = 0;

  while (true) {
    if (count === max_count) return;

    i++;

    if (indexes[indexes.length - 1] === chars.length - 1) {
      // reset at all A's
      // so increment the previous available character by one
      // so if AAZ go to ABA
      let reset_index = null;
      for (let ii = indexes.length - 2; ii >= 0; ii--) {
        if (indexes[ii] < chars.length - 2) {
          reset_index = ii;
          break;
        }
      }
      if (reset_index === null) {
        if (debug)
          console.log(
            "[var-names] adding a character and resetting to all A's"
          );
        indexes = indexes.map((n) => 0).concat([0]);
      } else {
        indexes[reset_index]++;
        for (let ii = reset_index + 1; ii < indexes.length; ii++) {
          indexes[ii] = 0;
        }
      }
    } else {
      indexes[indexes.length - 1]++;
    }
    const new_variable_name = indexes.map((ii) => chars[ii]).join("");
    if (reserved_words.has(new_variable_name)) {
      if (debug)
        console.log(
          "[var-names] skipping " +
            new_variable_name +
            "because it is a reserved word"
        );
      continue;
    }
    if (debug) console.log("[var-names] trying to eval new_variable_name");
    try {
      eval(`const ${new_variable_name} = "test";`);
      count++;
      yield new_variable_name;
    } catch (error) {
      if (debug) console.log("[var-names] can't use " + new_variable_name);
    }
  }
}

if (typeof module === "object") module.exports = { genVarNames };
if (typeof window === "object") window.varnames = { genVarNames };
if (typeof self === "object") self.varnames = { genVarNames };
