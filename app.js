const express = require('express');
const app = express();
var cors = require('cors')

const server = require("http").Server(app)

const swaggerUi = require('swagger-ui-express');
const specs = require('./swagger/index')

require("dotenv").config()
const port = process.env.PORT || port;
const passport = require('passport')



app.use(express.json({ limit: "50mb", }));
app.use(express.urlencoded({ extended: true }))
app.use(passport.initialize())
app.use(passport.session())
app.use('/uploads', express.static('uploads'))

app.use(function (req, res, next) {
    var allowedOrigins = [process.env.FRONTEND_URI, process.env.FRONTEND_URI, "http://127.0.0.1:8080/", "http://127.0.0.1:8080", "https://blowapp.netlify.app/", "https://blowapp.netlify.app", "https://www.blowapp.netlify.app", "www.blowapp.netlify.app"];
    var origin = req.headers.origin;

    if (allowedOrigins.includes(origin)) {
        res.setHeader("Access-Control-Allow-Origin", origin); // restrict it to the required domain
    }else{
        res.setHeader("Access-Control-Allow-Origin", "*");
    }
    if (origin) {
        res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
    }else{
        res.setHeader("Access-Control-Allow-Origin", "*");
    }

    if (req.method === 'OPTIONS') {
        res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
        return res.status(200).json({});
    }

    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'access-control-allow-origin,content-type,X-Requested-With,Access-Control-Request-Headers,Content-type,Accept,X-Access-Token,X-Key,Content-Type,Authorization');
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Request-Headers', 'access-control-allow-origin,content-type,X-Requested-With, Content-type,Accept,X-Access-Token,X-Key, Content-Type, Authorization');


    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.setHeader("Access-Control-Allow-Headers", "access-control-allow-origin,content-type,X-Requested-With,Access-Control-Request-Headers,Content-type,Accept,X-Access-Token,X-Key,Content-Type,Authorization");
    // res.header('Access-Control-Allow-Methods', 'GET, OPTIONS, PUT, PATCH, DELETE');
    // res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    // res.header('Access-Control-Allow-Credentials', true);
    return next();
});

const ioRoutes = require('./controllers/Socket/index')(server)
const authRoutes = require('./routes/Auth')
const userRoutes = require('./routes/User')
const teamRoutes = require('./routes/Teams')
const projectRoutes = require('./routes/Projects');
const calenderRoutes = require('./routes/Calender');
const reportRoutes = require('./routes/Reports');





app.use('/user', userRoutes)
app.use('/auth', authRoutes)
app.use('/team', teamRoutes)
app.use('/project', projectRoutes)
app.use('/calender', calenderRoutes)
app.use('/report', reportRoutes)




app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.get('/swagger.json', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(specs);
});


app.get("*", (req, res) => {
    return res.redirect("/api-docs")
})


server.listen(port, () => console.log(`listening on http://localhost:${port}`));
