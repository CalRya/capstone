const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "lindsaysalvaction110@gmail.com",
        pass: "jbib imfx asbw ktma", // Ensure this is a valid App Password
    },
});

async function sendEmail(to, subject, text) {
    const mailOptions = {
        from: "lindsaysalvacion110@gmail.com",
        to,
        subject, 
        text, 
    };

    try {
        const result = await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent successfully to ${to}`);
        return result;
    } catch (error) {
        console.error("❌ Error sending email:", error);
        throw error; // Ensure this error is handled in the calling function
    }
}

module.exports = sendEmail; // ✅ Export this function to use in other files
