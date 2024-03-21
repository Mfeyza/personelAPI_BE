"use strict";
/* -------------------------------------------------------
    EXPRESS - Personnel API
------------------------------------------------------- */


const Department = require("../models/department.model"); //' Department modelini içe aktarır, veritabanı işlemleri için kullanılır.

module.exports = {
  list: async (req, res) => { //? Tüm departmanları listeler.
      // const data = await Department.find(search).sort(sort).skip(skip).limit(limit)
    const data = await res.getModelList(Department); //? Önceden tanımlanmış getModelList yardımcı fonksiyonu ile departman listesini alır.
    res.status(200).send({ 
      error: false,  
      detail: await res.getModelListDetails(Department), 
      data, 
    });
  },

  create: async (req, res) => {
    const data = await Department.create(req.body); //' Request body'sinden alınan verilerle yeni bir departman kaydı oluşturur.
    res.status(201).send({ 
      error: false,
      data, 
    });
  },

  read: async (req, res) => { //' Belirli bir departmanın detaylarını getirir.
    const data = await Department.findOne({ _id: req.params.id }); //' URL parametresindeki id'ye göre departmanı bulur.
    res.status(200).send({ 
      error: false, 
      data, 
    });
  },

  update: async (req, res) => { //' Belirli bir departmanı günceller.
    const data = await Department.updateOne({ _id: req.params.id }, req.body, {
      runValidators: true, //' Güncelleme sırasında Mongoose validator'larını çalıştırır.
    });
    res.status(202).send({ 
      error: false, 
    data, 
      new: await Department.findOne({ _id: req.params.id }), //' Güncellenmiş departmanın bilgilerini içerir.
    });
  },
  
   // const isDeleted = data.deletedCount >= 1 ? true : false

    // res.status(isDeleted ? 204 : 404).send({
    //     error: !isDeleted,
    //     data
    // })

  delete: async (req, res) => { //' Belirli bir departmanı siler.
    const data = await Department.deleteOne({ _id: req.params.id }); //' URL parametresindeki id'ye göre departmanı siler.
    res.status(data.deletedCount ? 204 : 404).send({ 
      error: !data.deletedCount, //' Silme işlemi başarısız ise true, başarılı ise false döner.
      data, //' Silme işlemi sonucunu içerir.
    });
  },

  personnels: async (req, res) => { //' Bir departmana ait personelleri listeler.
    const Personnel = require("../models/personnel.model"); //' Personnel modelini içe aktarır.
    const data = await res.getModelList(
      Personnel,
      { departmentId: req.params.id }, //' Belirli bir departmana ait personelleri filtreler.
      "departmentId"
    );
    res.status(200).send({ 
      error: false, 
      detail: await res.getModelListDetails(
        Personnel,
        { departmentId: req.params.id },
        "departmentId"
      ), //' Listeleme detaylarını içerir.
      data, //' Listelenen personellerin bilgilerini içerir.
    });
  },
};
