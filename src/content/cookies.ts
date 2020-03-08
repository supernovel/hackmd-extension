export function get(key){
    var value = decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(key).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null

    if(value && value.substring(0,1) === "{" && value.substring(value.length-1,value.length) === "}") {
        try {
            value = JSON.parse(value)
        }catch (e) {
            return value;
        }
    }
    
    return value;
}