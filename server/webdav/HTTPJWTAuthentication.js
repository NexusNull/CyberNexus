const jwt = require("jsonwebtoken");
const SimpleUser = require("webdav-server").v2.SimpleUser;
const Errors = require("webdav-server").Errors;

class HTTPJWTAuthentication {
    constructor(privilegeManager, realm = 'realm', publicKey) {
        this.publicKey = publicKey;
        this.privilegeManager = privilegeManager;
        this.users = new Map();
        this.defaultUser = new SimpleUser('DefaultUser', '', false, true);
    }

    askForAuthentication(ctx) {
        return {
            'WWW-Authenticate': `Bearer realm="${this.realm}"`
        }
    }

    getUser(ctx, callback) {
        const onError = (error) => {
            callback(error, this.defaultUser)
        }

        const authHeader = ctx.headers.find('Authorization');
        let type, credentials;
        if (authHeader) {
            [type, credentials] = authHeader.split(' ');
            if (type !== 'Bearer' || !credentials) {
                onError(Errors.WrongHeaderFormat)
                return;
            }
        } else {
            onError(Errors.MissingAuthorisationHeader)
            return;
        }

        let token

        try {
            token = jwt.verify(credentials, this.publicKey);
        } catch (e) {
            console.log(e)
            onError(Errors.BadAuthentication)
            return;
        }

        let user = this.users.get(credentials);
        if (!user) {
            user = new SimpleUser(token.uid, '', token.admin, false);
            token.paths.forEach((ele) => {
                this.privilegeManager.setRights(user, ele.path, ele.perms)
            })
            this.users.set(credentials, user);
        }
        callback(null, user);
    }
}

module.exports = HTTPJWTAuthentication;