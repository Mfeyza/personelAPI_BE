"use strict";

/* -------------------------------------------------------
    EXPRESS - Personnel API
------------------------------------------------------- */


const { mongoose } = require("../configs/dbConnection");


/* ------------------------------------------------------- */
const passwordEncrypt = require("../helpers/passwordEncrypt");


const PersonnelSchema = new mongoose.Schema(
  {
    
    departmentId: {
      type: mongoose.Schema.Types.ObjectId, //? MongoDB'nin benzersiz tanımlayıcısı tipinde.
      ref: "Department", //' Bu alanın "Department" modeline referans verdiğini belirtir.
      required: true, //! Bu alanın zorunlu olduğunu belirtir.
    }, 

    username: {
      type: String,
      trim: true, //' Stringin başında ve sonunda boşluk olup olmadığını kontrol eder.
      required: true,
      unique: true, //' Kullanıcı adının benzersiz olmasını zorunlu kılar.
    },

    password: {
      type: String,
      trim: true,
      required: true,
      set: (password) => passwordEncrypt(password), //' Parolayı şifreleyen fonksiyonu çağırır.
    },

    firstName: { // İsim alanı.
      type: String,
      trim: true,
      required: true,
    },

    lastName: { // Soyisim alanı.
      type: String,
      trim: true,
      required: true,
    },

    phone: { // Telefon numarası alanı.
      type: String,
      trim: true,
      required: true,
    },

    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      validate: (email) => email.includes("@") && email.includes("."), // Email geçerliliğini kontrol eder.
    },

    title: { // Unvan alanı.
      type: String,
      trim: true,
      required: true,
    },

    salary: { // Maaş alanı.
      type: Number,
      default: 0, //' Varsayılan değer olarak 0 belirlenmiştir.
    },

    description: { // Açıklama alanı.
      type: String,
      trim: true,
      default: null,
    },

    isActive: { // Personelin aktif olup olmadığını belirten alan.
      type: Boolean,
      default: true,
    },

    isAdmin: { // Yönetici olup olmadığını belirten alan.
      type: Boolean,
      default: false,
    },

    isLead: { // Lider olup olmadığını belirten alan.
      type: Boolean,
      default: false,
    },

    startedAt: { //' İşe başlama tarihi.
      type: Date,
      default: Date.now(), //' Varsayılan değer olarak şu anki zamanı kullanır.
    },
  },
  { collection: "personnels", timestamps: true } //' Koleksiyon ismi ve zaman damgaları otomatik eklenir.
);

/* ------------------------------------------------------- */
module.exports = mongoose.model("Personnel", PersonnelSchema);
//' "Personnel" adı altında şemayı modelleştirir ve dışa aktarır. Bu model, veritabanı işlemleri için kullanılır.
