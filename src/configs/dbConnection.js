"use strict" // JavaScript'in strict modunu etkinleştirir, potansiyel hataları önlemeye yardımcı olur.

/* -------------------------------------------------------
    EXPRESS - Personnel API
------------------------------------------------------- */


const mongoose = require('mongoose') //' Mongoose modülünü içe aktarır. Mongoose, MongoDB için bir ODM (Object Data Modeling) aracıdır.

const dbConnection = function() { //' db bağlantısı için fonksiyon .
    // Bağlan:
    mongoose.connect(process.env.MONGODB) //' process.env.MONGODB değişkeninde saklanan MongoDB bağlantı dizesini kullanarak MongoDB'ye bağlanmaya çalışır.
        .then(() => console.log('* DB Connected * ')) //'  başarılı mesaj 
        .catch((err) => console.log('* DB Not Connected * ', err)) //'başarısız mesaj.
}

/* ------------------------------------------------------- */
module.exports = {
    mongoose, //' Mongoose modülünü dışa aktarır.
    dbConnection //' dbConnection fonksiyonunu dışa aktarır.
} 
