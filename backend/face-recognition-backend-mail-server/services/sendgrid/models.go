package sendgrid

// MailService represents the interface for our mail service.
type MailService interface {
	CreateMail(mailReq *Mail) []byte
	SendMail(mailReq *Mail) error
	NewMail(from string, to []string, subject string, mailType MailType, data *MailData) *Mail
}

type MailType int

// List of Mail Types we are going to send.
const (
	MailConfirmation MailType = iota + 1
	PassWordReset
)

// MailData represents the data to be sent to the template of the mail.
type MailData struct {
	Username    string
	Code        string
	Company     string
	Email       string
}

// Mail represents a email request
type Mail struct {
	From        string
	To          []string
	Body        string
	Subject     string
	Mtype       MailType
	Data        *MailData
}
