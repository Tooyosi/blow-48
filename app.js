const express = require('express');
const app = express();

const swaggerUi = require('swagger-ui-express');
const specs = require('./swagger/index')

require("dotenv").config()
const port = process.env.PORT || port;
const passport = require('passport')


app.use(express.json({ limit: "50mb", }));
app.use(express.urlencoded({extended: true}))
app.use(passport.initialize())
app.use(passport.session())


app.use(function (req, res, next) {
    var allowedOrigins = [process.env.FRONTEND_URI, process.env.FRONTEND_URI];
    var origin = req.headers.origin;

    if (allowedOrigins.includes(origin)) {
        res.setHeader("Access-Control-Allow-Origin", origin); // restrict it to the required domain
    }

    res.header('Access-Control-Allow-Methods', 'GET, OPTIONS, PUT, PATCH, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', true);
    return next();
});

const authRoutes = require('./routes/Auth')
const userRoutes = require('./routes/User')


app.use('/user', userRoutes)
app.use('/auth', authRoutes)




app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.get('/swagger.json', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(specs);
});


app.get("*", (req, res)=>{
    return res.redirect("/api-docs")
})


app.listen(port, () => console.log(`listening on http://localhost:${port}`));
