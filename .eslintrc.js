module.exports = {
    parser: "vue-eslint-parser",
    parserOptions: {
        "sourceType": "module",
        "ecmaVersion": 2024,
        "ecmaFeatures": {
            "globalReturn": false,
            "impliedStrict": false,
            "jsx": false
        }
    },
    extends: [
        // add more generic rule sets here, such as:
        // 'eslint:recommended',
        'plugin:vue/vue3-recommended',
        'plugin:vue/vue3-essential',
        'plugin:vue/vue3-strongly-recommended'
    ],
    rules: {
        "vue/html-indent": ["warn", 4, {
            "attribute": 1,
            "baseIndent": 1,
            "closeBracket": 0,
            "alignAttributesVertically": true,
            "ignores": []
        }],
        "vue/block-order": ["warn", {
            "order": ["template", "style[scoped]", "script[setup]"]
        }],
        "vue/component-tags-order": ["warn", {
            "order": ["template", "style[scoped]", "script[setup]"]
        }],
        "vue/html-self-closing": ["warn", {
            "html": {
                "void": "always",
                "normal": "always",
                "component": "never"
            },
            "svg": "always",
            "math": "always"
        }],
        "vue/multi-word-component-names": ["off", {
            "ignores": ["Auth", "Review", "Reply", "Avatar", "Banner", "Banner", "Profile"]
        }],
        "vue/html-closing-bracket-newline": ["warn", {
            "singleline": "never",
            "multiline": "never",
            "selfClosingTag": {
                "singleline": "never",
                "multiline": "never"
            }
        }],
        "vue/no-empty-component-block": ["warn"],
        "vue/block-tag-newline": ["error", {
            "singleline": "never",
            "multiline": "always",
            "maxEmptyLines": 0
        }],
        "vue/component-api-style": ["error",
            ["script-setup", "composition"]
        ],
        "vue/component-name-in-template-casing": ["error", "PascalCase", {
            "registeredComponentsOnly": true,
            "ignores": [],
            "globals": ["RouterView", "router-view"]
        }],
        "vue/custom-event-name-casing": ["warn", "camelCase", {
            "ignores": []
        }],
        "vue/enforce-style-attribute": ["error", {
            "allow": ["scoped"]
        }],
        "vue/html-button-has-type": ["warn", {
            "button": true,
            "submit": false,
            "reset": false
        }],
        "vue/html-comment-content-newline": ["warn", {
            "singleline": "ignore",
            "multiline": "always",
        }],
        "vue/html-comment-content-spacing": ["warn", "always", {
            "exceptions": []
        }],
        "vue/html-comment-indent": ["warn", 2],
        "vue/max-lines-per-block": ["warn", {
            "script": 200,
            "template": 200,
            "style": 70,
            "skipBlankLines": true
        }],

        // 不允许纯字符串，增加翻译时开启
        "vue/no-bare-strings-in-template": ["off", {
            "allowlist": [
                "(", ")", ",", ".", "&", "+", "-", "=", "*", "/", "#", "%", "!", "?", ":", "[", "]", "{", "}", "<", ">", "\u00b7", "\u2022", "\u2010", "\u2013", "\u2014", "\u2212", "|"
            ],
            "attributes": {
                "/.+/": ["title", "aria-label", "aria-placeholder", "aria-roledescription", "aria-valuetext"],
                "input": ["placeholder"],
                "img": ["alt"]
            },
            "directives": ["v-text"]
        }],

        "vue/no-duplicate-attr-inheritance": ["warn"],
        "vue/no-multiple-objects-in-class": ["error"],
        "vue/no-potential-component-option-typo": ["warn", {
            "presets": ["vue", "vue-router"],
            "custom": [],
            "threshold": 1
        }],
        "vue/no-ref-object-reactivity-loss": ["error"],
        "vue/no-required-prop-with-default": ["error", {
            "autofix": false,
        }],
        "vue/no-root-v-if": ["error"],
        "vue/no-setup-props-reactivity-loss": ["error"],
        "vue/no-static-inline-styles": ["warn", {
            "allowBinding": true
        }],
        "vue/no-template-target-blank": ["error"],
        "vue/no-this-in-before-route-enter": ["error"],
        "vue/no-undef-components": ["error", {
            "ignorePatterns": []
        }],
        "vue/no-undef-properties": ["error", {
            "ignores": ["/^\\$/"]
        }],
        "vue/no-unsupported-features": ["error", {
            "version": "^3.2.38",
            "ignores": []
        }],
        "vue/no-unused-emit-declarations": ["warn"],
        "vue/no-unused-properties": ["warn", {
            "groups": ["props", "setup", "computed"],
            "deepData": false,
            "ignorePublicMembers": false,
            "unreferencedOptions": []
        }],
        "vue/no-unused-refs": ["warn"],
        "vue/no-use-v-else-with-v-for": ["warn"],
        "vue/no-useless-mustaches": ["warn", {
            "ignoreIncludesComment": true,
            "ignoreStringEscape": true
        }],
        "vue/no-useless-v-bind": ["warn", {
            "ignoreIncludesComment": true,
            "ignoreStringEscape": true
        }],
        "vue/no-v-text": ["warn"],
        "vue/padding-line-between-blocks": ["warn", "always"],
        "vue/prefer-define-options": ["warn"],
        "vue/prefer-separate-static-class": ["warn"],
        "vue/prefer-true-attribute-shorthand": ["error", "always"],

        // 定义emits时需要同时定义验证器，暂不开启
        "vue/require-emit-validator": ["off"],

        "vue/require-macro-variable-name": ["warn", {
            "defineProps": "props",
            "defineEmits": "emits",
            "defineSlots": "slots",
            "useSlots": "slots",
            "useAttrs": "attrs"
        }],
        "vue/require-prop-comment": ["warn", {
            "type": "any"
        }],
        "vue/static-class-names-order": ["warn"],
        "vue/v-for-delimiter-style": ["warn", "in"],
        "vue/v-on-handler-style": ["off", ["method","inline"], {
            "ignoreIncludesComment": false
        }],
    }
}