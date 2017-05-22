## 1.Assets

#### 概览
类似于public和apache2的www文件夹，sails会将assets中的静态文件（js，css，images等）通过pipeline使用less/sass/jade等编译到.tmp/public中


#### 静态文件
Sails使用static中间件（Express部件）运行assets服务，可以在config/http.js中配置该中间件
```
/**
 * (sails.config.http)
 * 只对http请求生效，不包括websocket
 */

module.exports.http = {
    //每次请求都会使用的中间件，函数中写逻辑，在order中按需要的顺序添加对应函数名，$custom是保留函数名
    middleware: {
        // order: [
        //   'startRequestTimer',
        //   'cookieParser',
        //   'session',
        //   'myRequestLogger',
        //   'bodyParser',
        //   'handleBodyParserError',
        //   'compress',
        //   'methodOverride',
        //   'poweredBy',
        //   '$custom',
        //   'router',
        //   'www',
        //   'favicon',
        //   '404',
        //   '500'
        // ],
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
```

##### index.html 
在assets中创建foo.html就可以通过http://localhost:1337/foo.html访问
如果在assets中创建foo文件夹，再在其中创建index.html也可以通过http://localhost:1337/foo和http://localhost:1337/foo/index.html访问


##### 优先级
middleware在router之后，比如创建了assets/index.html，又在config/routes.js中声明了`'/':'FooController.js`，则routes优先生效


### 1.1默认任务
>概览

Grunt任务帮助实现了:less,jst,coffeescript,asset,文件监听和同步,生产环境优化

>默认任务
- clean
- coffee
- concat
- copy
- cssmin
- jst
- less
- sails-linker
- sync
- uglify
- watch

### 1.2禁用Grunt
1.删除Gruntfile，可以选择删除tasks文件夹
2.`.sailsrc`中设置参数
```
{
    "hooks":{
        "grunt":false
    },
    "paths":{  //如果禁用了Grunt，需要显式声明paths路径
        "public":"assets"
    }
}
```

可以修改sails-generate-frontend为自己需要的生成器来实现iOS/Android/Cordova的界面



### 1.3 自动化任务
> 概览

主要是为前端资源服务（stylesheets，scripts，模板引擎），也可以自动化重复性的开发流程比如数据库同步，浏览器测试等，sails提供了一些默认任务，也可以从社区选择自己需要的任务

> 资源管道(Asset Pipeline)

在pipeline.js中配置就可用了

> 任务配置

可以自己编写task然后挂载到合适的父task中，sails提供了很多开箱可用无需配置的task

流程
- 1. npm install grunt-contrib-handlebars --save-dev 
- 2.创建tasks/config/handlebars.js 
```
module.exports = function(grunt) {

  // We use the grunt.config api's set method to configure an
  // object to the defined string. In this case the task
  // 'handlebars' will be configured based on the object below.
  grunt.config.set('handlebars', {
    dev: {
      // We will define which template files to inject
      // in tasks/pipeline.js
      files: {
        '.tmp/public/templates.js': require('../pipeline').templateFilesToInject
      }
    }
  });

  // load npm module for handlebars.
  grunt.loadNpmTasks('grunt-contrib-handlebars');
};
```
- 3.修改pipeline中的templateFilesToInject
```
var templateFilesToInject = [
  'templates/**/*.hbs'
];
```
- 4.将对应改成hbs
```
// tasks/register/compileAssets.js 

module.exports = function (grunt) {
  grunt.registerTask('compileAssets', [
    'clean:dev',
    'handlebars:dev',       // changed jst task to handlebars task
    'less:dev',
    'copy:dev',
    'coffee:dev'
  ]);
};


// tasks/register/syncAssets.js 

module.exports = function (grunt) {
  grunt.registerTask('syncAssets', [
    'handlebars:dev',      // changed jst task to handlebars task
    'less:dev',
    'sync:dev',
    'coffee:dev'
  ]);
};
```

- 4.移除jst任务
```
npm uninstall grunt-contrib-jst --save-dev 
```

> 触发任务
开发时运行default.js，生产环境运行prod.js 

sails lift 运行default任务
sails lift --prod 运行prod任务
sails www 运行build任务
sails www --prod 运行buildPro任务
也可以自定义任务，比如NODE_ENV是QA，那么运行tasks/register/QA.js 


## 2.Blueprints 
blueprints是sails快速生成routes和actions的工具，方便快速构建model和controller
blueprints适合快速开发，同时也是高效的生成工具，可以overridden，protected，extended，disabled

### 2.1 Actions
blueprint默认的actions有find,findOne,create,update,destroy,populate,add,remove 

可以重写blueprint的actions
```
module.exports = {
    findOne:function(req,res){
        return res.json(403,'single model lookup is denied.');
    }
}
```

### 2.2 Routes 
blueprint有好几种routes
- RESTful
> /:modelIdentity/:id 然后根据请求类型来决定操作

- Shortcut
> /:modelIdentity/method/:id 

- Action 
> 控制器中定义了相应方法就行


## 3.配置
sails也遵从约定大于配置，对约定可以通过配置重置，配置项在config目录下
```
// config/foo.js
// The object below will be merged into `sails.config.blueprints`:
module.exports.blueprints = {
  shortcuts: false
};

//设置NODE_ENV=production node app.js 
```

## 4.控制器
```
module.exports = {
    hi:function(req,res){
        return res.send('hi there');
    },
    bye:function(req,res){
        return res.redirect('http://www.liaobaocheng.com');
    }
}
```

### 4.1普通控制器
`sails generate controller <controller name> [用空格分开actions名称]`
>例如 sails generate controller comment create destroy tag like 


### 4.2 路由控制器
在config/routes.js中显式声明路由和控制器


## 5.自定义响应
sails允许自定义响应，在api/responses文件夹中可以编写

### 5.1 一个自定义响应
```
module.exports = function(message){

    var req = this.req;
    var res = this.res;

    var viewFilePath = 'mySpecialView';
    var statusCode = 200;

    var result = {
        status: statusCode
    };

    if(message){
        result.message = message;
    }

    if(req.wantsJson){
        return res.json(result, result.status);
    }

    res.status(result.status);

    for(var key in result){
        res.locals[key] = result[key];
    }

    res.render(viewFilePath, result, (err)=>{
        if(err){
            return res.json(result, result.status);
        }

        res.render(viewFilePath);
    })
}
```

### 5.2 默认响应
res.ok 
res.serverError
res.badRequest 
res.notFound 
res.forbidden 
res.created

