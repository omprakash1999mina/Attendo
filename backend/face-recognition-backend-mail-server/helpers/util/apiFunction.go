package util

import "techdevelopers.live/user/constants"

func SendErrorResponse(err error) interface{} {
	return map[string]interface{}{
		"status":  constants.API_FAILED_STATUS,
		"message": err.Error(),
	}
}

func SendSuccessResponse(msg string) interface{} {
	return map[string]interface{}{
		"status":  constants.API_SUCCESS_STATUS,
		"message": msg,
	}
}
