function requireLogin(req, res, next) {

    if (!req.session.userId) {
        return res.redirect("/home/login");
    }

    next();
}

module.exports = requireLogin;