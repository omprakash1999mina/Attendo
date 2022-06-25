import Joi from 'joi';
import { Team, User, Holidays, AttendanceTime } from "../models";
import CustomErrorHandler from '../Services/CustomerrorHandler';
import discord from '../Services/discord';
import moment from "moment";

const teamController = {
    async createTeam(req, res, next) {
        const createTeamSchema = Joi.object({
            adminId: Joi.string().required(),
            teamName: Joi.string().required(),
            teamBg: Joi.string().required(),
            abreviation: Joi.string().required(),
        })

        const { error } = createTeamSchema.validate(req.body);
        if (error) {
            return next(CustomErrorHandler.badRequest(error));
        }
        try {
            const { adminId, teamName, abreviation, teamBg } = req.body;
            const exist = await User.exists({ _id: adminId });
            if (!exist) {
                discord.SendErrorMessageToDiscord(req.body.adminId, "Create team", "error user not exist in database !!");
                return next(CustomErrorHandler.unAuthorized())
            }

            const document = await Team.create({
                teamBg,
                adminId,
                teamName,
                abreviation
            })
            if (!document) {
                console.log(document)
                return next(CustomErrorHandler.serverError())
            }

        } catch (error) {
            discord.SendErrorMessageToDiscord(req.body.adminId, "Create team", error);
            return next(CustomErrorHandler.serverError())
        }
        res.status(200).json({ status: "success", msg: "Team created successfully." });
    },
    async getAllTeams(req, res, next) {

        const adminId = req.user._id;
        if (!adminId) {
            return next(CustomErrorHandler.badRequest());
        }
        let document;
        try {
            const exist = await User.exists({ _id: adminId });
            if (!exist) {
                discord.SendErrorMessageToDiscord(adminId, "Get team", "error user not exist in database !!");
                return next(CustomErrorHandler.unAuthorized())
            }

            document = await Team.find({ adminId: adminId });
            if (!document) {
                console.log(document)
                return next(CustomErrorHandler.badRequest("No team created yet !!"))
            }

        } catch (error) {
            discord.SendErrorMessageToDiscord(adminId, "Get team", error);
            return next(CustomErrorHandler.serverError())
        }
        res.status(200).json({ status: "success", teams: document });
    },
    async getEncodings(req, res, next) {
        //  use pagination here for big data library is mongoose pagination
        const teamName = req.params.teamName;
        if (!teamName) {
            return next(CustomErrorHandler.badRequest());
        }
        let encode;
        try {
            encode = await User.find({ teamName: teamName }).select('-__v -updatedAt -createdAt -email -role -teamName -userName -password  -attendance -contactNumber');
            if (!encode) {
                return next(CustomErrorHandler.badRequest("No encode exist !!"))
            }

        } catch (error) {
            discord.SendErrorMessageToDiscord(adminId, "Get encodings", error);
            return next(CustomErrorHandler.serverError())
        }
        res.status(200).json({ status: "success", encodings: encode });
    },
    async setHolidays(req, res, next) {
        const today = moment().utcOffset(330);

        const holidaySchema = Joi.object({
            adminId: Joi.string().required(),
            days: Joi.array().required(),
            dates: Joi.array().required(),
        })

        const { error } = holidaySchema.validate(req.body);
        if (error) {
            return next(CustomErrorHandler.badRequest());
        }
        try {
            const { adminId, days, dates } = req.body;
            const exist = await Holidays.findOne({ adminId });
            if (exist) {
                return next(CustomErrorHandler.badRequest("already exist !!"));
            }
            const data = await Holidays.create({
                adminId,
                days,
                dates
            });
            if (!data) {
                discord.SendErrorMessageToDiscord(req.body.adminId, "Set Holidays", "error in creating holidays !!");
                return next(CustomErrorHandler.badRequest("No  exist !!"))
            }

            const allUsers = await User.find();
            allUsers.forEach(async (singleUser) => {
                let attendance = singleUser.attendance.currentMonth;

                // setting all the date as holidays
                dates.forEach(element => {
                    let currentDate = today.date();

                    if (element >= currentDate) {
                        attendance[element - 1] = 'H';
                    }
                });
                // setting all the days as holidays
                days.forEach(day => {
                    attendance.map((element, index) => {
                        let month = today.month() + 1;
                        let year = today.year();

                        const d = new Date(`${year}-${month}-${index + 1}`)

                        const tempDate = d.getDay()
                        if (tempDate === day && (index + 1 >= today.date())) {
                            attendance[index] = 'H';
                        }
                    });
                });
                // console.log(attendance)
                const newAttendance = {
                    previousMonth: singleUser.attendance.previousMonth,
                    currentMonth: attendance
                }
                const id = singleUser._id;
                await User.findOneAndUpdate({ _id: id }, { attendance: newAttendance });
            });

        } catch (error) {
            console.log(error)
            discord.SendErrorMessageToDiscord(req.body.adminId, "Set Holidays", error);
            return next(CustomErrorHandler.serverError())
        }
        res.status(200).json({ status: "success", msg: "holidays set successfully !!" });
    },
    async updateHolidays(req, res, next) {
        const today = moment().utcOffset(330);

        const holidaySchema = Joi.object({
            adminId: Joi.string().required(),
            days: Joi.array().required(),
            dates: Joi.array().required(),
        })

        const { error } = holidaySchema.validate(req.body);
        if (error) {
            return next(CustomErrorHandler.badRequest(error));
        }
        const { adminId, days, dates } = req.body;
        try {
            const data = await Holidays.findOneAndUpdate({ adminId }, {
                adminId,
                days,
                dates
            });
            if (!data) {
                discord.SendErrorMessageToDiscord(req.body.adminId, "Update Holidays", "error in updating holidays !!");
                return next(CustomErrorHandler.badRequest("No  exist !!"))
            }


            // const allUsers = await User.find({ adminId });
            const allUsers = await User.find();
            allUsers.forEach(async (singleUser) => {
                let attendance = singleUser.attendance.currentMonth;

                attendance.forEach((element, index) => {
                    if (element === 'H' && (index + 1 >= today.date())) {
                        attendance[index] = 'A';
                    };
                });
                // setting all the date as holidays
                dates.forEach(element => {
                    let currentDate = today.date();

                    if (element >= currentDate) {
                        attendance[element - 1] = 'H';
                    }
                });
                // setting all the days as holidays
                days.forEach(day => {
                    attendance.map((element, index) => {
                        let month = today.month() + 1;
                        let year = today.year();

                        const d = new Date(`${year}-${month}-${index + 1}`)

                        const tempDate = d.getDay()
                        if (tempDate === day && (index + 1 >= today.date())) {
                            attendance[index] = 'H';
                        }
                    });
                });
                // console.log(attendance)
                const newAttendance = {
                    previousMonth: singleUser.attendance.previousMonth,
                    currentMonth: attendance
                }
                const id = singleUser._id;
                await User.findOneAndUpdate({ _id: id }, { attendance: newAttendance });
            });

        } catch (error) {
            discord.SendErrorMessageToDiscord(req.body.adminId, "Update Holidays", error);
            return next(CustomErrorHandler.serverError())
        }
        res.status(200).json({ status: "success", msg: "holidays updated successfully !!" });
    },
    async getHolidays(req, res, next) {
        let data = null;
        try {
            const { _id } = req.user;
            data = await Holidays.findOne({ adminId: _id }).select('-__v -updatedAt -createdAt -adminId -_id');
            if (!data) {
                discord.SendErrorMessageToDiscord(_id, "Get Holidays", "error no holidays exist in database with this admin id !!");
                return next(CustomErrorHandler.serverError())
            }
        } catch (error) {
            discord.SendErrorMessageToDiscord(req.user._id, "Get Holidays", error);
            return next(CustomErrorHandler.badRequest("Not exist !"))
        }
        res.status(200).json({ status: "success", holidays: data });
    },
    async setAttendanceTime(req, res, next) {
        const attendanceTimeSchema = Joi.object({
            attendanceTime: Joi.string().required(),
        })

        const { error } = attendanceTimeSchema.validate(req.body);
        if (error) {
            return next(CustomErrorHandler.badRequest(error));
        }

        let data = null;
        try {
            const { _id } = req.user;
            const { attendanceTime } = req.body;
            const exist = await AttendanceTime.findOne({ _id });
            if (exist) {
                return next(CustomErrorHandler.badRequest("already exist !!"));
            }
            data = await AttendanceTime.create({
                adminId: _id,
                attendanceTime
            });
            if (!data) {
                discord.SendErrorMessageToDiscord(_id, "Set attendance time", "error no attendance exist in database with this admin id !!");
                return next(CustomErrorHandler.serverError())
            }
        } catch (error) {
            discord.SendErrorMessageToDiscord(req.user._id, "Set attendance time", error);
            return next(CustomErrorHandler.serverError())
        }
        res.status(200).json({ status: "success", msg: "Attendance time set successfully." });
    },
    async updateAttendanceTime(req, res, next) {
        const attendanceTimeSchema = Joi.object({
            attendanceTime: Joi.string().required(),
        })

        const { error } = attendanceTimeSchema.validate(req.body);
        if (error) {
            return next(CustomErrorHandler.badRequest(error));
        }

        let data = null;
        try {
            const { _id } = req.user;
            const { attendanceTime } = req.body;
            data = await AttendanceTime.findOneAndUpdate({ adminId: _id }, {
                attendanceTime
            });
            if (!data) {
                discord.SendErrorMessageToDiscord(_id, "update attendance time", "error no attendanceTime exist in database with this admin id !!");
                return next(CustomErrorHandler.serverError())
            }
        } catch (error) {
            discord.SendErrorMessageToDiscord(req.user._id, "Update attendance time", error);
            return next(CustomErrorHandler.serverError())
        }
        res.status(200).json({ status: "success", msg: "Attendance updated successfully." });
    },
    async getAttendanceTime(req, res, next) {
        let data = null;
        try {
            const { _id } = req.user;
            data = await AttendanceTime.findOne({ adminId: _id }).select('-__v -updatedAt -createdAt -adminId -_id');
            if (!data) {
                discord.SendErrorMessageToDiscord(_id, "Get attendance time", "error no attendance exist in database with this admin id !!");
                return next(CustomErrorHandler.badRequest("Not exist !"))
            }
        } catch (error) {
            discord.SendErrorMessageToDiscord(req.user._id, "Get attendance time", error);
            return next(CustomErrorHandler.serverError())
        }
        res.status(200).json({ status: "success", attendanceTime: data });
    },

}
export default teamController;
