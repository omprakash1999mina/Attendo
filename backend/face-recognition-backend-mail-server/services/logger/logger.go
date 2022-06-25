package logger

import (
	"sync"

	"go.uber.org/zap"
	"techdevelopers.live/user/config"
)

var logger *zap.Logger
var once sync.Once

func InitLogger() {
	once.Do(func() {
		if config.IsProduction() {
			logger, _ = zap.NewProduction()
		} else {
			logger, _ = zap.NewDevelopment()
		}
		defer logger.Sync()
	})
}

func Client() *zap.Logger {
	return logger
}
