////////////////////////////////////////////////////
// send an email with given content using MailJet //
////////////////////////////////////////////////////
const Mailjet = require('node-mailjet');
const mailjet = Mailjet.apiConnect(
    process.env.MJ_APIKEY_PUBLIC || 'your-public-apikey',
    process.env.MJ_APIKEY_PRIVATE || 'your-private-apikey',
);

function request(senderMail, recipientMail, url) {
    const verificationLink = url + '?token=8a3903ad-6663-4bbe-9211-7902bf8edd0e'
    return mailjet
        .post('send', { version: 'v3.1' })
        .request({
            Messages: [
                {
                    From: {
                        Email: senderMail,
                        Name: "Me"
                    },
                    To: [
                        {
                            Email: recipientMail,
                            Name: "You"
                        }
                    ],
                    Subject: "Verify Your Email Address",
                    TextPart: `Hello, thank you for signing up! Please verify your email by clicking the link below:\n\n${verificationLink}\n\nIf you didn’t request this, you can ignore this email.`,
                    HTMLPart: `
                        <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px; background-color: #f4f4f4;">
                            <div style="max-width: 500px; background: white; padding: 20px; border-radius: 8px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);">
                                <h2 style="color: #333;">Verify Your Email</h2>
                                <p style="color: #555;">Thanks for signing up! Click the button below to verify your email address:</p>
                                <a href="${verificationLink}" style="display: inline-block; background: #007bff; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Verify Email</a>
                                <p style="color: #777; margin-top: 10px;">If you didn’t request this, please ignore this email.</p>
                            </div>
                        </div>
                    `
            ]
        })
}

request('anasnedjmeddine@gmail.com', 'an.mokhtari@esi-sba.dz', 'https://example.com/')
    .then((result) => {
        console.log(result.body)
    })
    .catch((err) => {
        console.log(err.statusCode)
    })
