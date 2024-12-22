import { obfuscator } from 'rollup-obfuscator'

export function codeObfuscatorPlugin(isBuild) {
    if(!isBuild) return undefined

    console.log('[rollup-obfuscatorPlugin] Using obfuscatorPlugin')
    const options = {
        compact: true, 
        controlFlowFlattening: true, 
        controlFlowFlatteningThreshold: 0.8,
        deadCodeInjection: false, 
        deadCodeInjectionThreshold: 0.5,
        debugProtection: false, 
        debugProtectionInterval: 0, 
        disableConsoleOutput: true, 
        domainLock: [],
        rotateUnicodeArray: true, 
        exclude: [],
        forceTransformStrings: [],
        identifierNamesCache: {},
        identifierNamesGenerator: 'hexadecimal', 
        identifiersDictionary: [],
        identifiersPrefix: '', 
        ignoreImports: true,
        inputFileName: '',
        log: false,
        numbersToExpressions: true,
        optionsPreset: 'default',
        renameGlobals: false, 
        renameProperties: false,
        renamePropertiesMode: 'safe',
        reservedNames: [], 
        reservedStrings: [], 
        rotateStringArray: true, 
        seed: 0, 
        selfDefending: true, 
        simplify: true,
        sourceMap: false, 
        sourceMapBaseUrl: '', 
        sourceMapFileName: '',
        sourceMapMode: 'separate',
        sourceMapSourcesMode: 'sources-content',
        splitStrings: false,
        splitStringsChunkLength: 10,
        stringArray: true, 
        stringArrayCallsTransform: false,
        stringArrayCallsTransformThreshold: 0.5,
        stringArrayEncoding: ['base64'], 
        stringArrayIndexesType: ['hexadecimal-number'],
        stringArrayIndexShift: true,
        stringArrayRotate: true,
        stringArrayShuffle: true,
        stringArrayWrappersCount: 1,
        stringArrayWrappersChainedCalls: true,
        stringArrayWrappersParametersMaxCount: 2,
        stringArrayWrappersType: 'variable',
        stringArrayThreshold: 0.8, 
        target: 'browser', 
        transformObjectKeys: true, 
        unicodeEscapeSequence: true, 
        // ... [See more](https://github.com/javascript-obfuscator/javascript-obfuscator)
    }
    return obfuscator({
        ...options,
        include: ["**/*.js", "**/*.ts", "**/*.vue"],
        exclude: [
            "node_modules/**",
            "src/assets/emoji-datasource-apple@15.1.2+esm.js",
            "src/indexApp/App.vue", // 解决项目编译后主路由无法切换的问题：TypeError: d.ctx.deactivate is not a function.
            "src/indexApp/components/SnowScreen.vue" // TODO 临时解决项目编译后雪花屏动画耗时太长，导致页面卡死的问题
        ],
        enforce: 'post',
        apply: 'build',
    })
}