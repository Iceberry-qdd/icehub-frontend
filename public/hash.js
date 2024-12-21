self.importScripts('https://cdn.jsdelivr.net/npm/spark-md5@3.0.2/spark-md5.min.js')

self.onmessage = function (e) {
    const { fileChunk } = e.data
    const spark = new self.SparkMD5.ArrayBuffer()
    const reader = new FileReader()
    reader.readAsArrayBuffer(fileChunk)
    reader.onload = function (e) {
        spark.append(e.target.result)
        self.postMessage({
            progress: 100,
            hash: spark.end()
        })
        self.close()
    }
}