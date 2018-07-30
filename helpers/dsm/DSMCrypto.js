const crypto = require('crypto');
require('dotenv').config();

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY; // Must be 256 bytes (32 characters)
const IV_LENGTH = 16;
const CIPHER = "";

module.exports = {
    encryptForUrl(dsm, user) {
        const json = {
            id: dsm._id,
            user: user
        };
        const text = JSON.stringify(json);
        return this.encrypt(text);
    },
    encrypt(text) {
        let iv = crypto.randomBytes(IV_LENGTH);
        let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
        let encrypted = cipher.update(text);

        encrypted = Buffer.concat([encrypted, cipher.final()]);

        return iv.toString('base64') + ':' + encrypted.toString('base64');
    },
    decrypt(text) {
        let textParts = text.split(':');
        let iv = new Buffer(textParts.shift(), 'base64');
        let encryptedText = Buffer.from(textParts.join(':'), 'base64');
        let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
        let decrypted = decipher.update(encryptedText);

        decrypted = Buffer.concat([decrypted, decipher.final()]);

        return decrypted.toString();
    }
};