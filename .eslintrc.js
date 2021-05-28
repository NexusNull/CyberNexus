module.exports = {
    root: true,
    'env': {
        'browser': true,
        'es2021': true,
    },
    'extends': [
        'eslint:recommended',
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended"
    ],
    'parser': '@typescript-eslint/parser',
    'parserOptions': {
        'ecmaVersion': 12,
        'sourceType': 'module',
    },
    'plugins': [
        '@typescript-eslint',
    ],
    'rules': {
        "indent": ["error", 4],
        "semi": ["error", "always"],
        "no-empty-function": ["warn", {allow: ["functions", "arrowFunctions", "generatorFunctions", "methods", "generatorMethods", "getters", "setters", "constructors", "asyncFunctions", "asyncMethods"]}]
    },
};
