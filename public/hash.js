self.importScripts('https://cdn.jsdelivr.net/npm/spark-md5@3.0.2/spark-md5.min.js')

self.onmessage = function (e) {
    const targetOrigin = window.location.origin
    const { fileChunk, origin } = e.data
    if (origin !== targetOrigin) return

    const spark = new self.SparkMD5.ArrayBuffer()
    const reader = new FileReader()
    reader.readAsArrayBuffer(fileChunk)
    reader.onload = function (ev) {
        spark.append(ev.target.result)
        self.postMessage({
            progress: 100,
            hash: spark.end(),
            origin: targetOrigin
        })
        self.close()
    }
}