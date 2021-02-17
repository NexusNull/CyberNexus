export default {

    posMod: function (num, mod) {
        let res = num % mod;
        return (res < 0 ? res + mod : res);
    },

    sleep: async function (ms) {
        return new Promise(function (resolve) {
            setTimeout(resolve, ms)
        });
    },

    /**
     * @param cname {string}
     * @param cvalue {string}
     * @param exdays {number}
     */
    setCookie: function (cname, cvalue, exdays) {
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
    },

    /**
     *
     * @param cname {string}
     * @returns {string|null}
     */
    getCookie: function (cname) {
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
    },


    distance: function (posA, posB) {
        let dist = Math.sqrt(Math.pow(posA.x - posB.x, 2) + Math.pow(posA.y - posB.y, 2) + Math.pow(posA.z - posB.z, 2))
        return dist;
    },

    clamp: function (value, min, max) {
        return Math.min(Math.max(value, min), max);
    },

    /**
     *  copies all position values into a new object
     * @param pos {{x: number, y: number, z: number}}
     * @returns {{x: number, y: number, z: number}}
     */
    copyPosition: function (pos) {
        return {x: pos.x, y: pos.y, z: pos.z};
    },

    /**
     * copies the position information from the second argument into the first
     * @param posA {{x: number, y: number, z: number}}
     * @param posB {{x: number, y: number, z: number}}
     */
    assignPosition: function (posA, posB) {
        posA.x = posB.x;
        posA.y = posB.y;
        posA.z = posB.z;
    },

    /**
     * set x,y,z of posA
     * @param posA {{x: {number}, y: {number}, z: {number}}}
     * @param x {number}
     * @param y {number}
     * @param z {number}
     */
    setPosition: function (posA, x, y, z) {
        posA.x = x;
        posA.y = y;
        posA.z = z;
    },

    toChunkCoordinates: function (x, y, z) {
        return {
            x: Math.floor(x / 16),
            y: Math.floor(y / 16),
            z: Math.floor(z / 16),
        }
    },

    equalPosition: function (posA, posB) {
        return posA.x === posB.x && posA.y === posB.y && posA.z === posB.z;
    },

    /**
     *
     * @param path
     * @return {Promise<string>}
     */
    loadJSON: async function(path: string) {
        return JSON.parse(await this.loadFile(path, "application/json"));
    },

    /**
     *
     * @param path
     * @param mimeType
     * @return {Promise<string>}
     */
    loadFile: async function(path: string, mimeType: string): Promise<string> {
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
    },

    async sendRequest(method, url, body?): Promise<string> {
        return new Promise(function (resolve, reject) {
            let xhttp = new XMLHttpRequest();
            xhttp.open(method, url, true);
            let data = "";
            if (typeof body == "object") {
                data = JSON.stringify(body);
                xhttp.setRequestHeader("Content-type", "application/json")
            } else {
                data = body;
            }

            xhttp.onreadystatechange = function () {
                if (xhttp.readyState === XMLHttpRequest.DONE) {
                    if (xhttp.status == 200) {
                        let result = xhttp.responseText;
                        resolve(result);
                    } else {
                        reject(xhttp);
                    }
                }
            };

            xhttp.send(data);
        });
    }
};
