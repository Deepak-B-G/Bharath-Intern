const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
dotenv.config();

const port = process.env.PORT || 3000;

const username = process.env.MONGODB_USERNAME;
const password = process.env.MONGODB_PASSWORD;

mongoose.connect(`mongodb+srv://${username}:${password}@cluster-01.xalmll0.mongodb.net/RegistrationFormDB`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const registrationSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    birthday: {
        type: Date,
        required: true
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other'],
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    phone: {
        type: String,
        required: true
    }
});

const Registration = mongoose.model("Registration", registrationSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files from the 'Task-01' directory
app.use(express.static(path.join(__dirname, "Task-01")));

// Define route for serving index.html
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname,  "index.html"));
});

// Define route for serving styles.css
app.get("/styles.css", (req, res) => {
    res.sendFile(path.join(__dirname,  "styles.css"));
});

app.post("/register", async (req, res) => {
    try {
        const { firstname, lastname, birthday, gender, email, phone } = req.body;

        const existingUser = await Registration.findOne( {email: email});
        
        if(!existingUser) {
            const registrationData = new Registration({
                firstname,
                lastname,
                birthday,
                gender,
                email,
                phone
            });
            await registrationData.save();
            res.redirect("/success");
        }
        else {
            console.log("User already Exists")
            res.redirect("/error");
        }
    } catch (error) {
        console.log(error);
        res.redirect("/error");
    }
});

app.get("/success", (req, res) => {
    res.sendFile(path.join(__dirname,  "success.html"));
});

app.get("/error", (req, res) => {
    res.sendFile(path.join(__dirname,  "error.html"));
});

app.listen(port, () => {
    console.log(`Server is running on ${port}`);
});
