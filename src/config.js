const host = document.location.origin

module.exports = {
    origin: host,
    mongodb: process.env.MONGODB_URI, 
}