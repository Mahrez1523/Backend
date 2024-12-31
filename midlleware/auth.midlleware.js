const jwt = require("jsonwebtoken");
const UserModel = require("../models/user.model");

module.exports.checkUser = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
      if (err || !decodedToken) {
        res.locals.user = null;
        res.cookie("jwt", "", { maxAge: 1 });
        next();
      } else {
        let user = await UserModel.findById(decodedToken.id);
        if (!user) {
          res.locals.user = null;
        } else {
          res.locals.user = user;
        }
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};



module.exports.requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
      jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
        if (err || !decodedToken) {
          return res.status(400).json({ error: 'No token or invalid token' });
        } else {
          try {
            const user = await UserModel.findById(decodedToken.id);
            if (!user) {
              return res.status(400).json({ error: 'User not found' });
            }
            res.locals.user = user;  // Assigner l'utilisateur à res.locals
            next();
          } catch (dbError) {
            return res.status(500).json({ error: 'Database error', details: dbError });
          }
        }
      });
    } else {
      return res.status(400).json({ error: 'No token provided' });
    }
  };
  
  
