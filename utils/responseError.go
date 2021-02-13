package utils

import (
	"net/http"
)

//ResponseError with http error
func ResponseError(res http.ResponseWriter, status int, message string) {
	res.WriteHeader(status)
	res.Write([]byte(message))
}
