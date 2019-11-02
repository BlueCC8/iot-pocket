export class HexHelper {
    public static a2hex(str) {
        var arr = [];
        for (var i = 0, l = str.length; i < l; i++) {
            var hex = Number(str.charCodeAt(i)).toString(16);
            arr.push(hex);
        }
        return arr.join('');
    }
    public static hex2a(hexx) {
        var hex = hexx.toString(); //force conversion
        var str = '';
        for (var i = 0; i < hex.length && hex.substr(i, 2) !== '00'; i += 2)
            str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
        return str;
    }
}
