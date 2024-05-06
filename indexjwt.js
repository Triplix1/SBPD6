const express = require('express');
const jwt = require('jsonwebtoken');
const jwtDecode = require('jwt-decode');
const bodyParser = require('body-parser');
const path = require('path');
const port = 3000;
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors("*"));

let token;

const API_DOMAIN = 'https://dev-pxu5guvclvdrtofv.us.auth0.com'; // Замініть на домен вашого SSO провайдера
const CLIENT_ID = '8QQ2JA42CH2SfDkDr4dazIMM3m9Knlts'; // Замініть на ваш client_id
const REDIRECT_URI = 'http://localhost:3000/api/callback'; // Замініть на ваш redirect_uri

app.get('/', (req, res) => {
    res.redirect(`${API_DOMAIN}/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&response_mode=query`);
});

app.get('/token', (req, res) => {
    res.json({ token });
});

app.get('/api/callback', async (req, res) => {
    const { code } = req.query;

    try {
        const tokenResponse = await axios.post(`${API_DOMAIN}/oauth/token`, {
            grant_type: 'authorization_code',
            client_id: CLIENT_ID,
            redirect_uri: REDIRECT_URI,
            code: code,
            client_secret: 'MoW5uQraDzk9nsSDWVSH5xC5IIuQW25NXaDTA0bd2iV0uMRgivK_rdzKvJNIeVgc' // Додайте ваш client_secret
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const { access_token } = tokenResponse.data;
        token = access_token;
        res.sendFile(path.join(__dirname + '/indexjwt.html'));
    } catch (error) {
        console.error('Authentication failed:', error);
        res.status(401).send('Authentication failed');
    }
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
