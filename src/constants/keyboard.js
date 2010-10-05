/**
 * @class doodle.Keyboard
 * @static
 */
Object.defineProperty(doodle, 'Keyboard', {
  enumerable: true,
  writable: false,
  configurable: false,
  value: Object.create(null, {
    /**
     * @name BACKSPACE
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'BACKSPACE': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 8
    },

    /**
     * @name TAB
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'TAB': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 9
    },

    /**
     * @name ENTER
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'ENTER': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 13
    },

    /**
     * @name COMMAND
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'COMMAND': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 15
    },

    /**
     * @name SHIFT
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'SHIFT': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 16
    },

    /**
     * @name CONTROL
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'CONTROL': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 17
    },

    /**
     * @name ALTERNATE
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'ALTERNATE': { //Option key
      enumerable: true,
      writable: false,
      configurable: false,
      value: 18
    },

    /**
     * @name PAUSE
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'PAUSE': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 19
    },

    /**
     * @name CAPS_LOCK
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'CAPS_LOCK': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 20
    },

    /**
     * @name NUMPAD
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'NUMPAD': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 21
    },

    /**
     * @name ESCAPE
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'ESCAPE': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 27
    },

    /**
     * @name SPACE
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'SPACE': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 32
    },

    /**
     * @name PAGE_UP
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'PAGE_UP': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 33
    },

    /**
     * @name PAGE_DOWN
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'PAGE_DOWN': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 34
    },

    /**
     * @name END
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'END': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 35
    },

    /**
     * @name HOME
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'HOME': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 36
    },

    /* ARROWS
     */

    /**
     * @name LEFT
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'LEFT': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 37
    },

    /**
     * @name UP
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'UP': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 38
    },

    /**
     * @name RIGHT
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'RIGHT': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 39
    },

    /**
     * @name DOWN
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'DOWN': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 40
    },

    /**
     * @name INSERT
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'INSERT': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 45
    },

    /**
     * @name DELETE
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'DELETE': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 46
    },

    /* NUMBERS
     */

    /**
     * @name
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'NUMBER_0': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 48
    },

    /**
     * @name NUMBER_1
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'NUMBER_1': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 49
    },

    /**
     * @name NUMBER_2
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'NUMBER_2': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 50
    },

    /**
     * @name NUMBER_3
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'NUMBER_3': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 51
    },

    /**
     * @name NUMBER_4
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'NUMBER_4': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 52
    },

    /**
     * @name NUMBER_5
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'NUMBER_5': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 53
    },

    /**
     * @name NUMBER_6
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'NUMBER_6': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 54
    },

    /**
     * @name NUMBER_7
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'NUMBER_7': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 55
    },

    /**
     * @name NUMBER_8
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'NUMBER_8': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 56
    },

    /**
     * @name NUMBER_9
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'NUMBER_9': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 57
    },

    /* LETTERS
     */

    /**
     * @name A
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'A': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 65
    },

    /**
     * @name B
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'B': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 66
    },

    /**
     * @name C
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'C': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 67
    },

    /**
     * @name D
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'D': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 68
    },

    /**
     * @name E
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'E': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 69
    },

    /**
     * @name F
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'F': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 70
    },

    /**
     * @name G
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'G': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 71
    },

    /**
     * @name H
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'H': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 72
    },

    /**
     * @name I
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'I': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 73
    },

    /**
     * @name J
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'J': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 74
    },

    /**
     * @name K
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'K': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 75
    },

    /**
     * @name L
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'L': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 76
    },

    /**
     * @name M
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'M': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 77
    },

    /**
     * @name N
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'N': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 78
    },

    /**
     * @name O
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'O': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 79
    },

    /**
     * @name P
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'P': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 80
    },

    /**
     * @name Q
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'Q': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 81
    },

    /**
     * @name R
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'R': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 82
    },

    /**
     * @name S
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'S': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 83
    },

    /**
     * @name T
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'T': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 84
    },

    /**
     * @name U
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'U': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 85
    },

    /**
     * @name V
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'V': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 86
    },

    /**
     * @name W
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'W': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 87
    },

    /**
     * @name X
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'X': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 88
    },

    /**
     * @name Y
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'Y': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 89
    },

    /**
     * @name Z
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'Z': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 90
    },

    /**
     * @name WINDOWS_KEY
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'WINDOWS_KEY': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 91
    },

    /* NUMBER PAD
     */

    /**
     * @name NUMPAD_0
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'NUMPAD_0': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 96
    },

    /**
     * @name NUMPAD_1
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'NUMPAD_1': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 97
    },

    /**
     * @name NUMPAD_2
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'NUMPAD_2': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 98
    },

    /**
     * @name NUMPAD_3
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'NUMPAD_3': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 99
    },

    /**
     * @name NUMPAD_4
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'NUMPAD_4': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 100
    },

    /**
     * @name NUMPAD_5
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'NUMPAD_5': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 101
    },

    /**
     * @name NUMPAD_6
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'NUMPAD_6': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 102
    },

    /**
     * @name NUMPAD_7
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'NUMPAD_7': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 103
    },

    /**
     * @name NUMPAD_8
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'NUMPAD_8': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 104
    },

    /**
     * @name NUMPAD_9
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'NUMPAD_9': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 105
    },

    /**
     * @name NUMPAD_MULTIPLY
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'NUMPAD_MULTIPLY': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 106
    },

    /**
     * @name NUMPAD_ADD
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'NUMPAD_ADD': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 107
    },

    /**
     * @name NUMPAD_ENTER
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'NUMPAD_ENTER': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 108
    },

    /**
     * @name NUMPAD_SUBTRACT
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'NUMPAD_SUBTRACT': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 109
    },

    /**
     * @name NUMPAD_DECIMAL
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'NUMPAD_DECIMAL': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 110
    },

    /**
     * @name NUMPAD_DIVIDE
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'NUMPAD_DIVIDE': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 111
    },

    /* FUNCTION KEYS
     */

    /**
     * @name F1
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'F1': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 112
    },

    /**
     * @name F2
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'F2': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 113
    },

    /**
     * @name F3
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'F3': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 114
    },

    /**
     * @name F4
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'F4': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 115
    },

    /**
     * @name F5
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'F5': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 116
    },

    /**
     * @name F6
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'F6': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 117
    },

    /**
     * @name F7
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'F7': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 118
    },

    /**
     * @name F8
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'F8': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 119
    },

    /**
     * @name F9
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'F9': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 120
    },

    /**
     * @name F10
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'F10': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 121
    },

    /**
     * @name F11
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'F11': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 122
    },

    /**
     * @name F12
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'F12': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 123
    },

    /**
     * @name F13
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'F13': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 124
    },

    /**
     * @name F14
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'F14': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 125
    },

    /**
     * @name F15
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'F15': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 126
    },

    /**
     * @name SCROLL
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'SCROLL': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 145
    },

    /* PUNCTUATION
     */

    /**
     * @name SEMICOLON
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'SEMICOLON': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 186
    },

    /**
     * @name EQUAL
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'EQUAL': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 187
    },

    /**
     * @name COMMA
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'COMMA': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 188
    },

    /**
     * @name MINUS
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'MINUS': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 189
    },

    /**
     * @name PERIOD
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'PERIOD': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 190
    },

    /**
     * @name SLASH
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'SLASH': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 191
    },

    /**
     * @name BACKQUOTE
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'BACKQUOTE': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 192
    },

    /**
     * @name LEFTBRACKET
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'LEFTBRACKET': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 219
    },

    /**
     * @name BACKSLASH
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'BACKSLASH': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 220
    },

    /**
     * @name RIGHTBRACKET
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'RIGHTBRACKET': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 221
    },

    /**
     * @name QUOTE
     * @return {number} [read-only]
     * @property
     * @constant
     * @static
     */
    'QUOTE': {
      enumerable: true,
      writable: false,
      configurable: false,
      value: 222
    }
    
  })
});
