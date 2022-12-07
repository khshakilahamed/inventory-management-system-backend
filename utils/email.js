

// with mailGun
const formData = require('form-data');
const Mailgun = require('mailgun.js');
const mailgun = new Mailgun(formData);

const mg = mailgun.client({
    username: 'api',
    key: process.env.MAILGUN_API_KEY,
});

module.exports.sendMailWithMailGun = async (data) => {
    const result = await mg.messages
        .create("sandboxb1cacddde2e941fbac621563e811e561.mailgun.org", {
            from: "Mailgun Sandbox <postmaster@sandboxb1cacddde2e941fbac621563e811e561.mailgun.org>",
            to: data.to,
            subject: data.subject,
            text: data.text,

            // to: ["khshakil.ahamed18@gmail.com"],
            // subject: "Hello",
            // text: "Testing some Mailgun awesomness!",
        });
        // .then(msg => console.log(msg)) // logs response data
        // .catch(err => console.log(err)); // logs any error`;


        return result.id;
}