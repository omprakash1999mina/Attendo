package server

import (
	"log"
	"os"

	"techdevelopers.live/user/services/logger"
)

func Init() {
	logger.InitLogger()
	r := NewRouter()

	port := os.Getenv("PORT")
	if port == "" {
		port = "80" // Default port if not specified
	}

	err := r.Run(":" + port)
	log.Println(err)
}
