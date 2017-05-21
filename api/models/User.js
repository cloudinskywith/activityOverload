module.exports = {
  schema:true,//数据库只保存有数值的字段

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
      required:true
      // unique:true
    },
    encryptedPassword:{
      type:'string'
    },
    toJSON:function(){
      var obj = this.toObject();
      delete obj.password;
      delete obj.confirmation;
      delete obj.encryptedPassword;
      delete obj._csrf;
      return obj;
    },
    beforeCreate:function (values, next) {
      if(!values.password || values.password != values.confirmation){
        return next({err:["password does not match password confirmation"]});
      }

      require('bcrypt').hash(values.password, 10, function passwordEncrypted(err, encryptedPassword) {
        if(err) return next(err);
        values.encryptedPassword = encryptedPassword;
        next();
      });
    }
  }
};
