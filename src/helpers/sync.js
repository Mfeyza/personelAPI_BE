"use strict" 

/* -------------------------------------------------------
    EXPRESS - Personnel API
------------------------------------------------------- */


// SYCHRONIZATION:
module.exports = async function() { //' Asenkron bir fonksiyonu dışa aktarır. Bu fonksiyon veritabanı senkronizasyon işlemleri için kullanılır.

    // return null; //' Fonksiyonun burada sonlandırılmasını sağlar. Sonraki kodların çalıştırılmasını engeller.

    /* REMOVE DATABASE */
    const { mongoose } = require('../configs/dbConnection') //'bağlantı ayarları'
    await mongoose.connection.dropDatabase() //' Mongoose aracılığıyla MongoDB veritabanını siler.
    console.log('- Database and all data DELETED!') //' Veritabanının silindiğini konsola yazar.
    /* REMOVE DATABASE */
    
    /* Department & Personnel */
    const Department = require('../models/department.model') //' Department modelini içe aktarır.
    const Personnel = require('../models/personnel.model') //' Personnel modelini içe aktarır.
    const departments = [
        "FullStack Department",
        "DevOps Department",
        "CyberSec Department",
    ] //' Başlangıç bölüm adlarını bir dizi olarak tanımlar.
    departments.forEach(value => { //' Her bir bölüm için döngü başlatır.
        // Department.create:
        Department.create({ name: value }).then((department) => { // Yeni bir bölüm oluşturur ve veritabanına kaydeder.
            console.log('- Department Added.') //' Bölümün eklendiğini konsola yazar.
            // Personnel.create:
            for (let i in [...Array(10)]) { //' Her bölüm için 10 personel oluşturacak bir döngü başlatır.
                Personnel.create({ //' Yeni bir personel oluşturur ve veritabanına kaydeder.
                    departmentId: department._id,
                    username: "test" + (value[0] + i),
                    password: "1234",
                    firstName: "firstName",
                    lastName: "lastName",
                    phone: "123456789",
                    email: "test" + (value[0] + i) + "@site.com",
                    title: "title",
                    salary: 2500,
                    description: "description",
                    isActive: true,
                    isAdmin: false,
                    isLead: false,
                    startedAt: "2023-10-15 13:14:15"
                })
            }
            console.log('- Personnels Added.') //' Personellerin eklendiğini konsola yazar.
        })
    })
    /* Department & Personnel */
}
