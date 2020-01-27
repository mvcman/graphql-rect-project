const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
    const authHeader = await req.get('Authorization');
    console.log("My authHeader ", authHeader);
    if (!authHeader){
        req.isAuth = false;
        return next();
    }
    const token = await authHeader.split(' ')[1]; //Bearer jfhsjdk
    console.log(token);
    if (!token || token === '') {
        req.isAuth = false;
        return next();
    }
    let decodedToken;
    try {
        decodedToken = await jwt.verify(token, 'mandarwaghe');
    }catch (err){
        req.isAuth = false;
        return next();
    }
    console.log(decodedToken);
    if(!decodedToken){
        req.isAuth = false;
        return next();
    }
    req.isAuth = true;
    req.userId = decodedToken.userId;
    next();
};
