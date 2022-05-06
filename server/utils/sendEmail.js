const nodemailer = require("nodemailer"); 






module.exports = async(email, subjects, text) => {
 try {
  const transporter = nodemailer.createTransport({

       host: process.env.HOST, 
       service: process.env.SERVICE, 
       post: Number(process.env.EMAIL_PORT), 
       secure: Boolean(process.env.SECURE), 
       auth: {
           user: process.env.USER, 
           pass: process.env.PASS
       }

  }); 
  await transporter.sendMail({
     from: process.env.USER, 
     to: email, 
     subject: subjects, 
     text: text 
  }); 
console.log("EMAIL sent Successfully"); 
  
 } catch (err) {
  
    console.log("Email not sent"); 
    console.log(error); 

 }



}