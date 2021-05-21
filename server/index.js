const express = require("express");
const app = express();
const mysql = require("mysql")
const bcrypt = require("bcryptjs")
const cors = require('cors');
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const axios = require('axios');

app.use(express.json());
app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    key: "userId",
    secret: "suscribed",
    resave: true,
    saveUninitialized: false,
    cookie: {
        maxAge: 60 * 60 * 24 * 24
    }
}))

const db = mysql.createConnection({
    user: "root",
    host: "localhost",
    password: "HvF:V=`n^G25j3:<",
    database: "SCJDatabase"
})

app.get('/practicas', (req, res) => {
    db.query("SELECT * FROM Practicas", (err, result) => {
        if (err) {
            console.log(err)
        }
        else {
            res.send(result)
        }
    })
})
app.get('/juntas', (req, res) => {
    db.query("SELECT * FROM Juntas", (err, result) => {
        if (err) {
            console.log(err)
        }
        else {
            res.send(result)
        }
    })
})

app.get('/eventos', (req, res) => {
    db.query("SELECT * FROM Eventos", (err, result) => {
        if (err) {
            console.log(err)
        }
        else {
            res.send(result)
        }
    })
})

app.get('/integrantes', async (req, res) => {
    db.query("SELECT * FROM Integrante",
        (err, result) => {
            if (err) {
                console.log(err)
            }
            else {
                res.send(result)
            }
        })
})


app.post('/reCaptcha', async (req, res, next) => {
    if (!req.body.token) {
        res.send("no token")
    }
    try {
        const secret = "6LdSbs0aAAAAAAgd-H0HdXPm7XSAksx7drVchfBW"
        const url = "https://www.google.com/recaptcha/api/siteverify?secret=" + secret + "&response=" + req.body.token

        const response = await axios.post(url)
        const { success } = response.data

        if (success) {
            console.log(success)
            res.send(response.data)
        }
        else {
            res.send(response.data)


        }
    } catch (e) {
        console.log(e)
    }
})

app.post('/createLabReport', async (req, res) => {
    const nombre = req.body.nombre
    const descripcion = req.body.descripcion
    const categoria = req.body.categoria

    db.query("INSERT INTO practicas (nombre,descripcion,categoria) VALUES(?,?,?)",
        [nombre, descripcion, categoria],
        (err, result) => {
            if (err) { console.log(err) }
            else {
                res.send(result)

            }
        })
})

app.post('/createVisit', async (req, res) => {
    const nombre = req.body.nombre
    const descripcion = req.body.descripcion
    const categoria = req.body.categoria

    db.query("INSERT INTO visitas (nombre,descripcion,categoria) VALUES(?,?,?)",
        [nombre, descripcion, categoria],
        (err, result) => {
            if (err) { console.log(err) }
            else {
                res.send(result)

            }
        })
})

app.post('/createJunta', async (req, res) => {
    const tipo = req.body.tipo
    const descripcion = req.body.descripcion
    const partipantes = req.body.participantes

    db.query("INSERT INTO Juntas (tipo,descripcion,participantes) VALUES(?,?,?)",
        [tipo, descripcion, partipantes],
        (err, result) => {
            if (err) { console.log(err) }
            else {
                res.send(result)

            }
        })
})

app.post('/create', async (req, res) => {
    console.log(req);
    const nombre = req.body.nombre
    const correo = req.body.correo
    const apellidos = req.body.apellidos
    const telefono = req.body.telefono
    const puesto = req.body.puesto
    const password = req.body.password
    const fecha = req.body.fecha
    const activo = req.body.activo

    db.query('INSERT INTO Integrante (nombre,apellidos,telefono,correo_electronico,contraseña,fechaInscripcion,puesto,activo) VALUES (?,?,?,?,?,?,?,?)',
        [nombre, apellidos, telefono, correo, password, fecha, puesto, activo],
        (err, result) => {

            if (err) { console.log(err) }
            else { res.send("Values inserted") }

        }
    );
});

