const jwt = require('jsonwebtoken')

var token = jwt.sign({name:"delray"}, "privatekey")
let decoded = jwt.verify(token, 'privatekey')

console.log(token)
console.log(decoded)





// const bcrypt = require('bcryptjs')



// bcrypt.hash("password", 9, function(err, hash) {
//     console.log(hash)
// });

// const f1 = async function(s){
//     hash = await bcrypt.hash(s, 9)
//     console.log("\n", hash)
//     const compare = await bcrypt.compare('123456', '$2a$08$uUNG0i2M5sCAlrgFksre6O3wZutpojyHou4Vckv9e7cE2TRd0IIlK')
//     console.log(compare)
// }

// f1("haha")
// console.log('e')