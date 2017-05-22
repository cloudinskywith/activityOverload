/**
 * (sails.config.http)
 * 只对http请求生效，不包括websocket
 */

module.exports.http = {
    //每次请求都会使用的中间件，函数中写逻辑，在order中按需要的顺序添加对应函数名，$custom是保留函数名
    middleware: {
        order: [
          'startRequestTimer',
          'cookieParser',
          'session',
          // 'myRequestLogger',
          'bodyParser',
          'handleBodyParserError',
          'compress',
          'methodOverride',
          'poweredBy',
          '$custom',
          'router',
          'www',
          'favicon',
          '404',
          '500'
        ],
        // 一个示例middleware，实现了将数据都打印到控制台
        // myRequestLogger: function (req, res, next) {
        //     console.log("Requested :: ", req.method, req.url);
        //     return next();
        // }

        //使用该bodyParser要确保先运行npm install skipper，也可以自己配置其他的bodyParser
        // bodyParser: require('skipper')({strict: true})

    },

    /****************************************************************************
     *                                                                          *
     *缓存时间，只在生产环境生效（只有生产环境express会缓存flat-files）                   *
     ***************************************************************************/

    // cache: 31557600000
};
