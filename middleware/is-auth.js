const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
    const authHeader = await req.get('Authorization');
    if (!authHeader){
        req.isAuth = false;
        return next();
    }
    const token = await authHeader.split(' '); //Authorization: Bearer jfhsjdk
    if (!token || token === '') {
        req.isAuth = false;
        return next();
    }
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, 'mandarwaghe');
    }catch (err){
        req.isAuth = false;
        return next();
    } 
    if(!decodedToken){
        req.isAuth = false;
        return next();
    }
    req.isAuth = true;
    req.userId = decodedToken.userId;
    next();
};
