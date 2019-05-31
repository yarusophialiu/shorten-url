const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UrlSchema = new Schema({
    created_at: String,
    originalURL: String,
    shortURL: String,
    code: String,
});

module.exports = mongoose.model("Url", UrlSchema )


