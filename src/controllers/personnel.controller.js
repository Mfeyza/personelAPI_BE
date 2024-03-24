"use strict";

const Personnel = require("../models/personnel.model"); //' Personnel modelini içe aktarır.

module.exports = {


  list: async (req, res) => {
      /*
    #swagger.tags = ["Personnels"]
    #swagger.summary = "List Personnels"
    #swagger.description = `
        You can send query with endpoint for search[], sort[], page and limit.
        <ul> Examples:
            <li>URL/?<b>search[field1]=value1&search[field2]=value2</b></li>
            <li>URL/?<b>sort[field1]=1&sort[field2]=-1</b></li>
            <li>URL/?<b>page=2&limit=1</b></li>
        </ul>
    `
*/
    //' Personelleri listeler.
    const data = await res.getModelList(Personnel, {}, "departmentId"); //'res.getModelList fonksiyonunun ikinci parametresi olarak boş bir obje ({}) geçirilmesi, bu fonksiyona özel bir filtre uygulanmadığını belirtir. Bu durum, Personnel modeline ait tüm kayıtların filtresiz olarak sorgulanıp getirileceği anlamına gelir. İkinci parametre genellikle bir filtreleme kriteri alır; eğer bu parametre boş bir obje olarak belirtilirse, bu, "herhangi bir ek filtreleme yapma" anlamına gelir.
    //' Özel bir yardımcı fonksiyon kullanarak, personelleri departman ID'sine göre listeler.

    res.status(200).send({
      error: false,
      detail: await res.getModelListDetails(Personnel),
      data, //' Listelenen personelleri gönderir.
    });
  },

  create: async (req, res) => {
    /*
#swagger.tags = ["Personnels"]
#swagger.summary = "Create Personnel"
#swagger.parameters['body'] = {
    in: 'body',
    required: true,
    schema: {
        username: "test",
        password: "1234",
        firstName: "firstName",
        lastName: "lastName",
        phone: "123456789",
        email: "test@site.com",
        title: "title",
        salary: 2500,
        description: "description",
        isActive: true,
        isAdmin: false,
        isLead: false,
        startedAt: "2023-10-15 13:14:15"
    }
}
*/
    //'! Yeni bir personel oluşturur.
    // isLead Kontrolü:
    const isLead = req.body?.isLead || false;
    if (isLead) {
      //* Eğer isLead true ise, aynı departmandaki diğer personellerin isLead'ini false yapar.
      await Personnel.updateMany(
        { departmentId: req.body.departmentId, isLead: true },
        { isLead: false }
      );
    }

    const data = await Personnel.create(req.body); //* Request body'den alınan bilgilerle personel oluşturur.

    res.status(201).send({
      error: false,
      data, //* Oluşturulan personelin bilgilerini gönderir.
    });
  },

  read: async (req, res) => {
    /*
    #swagger.tags = ["Personnels"]
    #swagger.summary = "Get Single Personnel"
*/
    //* Bir personelin detaylarını getirir.
    const data = await Personnel.findOne({ _id: req.params.id });

    res.status(200).send({
      error: false,
      data, //* Bulunan personelin bilgilerini gönderir.
    });
  },

  update: async (req, res) => {
    /*
    #swagger.tags = ["Personnels"]
    #swagger.summary = "Update Personnel"
    #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema: {
            username: "updatedUsername",
            password: "4321",
            firstName: "Dohn",
            lastName: "Joe",
            phone: "987654321",
            email: "jdoetest@site.com",
            title: "title1",
            salary: 5000,
            description: "updatedDescription",
            isActive: true,
            isAdmin: true,
            isLead: true,
        }
    }
*/
    //* Bir personeli günceller.
    //* isLead Kontrolü:
    const isLead = req.body?.isLead || false;
    if (isLead) {
      //* Eğer isLead true ise, aynı departmandaki diğer personellerin isLead'ini false yapar.
      //' Öncelikle, güncellenmek istenen personelin mevcut departman ID'sini bulmak için bir sorgu yapılır.
      const { departmentId } = await Personnel.findOne(
        { _id: req.params.id },
        { departmentId: 1 }
      );

      //'Bu satır, `Personnel` koleksiyonunda belirtilen `_id`'ye (URL parametresinden alınan) sahip kaydı bulur.İkinci parametre ({ departmentId: 1 }), MongoDB'nin projection özelliğini kullanarak sadece `departmentId` alanının döndürülmesini sağlar. Bu şekilde, istenen personelin hangi departmana ait olduğu bilgisi elde edilir.

      //' Daha sonra, bulunan `departmentId` kullanılarak, aynı departmanda ve `isLead` alanı `true` olan
      //' tüm personellerin `isLead` alanını `false` yapacak bir güncelleme işlemi yapılır.
      await Personnel.updateMany(
        { departmentId, isLead: true },
        { isLead: false }
      );
      //' Bu satır, `departmentId` ve `isLead: true` kriterlerine uyan tüm `Personnel` kayıtlarını günceller.
      //'{ isLead: false } ile yapılan güncelleme, bu kriterlere uyan personellerin `isLead` alanlarını `false` olarak değiştirir.
      //'Bu işlem, aynı departmanda sadece bir personelin lider (`isLead: true`) olmasını sağlamak için kullanılır.
      //' Yani, yeni bir lider atanıyorsa, eski liderin (veya liderlerin) `isLead` statüsü kaldırılır.

      //'Bu işlem genellikle, bir departmanda birden fazla lider olmamasını sağlamak amacıyla yapılır.Yeni bir personel lider olarak atanıyorsa, aynı departmandaki diğer personellerin liderlik statüsü iptal edilir.böylece departman içinde sadece bir lider olur.
    }

    // 'Personnel' modeli üzerinden bir belgeyi (document) güncellemek için 'updateOne' metodu kullanılır.

    //' Bu metod, ilk parametre olarak güncellenecek belgenin sorgu kriterlerini,
    //' ikinci parametre olarak güncellenmesi istenen yeni değerleri,
    //' üçüncü parametre olarak da çeşitli seçenekleri alır.
    const data = await Personnel.updateOne(
      { _id: req.params.id }, //? İlk parametre: Güncellenmek istenen belgenin sorgu kriteri. Burada, URL'den alınan 'id' değeri kullanılıyor.
      req.body, //? İkinci parametre: Güncellenmesi istenen yeni değerler. Bu, genellikle HTTP isteğinin gövdesinden ('req.body') alınır.
      { runValidators: true } //? Üçüncü parametre: Güncelleme işlemi sırasında Mongoose şema validatörlerinin çalıştırılmasını sağlar.
    );
    //?Bu kod satırı, belirli bir 'id'ye sahip 'Personnel' belgesini, istek gövdesinde ('req.body') bulunan bilgilerle günceller. 'runValidators: true' seçeneği sayesinde, modelin şema tanımında belirtilmiş validatörler, güncelleme işlemi sırasında da çalıştırılır. Bu, güncellenen verinin model şemasına uygun olmasını sağlar. Örneğin, şemada bir alanın 'required: true' olarak işaretlenmiş olması durumunda, bu alanın güncelleme isteğinde eksik olmaması gerektiğini kontrol eder. Veya belirli bir alan için tanımlanmış özel bir validasyon fonksiyonu varsa,bu fonksiyonun sağladığı koşulları güncellenen verinin de karşılaması gerekir.'data' değişkeni, 'updateOne' metodunun sonucunu tutar. Bu sonuç, güncelleme işleminin başarılı olup olmadığı,kaç adet belgenin etkilendiği gibi bilgileri içerir. Ancak güncellenen belgenin kendisini doğrudan döndürmez.

    res.status(202).send({
      error: false,
      data, //' Güncelleme işleminin sonucunu gönderir.
      new: await Personnel.findOne({ _id: req.params.id }), //' Güncellenmiş personelin bilgilerini gönderir.
    });
  },

  delete: async (req, res) => {
    /*
    #swagger.tags = ["Personnels"]
    #swagger.summary = "Delete Personnel"
*/
    //' Bir personeli siler.
    const data = await Personnel.deleteOne({ _id: req.params.id });

    res.status(data.deletedCount ? 204 : 404).send({
      error: !data.deletedCount, //' Silme işlemi başarılı ise false, değilse true döner.
      data, //' Silme işleminin sonucunu gönderir.
    });
  },
};
