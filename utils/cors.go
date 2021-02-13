package utils

import (
	"fmt"
	"net/http"
)

func cors(res *http.ResponseWriter) {
	(*res).Header().Set("Access-Control-Allow-Origin", "*")
	(*res).Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
	(*res).Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Auth, auth")
}

//Cors is to handle cors
func Cors(next http.HandlerFunc) http.HandlerFunc {
	return func(res http.ResponseWriter, req *http.Request) {
		cors(&res)
		if req.Method == "OPTIONS" {
			authHeader := req.Header.Get("Auth")
			fmt.Println("options")
			fmt.Println("header", authHeader)
			fmt.Println("header", res.Header())
			res.WriteHeader(http.StatusOK)
			return
		}
		authHeader := req.Header.Get("Auth")
		fmt.Println("header not options", authHeader)
		fmt.Println("not options")
		fmt.Println("header", res.Header())
		next.ServeHTTP(res, req)
	}
}
