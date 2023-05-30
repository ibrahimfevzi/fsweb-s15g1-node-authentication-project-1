// `sinirli` middleware'ını `auth-middleware.js` dan require edin. Buna ihtiyacınız olacak!
const router = require("express").Router();
const mw = require("../auth/auth-middleware");
const userModel = require("./users-model");

/**
  [GET] /api/users

  Bu uç nokta SINIRLIDIR: sadece kullanıcı girişi yapmış kullanıcılar
  ulaşabilir.

  response:
  status: 200
  [
    {
      "user_id": 1,
      "username": "bob"
    },
    // etc
  ]

  response giriş yapılamadıysa:
  status: 401
  {
    "message": "Geçemezsiniz!"
  }
 */

router.get("/", mw.sinirli, async (req, res, next) => {
  try {
    const allUsers = await userModel.bul();
    res.json(allUsers);
  } catch (error) {
    next(error);
  }
});
module.exports = router;

// Diğer modüllerde kullanılabilmesi için routerı "exports" nesnesine eklemeyi unutmayın.
