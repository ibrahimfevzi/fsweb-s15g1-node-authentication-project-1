const userModel = require("../users/users-model");
const bcryptjs = require("bcryptjs");

/*
  Kullanıcının sunucuda kayıtlı bir oturumu yoksa

  status: 401
  {
    "message": "Geçemezsiniz!"
  }
*/
function sinirli(req, res, next) {
  try {
    if (req.session && req.session.user_id > 0) {
      next();
    } else {
      res.status(401).json({ message: "Geçemezsiniz!" });
    }
  } catch (error) {
    next(error);
  }
}

/*
  req.body de verilen username halihazırda veritabanında varsa

  status: 422
  {
    "message": "Username kullaniliyor"
  }
*/
async function usernameBostami(req, res, next) {
  try {
    let { username } = req.body;
    const isExist = await userModel.goreBul({ username: username });
    if (isExist && isExist.length > 0) {
      res.status(422).json({ message: "Username kullaniliyor" });
    } else {
      next();
    }
  } catch (error) {
    next(error);
  }
}

/*
  req.body de verilen username veritabanında yoksa

  status: 401
  {
    "message": "Geçersiz kriter"
  }
*/

async function usernameVarmi(req, res, next) {
  try {
    let { username } = req.body;
    const isExist = await userModel.goreBul({ username: username });
    if (isExist && isExist.length > 0) {
      let user = isExist[0];
      let isPasswordMatch = bcryptjs.compareSync(
        req.body.password,
        user.password
      );
      if (isPasswordMatch) {
        req.dbUser = user;
        next();
      } else {
        res.status(401).json({
          message: "Geçersiz kriter",
        });
      }
    } else {
      res.status(401).json({
        message: "Geçersiz kriter",
      });
    }
  } catch (error) {
    next(error);
  }
}

/*
  req.body de şifre yoksa veya 3 karakterden azsa

  status: 422
  {
    "message": "Şifre 3 karakterden fazla olmalı"
  }
*/
function sifreGecerlimi(req, res, next) {
  try {
    let { password } = req.body;
    if (!password || password.length < 3) {
      res.status(422).json({ message: "Şifre 3 karakterden fazla olmalı" });
    } else {
      next();
    }
  } catch (error) {
    next(error);
  }
}
//Login ve Register
function checkPayload(req, res, next) {
  try {
    let { username, password } = req.body;
    if (!username || !password) {
      res.status(422).json({ message: "Şifre 3 karakterden fazla olmalı" });
    } else {
      next();
    }
  } catch (error) {
    next(error);
  }
}

// Diğer modüllerde kullanılabilmesi için fonksiyonları "exports" nesnesine eklemeyi unutmayın.
module.exports = {
  usernameBostami,
  checkPayload,
  sifreGecerlimi,
  usernameVarmi,
  sinirli,
};
