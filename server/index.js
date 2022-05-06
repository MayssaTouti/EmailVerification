const express =require("express"); 
const app=express(); 
const cors= require("cors"); 
const pool= require("./db"); 
const { Pool } = require("pg");

/**/
app.listen(5000,() => {

    console.log("server hos started on port 5000"); 

}); 



//midelware
app.use(cors()); 
app.use(express.json());  //req.body
//Routes //





//register and login routes 

app.use("/auth",require("./routes/jwtAuth")); 
 //dashboard route 
 app.use("/dashboard",require("./routes/dashboard")); 

/*********************/
//create a user  
app.post("/users", async(req,res) => {

    //await 
    try {
    console.log(req.body); 
    const {email , name, password, role_id} = req.body; 
    const newUser = await pool.query(
       `INSERT INTO utilisateur("email", "name","password","role_id") VALUES ($1, $2,$3,$4) `, [email, name,password,role_id]
    ); 
    res.json(newUser.rows[0]); 
        
    } catch (err) {
        console.error(err.message); 
    }

})

// get all user 
app.get("/users", async (req,res) => {

    try {
    const allUsers = await pool.query ("SELECT * FROM utilisateur"); 
    res.json(allUsers.rows); 
    
    }catch (err) {
        console.error(err.message); 
        
    }})


app.get('/userEmail', async (req, res) => {
    try {
       let emailAdmin = await pool.query(
    "SELECT email FROM utilisateur u , role r  WHERE u.role_id  = r.role_id AND r.role_name ='admin' "); 
    res.json(emailAdmin.rows);  
    } catch (err) {
     console.error(err.message);      
    }
}); 



// get a user
app.get("/users/:id" , async(req, res) => {
    try {
     
      const {id} = req.params; 
      const user= await pool.query
       ("SELECT * FROM utilisateur WHERE iduser = $1",
        [id]); 
      res.json(user.rows[0]); 
    
    
    } catch (err) {

        console.error(err.message);
    } })
 /*   
    app.get("/users/:id" , async(req, res) => {
        try {
         
          const {id} = req.params; 
          const user= await pool.query
           ("SELECT (iduser,email,name,role_name) FROM utilisateur u, role r  WHERE u.role_id= r.role_id",
            [id]); 
          res.json(user.rows[0]); 
        
        
        } catch (err) {
    
            console.error(err.message);
        } })
        
       
    */


//update a user 


app.put("/users/:id", async (req, res) => {

    try {
      
    const {id} = req.params; 
    const {email , name,password,role_id} = req.body; 
    const updateUser = await  pool.query(`UPDATE "utilisateur"
     SET "email" = $1 , "name"= $2 ,"password"=$3 ,"role_id"=$4 WHERE "iduser" = $5 `, [email, name,password,role_id , id]); 
    
     res.json("User was updated "); 
    
        
    } catch (err) {
        console.error(err.message); 
    }
    
    })

    //delete a User
app.delete("/users/:id", async(req, res)=> {
try {
    
const {id} = req.params; 
const  deleteUser= await pool.query("DELETE FROM utilisateur WHERE  iduser = $1", [id] ); 
res.json(" user was deleted !"); 

} catch (err) {
    console.error(err.message); 
}

} )
    
///////////////////////////////////////////////////////  Role //////////////////////////////////
app.get("/roles", async (req,res) => {
    
    try {
    const allRoles = await pool.query ("SELECT * FROM role"); 
    res.json(allRoles.rows); 
    
    }catch (err) {
        console.error(err.message); 
        
    }})
//create a role  
app.post("/roles", async(req,res) => {

    //await 
    try {
    console.log(req.body); 
    const {role_name , role_description} = req.body; 
    const newRole = await pool.query(
        `INSERT INTO role("role_name", "role_description") VALUES ($1, $2) `, [role_name, role_description]
    ); 
    res.json(newRole.rows[0]); 
        
    } catch (err) {
        console.error(err.message); 
    }

})

// get a role
 app.get("/roles/:id" , async(req, res) => {
try {
 
  const {id} = req.params; 
  const role= await pool.query
   ("SELECT * FROM role WHERE role_id = $1",
    [id]); 
  res.json(role.rows[0]); 


} catch (err) {
    console.error(err.message);
} })


app.get("/roles", async (req,res) => {

try {
const allRoles = await pool.query ("SELECT * FROM role"); 
res.json(allRoles.rows); 

}catch (err) {
    console.error(err.message); 
    
}})



//update a role 

app.put("/roles/:id", async (req, res) => {

try {
  
const {id} = req.params; 
const {role_name , role_description} = req.body; 
const updateRole = await  pool.query(`UPDATE "role"
 SET "role_name" = $1 , "role_description"= $2 WHERE "role_id" = $3 `, [role_name, role_description , id]); 

 res.json("Role was updated "); 

    
} catch (err) {
    console.error(err.message); 
}

})




//delete a role
app.delete("/roles/:id", async(req, res)=> {
try {
    
const {id} = req.params; 
const  deleteRole= await pool.query("DELETE FROM role WHERE  role_id = $1", [id] ); 
res.json(" role was deleted !"); 

} catch (err) {
    console.error(err.message); 
}

} )


