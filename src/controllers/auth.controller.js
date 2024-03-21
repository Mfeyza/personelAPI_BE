"use strict";

const Personnel = require("../models/personnel.model");
const Token = require("../models/token.model");
const passwordEncrypt = require("../helpers/passwordEncrypt");

module.exports = {
  //! GİRİŞ VE ÇIKIŞ İŞLEMLERİ

  login: async (req, res) => {
    //' Bir personelin sistem girişi yapmasını sağlar.
    const { username, password } = req.body;

    if (username && password) {
      //* findOne, passwordu modeldeki set metodundaki encrypt i kullanarak db'de filtreleme yapar
      const user = await Personnel.findOne({ username, password });
      if (user && user.isActive) {
        //! user varsa ve aktifse userın varlığını personnel modelinden bulduk, isactivelik durumuna da dönen yanıttan ulaştık.

        // //' Oturum bilgilerini ayarlar.
        // req.session = {
        //     id: user._id,
        //     password: user.password
        // };
        // //' Hatırla seçeneği varsa, cookie'nin süresini 3 gün olarak ayarlar.
        // if (req.body?.rememberMe) {
        //     req.sessionOptions.maxAge = 1000 * 60 * 60 * 24 * 3; // 3 Gün
        // }

        //! TOKEN
        //* token var mıdır? kullanıcını _id özelliği her kayıt için benzersiz tanımlayıcıdı.Eğer token modelinde userId alanı user._id ye eşir olan bi kayıt bulursa bu kullanıcın kaydı var demektir.
        let tokenData = await Token.findOne({ userId: user._id });

        //? Eğer token yoksa oluştur:
        if (!tokenData) {
          //' token data undefined ya da null ise
          const tokenKey = passwordEncrypt(user._id + Date.now()); //* burada kullanıcının benzersiz ıd si ile , o anın zaman damgası birleşir elde edilen girdi passwordEbcrypt fonksiyonuna verilir ve sonuç larak benersiz bi token oluşur.
          console.log(typeof tokenKey, tokenKey);
          tokenData = await Token.create({ userId: user._id, token: tokenKey });
        }

        /* TOKEN */

        res.status(200).send({
          error: false,
          token: tokenData.token,
          user,
        });
        res.status(200).send({
          error: false,
          user, //' Giriş yapan kullanıcının bilgilerini gönderir.
        });
      } else {
        res.errorStatusCode = 401;
        throw new Error("Yanlış Kullanıcı Adı veya Şifre.");
      }
    } else {
      res.errorStatusCode = 401;
      throw new Error("Lütfen kullanıcı adı ve şifre girin.");
    }
  },

  logout: async (req, res) => {
    //' Kullanıcının sistemden çıkış yapmasını sağlar.
    req.session = null; //' Oturum bilgilerini temizler.
    res.status(200).send({
      error: false,
      message: "Çıkış yapıldı: Oturum bilgileri silindi.",
    });
  },
};
