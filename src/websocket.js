import SockJS from "sockjs-client/dist/sockjs.min.js"
import Stomp from 'stompjs'
import { reactive } from "vue"

export class MsgPack {
    /**
     * 构造MsgPack对象
     * @param {String} msg 消息内容
     * @param {String} from 发送者id
     * @param {String} type 消息类型
     * @param {String} to 接收者id
     * @param {Number} timestamp 消息时间戳
     */
    constructor(msg, from, type, to) {
        this.msg = msg
        this.from = from
        this.type = type
        this.to = to
        this.timestamp = Date.now()
    }
}

export const ws = reactive({
    url: 'http://192.168.0.103:8080/ws',
    globalStompClient: null,
    reconnectCount: 0,
    connectState: 'DISCONNECT', // CONNECTED,MAX_TRY_RECONNECT,DISCONNECTED,CONNECTED_FAILED
    wsReconnect: 0,
    initWebsocket() {
        let socket = new SockJS(this.url, null, { timeout: 15000 })
        this.globalStompClient = Stomp.over(socket)
    },
    connectWebsocket(token) {
        const that = this
        this.globalStompClient.connect({ TOKEN: token }, function (frame) {
            console.log(`[Websocket]connected successful: ${frame}`)
            that.connectState = 'CONNECTED'
        }, function (error) {
            console.error(`[Websocket]Can not connect to the websocket server: ${error}`)
            that.connectState = 'CONNECTED_FAILED'
        })
    },
    reconnectWebsocket() {
        const that = this
        if (this.reconnectCount > 10) {
            this.connectState = 'MAX_TRY_RECONNECT'
            console.error('[Websocket]Reconnect count is over limit, connect failed!')
            return
        }

        if (this.connectState == 'CONNECTED') {
            console.warn('[Websocket]You have already connected, no need to reconnect.')
            return
        }

        if (this.connectState == 'DISCONNECTED') {
            console.warn('[Websocket]You have already actively disconnected, can not reconnect.')
            return
        }

        this.wsReconnect && clearTimeout(this.wsReconnect)
        this.wsReconnect = setTimeout(function () {
            console.log('[Websocket]Starting reconnect...')
            that.reconnectCount++
            that.connectWebsocket()
        }, 1000)
    },
    disconnectWebsocket() {
        if (this.globalStompClient != null) {
            this.globalStompClient.disconnect(function () {
                console.log('[Websocket]Stopping connect...')
            })
        }
    },
    /**
     * 订阅topic信息
     * @param {String} topicPath 订阅的topic路径
     * @param {function} fn 订阅回调函数
     */
    subscribeTopic(topicPath, fn) {
        this.globalStompClient.subscribe(topicPath, fn)
    },
    /**
     * 订阅queue信息
     * @param {String} queuePath 订阅的queue路径
     * @param {function} fn 订阅回调函数
     */
    subscribeQueue(queuePath, fn) {
        this.globalStompClient.subscribe(queuePath, fn)
    },
    /**
     * 向topic发送消息
     * @param {MsgPack} msg 消息实体
     */
    sendToTopic(msg) {
        this.globalStompClient.send('/app/send/public/notify', {}, JSON.stringify(msg))
    },
    /**
     * 向单人queue发送消息
     * @param {MsgPack} msg 消息实体
     */
    sendToOneQueue(msg, channelName) {
        this.globalStompClient.send(`/app/send/one/${msg.to}/${channelName}`, {}, JSON.stringify(msg))
    },
    /**
     * 向指定用户id的指定channel发送消息
     * @param {string} receiverId 接收者id
     * @param {string} channelName channel名字
     * @param {MsgPack} msg 消息实体
     */
    sendToOnesChannel(receiverId, channelName, msg) {
        this.globalStompClient.send(`/app/send/one/${receiverId}/${channelName}`, {}, JSON.stringify(msg))
    }
})