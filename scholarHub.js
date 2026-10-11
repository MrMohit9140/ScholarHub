const express = require("express"); // requiring express
const app = express(); // activating express 
app.set("view engine","ejs");  // seting ejs
const mongoose = require("mongoose");  // requiring mongoose for database connection
const User = require("./models/users");
const session = require("express-session"); // requiring express-session for session management
const bcrypt = require("bcrypt"); // requiring bcrypt for password hashing
const MongoStore = require("connect-mongo").default; // requiring connect-mongo for session storage
require("dotenv").config(); // requiring dotenv for environment variables
const requireLogin = require("./middleware/auth"); // requiring custom middleware for authentication
// ejs-mate for templating 
const ejsMate = require("ejs-mate");
app.engine("ejs",ejsMate);

// requiring path
const path = require("path");

// url encoding 
app.use(express.urlencoded({extended : true}));
app.use(express.json()); 

//seting views of web
app.set("views",path.join(__dirname,"/views"));

// using public folder

app.use(express.static("public"));
app.use(express.static(path.join(__dirname,"public")));



const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`ScholarHub running on port ${PORT}`);
});


// database connection
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully");
    })
    .catch((error) => {
        console.log(
            "MongoDB connection error:",
            error
        );

    });


    // session configuration    
    app.use(
    session({

        secret: process.env.SESSION_SECRET,

        resave: false,

        saveUninitialized: false,

        store: MongoStore.create({
            mongoUrl: process.env.MONGO_URI,
            collectionName: "sessions"
        }),

        cookie: {

            httpOnly: true,

            maxAge: 1000 * 60 * 60 * 24 * 30

        }

    })
);
// header change after the login and register
app.use((req, res, next) => {

    if (req.session.userId) {
        res.locals.user = {
            id: req.session.userId,
            name: req.session.name,
            username: req.session.username,
            email: req.session.email
        };
    } else {
        res.locals.user = null;
    }

    next();
});

// get request  for Home page
app.get('/',(req,res)=>{
    res.render("home.ejs");
});


// Get request for register in your account
app.get("/home/register",(req,res)=>{
    res.render("register.ejs");
});

app.get("/home", (req, res) => {

    res.render("home");

});

// =====================================================
// REGISTER USER
// =====================================================

app.post("/home/register", async (req, res) => {

    try {

        const {
            name,
            username,
            email,
            password,
            confirmPassword,
            terms
        } = req.body;


        // ---------------------------------------------
        // CHECK REQUIRED FIELDS
        // ---------------------------------------------

        if (
            !name ||
            !username ||
            !email ||
            !password ||
            !confirmPassword
        ) {

            return res.send(
                "Please fill all required fields."
            );

        }


        // ---------------------------------------------
        // CHECK TERMS
        // ---------------------------------------------

        if (!terms) {

            return res.send(
                "Please accept the Terms & Conditions."
            );

        }


        // ---------------------------------------------
        // CHECK PASSWORD MATCH
        // ---------------------------------------------

        if (password !== confirmPassword) {

            return res.send(
                "Passwords do not match."
            );

        }


        // ---------------------------------------------
        // PASSWORD LENGTH
        // ---------------------------------------------

        if (password.length < 8) {

            return res.send(
                "Password must contain at least 8 characters."
            );

        }


        // ---------------------------------------------
        // NORMALIZE DATA
        // ---------------------------------------------

        const cleanName = name.trim();

        const cleanUsername =
            username.trim().toLowerCase();

        const cleanEmail =
            email.trim().toLowerCase();


        // ---------------------------------------------
        // CHECK EXISTING USER
        // ---------------------------------------------

        const existingUser = await User.findOne({

            $or: [
                {
                    email: cleanEmail
                },
                {
                    username: cleanUsername
                }
            ]

        });


        if (existingUser) {

            if (
                existingUser.email ===
                cleanEmail
            ) {

                return res.send(
                    "This email is already registered."
                );

            }

            if (
                existingUser.username ===
                cleanUsername
            ) {

                return res.send(
                    "This username is already taken."
                );

            }

        }


        // ---------------------------------------------
        // HASH PASSWORD
        // ---------------------------------------------

        const hashedPassword =
            await bcrypt.hash(
                password,
                10
            );


        // ---------------------------------------------
        // CREATE USER
        // ---------------------------------------------

        const newUser = new User({

            name: cleanName,

            username: cleanUsername,

            email: cleanEmail,

            password: hashedPassword

        });


        // ---------------------------------------------
        // SAVE USER TO MONGODB
        // ---------------------------------------------

        await newUser.save();


        console.log(
            "New user registered:",
            cleanEmail
        );


        // ---------------------------------------------
        // REDIRECT TO LOGIN
        // ---------------------------------------------

        res.redirect(
            "/home/login?registered=true"
        );

    }

    catch (error) {

        console.log(
            "Registration error:",
            error
        );

        res.status(500).send(
            "Something went wrong during registration."
        );

    }

});


