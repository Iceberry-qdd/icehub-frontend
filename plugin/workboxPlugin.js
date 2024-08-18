import { injectManifest } from 'workbox-build'

const workboxOptions = {
    injectionPoint: '/self.__WB_MANIFEST/',
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

function workboxPlugin(isBuild) {
    if(!isBuild) return undefined

    return {
        name: "workbox",
        apply: "build",
        enforce: "post",
        writeBundle(_, bundle) {
            const swFile = Object.getOwnPropertyNames(bundle).find(it => it.match(/^assets\/sw\.[a-f0-9]{8}\.js$/))
            if(!swFile){
                console.debug(`[rollup-workbox] Ignore "${swFile}"`)
                return
            }

            console.debug(`[rollup-workbox] Injecting "${swFile}"`)
            workboxOptions.swSrc = `dist/${swFile}`
            injectManifest(workboxOptions)
                .then(({ count, size, warnings }) => {
                    if (warnings.length > 0) {
                        console.warn(
                            'Warnings encountered while injecting the manifest:',
                            warnings.join('\n')
                        )
                    }
                    console.log(`[rollup-workbox] Injected a manifest which will precache ${count} files, totaling ${size} bytes.`)
                })
        }
    }
}
export { workboxPlugin }