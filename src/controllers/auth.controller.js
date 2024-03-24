"use strict";

const Personnel = require("../models/personnel.model");
const Token = require("../models/token.model");
const passwordEncrypt = require("../helpers/passwordEncrypt");

module.exports = {
  //! GİRİŞ VE ÇIKIŞ İŞLEMLERİ

  login: async (req, res) => {
    /*!
  #swagger.tags = ['Authentication']
  #swagger.summary='login'
  #swagger.description='Login with username and password
 #swagger.parameters['body']={
   in:'body',
  required:'true',
   schema:{
    username:"testf0",
    password:"12345"
  } }


 */
  


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
          const tokenKey = passwordEncrypt(user._id + Date.now()); //* burada kullanıcının benzersiz ıd si ile , o anın zaman damgası birleşir elde edilen girdi passwordEbcrypt fonksiyonuna verilir ve sonuç olarak benzersiz bi token oluşur.
          console.log(typeof tokenKey, tokenKey);
          tokenData = await Token.create({ userId: user._id, token: tokenKey }); //' yeni oluşturulan tokenkey kullanıcının Id si ile beraber modele göre(modelda ne vermiştik userId ve token) veitabanına eklenir ve buna da tokenData der. yani şöyle bir somut örnek olabilir.tokenData= {userId: "123456", token :"12h6494jdsaks"}
        }

        /* TOKEN */

        res.status(200).send({
          error: false,
          token: tokenData.token, //' tokene nokta retasyonuyla ulaştı tokendatanın içinden
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

    /*!
  #swagger.tags = ['Authentication']
  #swagger.summary='logout'
  #swagger.description='delete token'

 */




    /* SESSION */

    req.session = null; //' Oturum bilgilerini temizler.

    /* TOKEN */

    //* 1. Yöntem (Kısa yöntem)
    //? Her kullanıcı için sadece 1 adet token var ise (tüm cihazlardan çıkış yap):

    // console.log(req.user)
    // const deleted = await Token.deleteOne({ userId: req.user._id }) //'  gelen userId si kaydolan _Id ye eşit olan tokeni gidip bul ve onu sil

    //* 2. Yöntem:
    //? Her kullanıcı için 1'den fazla token var ise (çoklu cihaz):

    const auth = req.headers?.authorization || null; // Token ...tokenKey... //' Authorization başlığından kimlik doğrulama bilgisi (token) alınır. Eğer Authorization başlığı mevcut değilse, auth değişkeni null olarak ayarlanır.
    const tokenKey = auth ? auth.split(" ") : null; // ['Token', '...tokenKey...'] //'Token, genellikle "Bearer <token>" veya "Token <token>" formatında saklanır. Bu nedenle, auth değişkeninin boşluk karakterine göre ayrıştırılması gerekir.

    //!Eğer auth değişkeni boş değilse, yani bir Authorization başlığı varsa, bu başlık boşluk karakterine göre ikiye ayrılır ve tokenKey değişkenine bir dizi olarak atanır. Bu dizinin ilk elemanı genellikle token tipini (örneğin, "Token" veya "Bearer"), ikinci elemanı ise tokenın kendisini içerir.

    let deleted = null;
    if (tokenKey && tokenKey[0] == "Token") { //? yine de kontrolü yaptı sıfırıncı eleman Token mı baktı geri kalanaı silecek
      deleted = await Token.deleteOne({ token: tokenKey[1] });//' Bu, Token modelini kullanarak, token değeri tokenKey[1]'e (yani ayrıştırılmış tokenın ikinci elemanına) eşit olan kaydın veritabanından silinmesini sağlar. Bu işlem asenkron olduğu için await anahtar kelimesi ile beklenir.
    }
//token süre
        // if (!tokenData) {
        //     const tokenKey = passwordEncrypt(user._id + Date.now());
        //     const expires = new Date(Date.now() + 3600000); // Örneğin, 1 saat sonraya ayarla (3600000 milisaniye = 1 saat)

        //     tokenData = await Token.create({
        //         userId: user._id,
        //         token: tokenKey,
        //         expires: expires
        //     });
        // }
        //                 let tokenData = await Token.findOne({ userId: user._id });

        // if (tokenData) {
        //     // Şimdiki zaman, tokenın son kullanma zamanından büyük mü kontrol et
        //     if (new Date() > tokenData.expires) {
        //         // Token süresi dolmuş
        //         console.log("Token'ın süresi doldu.");
        //         // Burada tokenı silmek veya kullanıcıya yeni bir token oluşturması için yönlendirme yapmak gibi işlemler yapılabilir
        //     } else {
        //         // Token geçerli
        //         console.log("Token geçerli.");
        //     }
        // }
    /* TOKEN */

    res.status(200).send({
      error: false,
      // message: 'Logout: Sessions Deleted.',
      message: "Logout: Token Deleted.",
      deleted, //* silineni gösterecek
    });
  },
};
