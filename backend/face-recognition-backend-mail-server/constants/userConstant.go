package constants

// request related
const (
	HTTP_METHOD_GET  = "GET"
	HTTP_METHOD_POST = "POST"
)

// api status
const (
	API_FAILED_STATUS  = "Fail"
	API_SUCCESS_STATUS = "Success"
)

// error messages
const (
	INVALID_REQUEST                        = "invalid json request body"
	INVALID_MAIL_ID                        = "invalid email address provided"
	ERROR_BAD_REQUEST                      = "bad request"
	NOT_AUTHERIZED                         = "unautherized access"
	INVALID_REQUEST_NOT_ADMIN              = "you don't have permission to access this resource"
	SERVER_ERROR                           = "server error"
)

// response messages
const (
	VERIFY_MAIL                        = "Please verify your email account using the confirmation code send to your mail"
	ERROR_IN_SENDING_MAIL              = "error in sending mail"
	ERROR_IN_GETTING_VERIFICATION_DATA = "Unable to verify mail. Please try again later"
	USER_VERIFICATION_SUCCESS          = "user mail verification succeeded"
	SEND_EMAIL_SUCCESS                 = "email sent successfully"
)

// required request body fields
var (
	SEND_EMAIL_REQUIRED_FIELDS = []string{"userName", "email", "type","otp", "company", "adminId", "password", "subject"}
	SEND_EMAIL_OPTIONAL_FIELDS = []string{}
)

// info messages
const (
	INFO_CACHE_DISABLED = "cache disabled"
)

// ContentType
const (
	CONTENT_TYPE_JSON        = "application/json"
	CONTENT_TYPE_XML_ENCODED = "application/x-www-form-urlencoded"
)

const (
	DISCORD_URL = "https://discord.com/api/webhooks/"
)
