const express = require('express');
const multer = require('multer');

const path = require('path');

const uploadFolder = __dirname + '/uploads/images';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadFolder)
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname))
  }
})

const upload = multer({ storage: storage })

const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use(express.json({
  limit: '50mb'
}))

app.post('/upload', upload.single('photo'), (req, res) => {
  if (req.file) {
    res.json(req.file);
  }
  else throw 'error';
});

app.get('/image/:fileName', (req, res) => {
  const file = `${uploadFolder}/${req.params.fileName}`;
  res.sendFile(file);
})

app.post('/uploadbase64', (req, res) => {

  const base64Data = req.body.image.replace(/^data:image\/png;base64,/, "")

  require("fs").writeFileSync(`${uploadFolder}/${Date.now()}.png`, base64Data, 'base64');

  res.json({ upload: 'success' })

})



app.listen(PORT, () => {
  console.log('Listening at ' + PORT);
});