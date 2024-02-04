const qrcode = require('qrcode-terminal')
const { Client, LocalAuth } = require('whatsapp-web.js')

// my sql
const mysql = require('mysql2')
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'test' // test bawaan xampp
})
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
})

function createtabel(){
    connection.connect(function(err) {
        if (err) throw err
        console.log("Connected!")
        var sql = "CREATE TABLE chatWa (nomor VARCHAR(255), chat VARCHAR(255), type VARCHAR(255))"  // tabel
        connection.query(sql,function (err, result) {
            if (err) throw err
            console.log("Table created")
        })
    })
}

function insertdata(nomor,chat, type){
    connection.connect(function(err){
        if (err) throw err
        console.log("Connected!")
        var sql = `INSERT INTO chatwa (nomor, chat, type) VALUES ("${nomor}", "${chat}", "${type}")`
        connection.query(sql, function (err, result) {
            if (err) throw err
            console.log("insert datay")
        })
    })
}
function drop(val){
    connection.connect(function(err) {
        if (err) throw err
        var sql = `DROP TABLE ?`
        var values = val
        connection.query(sql,[values], function (err, result) {
          if (err) throw err
          console.log("Table deleted")
        })
      })
}


const client = new Client({
    authStrategy: new LocalAuth({
        dataPath: './login_data'
    })
})
client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true })
})
client.on('ready', () => {
    console.log('Client is ready!')
})
client.on('message', async (message) => {
    // console.log("from :",message.from)
    // console.log("tipe :",message.type)
    // console.log("pesan :",message.body)
    if(message.type === 'chat'){  // groub dll coba di tes jsonnya
        if (message.body === 'Rizki Sayang Pungki') {
            await message.reply('BENAR')
            console.log("pesan cinta:",message.body, " from:", message.from)
            insertdata(message.from, message.body, message.type)
        }
        else if (message.body === 'Sayang Pungki Poll') {
            await client.sendMessage(message.from, 'ALHAMDULILAH')
            console.log("pesan cinta:",message.body, " from:", message.from)
            insertdata(message.from, message.body, message.type)
        }else{
            console.log("pesan chat:",message.body, " from:", message.from)
            insertdata(message.from, message.body, message.type)
        }
    }else{
        console.log("pesan grup atau lainya:",message.body, " from:", message.from)
    }
    // console.log(message) // SEMUA JSON
})
// createtabel()
client.initialize()
