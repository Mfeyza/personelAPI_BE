"use strict" // JavaScript'in katı modunu etkinleştirir. Bu, belirli hataları önlemeye yardımcı olur ve kodun daha güvenli olmasını sağlar.

/* -------------------------------------------------------
    EXPRESS - Personnel API
------------------------------------------------------- */
// Bu yorum, kodun bir Personel API'sinin parçası olduğunu belirtir.

const { mongoose } = require('../configs/dbConnection')
// '../configs/dbConnection' modülünden 'mongoose' nesnesini çıkarır. Bu, MongoDB'ye bağlanmak için kullanılan Mongoose kütüphanesidir.

/* ------------------------------------------------------- */

const DepartmentSchema = new mongoose.Schema({
    //' Yeni bir Mongoose şeması oluşturur. Bu şema, Department koleksiyonunun yapısını tanımlar.

    name: {
        type: String, // 'name' alanının veri tipi String olmalıdır.
        trim: true, // 'name' alanının başındaki ve sonundaki boşlukları kaldırır.
        required: true, // 'name' alanı zorunludur; bu alanın boş bırakılması kabul edilmez.
        unique: true // 'name' alanındaki değerler benzersiz olmalıdır; aynı değere sahip iki kayıt olamaz.
    }

}, { collection: "departments", timestamps: true })
//' Şemanın hangi koleksiyona ait olduğunu ('departments') ve zaman damgalarını (oluşturulma ve güncellenme zamanları) otomatik olarak eklemesi gerektiğini belirtir.

/* ------------------------------------------------------- */
module.exports = mongoose.model('Department', DepartmentSchema)
// 'Department' adı ve yukarıda tanımlanan şema kullanılarak bir Mongoose modeli oluşturur ve dışa aktarır. Bu model, Department koleksiyonuyla etkileşim kurmak için kullanılır.
