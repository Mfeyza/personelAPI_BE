"use strict"
/* -------------------------------------------------------
    NODEJS EXPRESS | CLARUSWAY FullStack Team
------------------------------------------------------- */
// Middleware: permissions (authorization)

module.exports = {

    isLogin: (req, res, next) => {
  if(req.user){
    next()
} else {
    
}
    },

    isLead: (req, res, next) => {

    },

    isAdmin: (req, res, next) => {

    },
}