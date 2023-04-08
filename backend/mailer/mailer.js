import nodemailer from "nodemailer"

export default function sendConfirmationEmail(user, confirmationCode) {

    return new Promise((resolve, reject) => {

        let transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASS,
            }
        })

        const message = {
            from: process.env.GMAIL_USER,
            to: user.email,
            subject: "Confirm your email",
            html: `
                <h1>Confirm your email</h1>
                <p>Hi ${user.username},</p>
                <p>Thanks for signing up for our service. </p>
                <p>To activate your account please confirm your email by clicking on the following link:</p>
                <p><a target="_" href="https://guysauceperformance.netlify.app/activate/:${confirmationCode}">CLICK HERE</a></p>
                <p>Thanks!</p>
            `
        }

        transporter.sendMail(message, (err, info) => {
            if (err) {
                reject(err)
            }
            resolve(info)
        })
    
    })

}