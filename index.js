const express = require("express");
const app = express();
const ejs = require("ejs");
const path = require("path");
const session = require("express-session");
const mysql = require("mysql");
const url = require("url");
const sha1 = require("sha1");
const moment = require("moment");
const dbconfig = require("./config.js")
const { urlencoded } = require("express");
const { user } = require("./config.js");

const port = process.env.port || 3000;

app.use(express.static(path.join(__dirname + "/views")));
app.use(urlencoded({extended:true}));
app.use(express.json());
app.set("view engine", "ejs");

app.use(session({
    secret:"secret",
    resave: true,
    saveUninitialized: true
}))

var kapcs = mysql.createConnection(dbconfig);

kapcs.connect((err)=>{
    if (err) {
        console.log(err)
    }
    else{
        console.log("Sikeresen kapcsolódva!")
    }
})

app.get("/", (req, res)=>{
    ejs.renderFile("views/login.ejs", {hiba:""}, (err, data)=>{
        if (err) {
            console.log(err);
        }
        else{
            res.send(data);
        }
    })
})

app.post("/login", (req, res)=>{
    var email = req.body.email;
    var pass = req.body.password

    kapcs.query(`SELECT * FROM users WHERE email = '${email}' AND password = SHA1('${pass}')`, (err, data1)=>{
        if (err) {
            console.log(err)
        }
        else{
            if (data1.length == 0) {
                ejs.renderFile("views/login.ejs", {hiba:"Nincs felhasználó ilyen adatokkal!"}, (err, data2)=>{
                    if (err) {
                        console.log(err);
                    }
                    else{
                        res.send(data2);
                    }
                })
            }
            else{
                req.session.user = data1[0]
                req.session.bente = true;
                console.log(req.session.user)
                if (user.status == 1) {
                    kapcs.query(`UPDATE users SET last = CURRENT_TIMESTAMP WHERE ID = ${data1[0].ID}`)
                }
                
                res.redirect("/home")
            }
        }
    })
})

app.get("/home", (req, res)=>{
    if (req.session.bente) {
        if (req.session.user.status == '1') {
            ejs.renderFile("views/home.ejs", {cim:"Home",user:req.session.user}, (err, data)=>{
                if (err) {
                    console.log(err)
                }
                else{
                    res.send(data)
                }
            });
        }
        else{
            ejs.renderFile("views/login.ejs", {hiba:"Sajnos ki lettél tíltva egy időre!"}, (err, data2)=>{
                if (err) {
                    console.log(err);
                }
                else{
                    res.send(data2);
                }
            })
        }
    }
    else{
        res.redirect("/")
    }
})

app.get("/profile", (req, res)=>{
    if (req.session.bente) {
        if (req.session.user.status == '1') {
            ejs.renderFile("views/profile.ejs", {cim:"Profilod",user:req.session.user}, (err, data)=>{
                if (err) {
                    console.log(err)
                }
                else{
                    res.send(data)
                }
            });
        }
        else{
            ejs.renderFile("views/login.ejs", {hiba:"Sajnos ki lettél tíltva egy időre!"}, (err, data2)=>{
                if (err) {
                    console.log(err);
                }
                else{
                    res.send(data2);
                }
            })
        }
    }
    else{
        res.redirect("/home")
    }
})

app.get("/admin", (req, res)=>{
    if (req.session.bente && req.session.user.rights == "admin") {
        if (req.session.user.status == '1') {
            kapcs.query("SELECT * FROM users", (err, data0, field)=>{
                if (err) {
                    console.log("err")
                }
                else{
                    ejs.renderFile("views/admin.ejs", {cim:"Admin", user:req.session.user, users:data0, field}, (err, data)=>{
                        if (err) {
                            console.log(err)
                        }
                        else{
                            res.send(data)
                        }
                    });
                }
            })
        }
        else{
            ejs.renderFile("views/login.ejs", {hiba:"Sajnos ki lettél tíltva egy időre!"}, (err, data2)=>{
                if (err) {
                    console.log(err);
                }
                else{
                    res.send(data2);
                }
            })
        }
    }
    else{
        res.redirect("/home")
    }
})

