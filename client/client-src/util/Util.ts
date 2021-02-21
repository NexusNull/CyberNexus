export default {

    posMod: function (num: number, mod: number): number {
        const res = num % mod;
        return (res < 0 ? res + mod : res);
    },

    sleep: async function (ms: number): Promise<void> {
        return new Promise(function (resolve) {
            setTimeout(resolve, ms);
        });
    },


    setCookie: function (cname: string, cvalue: string, exdays: number): void {
        if (typeof cname !== 'string') {
            throw TypeError('cname has to be of type string');
        }
        if (typeof cvalue !== 'string') {
            throw TypeError('cvalue has to be of type string');
        }
        const d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        const expires = 'expires=' + d.toUTCString();
        document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';
    },

    getCookie: function (cname: string): string | null {
        const name = cname + '=';
        const decodedCookie = decodeURIComponent(document.cookie);
        const ca = decodedCookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return null;
    },

    distance: function (posA: { x: number, y: number, z: number }, posB: { x: number, y: number, z: number }): number {
        return Math.sqrt(Math.pow(posA.x - posB.x, 2) + Math.pow(posA.y - posB.y, 2) + Math.pow(posA.z - posB.z, 2));
    },

    clamp: function (value: number, min: number, max: number): number {
        return Math.min(Math.max(value, min), max);
    },

    /**
     *  copies all position values into a new object
     */
    copyPosition: function (pos: { x: number, y: number, z: number }): { x: number, y: number, z: number } {
        return {x: pos.x, y: pos.y, z: pos.z};
    },

    /**
     * copies the position information from the second argument into the first
     */
    assignPosition: function (posA: { x: number, y: number, z: number }, posB: { x: number, y: number, z: number }): void {
        posA.x = posB.x;
        posA.y = posB.y;
        posA.z = posB.z;
    },

    /**
     * set x,y,z of posA
     */
    setPosition: function (posA: { x: number, y: number, z: number }, x: number, y: number, z: number): void {
        posA.x = x;
        posA.y = y;
        posA.z = z;
    },

    toChunkCoordinates: function (x: number, y: number, z: number): { x: number, y: number, z: number } {
        return {
            x: Math.floor(x / 16),
            y: Math.floor(y / 16),
            z: Math.floor(z / 16),
        };
    },

    equalPosition: function (posA: { x: number, y: number, z: number }, posB: { x: number, y: number, z: number }): boolean {
        return posA.x === posB.x && posA.y === posB.y && posA.z === posB.z;
    },

    deepCopy: function (obj: any): any {
        const newObj = Object.assign({}, obj);
        for (const key in newObj) {
            if (typeof newObj[key] == "object") {
                newObj[key] = this.deepCopy(obj[key]);
            }
        }
        return newObj;
    },

    loadJSON: async function (path: string): Promise<any> {
        return JSON.parse(await this.loadFile(path, 'application/json'));
    },

    loadFile: async function (path: string, mimeType: string): Promise<string> {
        return new Promise(function (resolve, reject) {
            const xobj = new XMLHttpRequest();
            xobj.overrideMimeType(mimeType);
            xobj.open('GET', path, true);
            xobj.onreadystatechange = function () {
                if (xobj.readyState === 4) {
                    switch (xobj.status) {
                    case 200:
                        resolve(xobj.responseText);
                        break;
                    case 404:
                        reject(`${xobj.responseText} for ${xobj.responseURL}`);
                        break;
                    }
                }
            };
            xobj.send(null);
        });
    },

    async sendRequest(method: string, url: string, body?: any): Promise<string> {
        return new Promise(function (resolve, reject) {
            const xhttp = new XMLHttpRequest();
            xhttp.open(method, url, true);
            let data;
            if (typeof body == 'object') {
                data = JSON.stringify(body);
                xhttp.setRequestHeader('Content-type', 'application/json');
            } else {
                data = body;
            }

            xhttp.onreadystatechange = function () {
                if (xhttp.readyState === XMLHttpRequest.DONE) {
                    if (xhttp.status == 200) {
                        const result = xhttp.responseText;
                        resolve(result);
                    } else {
                        reject(xhttp);
                    }
                }
            };

            xhttp.send(data);
        });
    },
};
