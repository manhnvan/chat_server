const mongoose = require('mongoose');

const sellerSchema = mongoose.Schema({
    username: {
        type: String,
        require: true
    },
    address: {
        type: String,
        address: true
    },
    phone: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    shopName: {
        type: String,
        require: true,
        unique: true
    },
    avatar: {
        type: String,
        default: "https://nongdan.pro/wp-content/uploads/2017/05/shop-icon.png"
    }
})

module.exports = mongoose.model('seller', sellerSchema);