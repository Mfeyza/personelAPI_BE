"use strict"
/* -------------------------------------------------------
    EXPRESS - Personnel API
------------------------------------------------------- */
// passwordEncrypt():

const crypto = require('node:crypto'), //' Node.js'in kriptografi modülü olan 'crypto'yu içe aktarır.
    keyCode = process.env.SECRET_KEY, //' envden 'SECRET_KEY' adlı şifreleme anahtarını alır.
    loopCount = 10_000, //' PBKDF2 şifreleme algoritmasının yineleme sayısını tanımlar.
    charCount = 32, //' Oluşturulacak şifrelenmiş parolanın karakter sayısını tanımlar.
    encType = 'sha512'; //' Kullanılacak şifreleme algoritmasının türünü tanımlar.

module.exports = function (password) { //' Parolayı şifreleyen fonksiyonu tanımlar ve dışa aktarır.
    return crypto.pbkdf2Sync(password, keyCode, loopCount, charCount, encType).toString('hex')
    //' Verilen parolayı, çevre değişkeninden alınan anahtar ile PBKDF2 algoritması kullanarak şifreler.
    //' Sonuç olarak hexadecimal biçiminde bir string döndürür.
}