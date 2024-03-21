"use strict"
/* -------------------------------------------------------
    NODEJS EXPRESS | CLARUSWAY FullStack Team
------------------------------------------------------- */
// Middleware: permissions (authorization)

module.exports = {

    isLogin: (req, res, next) => {
        if (req.user && req.user.isActive) {
            next(); //* Kullanıcı oturumu açmış ve aktifse, bir sonraki middleware veya route handler'a geçer.
        } else {
            res.errorStatusCode = 403; 
            throw new Error('NoPermission: You must login.'); //' Oturum açma gerektiğini belirten bir hata fırlatır.
        }
    },

    isAdmin: (req, res, next) => {
        if (req.user && req.user.isActive && req.user.isAdmin) {
            next(); //' Kullanıcı oturumu açmış, aktif ve admin yetkisine sahipse bir sonraki işleme geçer.
        } else {
            res.errorStatusCode = 403; 
            throw new Error('NoPermission: You must login and to be Admin.'); //* Admin yetkisine sahip olma gerektiğini belirten bir hata fırlatır.
        }
    },

    isLead: (req, res, next) => {
        const departmentId = req.params?.id; //' URL parametresinden departman ID'sini alır.
    
        if (
            req.user
            && req.user.isActive
            && (req.user.isAdmin || (req.user.isLead && req.user.departmentId == departmentId))
        ) {
            next(); //* Kullanıcı oturumu açmış, aktif ve ya admin yetkisine sahip veya ilgili departmanın lideriyse bir sonraki işleme geçer.
        } else {
            res.errorStatusCode = 403; 
            throw new Error('NoPermission: You must login and to be Admin or Department Lead.'); //' Admin veya departman lideri olma gerektiğini belirten bir hata fırlatır.
        }
    },
}