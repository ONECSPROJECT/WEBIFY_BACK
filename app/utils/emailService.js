////////////////////////////////////////////////////
// send an email with given content using MailJet //
////////////////////////////////////////////////////
const dotenv = require('dotenv');
const assert = require('node:assert/strict');
const Mailjet = require('node-mailjet');
dotenv.config();



const mailjet = Mailjet.apiConnect(
    process.env.MJ_APIKEY_PUBLIC || 'ta_nouvelle_cle_publique',
    process.env.MJ_APIKEY_PRIVATE || 'ta_nouvelle_cle_privee'
);
console.log("Mailjet Public Key:", process.env.MJ_APIKEY_PUBLIC);
console.log("Mailjet Private Key:", process.env.MJ_APIKEY_PRIVATE);


// Définition de senderMail avec une variable d'environnement
const senderMail = process.env.SENDER_MAIL || 'default-email@gmail.com';

function request(recipientMail, url) {
    assert.match(senderMail, /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/, "Invalid sender email format");
    assert.match(recipientMail, /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/, "Invalid recipient email format");
    assert.match(url, /^(https?:\/\/)?(localhost|[\w.-]+)(:\d+)?(\/\S*)?$/, "Invalid URL format");

    return mailjet
        .post('send', { version: 'v3.1' })
        .request({
            Messages: [
                {
                    From: {
                        Email: senderMail,  // Utilisation de senderMail défini dynamiquement
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
        });
}

module.exports = { request };
