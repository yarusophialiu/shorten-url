const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const logger = require('morgan');
const Url = require('./models/models')
const validUrl = require('valid-url')

const API_PORT = 3001;
const app = express();
app.use(cors());
const router = express.Router();

// our MongoDB database
const dbRoute =
  'mongodb+srv://shortenurl_user:shortenurl@cluster0-oiv14.mongodb.net/test?retryWrites=true&w=majority'

// connects our back end code with the database
mongoose.connect(dbRoute, { useNewUrlParser: true });

let db = mongoose.connection;

db.once('open', () => console.log('connected to the database'));

// checks if connection with the database is successful
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// bodyParser, parses the request body to be a readable json format
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger('dev'));

router.post('/shortenurl', (req, res)=> {
    const { originalURL } = req.body

    if (validUrl.isUri(originalURL)) {
        Url.findOne({originalURL: originalURL}, (err, doc) => {
            if (doc) res.json({success: true, shortURL: doc.shortURL, code: doc.code})
            else {
                const createdId = (count) => {
                    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz0123456789";
                    let id_str = ''
                    while (count > 0) {
                        const remainder = count % 62
                        id_str = chars[remainder] + id_str
                        count = Math.floor(count/62)
                    }
                    return id_str
                }
                
                let code = 0

                db.collection("urls").countDocuments(
                    {},
                    {}, 
                    (error, result) => {
                        if (!err) {
                            code = result + 1
                        const new_id = createdId(code)
                        const shortURL = 'http://localhost:3000/' + new_id
                        const newUrl = new Url({
                            originalURL,
                            shortURL,
                            created_at: new Date(),
                            code: new_id,
                        })

                        newUrl.save((err, saved) => {
                            if (saved) res.json({success: true, shortURL: saved.shortURL, code: saved.code});
                            else console.log('failed to create a new url', err)
                         })
                        } else console.log(error)
                    } 
                  );
            }
        })
    }
});

router.get('/geturl/:code', (req, res) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        const code = req.params.code
        Url.findOne({ code: code }, (err, doc) => {
            if (doc) return res.redirect(doc.originalURL)
            else console.log(err)
        })
    })


// this method removes existing data in our database
router.delete('/deleteData', (req, res) => {
  const { id } = req.body;
  Data.findByIdAndRemove(id, (err) => {
    if (err) return res.send(err);
    return res.json({ success: true });
  });
});


// append /api for our http requests
app.use('/api', router);

// launch our backend into a port
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));