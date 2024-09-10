import DOMPurify from 'dompurify'

const config = {
    SAFE_FOR_TEMPLATES: false,
    SAFE_FOR_XML: true,
    USE_PROFILES: {
        html: true,
        mathMl: true,
        svg: true
    },
    CUSTOM_ELEMENT_HANDLING: {
        tagNameCheck: null, // no custom elements are allowed
        attributeNameCheck: null, // default / standard attribute allow-list is used
        allowCustomizedBuiltInElements: false, // no customized built-ins allowed
    },
    ALLOW_UNKNOWN_PROTOCOLS: false,
    ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|xxx):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
    RETURN_DOM: true,
    RETURN_DOM_FRAGMENT: false,
    RETURN_TRUSTED_TYPE: false,
    WHOLE_DOCUMENT: false,
    SANITIZE_DOM: true,
    SANITIZE_NAMED_PROPS: false,
    KEEP_CONTENT: true,
    FORCE_BODY: false,
    PARSER_MEDIA_TYPE: 'text/html',
    IN_PLACE: true
}

DOMPurify.setConfig(config)

export const domCleanExt = {
    type: 'output',
    filter: function(text, converter, options){
        const clean = DOMPurify.sanitize(text)
        return clean.innerHTML
    }
}