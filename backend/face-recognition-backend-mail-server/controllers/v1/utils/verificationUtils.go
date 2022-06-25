package utils

import (
	"fmt"

	"techdevelopers.live/user/helpers/request"
	"techdevelopers.live/user/helpers/util"
)

func ValidateAndParseVerificationFields(verificationJSON map[string]interface{}, requiredFields []string, optionalFields []string) (*request.VerificationData, bool) {
	lengthDiffRequiredFieldsAndUserJSON := len(verificationJSON) - len(requiredFields)

	if lengthDiffRequiredFieldsAndUserJSON < 0 || len(optionalFields) < lengthDiffRequiredFieldsAndUserJSON {
		return nil, false
	}

	countOfReqFields := len(requiredFields)
	var verification request.VerificationData
	for k, v := range verificationJSON {
		if util.Contains(requiredFields, k) {
			countOfReqFields--
		} else if !util.Contains(optionalFields, k) {
			return nil, false
		}

		valueType := fmt.Sprintf("%T", v)
		switch k {
		case "userName":
			if valueType == "string" {
				verification.UserName = v.(string)
			} else {
				return &verification, false
			}
		case "email":
			if valueType == "string" {
				verification.Email = v.(string)
			} else {
				return &verification, false
			}
		case "company":
			if valueType == "string" {
				verification.Company = v.(string)
			} else {
				return &verification, false
			}
		case "adminId":
			if valueType == "string" {
				verification.AdminId = v.(string)
			} else {
				return &verification, false
			}
		case "password":
			if valueType == "string" {
				verification.Password = v.(string)
			} else {
				return &verification, false
			}
		case "type":
			if valueType == "string" {
				verification.Type = v.(string)
			} else {
				return &verification, false
			}
		case "subject":
			if valueType == "string" {
				verification.Subject = v.(string)
			} else {
				return &verification, false
			}
		case "otp":
			if valueType == "string" {
				verification.OTPCode = v.(string)
			} else {
				return &verification, false
			}
		default:
			return nil, false
		}
	}

	if countOfReqFields == 0 {
		return &verification, true
	}

	return nil, false
}
