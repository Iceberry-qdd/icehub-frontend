module.exports = {
    dontCacheBustURLsMatching: /(?:GlobalBanner|GlobalNetworkOffPage|GlobalNotifyBanner|manifest|BackToTop|auth|Login|Register)\.[0-9a-f]{8}\.(?:js|css|json)$/,
    globDirectory: 'dist/',
    globPatterns: [
        "**/{GlobalBanner,GlobalNetworkOffPage,auth,GlobalNotifyBanner,BackToTop,Login,Register}.*.{js,css}",
        "{offline,auth}.html",
        "**/manifest.*.json",
        "favicon.ico"
    ],
    swDest: 'dist/sw.js',
    swSrc: 'public/sw.js',
}