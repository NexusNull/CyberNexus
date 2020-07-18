class Util {
    constructor() {
    }

    posMod(num, mod) {
        let res = num % mod;
        return (res < 0 ? res + mod : res);
    }

    async sleep(ms) {
        return new Promise(function (resolve) {
            setTimeout(resolve, ms)
        });
    }

    /**
     * @param cname {string}
     * @param cvalue {string}
     * @param exdays {number}
     */
    setCookie(cname, cvalue, exdays) {
        if (typeof cname !== "string") {
            throw TypeError("cname has to be of type string");
        }
        if (typeof cvalue !== "string") {
            throw TypeError("cvalue has to be of type string");
        }
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    /**
     *
     * @param cname {string}
     * @returns {string|null}
     */
    getCookie(cname) {
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return null;
    }


    distance(posA, posB) {
        let dist = Math.sqrt(Math.pow(posA.x - posB.x, 2) + Math.pow(posA.y - posB.y, 2) + Math.pow(posA.z - posB.z, 2))
        return dist;
    }

    clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    /**
     *  copies all position values into a new object
     * @param pos {{x: number, y: number, z: number}}
     * @returns {{x: number, y: number, z: number}}
     */
    copyPosition(pos) {
        return {x: pos.x, y: pos.y, z: pos.z};
    }

    /**
     * copies the position information from the second argument into the first
     * @param posA {{x: number, y: number, z: number}}
     * @param posB {{x: number, y: number, z: number}}
     */
    assignPosition(posA, posB) {
        posA.x = posB.x;
        posA.y = posB.y;
        posA.z = posB.z;
    }

    /**
     * set x,y,z of posA
     * @param posA {{x: {number}, y: {number}, z: {number}}}
     * @param x {number}
     * @param y {number}
     * @param z {number}
     */
    setPosition(posA, x, y, z) {
        posA.x = x;
        posA.y = y;
        posA.z = z;
    }

    toChunkCoordinates(x, y, z) {
        return {
            x: Math.floor(x / 16),
            y: Math.floor(y / 16),
            z: Math.floor(z / 16),
        }
    }

    equalPosition(posA, posB) {
        return posA.x === posB.x && posA.y === posB.y && posA.z === posB.z;
    }

    /**
     *
     * @param path
     * @return {Promise<string>}
     */
    async loadJSON(path: string) {
        return JSON.parse(await this.loadFile(path, "application/json"));
    }

    /**
     *
     * @param path
     * @param mimeType
     * @return {Promise<string>}
     */
    async loadFile(path: string, mimeType: string): Promise<string> {
        return new Promise(function (resolve, reject) {
            var xobj = new XMLHttpRequest();
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
        })
    }
};
let util = new Util();
export {util}