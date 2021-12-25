const express = require("express")
const server = express()

// Aqui o comandno importa o banco de dados para a aplicação Arthas.
const db = require("./database/db.js")

// Aqui é feito a configuração da pasta public
server.use(express.static("public"))

// habilita o uso do req.body na aplicação Arthas.
server.use(express.urlencoded({ extended: true }))

// utilizando template engine 
const nunjucks = require("nunjucks")
nunjucks.configure("src/views", {
    express: server,
    noCache: true
})

// configurar os caminhos

server.get("/", (req, res) => {
    return res.render("index.html")
})
server.get("/reservar", (req, res) => {
    return res.render("reservar.html")
})
server.post("/savepoint", (req, res) => {
    // console.log(req.body)
    // Inserir dados na tabela
    const query = `
            INSERT INTO places (
                name,
                date1,
                date2,
                adress,
                adress2,
                state,
                city,
                items
            ) VALUES (?,?,?,?,?,?,?,?);
        `
    const values = [
        req.body.name,
        req.body.date1,
        req.body.date2,
        req.body.adress,
        req.body.adress2,
        req.body.state,
        req.body.city,
        req.body.items
    ]

    function afterInsertData(err) {
        if (err) {
            return console.log(err)
        }
        console.log("Cadstrado con sucesso")
        console.log(this)
        return res.render("reservar.html", { saved: true })
    }
    db.run(query, values, afterInsertData)
})


server.get("/search", (req, res) => {
    const search = req.query.search
    if (search == "") {
        return res.render("search.html", { total: 0 })
    }
    //- Consultar os dados da tabela
    db.all(`SELECT * FROM places WHERE name LIKE '%${search}%'`, function (err, rows) {
        if (err) {
            return console.log(err)
        }
        console.log("Aqui estão os registros")
        console.log(rows)
        const total = rows.length
        return res.render("search.html", { places: rows, total: total })
    })
})

// ligar servidor
server.listen(3030)