// =====================================================
// LOGIN PAGE
// =====================================================

app.get("/home/login", (req, res) => {

    res.render("login", {

        registered:
            req.query.registered === "true"

    });

});


// =====================================================
// LOGIN USER
// =====================================================

app.post("/home/login", async (req, res) => {

    try {

        const {
            email,
            password,
            remember
        } = req.body;


        // ---------------------------------------------
        // CHECK FIELDS
        // ---------------------------------------------

        if (!email || !password) {

            return res.send(
                "Please enter email and password."
            );

        }


        // ---------------------------------------------
        // NORMALIZE EMAIL
        // ---------------------------------------------

        const cleanEmail =
            email.trim().toLowerCase();


        // ---------------------------------------------
        // FIND USER
        // ---------------------------------------------

        const user = await User.findOne({
            email: cleanEmail
        });


        if (!user) {

            return res.send(
                "Invalid email or password."
            );

        }


        // ---------------------------------------------
        // CHECK PASSWORD
        // ---------------------------------------------

        const passwordMatch =
            await bcrypt.compare(
                password,
                user.password
            );


        if (!passwordMatch) {

            return res.send(
                "Invalid email or password."
            );

        }


        // ---------------------------------------------
        // CREATE LOGIN SESSION
        // ---------------------------------------------

        req.session.userId =
            user._id.toString();

        req.session.username =
            user.username;

        req.session.name =
            user.name;

        req.session.email =
            user.email;


        // ---------------------------------------------
        // REMEMBER ME
        // ---------------------------------------------

        if (remember) {

            req.session.cookie.maxAge =
                1000 *
                60 *
                60 *
                24 *
                30;

        } else {

            // Session cookie
            // removed when browser session ends

            req.session.cookie.maxAge = null;

        }


        // ---------------------------------------------
        // REDIRECT
        // ---------------------------------------------

        res.redirect("/dashboard");

    }

    catch (error) {

        console.log(
            "Login error:",
            error
        );

        res.status(500).send(
            "Something went wrong during login."
        );

    }

});


// =====================================================
// DASHBOARD
// =====================================================

app.get(
    "/dashboard",
    requireLogin,
    async (req, res) => {

        try {

            const user =
                await User.findById(
                    req.session.userId
                ).select("-password");


            if (!user) {

                req.session.destroy(() => {

                    res.redirect(
                        "/home/login"
                    );

                });

                return;

            }


            res.render(
                "dashboard",
                {
                    user: user
                }
            );

        }

        catch (error) {

            console.log(
                "Dashboard error:",
                error
            );

            res.redirect(
                "/home/login"
            );

        }

    }
);


// =====================================================
// LOGOUT
// =====================================================

app.get("/logout", (req, res) => {

    req.session.destroy((error) => {

        if (error) {

            console.log(
                "Logout error:",
                error
            );

            return res.send(
                "Unable to logout."
            );

        }


        res.clearCookie("connect.sid");

        res.redirect(
            "/home/login"
        );

    });

});


// =====================================================
// FORGOT PASSWORD PAGE
// =====================================================

app.get(
    "/home/forgot-password",
    (req, res) => {

        res.render(
            "forgot-password"
        );

    }
);



// For the student routes
const studentRoutes = require("./routes/student");  // requiring student routes
app.use("/", studentRoutes);

