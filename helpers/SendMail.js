const axios = require("axios")


class SendMail {
    constructor(service) {
        this.service = process.env.MAIL_SERVICE
        this.auth = {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    }

    async dispatch(to, from, subject, text, myCallBack) {
        var data = {
            service_id: process.env.EMAIL_SERVICE_ID,
            template_id: process.env.EMAIL_TEMPLATE_ID,
            user_id: process.env.EMAIL_USER_ID,
            accessToken: process.env.EMAIL_ACCESS_TOKEN,
            template_params: {
                'to_mail': to,
                'subject': subject,
                "body": text
            }
        };
        
        return await axios({
            method: "Post",
            url: "https://api.emailjs.com/api/v1.0/email/send",
            headers: {
                "Content-Type": 'application/json',
                "Authorization": "Bearer 3d0140adcc1dc3ba14db40f80d6a5db9"
            },
            data: data
        }).then((res)=>{
            myCallBack()
        }).catch((err)=>{
            myCallBack(err)
        })
    }
}

module.exports = SendMail