////////////////////////////////////////////////////
// send an email with given content using MailJet //
////////////////////////////////////////////////////
const assert = require('node:assert/strict');
const Mailjet = require('node-mailjet');
const mailjet = Mailjet.apiConnect(
    process.env.MJ_APIKEY_PUBLIC || '0c189594977645e19bdef0f5665d521e',
    process.env.MJ_APIKEY_PRIVATE || '0f4df62ab260d1bfc0b579e584dbbb44',
);

function request(recipientMail, url) {

    console.log("email service checkpoint")
    console.log(process.env.MJ_APIKEY_PRIVATE)
    return mailjet
        .post('send', { version: 'v3.1' })
        .request({
            Messages: [
                {
                    From: {
                        Email: 'm.djenadi@esi-sba.dz',
                        Name: "Webify"
                    },
                    To: [
                        {
                            Email: recipientMail,
                            Name: "You"
                        }
                    ],
                    Subject: "(noreply) Reset Your Password",
                    TextPart: `Hello, you can reset your password by clicking the link below:\n\n${url}\n\nIf you didn’t request this, you can ignore this email.`,
                    HTMLPart: `
                        <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px; background-color: #f4f4f4;">
                            <div style="max-width: 500px; background: white; padding: 20px; border-radius: 8px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);">
                                <h2 style="color: #333;">Reset Your Password</h2>
                                <p style="color: #555;">Thanks for signing up! Click the button below to verify your email address:</p>
                                <a href="${url}" style="display: inline-block; background: #007bff; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Verify Email</a>
                                <p style="color: #777; margin-top: 10px;">If you didn’t request this, please ignore this email.</p>
                            </div>
                        </div>
                    `
                }
            ]
        })
}

module.exports = { request };
