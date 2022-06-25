import axios from "axios";
import { EMAIL_ADMIN_ID, EMAIL_ADMIN_PASSWORD, EMAIL_API_URL } from '../config'
import discord from "./discord";

const mailService = {
    async send(userName, type, otp, email, lenderName, lenderEmail) {
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        }

        const data = {
            userName,
            type,
            otp,
            email,
            lenderName,
            lenderEmail,
            subject: "Regarding OTP",
            company: "Tech Developers",
            adminId: `${EMAIL_ADMIN_ID}`,
            password: `${EMAIL_ADMIN_PASSWORD}`,
        }
        await axios.post(EMAIL_API_URL, data, config).then((res) => {
            return true;
        }).catch((err) => {
            // console.log(err)
            discord.SendErrorMessageToDiscord(email, "Send Mail", err);
            console.log("error in sending mail to :" + email)
            return false;
        });
    }
}
export default mailService;

// {
// 	"userName":"Rishabh Singh",
// 	"type":"success",
// 	"email":"example@gmail.com",
// 	"company":"OpDevelopers PVT LTD",
// 	"adminId":"youradmin",
// 	"password":"yourpass"
// }
