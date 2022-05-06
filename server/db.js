const   Pool = require("pg").Pool ; 

const pool = new Pool ({
    type: "postgres", 
    port:  5432,
    host: "localhost",
    database:"graphqlcrudtest" ,  
    user:"postgres", 
    password:"bd"

}); 

 module.exports = pool ;   