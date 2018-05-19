/*
* @Author: Marte
* @Date:   2018-04-22 18:37:02
* @Last Modified by:   Marte
* @Last Modified time: 2018-04-22 19:59:50
*/
export function saveLocal (id, key, val) {     //把数据存到本地
    let seller = window.localStorage.__store__;   //__store__表示私有变量
    if (!seller) {
        seller = {};
        seller[id] = {};
    }else{
        seller = JSON.parse(seller);
        if (!seller[id]) {
            seller[id] = {};
        }
    }
    seller[id][key] = val;
    window.localStorage.__store__ = JSON.stringify(seller);    //存储要用stringify方法转成字符串
};

export function fetchLocal (id, key, defaul) {   //获取本地的数据
    let seller = window.localStorage.__store__;       //如果存在的话取出来的数据为字符串，需要用parse方法转化为对象
    if (!seller) {
        return defaul;
    }
    seller = JSON.parse(seller);
    if (!seller[id]) {
        return defaul;
    }
    let result = seller[id][key];
    return seller[id][key] || defaul;
}

