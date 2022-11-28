const nconf = require('nconf');
const jwt = require('jsonwebtoken');

module.exports.auth = async(req, res, next)=>{   
    try {
        const jwt_password = nconf.get("jwt_password");
        const decoded = jwt.verify(req.headers.token, jwt_password);

        next()
      } catch(err) {
        console.log("err", err)
        res.status(500).send("Access denied")
      } 
}