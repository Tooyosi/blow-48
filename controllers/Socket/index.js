const jwt = require('jsonwebtoken')
const Models = require("../../models/index")

let count = 0

let getDecoded = (token) => {
    return new Promise((resolve, reject) => {
        try {
            const decoded = jwt.verify(token, process.env.SESSION_SECRET);
            resolve(decoded)
        } catch (error) {
            reject(error)
        }
    })
}

let userOnline = async (id, param) => {
    let updateUser = await Models.user.findOne({
        where: {
            id: id
        }
    })
    await updateUser.update({
        isOnline: param
    })
}

module.exports = (server) => {
    const io = require("socket.io")(server, {
        cors: {
            origin: "http://127.0.0.1:5500",
            methods: ["*"],
            allowedHeaders: ["Access-Control-Allow-Headers", "Access-Control-Allow-Credentials"],
            credentials: true
        }
    })


    io.on("connection", async (socket) => {
        try {
            let decoded = await getDecoded(socket.handshake.auth.token)

            await userOnline(decoded.id, true)
            socket.on("disconnect", async (data) => {
                let decoded = await getDecoded(socket.handshake.auth.token)
                await userOnline(decoded.id, false)
            })

            socket.on("user list", async (data) => {
                let { skip, limit } = data
                let usersList = await Models.user.findAndCountAll({
                    offset: skip,
                    limit,
                    attributes: { exclude: ['password', 'reset_password_token', 'reset_password_expiry'] },
                    include: {
                        model: Models.user_role,
                        as: 'user_role',
                        attributes: ['role']

                    },
                })

                io.sockets.emit('broadcast', usersList)
            })
            

        } catch (error) {
            // console.log(error)
        }
    })

}