package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	MailName             string
	MailAdminId          string
	MailPassword         string
	AppEnv               string
	ServerPort           string

	CustomTemplateID          string
	MailVerifictionTemplateID string
	PasswordResetTemplateID   string
	SendGridApiKey            string

	DiscordWebHookId             string
	DiscordWebHookToken          string
	DiscordShouldWaitForResponse string
	DiscordUrl                   string
}

var config Config

// init() Should run at the very beginning, before any other package or code.
func init() {
	appEnv := os.Getenv("APP_ENV")
	if len(appEnv) == 0 {
		appEnv = "dev"
	}

	configFilePath := "./config/.env.dev"

	switch appEnv {
	case "production":
		configFilePath = "./config/.env.prod"
		break
	case "stage":
		configFilePath = "./config/.env.stage"
		break
	}
	log.Println("reading env from: " + configFilePath)

	e := godotenv.Load(configFilePath)

	if e != nil {
		log.Println("error loading .env: ", e)
		panic(e.Error())
	}

	config.MailName = os.Getenv("MAIL_NAME")
	config.MailAdminId = os.Getenv("MAIL_ADMIN_ID")
	config.MailPassword = os.Getenv("MAIL_PASSWORD")
	config.AppEnv = appEnv
	config.ServerPort = os.Getenv("SERVER_PORT")
	
	config.MailVerifictionTemplateID = os.Getenv("MAIL_VERIFICATION_TEMPLATE_ID")
	config.PasswordResetTemplateID = os.Getenv("PASSWORD_RESET_TEMPLATE_ID")
	config.CustomTemplateID = os.Getenv("CUSTOM_TEMPLATE_ID")
	config.SendGridApiKey = os.Getenv("SENDGRID_API_KEY")

	config.DiscordWebHookId = os.Getenv("DISCORD_WEBHOOK_ID")
	config.DiscordWebHookToken = os.Getenv("DISCORD_WEBHOOK_TOKEN")
	config.DiscordShouldWaitForResponse = os.Getenv("DISCORD_SHOULD_WAIT_FOR_RESPONSE")
	config.DiscordUrl = os.Getenv("DISCORD_URL")
}

func Get() Config {
	return config
}

func IsProduction() bool {
	return config.AppEnv == "production"
}
