//les importations
const router = require("express").Router();
const pool = require("../db");
const bcrypt = require("bcrypt");
const jwtGenerator = require("../utils/jwtGenerator");
const validInfo = require("../middleware/validateInfo");
const authorization = require("../middleware/authorization");
const nodemailer = require("nodemailer");
const { text } = require("express");

//register
router.post("/register", validInfo, async (req, res) => {
  const { email, nom, password } = req.body;
  try {
    //  destructure the req.body(name, email,password)

    // check if user exist (if user exist then throw err)
    const user = await pool.query(
      "SELECT * FROM  Simple_User WHERE email = $1",
      [email]
    );

    if (user.rows.length > 0) {
      return res.status(401).json(" User alerady exist ");
    }

    //3. Bcrypt the user password
    const salt = await bcrypt.genSalt(10);

    const bcryptPassword = await bcrypt.hash(password, salt);

    //4. enter the new user inside our dataBase
    let newUser = await pool.query(
      "INSERT INTO Simple_User(email, nom, password) VALUES ($1, $2, $3) RETURNING *",
      [email, nom, bcryptPassword]
    );

    let emailAdmin = await pool.query(
      "SELECT email FROM utilisateur u , role r  WHERE u.role_id  = r.role_id AND r.role_name ='admin' "
    );



    
    emailAdmin.rows.forEach(({email}) => {
      const transporter = nodemailer.createTransport({
        service: "hotmail",

        auth: {
          user: "wedo-consult@outlook.com",
          pass: "abe0dc7c-4c42",
        },
      });

      transporter.sendMail({
        from: "wedo-consult@outlook.com",
        to: email,
        subject: "Notification",
        html: `<h1>User ${nom} has signed in</h1>`,
      },(error, info) => {
        if(error) {
            console.log (error)
            // throw Error("Email not sent")
            return;
        }

        console.log("sent : ", info.response)
      });
    });

    // 5. genrating our jwt towken
    const jwtToken = jwtGenerator(newUser.rows[0].id_user);

    return res.json({ jwtToken });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//login route

router.post("/login", validInfo, async (req, res) => {
  //1. destructure the req.body

  try {
    const { email, password } = req.body;

    //2. check if user dosen't exist (if bot then we throw err)
    const user = await pool.query(
      "SELECT * FROM public.Simple_User WHERE email = $1",
      [email]
    );

    if (user.rows.length === 0) {
      return res.status(401).json("Invalid Credential");
    }

    //3. check if incomming password is the same the database password
    const validePassword = await bcrypt.compare(
      password,
      user.rows[0].password
    );

    if (!validePassword) {
      return res.status(401).json("password or Email is incorrect");
    }
    //4. give then jwt token
    const jwtToken = jwtGenerator(user.rows[0].id_user);

    return res.json({ jwtToken });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
router.get("/verify", authorization, async (req, res) => {
  try {
    res.json(true);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