app.get("/admin/*", (req, res)=>{
    if (req.session.bente && req.session.user.rights == "admin") {
        if (req.session.user.status == '1') {
            //Sikeres belépés admin
            var id = req.params[0];
            kapcs.query(`SELECT * FROM users WHERE ID = ${id}`, (err, data)=>{
                if (err) {
                    console.log(err)
                }
                else{
                    ejs.renderFile("views/admin_edit.ejs", {cim:"Admin_edit", user:req.session.user, users:data[0], hiba:""}, (err, data1)=>{
                        if (err) {
                            console.log(err)
                        }
                        else{
                            res.send(data1);
                        }
                    })
                }
            })
        }
        else{
            ejs.renderFile("views/login.ejs", {hiba:"Sajnos ki lettél tíltva egy időre!"}, (err, data2)=>{
                if (err) {
                    console.log(err);
                }
                else{
                    res.send(data2);
                }
            })
        }
    }
    else{
        res.redirect("/home")
    }
})

app.post("/admin_edit/*", (req, res)=>{
    var id = req.params[0];
    var name = req.body.name;
    var email = req.body.email;
    var pass1 = req.body.password1;
    var pass2 = req.body.password2;
    var rights = req.body.rights;
    var status = req.body.status;
    var passwords = ""

    if (pass1 == pass2) {
        if (pass1 != "") {
            passwords = `password = SHA1('${pass1}'), `;
        }
        kapcs.query(`UPDATE users SET username = '${name}', email = '${email}', ${passwords} rights = '${rights}', status = '${status}' WHERE ID = ${id}`, (err)=>{
            if (err) {
                console.log(err)
            }
            else{
                res.redirect("/admin")
            }
        })
    }
    else{
        kapcs.query(`SELECT * FROM users WHERE ID = ${id}`, (err, data)=>{
            if (err) {
                console.log(err)
            }
            else{
                ejs.renderFile("views/admin_edit.ejs", {user:req.session.user, users:data[0], hiba:"Jelszavak nem egyeznek!"}, (err, data1)=>{
                    if (err) {
                        console.log(err)
                    }
                    else{
                        res.send(data1);
                    }
                })
            }
        })
    }

    
})

app.get("/reg", (req, res)=>{
    ejs.renderFile("views/reg.ejs", {hiba:"", name:"", email:""}, (err, data)=>{
        if (err) {
            console.log(err)
        }
        else{
            res.send(data);
        }
    })
})

app.post("/reg", (req, res)=>{
    var name = req.body.name;
    var email = req.body.email;
    var pass1 = req.body.password1;
    var pass2 = req.body.password2;

    if (pass1 != pass2) {
        ejs.renderFile("views/reg.ejs", {hiba:"A jelszavak nem egyeznek!", name:`${name}`, email:`${email}`}, (err, data)=>{
            if (err) {
                console.log(err)
            }
            else{
                res.send(data);
            }
        })
    }
    else{
        kapcs.query(`SELECT * FROM users WHERE email="${email}"`, (err, data1)=>{
            if (err) {
                console.log(err)
            }
            else{
                if (data1.length > 0) {
                    ejs.renderFile("views/reg.ejs", {hiba:"Az email cím foglalt!", name:`${name}`, email:`${email}`}, (err, data)=>{
                        if (err) {
                            console.log(err)
                        }
                        else{
                            res.send(data);
                        }
                    })
                }
                else{
                    kapcs.query(`SELECT * FROM users WHERE password = SHA1('${pass1}')`, (err, data2)=>{
                        if (err) {
                            console.log(err)
                        }
                        else{
                            if (data2.length > 0) {
                                ejs.renderFile("views/reg.ejs", {hiba:"A jelszaó már foglalt!", name:`${name}`, email:`${email}`}, (err, data)=>{
                                    if (err) {
                                        console.log(err)
                                    }
                                    else{
                                        res.send(data);
                                    }
                                })
                            }
                            else{
                                kapcs.query(`INSERT INTO users VALUES (null,'${name}','${email}', SHA1('${pass1}'), CURRENT_TIMESTAMP, null,'user', 1)`)
                                res.redirect("/")
                            }
                        }
                    })
                }
            }
        })
    }
})

app.get("/steps", (req, res)=>{
    if (req.session.bente) {
        if (req.session.user.status == '1') {
            ejs.renderFile("views/steps.ejs", {cim:"Lépéseid", user:req.session.user}, (err, data)=>{
                if (err) {
                    console.log(err)
                }
                else{
                    res.send(data)
                }
            });
        }
        else{
            ejs.renderFile("views/login.ejs", {hiba:"Sajnos ki lettél tíltva egy időre!"}, (err, data2)=>{
                if (err) {
                    console.log(err);
                }
                else{
                    res.send(data2);
                }
            })
        }
    }
    else{
        res.redirect("/home")
    }
})

app.get("/logout", (req, res)=>{
    req.session.bente = false;
    res.redirect("/")
})

app.listen(port, ()=>{
    console.log("A szerver fut..." + port);
})