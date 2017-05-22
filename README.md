npm install -g sails
npm install -g grunt-cli


sails new activityOverload

sails lift

sails使用热加载(不能检测到页面的变更，可以检测到api和model目录的变更)
npm install sails-hook-autoreload --save
npm install -g nodemon


sails使用bootstrap
```
tasks/pipeline.js
```


config/routes.js是配置路由的地方
Gruntfile是配置各种js依赖的地方


### 一个mvc的实现

sails generate api user
```
// api/models/User.js
module.exports = {
  schema:true,//数据库只保存有数组的部分

  attributes: {
    name:{
      type:'string',
      required:true
    },
    title:{
      type:'string'
    },
    email:{
      type:'string',
      email:true,
      required:true,
      unique:true
    },
    encryptedPassword:{
      type:'string'
    },
    //定制返回数据格式
    toJSON:function(){
      var obj = this.toObject();
      delete obj.password;
      delete obj.confirmation;
      delete obj.encryptedPassword;
      delete obj._csrf;
      return obj;
    }
  }
};

// views/user/new
新建ejs文件，按照mvc架构实现
<form action="/user/create" method="post" class="form-signin" style="width:500px;">
  <div class="control-group">
    <input type="text" class="form-control" placeholder="你的名字"  name="name">
  </div>
  <div class="control-group">
    <input type="text" class="form-control" placeholder="你的职位" name="title">
  </div>
  <div class="control-group">
    <input type="text" class="form-control" placeholder="你的邮箱" name="email">
  </div>
  <div class="control-group">
    <input type="text" class="form-control" placeholder="你的密码" name="password">
  </div>
  <div class="control-group">
    <input type="text" class="form-control" placeholder="再次确认密码" name="confirm">
  </div>

  <input type="submit" class="btn btn-lg btn-primary btn-block" value="创建用户">
  <input type="hidden" name="_csrf" value="<%= _csrf %>">
</form>


// api/controllers/UserController.js
module.exports = {
	'new':(req,res)=>{
	  res.view()
  }
};
```


#### flash
```
// UserController.js
module.exports = {
  'new': (req, res) => {
    res.locals.flash = _.clone(req.session.flash)
    res.view()
    req.session.flash = {};
  },
  'create': (req, res, next) => {
    User.create(req.params.all(), function userCreated(err, user) {
      if (err) {
        req.session.flash = {err: err};
        return res.redirect('/user/new');
      }
      res.json(user);
      req.session.flash = {};
    })
  }
};


// view
<% if(flash && flash.err) { %>
<ul class="alert alert-success">
  <% Object.keys(flash.err).forEach(function(err){ %>
    <li><%- JSON.stringify(flash.err[err])%></li>
  <% }) %>
</ul>
<% } %>

```


### polices and validation
```
// api/polices/flash.js
model.exports = function(req,res,next){
  res.locals.flash = {};
  if(!req.session.flash)return next();
  res.locals.flash = _.clone(req.session.flash);

  req.session.flash = {};
  next();
}

// config/policies.js
"*":"flash"
```
然后可以将一些重复的逻辑删除掉了

进行到13章，总之就是crud+各种web的操作，实战为王，业务栈+技术栈。



### session
sails generate controller session

将http.js中的middleware开启，这些middleware都是互相依赖的所以比较蛋疼