app.post('/createEvent', async (req, res) => {
    console.log(req);
    const nombre = req.body.nombreEvento
    const ciudad = req.body.ciudad
    const nacional = req.body.nacional
    const descripcion = req.body.descripcion

    //const hashedPassword = await bcrypt.hash(password, 10)
    //console.log(hashedPassword)
    db.query('INSERT INTO Eventos (nombreEvento,ciudad,nacional,descripcion) VALUES (?,?,?,?)',
        [nombre, ciudad, nacional, descripcion],
        (err, result) => {

            if (err) { console.log(err) }
            else { res.send("Values inserted") }

        }
    );
});

app.post('/suscribeToEvent', async (req, res) => {
    console.log(req)
    const idIntegrante = req.body.idIntegrante
    const noEvento = req.body.noEvento
    const fecha = req.body.fecha
    db.query("INSERT INTO integrante_evento (idIntegrante,noEvento,fecha) VALUES (?,?,?)", [idIntegrante, noEvento, fecha],
        (err, result) => {
            if (err) { console.log(err) }
            else { res.send('Values inserted') }
        })
})

app.delete('/deleteEvent/:id', async (req, res) => {
    console.log(req)
    const id = req.params.id
    console.log(id)
    db.query("DELETE FROM Eventos WHERE noEvento = ?", id,
        (err, result) => {
            if (err) {
                console.log(id)
                console.log(err)
            }
            else { res.send(result) }
        })
})

app.delete('/deleteIntegrante/:id', async (req, res) => {
    console.log(req)
    const id = req.params.id
    console.log(id)
    db.query("DELETE FROM Integrante WHERE idIntegrante = ?", id,
        (err, result) => {
            if (err) {
                console.log(id)
                console.log(err)
            }
            else { res.send(result) }
        })
})

app.get('/login', (req, res) => {
    if (req.session.user) {

        res.send({ LoggedIn: true, user: [req.session.user] });
    }
    else {
        res.send({ LoggedIn: false, user: [] });
    }
})

app.post('/login', async (req, res) => {
    try {
        console.log(req);
        const correo = req.body.correo
        const password = req.body.password
        db.query("SELECT * FROM Integrante WHERE correo_electronico = ? AND contraseña =? ",
            [correo, password], (err, result) => {
                if (err) {
                    res.send({ err: err })
                }
                if (result) {
                    req.session.user = result;
                    console.log(req.session.user);
                    res.send(result)
                }
                else {
                    res.send({ message: "Wrong combination" })
                }
            })

    }

    catch (e) {
        console.log(e);
        res.status(500).send('error ocurred');
    }


});

app.put('/updateEvent', async (req, res) => {
    try {
        const noEvento = req.body.noEvento
        const nuevoNombre = req.body.nuevoNombre
        const nuevaCiudad = req.body.nuevaCiudad
        const boolNacional = req.body.boolNacional
        const nuevaDescripcion = req.body.nuevaDescripcion
        db.query("UPDATE Eventos SET nombreEvento = ?, ciudad = ?, nacional = ?,descripcion = ? WHERE noEvento = ?", [nuevoNombre, nuevaCiudad, boolNacional, nuevaDescripcion, noEvento], (err, result) => {
            if (err) {
                console.log(err)
            }
            if (result) {
                res.send(result)
            }
        })
    }
    catch (e) {
        console.log(e)
    }
})

app.post('/getUser', async (req, res) => {
    try {
        const idIntegrante = req.body.id
        db.query("SELECT * FROM Integrantes WHERE idIntegrante = ? ",
            [idIntegrante], (err, result) => {
                if (err) {
                    res.send({ err: err })
                }
                if (result) {
                    console.log(req.session.user);
                    res.send(result)
                }
                else {
                    res.send({ message: "Wrong combination" })
                }
            })

    }

    catch (e) {
        console.log(e);
        res.status(500).send('error ocurred');
    }


});

app.get("/dashboard", (req, res) => {
    if (req.session.user) {
        res.send(req.session.user)
    }
    else {
        res.redirect("/login")
    }
})

app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return console.log(err);
        }
        res.redirect('/');
    });

});
app.listen(3002, () => {
    console.log("Server started on port 3002.");
});
