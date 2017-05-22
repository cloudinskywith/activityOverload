/**
 * SessionController
 *
 * @description :: Server-side logic for managing sessions
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	new:(req,res)=>{
	  var oldDate = new Date();
	  var newDate = new Date(oldDate.getTime() + 600000);
	  req.session.cookie.expires = newDate;
	  console.log(req.session);
	  return res.view();
  }
};