// oppurtunities routes
const opportunityRoutes =
    require("./routes/opportunities");

app.use("/", opportunityRoutes);


// community member data
const users = [
    {
        id: 1,
        name: "Mohit",
        username: "MrMohit9140",
        email: "mohitkashyap0986@gmail.com",
        phone: "9569654716",

        bio: "ECE student & Head of Scholar Hub passionate about web development, coding and building useful projects.",

        posts: 18,
        followers: 245,
        following: 132,

        field: "Electronics & Communication Engineering",

        interests: [
            "Technology",
            "Coding",
            "WebDev"
        ]
    }
];

// adding community route to show community in  it
app.get("/home/community",(req,res) =>{
    console.log(users);
    res.render("community.ejs",{users});
});


// additional functionality for user profile and login

app.post("/home/login", async (req, res) => {

    const { email, password } = req.body;

    // Find user in MongoDB
    const user = await User.findOne({ email });

    if (!user) {
        return res.send("Invalid email or password");
    }

    // Compare entered password with stored hash
    const passwordMatch = await bcrypt.compare(
        password,
        user.password
    );

    if (!passwordMatch) {
        return res.send("Invalid email or password");
    }

    // Store user identity in session
    req.session.userId = user._id;
    req.session.username = user.username;

    // User is now logged in
    res.redirect("/dashboard");
});


// scholarship finder
const StudentProfile = require("./models/scholarprofile");
const Scholarship = require("./models/scholar");

// get request for scholarship finder page
app.get(
    "/scholarships",
    requireLogin,
    async (req, res) => {

        const profile = await StudentProfile.findOne({
            userId: req.session.userId
        });

        if (profile) {
            return res.render("scholarshipResults", {
                profile,
                scholarships: []
            });
        }

        res.render("scholarships");
    }
);

// save the form data to mongoData
app.post(
    "/scholarships/find",
    requireLogin,
    async (req, res) => {

        try {

            const {
                gender,
                state,
                district,
                educationLevel,
                institution,
                course,
                year,
                annualIncome,
                category,
                percentage
            } = req.body;


            const disability = req.body.disability === "on";

            const firstGeneration =
                req.body.firstGeneration === "on";

            const hosteller =
                req.body.hosteller === "on";


            const profileData = {
                userId: req.session.userId,

                gender,
                state,
                district,
                educationLevel,
                institution,
                course,
                year,

                annualIncome: Number(annualIncome),

                category,

                percentage:
                    percentage
                        ? Number(percentage)
                        : undefined,

                disability,
                firstGeneration,
                hosteller
            };


            await StudentProfile.findOneAndUpdate(
                {
                    userId: req.session.userId
                },
                profileData,
                {
                    upsert: true,
                    new: true
                }
            );


            res.redirect("/scholarships/results");

        } catch (error) {

            console.log(
                "Scholarship profile error:",
                error
            );

            res.status(500).send(
                "Unable to save scholarship profile."
            );
        }
    }
);

// find matching Scholarships now
app.get(
    "/scholarships/results",
    requireLogin,
    async (req, res) => {

        try {

            const profile =
                await StudentProfile.findOne({
                    userId: req.session.userId
                });


            if (!profile) {
                return res.redirect("/scholarships");
            }


            const scholarships =
                await Scholarship.find({
                    educationLevels:
                        profile.educationLevel,

                    states: {
                        $in: [
                            profile.state,
                            "All India"
                        ]
                    },

                    categories: {
                        $in: [
                            profile.category,
                            "All"
                        ]
                    },

                    maxIncome: {
                        $gte: profile.annualIncome
                    },

                    minPercentage: {
                        $lte: profile.percentage || 0
                    }
                });


            res.render(
                "scholarshipResults",
                {
                    profile,
                    scholarships
                }
            );

        } catch (error) {

            console.log(
                "Scholarship matching error:",
                error
            );

            res.status(500).send(
                "Unable to find scholarships."
            );
        }
    }
);

// Catch every URL that was not matched above
// app.use((req, res) => {
//     console.log("Unknown URL:", req.originalUrl);
//     res.redirect("/home");
// });
app.use((req, res) => {
    res.status(404).render("default.ejs");
});


