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
    /** https://stackoverflow.com/questions/4459928/how-to-deep-clone-in-javascript/
     *  In my opinion we should have to deal with this, cloning something complex should lead to a compiler/runtime error
     *  because some things shouldn't or can't be cloned properly and any attempt to do so should throw an error into the devs face saying "Fix your shit".
     *  In this case tough i'm lazy and this works for the objects I'm using it for.
     *  To anyone else using this, this function should be a last/least effort,
     *  this function will do so much unnecessary work that can be fixed with a little knowledge about the object.
     */
    clone: function <Type>(item: Type): Type {
        if (!item) {
            return item;
        }

        const types = [Number, String, Boolean];
        let result;

        types.forEach(function (type) {
            if (item instanceof type) {
                result = type(item);
            }
        });

        if (typeof result == "undefined") {
            if (Array.isArray(item)) {
                result = [];
                item.forEach((child, index) => {
                    result[index] = this.clone(child);
                });
            } else if (typeof item == "object") {
                if (item instanceof Date) {
                    result = new Date(item);
                } else {
                    // it is an object literal
                    result = {};
                    for (const i in item) {
                        result[i] = this.clone(item[i]);
                    }
                }
            } else {
                result = item;
            }
        }

        return result;
    },

    /** Why this isn't standard functionality is beyond me */
    intersectSet: function <Type>(a: Set<Type>, b: Set<Type>): Set<Type> {
        const result: Set<Type> = new Set();
        for (const elem of a) {
            if (b.has(elem)) {
                result.add(elem);
            }
        }
        return result;
    },

    /** Why this isn't standard functionality is beyond me */
    differenceSet: function <Type>(a: Set<Type>, b: Set<Type>): Set<Type> {
        const result: Set<Type> = new Set();
        for (const elem of a) {
            if (!b.has(elem)) {
                result.add(elem);
            }
        }
        return result;
    },

    normalizePath(path: string): string {
        const trailing = path.endsWith("/");
        const elements = path.split('/').filter((elem) => elem.length > 0 && elem != ".");
        const newElements = [];
        for (const element of elements) {
            if (element == "..")
                newElements.pop();
            else
                newElements.push(element);
        }
        const resultPath = "/" + newElements.join("/");
        return resultPath + (!resultPath.endsWith("/") && trailing ? "/" : "");
    },

    parsePath: function (path: string): string[] {
        path = this.normalizePath(path);
        return path.split('/').filter((elem) => elem.length > 0);
    },

    loadJSON: async function (path: string): Promise<unknown> {
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

    async sendRequest(method: string, url: string, body?: unknown): Promise<string> {
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
