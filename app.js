const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

var fs = require('fs');

const login = async (req, res) => {

    try {

        const jsonData = {
            "username": "dates_service",
            "password": "abcde"
        }

        fs.readFile("token.json",'utf-8', function(err, data) {

            // Check for errors
            if (err) console.log("No file found");
            else {
                // Converting to JSON
                const token = JSON.parse(data);
                console.log("This is my token");
                console.log(token["token"]);
            }
        });


        const res1 = await axios.post('http://127.0.0.1:8000/', jsonData)

        const jwt = {
            token:res1.headers["set-cookie"][0].split(";")[0].split("=")[1]
        }

        fs.writeFile('token.json', JSON.stringify(jwt), function (err) {
            if (err) throw err;
            console.log('Saved!');
        });

        res.json({'msg':'logged'});
    } catch (error) {
        // Handle errors
        console.error('Error making request to other service:', error.message);
        res.status(500).json({ error: 'An error occurred while fetching data from the other service' });
    }
}

app.get('/login', login);

app.get('/check_permission/:username', async (req, res) => {
    try {
        let token = "";
        const data = fs.readFileSync("token.json", 'utf-8');
        token = JSON.parse(data).token;

        if (token !== "") {
            const username = req.params.username;
            const res1 = await axios.get(`http://localhost:8000/check/user/permission/${username}/upload_pet_catalog_service_permission`, {
                headers: {
                    accept: "application/json",
                    'access-token': `${token}`
                },
                withCredentials: true
            });
            res.json(res1.data);
        } else {
            res.json({ 'msg': 'Not login' });
        }
    } catch (error) {
        console.error('Error making request to other service:', error.message);
        res.status(500).json({ error: error.message });
    }
});

app.get('/get/user/:username', async (req, res) => {
    try {
        let token = "";
        const data = fs.readFileSync("token.json", 'utf-8');
        token = JSON.parse(data).token;

        if (token !== "") {
            const username = req.params.username;
            const res1 = await axios.get(`http://localhost:8000/get/user/${username}/`, {
                headers: {
                    accept: "application/json",
                    'access-token': `${token}`
                },
                withCredentials: true
            });
            res.json(res1.data);
        } else {
            res.json({ 'msg': 'Not login' });
        }
    } catch (error) {
        console.error('Error making request to other service:', error.message);
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
