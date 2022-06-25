package util

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"math"
	"net/http"
	"net/mail"
	"net/url"
	"strings"

	"techdevelopers.live/user/config"
	"techdevelopers.live/user/constants"
	"techdevelopers.live/user/helpers/request"
)

func StructToJSON(val interface{}) interface{} {
	jsonEncoded, _ := json.Marshal(val)
	var respJSON interface{}
	json.Unmarshal([]byte(jsonEncoded), &respJSON)
	return respJSON
}
func IsAdmin(mailData *request.VerificationData) bool {
	ok := true
	if mailData.AdminId != config.Get().MailAdminId {
		ok = false
	}
	if mailData.Password != config.Get().MailPassword {
		ok = false
	}
	return ok
}

func Contains(str []string, key string) bool {
	for _, v := range str {
		if v == key {
			return true
		}
	}
	return false
}

func IsInteger(val float64) bool {
	return math.Floor(val) == math.Ceil(val)
}

func ValidEmail(email string) (string, bool) {
	mailId, err := mail.ParseAddress(email)
	if err != nil {
		return "", false
	}
	return mailId.Address, true
}

func CallAPI(URL string, method string, ContentType string, payLoad map[string]interface{}, header map[string]interface{}) (string, error) {
	response := ""
	if method == http.MethodPost {
		body, err := json.Marshal(payLoad)
		if err != nil {
			return "", err
		}
		client := &http.Client{}
		var req *http.Request

		if ContentType == constants.CONTENT_TYPE_XML_ENCODED {
			form := url.Values{}
			for k, v := range payLoad {
				form.Add(k, v.(string))
			}
			req, err = http.NewRequest(http.MethodPost, URL, strings.NewReader(form.Encode()))
		} else {
			req, err = http.NewRequest(http.MethodPost, URL, bytes.NewBuffer(body))
		}
		if err != nil {
			return "", err
		}
		req.Header.Set("Content-Type", ContentType)

		for key, value := range header {
			req.Header.Set(key, value.(string))
		}
		resp, err := client.Do(req)
		if err != nil {
			return "", err
		}

		defer resp.Body.Close()

		responseBody, err := ioutil.ReadAll(resp.Body)

		if err != nil {
			return "", err
		}
		response = string(responseBody)

	} else if method == http.MethodGet {
		client := &http.Client{}
		req, err := http.NewRequest(http.MethodGet, URL, nil)
		if err != nil {
			return "", err
		}

		// appending to existing query args
		q := req.URL.Query()
		for key, value := range payLoad {
			q.Add(key, fmt.Sprintf("%v", value))
		}

		// assign encoded query string to http request
		req.URL.RawQuery = q.Encode()

		resp, err := client.Do(req)
		if err != nil {
			return "", err
		}

		defer resp.Body.Close()
		responseBody, err := ioutil.ReadAll(resp.Body)
		if err != nil {
			return "", err
		}
		response = string(responseBody)
	}

	return response, nil
}
