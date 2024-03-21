"use strict";
/* -------------------------------------------------------
    EXPRESS - Personnel API
------------------------------------------------------- */
// app.use(authentication):

const Token = require("../models/token.model");

module.exports = async (req, res, next) => {
  // Authorization: Token ...
  // Authorization: ApiKey ...
  // Authorization: X-API-KEY ...
  // Authorization: x-auth-token ...
  // Authorization: Bearer ...

  const auth = req.headers?.authorization || null; // Token ...tokenKey...
  const tokenKey = auth ? auth.split(" ") : null; // ['Token', '...tokenKey...']

  if (tokenKey && tokenKey[0] == "Token") {
    const tokenData = await Token.findOne({ token: tokenKey[1] }).populate(
      "userId"
    );  //'Token' modeli kullanarak, 'tokenKey[1]' değerine sahip token'ı veritabanından arar ve bu token'a bağlı kullanıcıyı (userId) da getirir.
   
    // console.log(tokenData)
    //* Eğer 'tokenData' varsa, yani token bulunduysa, bulunan kullanıcı bilgisini 'req.user' içine ekler.
    if (tokenData) req.user = tokenData.userId; // Personnel Data
    // console.log(req.user)
  }

  next();
};


//'  populate() Metodunun İşlevi:
//? Referansları Gerçek Veriyle Doldurma: populate() kullanarak, bir modeldeki referans alanının sadece ID'si yerine, ilişkili olduğu koleksiyondan o ID'ye ait tüm veriyi getirebilir ve sorgulanan belgeye ekleyebilirsiniz.
//* Okunabilirlik ve Kullanışlılık: İlişkili verilerin doğrudan sorgu sonucunda birleştirilmesi, uygulama kodunda ek veri birleştirme işlemleri yapmaya gerek bırakmaz ve verilerin kullanımını kolaylaştırır.
//! Esneklik: Birden fazla alanı ve hatta iç içe ilişkili alanları populate() ile doldurabilirsiniz. Ayrıca, hangi alanların getirileceğini, sıralama veya limit gibi ek sorgu parametrelerini belirleyebilirsiniz.