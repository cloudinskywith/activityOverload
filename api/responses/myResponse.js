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