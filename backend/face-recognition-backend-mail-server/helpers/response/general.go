package response

type Response struct {
	Status  string      `json:"status"`
	Message string      `json:"message"`
	Result  interface{} `json:"result,omitempty"`
}
