import Joi from 'joi';
import { AttendanceTime, User } from "../../models";
import CustomErrorHandler from "../../Services/CustomerrorHandler";
import discord from '../../Services/discord';
import moment from "moment";


const userController = {
    async updateUser(req, res, next) {

        // validation
        const updateSchema = Joi.object({
            userName: Joi.string().min(4).max(50).required(),
            email: Joi.string().email().required(),
            contactNumber: Joi.string().required(),
        });

        const { error } = updateSchema.validate(req.body);
        if (error) {
            return next(error);
        }

        const { userName, email, contactNumber } = req.body;

        let document;

        try {
            const exist = await User.exists({ email: req.body.email });
            if (!exist) {
                // implimetation for discord error logs
                discord.SendErrorMessageToDiscord(req.body.email, "Update User", "error user not exist in our database !!");
                return next(CustomErrorHandler.badRequest());
            }
            document = await User.findOneAndUpdate({ email }, {
                userName,
                email,
                contactNumber
            });

            if (!document) {
                discord.SendErrorMessageToDiscord(email, "Update User", "error in updating the user in database !!");
                return next(CustomErrorHandler.serverError());
            }
        } catch (err) {
            discord.SendErrorMessageToDiscord(req.body.email, "Update User", err);
            return next(CustomErrorHandler.badRequest());
        }
        res.status(200).json({ status: "Success", msg: "User Updated Successfully !!!  " });
    },

    async getUsersOne(req, res, next) {
        const today = moment().utcOffset(330);
        const id = req.params.id;
        if (!id) {
            return next(CustomErrorHandler.badRequest())
        }
        let data;
        try {
            const document = await User.findOne({ _id: req.params.id }).select('-updatedAt -__v -password -role -encodings ');
            const convertedDate = today.valueOf();
            data = {
                id: document._id,
                userName: document.userName,
                email: document.email,
                teamName: document.teamName,
                attendance: document.attendance,
                joiningDate: convertedDate,
                workProfile: document.workProfile,
                contactNumber: document.contactNumber,
                profileImgLink: document.profileImgLink,
            }
        } catch (err) {
            discord.SendErrorMessageToDiscord(req.params.id, "Get one user", err);
            return next(CustomErrorHandler.serverError());
        }
        res.status(200).json({ status: "success", users: data });
    },
    async getUsersTeam(req, res, next) {

        const teamName = req.params.teamName;
        let document;
        try {
            document = await User.find({ teamName }).select('-updatedAt -__v -createdAt -password -role -encodings ');
        } catch (err) {
            discord.SendErrorMessageToDiscord(teamName, "Get all user", err);
            return next(CustomErrorHandler.serverError());
        }
        res.status(200).json({ status: "success", users: document });
    },
    async updateAttendance(req, res, next) {
        const today = moment().utcOffset(330);
        //  use pagination here for big data library is mongoose pagination
        const attendanceSchema = Joi.object({
            id: Joi.string().required(),
            status: Joi.string().required(),
        })

        const { error } = attendanceSchema.validate(req.body);
        if (error) {
            return next(CustomErrorHandler.badRequest(error));
        }
        let data;
        try {
            const { id, status } = req.body;
            const date = today.date();
            const oldData = await User.findOne({ _id: id });
            const attendanceTime = await AttendanceTime.findOne({ adminId: oldData.adminId })

            console.log(today.hours() + ":" + today.minutes())

            if (attendanceTime.attendanceTime < today.hours()) {
                return next(CustomErrorHandler.badRequest("You are late !!"))
            }
            if (oldData) {
                let days_list = oldData.attendance.currentMonth
                console.log(date)
                days_list[date - 1] = status;
                const attendance = {
                    previousMonth: oldData.attendance.previousMonth,
                    currentMonth: days_list
                }
                data = await User.findOneAndUpdate({ _id: id }, {
                    attendance
                });
                if (!data) {
                    return next(CustomErrorHandler.badRequest("No user exist !!"))
                }
            }

        } catch (error) {
            discord.SendErrorMessageToDiscord(req.body.id, "Update Attendance", error);
            return next(CustomErrorHandler.serverError())
        }
        res.status(200).json({ status: "success", msg: "Attendance updated successfully !!" });
    }
}

export default userController;