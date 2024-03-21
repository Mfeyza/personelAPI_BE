"use strict" 
/* -------------------------------------------------------
    EXPRESS - Personnel API
------------------------------------------------------- */

module.exports = (req, res, next) => {  // Middleware fonksiyonunu tanımlar ve dışa aktarır.
// Searching & Sorting & Pagination:  

    // SEARCHING: URL?search[key1]=value1&search[key2]=value2
    const search = req.query?.search || {} //' URL'deki `search` sorgu parametresini alır veya boş bir obje tanımlar.
    for (let key in search) search[key] = { $regex: search[key], $options: 'i' } //' Her bir arama terimini regex sorgusu haline getirir.

    //? SORTING: URL'den gelen sıralama bilgisini alır.  // Cancelled -> SORTING: URL?sort[key1]=1&sort[key2]=-1 (1:ASC, -1:DESC)
    //? mongoose=^8.0 -> SORTING: URL?sort[key1]=asc&sort[key2]=desc (asc: A->Z - desc: Z->A)
    const sort = req.query?.sort || {} //' URL'deki `sort` sorgu parametresini alır veya boş bir obje tanımlar.

    //? PAGINATION: URL?page=1&limit=10
    let limit = Number(req.query?.limit) //' URL'deki `limit` sorgu parametresini sayıya çevirir.
    limit = limit > 0 ? limit : Number(process.env?.PAGE_SIZE || 20) //' Eğer limit geçerli bir sayı değilse, varsayılan olarak env veya 20 olarak ayarlar.
    
    let page = Number(req.query?.page) //' URL'deki `page` sorgu parametresini sayıya çevirir.
    page = (page > 0 ? page : 1) - 1 //' Eğer sayfa geçerli bir sayı değilse, varsayılan olarak 1 olarak ayarlar ve 0 tabanlı indeksleme için 1 çıkarır.
    
    let skip = Number(req.query?.skip) //' URL'deki `skip` sorgu parametresini sayıya çevirir.
    skip = skip > 0 ? skip : (page * limit) //' Eğer skip geçerli bir sayı değilse, geçerli sayfa numarasına göre atlanacak kayıt sayısını hesaplar.

    //' Model üzerinden arama, sıralama ve sayfalama işlemlerini yapacak fonksiyonu tanımlar.
    res.getModelList = async function (Model, populate = null) {
        return await Model.find(search).sort(sort).skip(skip).limit(limit).populate(populate)
    }

    //' Arama, sıralama ve sayfalama işlemlerinin detaylarını döndürecek fonksiyonu tanımlar.
    res.getModelListDetails = async function (Model) {
        const data = await Model.find(search) //' Arama kriterlerine uygun kayıtları alır.
        let details = {
            search,
            sort,
            skip,
            limit,
            page,
            pages: {
                previous: (page > 0 ? page : false),
                current: page + 1,
                next: page + 2,
                total: Math.ceil(data.length / limit)
            },
            totalRecords: data.length,
        }
        //' Toplam sayfa sayısından fazla bir sonraki sayfa numarası ayarlanmışsa, sonraki sayfa değerini false olarak ayarlar.
        details.pages.next = (details.pages.next > details.pages.total ? false : details.pages.next)
        //' Eğer toplam kayıt sayısı limit değerinden az veya eşitse, sayfalama bilgisini false olarak ayarlar.
        if (details.totalRecords <= limit) details.pages = false
        return details
    }

    next()
}
