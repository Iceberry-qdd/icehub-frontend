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
    url: `${import.meta.env.VITE_API_BASE_URL}/ws`,
    globalStompClient: null,
    reconnectCount: 0,
    connectState: 'DISCONNECT', // CONNECTED,MAX_TRY_RECONNECT,DISCONNECTED,CONNECTED_FAILED
    wsReconnect: 0,
    initWebsocket() {
        let socket = new SockJS(this.url, null, { timeout: 15000 })
        this.globalStompClient = Stomp.over(socket)
        this.globalStompClient.heartbeat.outgoing = 20000
        this.globalStompClient.heartbeat.incoming = 20000
    },
    connectWebsocket(token) {
        const that = this
        this.globalStompClient.connect({ TOKEN: token }, function (frame) {
            that.connectState = 'CONNECTED'
            that.reconnectCount = 0
        }, function (error) {
            console.error(`[Websocket]Can not connect to the websocket server: ${error}`)
            that.connectState = 'CONNECTED_FAILED'
        })
    },
    reconnectWebsocket(token) {
        const that = this

        const interval = setInterval(function(){
            that.reconnectCount++
            if (that.reconnectCount > 10) {
                that.connectState = 'MAX_TRY_RECONNECT'
            }
    
            if (['CONNECTED', 'DISCONNECTED', 'MAX_TRY_RECONNECT'].includes(that.connectState)) {
                clearTimeout(timeout)
                clearInterval(interval)
                return
            }

            that.initWebsocket()
            that.connectWebsocket(token)
        }, 5000)

        const timeout = setTimeout(function(){ clearInterval(interval) }, 5000 * 11)
    },
    disconnectWebsocket() {
        if (this.globalStompClient != null) {
            this.globalStompClient.disconnect( function () {
            })
        }
    },
    /**
     * 订阅topic信息
     * @param {String} topicPath 订阅的topic路径
     * @param {function} fn 订阅回调函数
     */
    subscribeTopic(topicPath, fn, headers) {
        this.globalStompClient.subscribe(topicPath, fn, headers)
    },
    /**
     * 订阅queue信息
     * @param {String} queuePath 订阅的queue路径
     * @param {function} fn 订阅回调函数
     */
    subscribeQueue(queuePath, fn, headers) {
        this.globalStompClient.subscribe(queuePath, fn, headers)
    },
    /**
     * 向topic发送消息
     * @param {MsgPack} msg 消息实体
     */
    sendToTopic(msg) {
        this.globalStompClient.send('/app/send/public.notify', {}, JSON.stringify(msg))
    },
    /**
     * 向单人queue发送消息
     * @param {MsgPack} msg 消息实体
     */
    sendToOneQueue(msg, channelName) {
        this.globalStompClient.send(`/app/send/one.${msg.to}.${channelName}`, {}, JSON.stringify(msg))
    },
    /**
     * 向指定用户id的指定channel发送消息
     * @param {string} receiverId 接收者id
     * @param {string} channelName channel名字
     * @param {MsgPack} msg 消息实体
     */
    sendToOnesChannel(receiverId, channelName, msg) {
        this.globalStompClient.send(`/app/send/one.${receiverId}.${channelName}`, {}, JSON.stringify(msg))
    }
})