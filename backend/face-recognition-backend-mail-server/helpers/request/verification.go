package request

type VerificationDataType int

const (
	MailConfirmation VerificationDataType = iota + 1
	PassWordReset
)

// EmailData represents the type for the data stored for email sending
type EmailData struct {
	UserName string `json:"userName" form:"userName" binding:"required"`
	Email    string `json:"email,omitempty" form:"email" binding:"required"`
	Type     string `json:"type,omitempty" form:"type" binding:"required"`
	Company  string `json:"company,omitempty" form:"company" binding:"required"`
	AdminId  string `json:"adminId,omitempty" form:"adminId" binding:"required"`
	Password string `json:"password" form:"password" binding:"required"`
}

// VerificationData represents the type for the data stored for verification.
type VerificationData struct {
	UserName    string `json:"userName"`
	Email       string `json:"email"`
	Type        string `json:"type"`
	Subject     string `json:"subject"`
	Company     string `json:"company"`
	OTPCode     string `json:"otp"`
	AdminId     string `json:"adminId"`
	Password    string `json:"password"`
}
