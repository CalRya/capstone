const mongoose = require("mongoose");

const MinigameSchema = new mongoose.Schema({
    minigameID: {type: String, required: true, unique: true},
    minigameTitle: {type: String, required: true}, // name
    minigameAnswer: {type: String, required: true},
    minigameScore: {type: Number, default: 0},
    minigameBestScore: {type: Number, default: 0}
   

});

module.exports = mongoose.model("Minigame", MinigameSchema);