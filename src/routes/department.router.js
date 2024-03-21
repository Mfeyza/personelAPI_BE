"use strict"; 

/* -------------------------------------------------------
    EXPRESS - Personnel API
------------------------------------------------------- */


const router = require('express').Router();
//' Express'in Router fonksiyonunu kullanarak yeni bir router örneği oluşturur.

/* ------------------------------------------------------- */

const department = require('../controllers/department.controller');
//' Department ile ilgili işlemleri yöneten controller'ı içe aktarır.

// URL: /departments
// '/departments' URL'si için route tanımları başlar.

router.route('/')
    .get(department.list) 
    .post(department.create); 

router.route('/:id')
    .get(department.read) 
    .put(department.update) 
    .patch(department.update) 
    .delete(department.delete); 

router.get('/:id/personnels', department.personnels);
//' GET /departments/:id/personnels - Belirli bir departmana ait personelleri listeler.

/* ------------------------------------------------------- */
module.exports = router;

