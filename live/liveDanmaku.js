function liveDanmaku(rid, url) {
    this.roomId = rid;
    this.timer = null;
    this.danmus = [];
    this.socket = new WebSocket(url);
    this.socket.onopen = function () {
        console.log('onopen');
        const firstData = {
            'uid': 0,
            'roomid': parseInt(this.roomid, 10),
            'protover': 2,
            'platform': 'web',
            'clientver': '1.8.5',
            'type': 2,
        };
        this.socket.send(this.sendMessage(JSON.stringify(firstData), 1, 7, 1));
        this.sendHeartbeat();
        timer = setInterval(function () {
            this.sendHeartbeat();
        }, 30000);
    };
    this.socket.onmessage = function (msg) {
        console.log('onmessage');
        var reader = new FileReader();
        reader.readAsArrayBuffer(msg.data);
        reader.onload = function () {
            var content = reader.result;
            this.handleMessage(content);
        }
    };
    this.socket.onclose = function (e) {
        console.log('close code:' + e.code);
        alert('弹幕服务器断开连接');
    };
    this.sendHeartbeat = function () {
        const heartData = '[object Object]';
        socket.send(this.sendData(heartData, 1, 2, 1));
    };
    this.sendMessage = function (data, p, o, s) {
        console.log('send');
        let dataUint8Array = this.stringToUint(data);
        let buffer = new ArrayBuffer(dataUint8Array.byteLength + 16);
        let dv = new DataView(buffer);
        dv.setUint32(0, dataUint8Array.byteLength + 16);
        dv.setUint16(4, 16);
        dv.setUint16(6, parseInt(p, 10));
        dv.setUint32(8, parseInt(o, 10));
        dv.setUint32(12, parseInt(s, 10));
        for (let i = 0; i < dataUint8Array.byteLength; i++)
            dv.setUint8(16 + i, dataUint8Array[i]);
        return buffer;
    };
    this.handleMessage = function (data) {
        const dv = new DataView(data);
        const packageLen = dv.getUint32(0);
        const headerLen = dv.getUint16(4);
        const protover = dv.getUint16(6);
        const operation = dv.getUint32(8);
        data = data.slice(headerLen, packageLen);
        switch (protover) {
            case 0:
                const str = this.uintToString(new Uint8Array(data));
                this.parseDanmuMessage(str);
                break;
            case 1:
                const dataV = new DataView(data);
                if (operation === 3) {
                    console.log("人气值为：" + dataV.getUint32(0));
                }
                else if (operation === 8) {
                    const str = this.uintToString(new Uint8Array(data));
                    console.log(str);
                }
                break;
            case 2:
                if (operation === 5)
                    this.unzip(pako.inflate(new Uint8Array(data)).buffer);
                break;
        }
    };
    this.unzip = function () {
        var offect = 0;
        var len = 0
        const maxLength = data.byteLength;
        while (offect < maxLength) {
            data = data.slice(len, maxLength);
            const dv = new DataView(data);
            const packageLen = dv.getUint32(0);
            const headerLen = dv.getUint16(4);
            const protover = dv.getUint16(6);
            const operation = dv.getUint32(8);
            var datas = data.slice(headerLen, packageLen)
            switch (protover) {
                case 0:
                    const str = this.uintToString(new Uint8Array(datas));
                    this.parseDanmuMessage(str);
                    break;
                case 1:
                    const dataV = new DataView(datas);
                    if (operation === 3) {
                        console.log("人气值为：" + dataV.getUint32(0));
                    } else if (operation === 8) {
                        const str = this.uintToString(new Uint8Array(datas));
                        console.log(str);
                    }
                    break;
                case 2:
                    if (operation === 5) {
                        try {
                            console.log(pako.inflate(new Uint8Array(datas), { to: 'string' }));
                        }
                        catch (err) {
                            console.log(err);
                        }
                    }
                    break;
            }
            offect += packageLen;
            len = packageLen;
        }
    };
    this.parseDanmuMessage = function (jsons) {
        jsons = JSON.parse(jsons);
        switch (jsons.cmd) {
            case "DANMU_MSG":
                const danmu = {
                    name: jsons.info[2][1],
                    message: jsons.info[1]
                };
                this.danmus.push(danmu);
                break;
            default:
                break;
        }
    };
    this.stringToUint = function (s) {
        const charList = s.split('');
        const uintArray = [];
        for (let i = 0; i < charList.length; i++) {
            uintArray.push(charList[i].charCodeAt(0));
        }
        return new Uint8Array(uintArray);
    };
    this.uintToString = function (uintArray) {
        return decodeURIComponent(escape(String.fromCodePoint.apply(null, uintArray)));
    };
}