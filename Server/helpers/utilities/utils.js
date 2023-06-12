const e = require("express");

class Utilities {
    generateRandomPassword() {
        return Math.random().toString(36).slice(-8);
    }
  
    generateRandomNumber() {
        return Math.floor(Math.random() * 1000);
    }
}

module.exports = Utilities;