const mongoose = require('mongoose');
mongoose.connect("mongodb+srv://ejohn7_sdev255:MyPassword@songdb.brferpo.mongodb.net/?appName=SongDB")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

module.exports = mongoose;
