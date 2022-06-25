package server

import (
	"github.com/gin-gonic/gin"
	"techdevelopers.live/user/constants"
	v1 "techdevelopers.live/user/controllers/v1"
	"techdevelopers.live/user/controllers/v1/middlewares"
)

func NewRouter() *gin.Engine {
	router := gin.New()
	router.Use(gin.Logger())

	// router.Use(middlewares.CORSMiddleware())

	version1 := router.Group("api/v1")
	{
		userGroupV1 := version1.Group("user")
		{
			userGroupV1.POST("/verify/sendmail", middlewares.GetRequestBodyEmailData(constants.SEND_EMAIL_REQUIRED_FIELDS, constants.SEND_EMAIL_OPTIONAL_FIELDS), v1.SendEmailToUser)
		}
	}

	return router
}
