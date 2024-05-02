const express = require('express');
const cors = require('cors');

const fs = require('fs');
const path = require('path');

const app = express();

app.use(cors());
const tutorialsDirectory = path.join(__dirname, 'tutorials');

app.get('/tutorials', (req, res) => {
  fs.readdir(tutorialsDirectory, (err, files) => {
    if (err) {
      res.status(500).json({ error: 'Failed to read directory' });
      return;
    }

    const jsonFiles = files.filter(file => path.extname(file) === '.json');

    const tutorials = jsonFiles.map(file => {
      const filePath = path.join(tutorialsDirectory, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(content);
    });

    res.json(tutorials);
  });
});

app.listen(8066, () => {
  console.log('Server is running on port 8066');
});

