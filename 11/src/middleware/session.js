const loginUsers = {};

module.exports = function () {
    return async function ( ctx, next ) {
       ctx.session = session;
       await next();
    }
}

const session = {
    set: function(username) {
        loginUsers[username] = true;
    },
    
    check: function(username){
        return loginUsers[username] ? true : false;
    }
};