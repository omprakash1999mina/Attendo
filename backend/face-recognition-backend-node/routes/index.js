const router = express.Router();
import express from "express";
import auth from "../middleware/auth";
import admin from "../middleware/admin";
import { loginController, userController, refreshController, registerController, teamController, forgotPasswordController } from '../controllers';
import otpController from "../controllers/auth/otpController";

router.get('/encodings/:teamName', teamController.getEncodings);
router.get('/getallteams', [auth, admin], teamController.getAllTeams);
router.post('/create/team', [auth, admin], teamController.createTeam);
router.get('/get/attendancetime', [auth, admin], teamController.getAttendanceTime);
router.post('/set/attendancetime', [auth, admin], teamController.setAttendanceTime);
router.post('/update/attendancetime', [auth, admin], teamController.updateAttendanceTime);
router.get('/get/holidays', [auth, admin], teamController.getHolidays);
router.post('/set/holidays', [auth, admin], teamController.setHolidays);
router.post('/update/holidays', [auth, admin], teamController.updateHolidays);
router.get('/users/team/:teamName', [auth, admin], userController.getUsersTeam);

router.post('/user/update/attendance', userController.updateAttendance);
router.post('/user/update/profile', userController.updateUser);
router.post('/user/login', loginController.login);
router.post('/user/forgot/password', forgotPasswordController.forgot);
router.post('/user/register', [auth, admin], registerController.register);
router.post('/admin/register', [auth, admin], registerController.registerAdmin);
router.post('/user/refresh', refreshController.refresh);
router.post('/user/logout', loginController.logout);
// router.put('/update/:id', [auth], userController.update);
router.get('/users/:id', [auth], userController.getUsersOne);
router.post('/user/email/verify', otpController.send);

export default router;

