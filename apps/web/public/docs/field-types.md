# Field Types

MockServer uses a string-based syntax to define data types. You can pass arguments to types using colons (`:`).

## String Syntax
Format: `type:arg1:arg2`

## Available Types

### Identity & Person
| Type | Example Output |
| :--- | :--- |
| `uuid` | "a1b2-c3d4-e5f6..." |
| `username` | "cool_coder_99" |
| `firstName` | "Alice" |
| `lastName` | "Smith" |
| `email` | "alice.smith@example.com" |
| `avatar` | "https://i.pravatar.cc/..." |

### Content
| Type | Example Output |
| :--- | :--- |
| `sentence` | "The quick brown fox jumps." |
| `paragraph` | "Lorem ipsum dolor sit amet..." |
| `word` | "mockserver" |

### Numbers & Logic
| Type | Arguments | Description |
| :--- | :--- | :--- |
| `boolean` | - | `true` or `false` |
| `integer` | `min:max` | Random integer. `integer:0:100` |
| `enum` | `val1,val2...` | Picks one. `enum:admin,user,guest` |

### Dates
| Type | Description |
| :--- | :--- |
| `date:past` | A random date in the past 10 years. |
| `date:recent` | A random date in the past 30 days. |
| `date:future` | A random date in the future. |

### Arrays
Syntax: `array:subtype:min:max`

* `array:image:0:5` -> Returns an array of 0 to 5 image URLs.
* `array:word:3:3` -> Returns exactly 3 words.
* `array:username:1:10` -> Returns a list of usernames.
