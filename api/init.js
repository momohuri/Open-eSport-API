define(['express', '../api/routes'], function (express, routes) {
    return {

        init: function () {

            var app = express();

            var port = 5000;

            var allowCrossDomain = function (req, res, next) {
                res.header('Access-Control-Allow-Origin', '*');
                res.header('Access-Control-Allow-Methods', 'GET');
                res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

                // intercept OPTIONS method
                if ('OPTIONS' == req.method) {
                    res.send(200);
                }
                else {
                    next();
                }
            };

            app.configure(function () {
                app.use(allowCrossDomain);
            });

            app.listen(port, function () {
                console.log("API ready on " + port);
            });

            routes.init(app);
        }
    }
});
