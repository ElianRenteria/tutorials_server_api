const express = require('express');
const cors = require('cors');
const fs = require('fs');
const https = require('https');
const path = require('path');
const { Ollama } = require('ollama-node');
const bodyParser = require('body-parser');



const app = express();
const ollama = new Ollama();


app.use(cors());
app.use(bodyParser.json());

const tutorialsDirectory = path.join(__dirname, 'tutorials');



// Endpoint to handle chat
app.post('/chat', async (req, res) => {
    try {
	const { message } = req.body;
        // Set Ollama model
        await ollama.setModel("tinyllama");

        // Generate response using Ollama
        const { output } = await ollama.generate(message);

        // Send response back to client
        res.json({ 'response': output });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }

});



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

var options={
	key:fs.readFileSync('./SSL/private.key'),
	cert:fs.readFileSync('./SSL/certificate.crt'),
	ca:fs.readFileSync('./SSL/bundle.ca-bundle')
};

const httpsServer = https.createServer(options, app);


httpsServer.listen(8066, () => {
  console.log('Server is running on port 8066');
});

