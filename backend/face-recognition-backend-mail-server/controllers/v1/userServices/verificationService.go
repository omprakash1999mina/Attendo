package userServices

import (
	"errors"
	"fmt"

	"techdevelopers.live/user/constants"
	"techdevelopers.live/user/helpers/request"
	"techdevelopers.live/user/services/discord"
	"techdevelopers.live/user/services/sendgrid"
)

func SendMail(req *request.VerificationData) (error) {
	from := "devansh.gaur.iitbhu20@gmail.com"
	to := []string{req.Email}
	mailType := sendgrid.MailConfirmation
	otpCode := req.OTPCode
	var subject string

	mailData := &sendgrid.MailData{
		Username:    req.UserName,
		Company:     req.Company,
		Code:        otpCode,
		Email:       "tech.developers@gmail.com",
	}

	if req.Type == "otp" {
		mailType = sendgrid.PassWordReset
		subject = "Forgot Password"
	}
	if req.Type == "success" {
		mailType = sendgrid.MailConfirmation
		subject = "SignUp successfully"
	}
	if req.Type == "custom" {
		mailType = 3
		subject = req.Subject
	}

	mailReq := sendgrid.NewMail(from, to, subject, mailType, mailData)
	err := sendgrid.SendMail(mailReq)
	if err != nil {
		discord.SendErrorMessageToDiscord(fmt.Sprintf("Error in sending verification mail to %s and the error is: %s", req.Email, err.Error()))
		return errors.New(constants.ERROR_IN_SENDING_MAIL)
	}
	return nil
}
