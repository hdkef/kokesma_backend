package utils

import (
	"encoding/json"
	"net/http"
)

//ResponseSuccessJSON to response with message in json format
func ResponseSuccessJSON(res http.ResponseWriter, status int, message string) {
	Obj := struct {
		SUCCESS string
		MESSAGE string
	}{SUCCESS: "true", MESSAGE: message}
	res.WriteHeader(status)
	json.NewEncoder(res).Encode(Obj)
}
