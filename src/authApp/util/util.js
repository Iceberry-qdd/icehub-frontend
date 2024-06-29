import { JSEncrypt } from 'jsencrypt'

export function encodePwd(publicKey, pwd) {
    const encrypt = new JSEncrypt()
    encrypt.setPrivateKey(publicKey)
    const encryptedPK = encrypt.encrypt(pwd)
    return encryptedPK
}