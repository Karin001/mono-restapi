const md5 = require('crypto');
const md5Change = function(password) {
    if(!password){
        return 'type_err'
    }
    let temp;
    temp = md5.createHash('md5').update(password).digest('hex');
    temp = md5.createHash('md5').update(temp.substr(5,17)).digest('hex');
    return md5.createHash('md5').update(temp.substr(6,25)).digest('hex');
}
module.exports = {
    md5Change
}