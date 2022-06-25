import Joi from 'joi';
import { User } from "../../models";
import CustomErrorHandler from '../../Services/CustomerrorHandler';
import bcrypt from 'bcrypt';
import discord from '../../Services/discord';
import firebaseServices from '../../Services/firebaseConfig';
import moment from "moment";


const registerController = {

    async register(req, res, next) {
        const today = moment().utcOffset(330);

        // validation
        const registerSchema = Joi.object({
            userName: Joi.string().min(4).max(50).required(),
            email: Joi.string().email().required(),
            teamName: Joi.string().required(),
            profileImgLink: Joi.string().required(),
            workProfile: Joi.string().required(),
            encodings: Joi.string().required(),
            contactNumber: Joi.string().required(),

        });

        const { error } = registerSchema.validate(req.body);
        let ok = false;

        if (error) {
            // delete the file uploaded in firebase 
            if (req.body.profileImgLink) {
                ok = firebaseServices.DeleteFileInFirebase(req.body.profileImgLink)
            }
            // implimetation for discord error logs
            if (!ok) {
                discord.SendErrorMessageToDiscord(req.body.email, "Register User", "error in deleting files in firebase !!");
                console.log("failed to deleting file")
            }
            else {
                discord.SendErrorMessageToDiscord(req.body.email, "Register User", error + " and All files deleted successfully");
                console.log("error accurs and all files deleted on firebase successfully")
            }
            // ok = firebaseServices.DeleteFileInFirebase(req.body.profileImgLink)
            return next(error);
        }
        try {
            const exist = await User.exists({ email: req.body.email });
            if (exist) {
                // delete the file uploaded in firebase 
                const ok = firebaseServices.DeleteFileInFirebase(req.body.profileImgLink)
                if (!ok) {
                    discord.SendErrorMessageToDiscord(req.body.email, "Register User", "error in deleting files in firebase !!");
                    console.log("failed to deleting file")
                }
                else {
                    discord.SendErrorMessageToDiscord(req.body.email, "Register User", error + " and All files deleted successfully");
                    console.log("error accurs and all files deleted on firebase successfully")
                }
                // implimetation for discord error logs
                discord.SendErrorMessageToDiscord(req.body.email, "Register User", "error the email is already exist ");
                return next(CustomErrorHandler.alreadyExist('This email is already taken . '));
            }
        } catch (err) {
            // delete the file uploaded in firebase 
            return next(CustomErrorHandler.badRequest());
        }
        const { userName, email, teamName, encodings, contactNumber, workProfile, profileImgLink } = req.body;
        const random = Math.floor(1000 + Math.random() * 9000);
        const password = userName.substring(0, 4) + "@" + contactNumber.substring(0, 4) + random.toString();

        const { _id } = req.user;
        const adminId = _id;
        const hashedPassword = await bcrypt.hash(password, 10);

        const days = today.daysInMonth();
        const blank_days_list = Array(days).fill('A')

        const attendance = {
            previousMonth: { P: 0, A: 0 },
            currentMonth: blank_days_list
        }
        let document;

        try {
            document = await User.create({
                userName,
                email,
                teamName,
                adminId,
                encodings,
                attendance,
                workProfile,
                contactNumber,
                profileImgLink,
                password: hashedPassword
            });
            console.log(document);

            if (!document) {
                discord.SendErrorMessageToDiscord(email, "Register User", "error in creating the user in database !!");
                return next(CustomErrorHandler.serverError());
            }

        } catch (err) {
            // delete the file uploaded in firebase
            const ok = firebaseServices.DeleteFileInFirebase(req.body.profileImgLink)
            if (!ok) {
                discord.SendErrorMessageToDiscord(req.body.email, "Register User", "error in deleting files in firebase !!");
                console.log("failed to deleting file")
            }
            else {
                discord.SendErrorMessageToDiscord(req.body.email, "Register User", error + " and All files deleted successfully");
                console.log("error accurs and all files deleted on firebase successfully")
            }
            discord.SendErrorMessageToDiscord(req.body.email, "Register User", err);
            return next(err);
        }
        res.status(201).json({ default_password: password, status: "Success", msg: "User Registered Successfully !!!  " });
    },
    async registerAdmin(req, res, next) {
        // validation
        const registerSchema = Joi.object({
            email: Joi.string().email().required()
        });

        const { error } = registerSchema.validate(req.body);

        if (error) {
            // ok = firebaseServices.DeleteFileInFirebase(req.body.profileImgLink)
            return next(error);
        }
        const { email } = req.body;

        let document;

        try {
            const exist = await User.exists({ email: req.body.email });
            if (!exist) {
                // implimetation for discord error logs
                discord.SendErrorMessageToDiscord(req.body.email, "Register Admin", "error user not exist in our database !!");
                return next(CustomErrorHandler.badRequest("User Not exist !!"));
            }
            document = await User.findOneAndUpdate({ email }, {
                role: "admin"
            });

            if (!document) {
                discord.SendErrorMessageToDiscord(email, "Register Admin", "error in creating the user in database !!");
                return next(CustomErrorHandler.serverError());
            }

        } catch (err) {
            discord.SendErrorMessageToDiscord(req.body.email, "Register Admin", err);
            return next(CustomErrorHandler.serverError());
        }
        res.status(200).json({ status: "Success", msg: "Admin Registered Successfully. " });
    },
};

export default registerController;
