module.exports = {
    // findOne: (req, res) => {
    //     return res.json(403, 'single model lookup is denied');
    // },

    new: (req, res) => {
        res.locals.flash = _.clone(req.session.flash)
        res.view()
        req.session.flash = {};
    },
    create: (req, res, next) => {
        User.create(req.params.all(), function userCreated(err, user) {
            if (err) {
                req.session.flash = {err: err};
                return res.redirect('/user/new');
            }
            // res.json(user);
            req.session.flash = {};
            res.redirect('/user/show/' + user.id);
        })
    },
    show: (req, res, next) => {
        User.findOne(req.param('id'), (err, user) => {
            if (err)return next(err);
            if (!user) return next();
            res.view({
                user: user
            });
        });
    },
    edit: (req, res, next) => {
        User.findOne(req.param('id'), (err, user) => {
            if (err) return next(err);
            if (!user) return next();
            res.view({
                user: user
            });
        });
    },
    index: (req, res, next) => {
        User.find((err, users) => {
            if (err) return next(err);
            res.view({
                users: users
            });
        });
    },
    update: (req, res, next) => {
        User.update(req.param('id'), req.params.all(), (err) => {
            if (err) {
                return res.redirect('/user/edit' + req.param('id'));
            }
            res.redirect('/user/show/' + req.param('id'));
        })
    },
    destroy: (req, res, next) => {
        User.findOne(req.param('id'), (err, user) => {
            if (err) return next(err);
            if (!user) return next('User does not exist.');
            User.destroy(req.param('id'), (err) => {
                if (err) return next(err);
            });
            res.redirect('/user');
        })
    }
}
;
