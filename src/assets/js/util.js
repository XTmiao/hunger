/*

解析url参数：
example: ?id=123&a=b
 */
export function urlParse () {
    let url = window.location.search;    //?id=123&a=b
    if (url) {    //如果url不为空
        let reg = /[?&][^?&]+=[^?&]/g;
        let arr = url.match( reg );            //["?id=1", "&a=b"]
        let parse = {};
        arr.forEach( (item) => {
            let arrNew = item.substring(1).split('=');
            let key = decodeURIComponent(arrNew[0]);
            let val = decodeURIComponent(arrNew[1]);
            /*let key = arrNew[0];
            let val = arrNew[1];*/
            parse[key] = val;
        } );
        return parse;     //{id: "1", a: "b"}
    }
    return 0;
};