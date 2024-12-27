const adminAuth = (req, res, next) => {
    const token = 'admin';
    const isAdminAuthorized = token === 'admin';

    if(!isAdminAuthorized) {
        return res.status(401).send('Unauthorized User..')
    } else {
        next();
    }
};

const userAuth = (req, res, next) => {
    const token = 'user';
    const isAdminAuthorized = token === 'user';

    if(!isAdminAuthorized) {
        return res.status(401).send('Unauthorized User..')
    } else {
        next();
    }
}

module.exports = {
    adminAuth,
    userAuth
}