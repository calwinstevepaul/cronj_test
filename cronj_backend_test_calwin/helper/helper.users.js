const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nconf = require('nconf');

module.exports.hashString = async(string)=>{    
    return await bcrypt.hash(string, 10)
}

module.exports.checkPassword = async(hash, password)=>{    
    return await bcrypt.compare(password, hash)
}

module.exports.createJwt = (user)=>{  
    const jwt_password = nconf.get("jwt_password");
    return  jwt.sign({ userId:user._id }, jwt_password);
}

