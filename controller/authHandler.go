package controller

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"os"
	"pure/models"
	"pure/utils"
	"strconv"

	jwt "github.com/dgrijalva/jwt-go"
	"golang.org/x/crypto/bcrypt"
)

const (
	expires = 604800000
	invit   = "LFC"
)

//AuthHandler wraps all http request related to authentication mechanism
type AuthHandler struct {
}

//Login handles http request post related to login and send back token
func (c *AuthHandler) Login(db *sql.DB) http.HandlerFunc {

	return func(res http.ResponseWriter, req *http.Request) {
		decoder := json.NewDecoder(req.Body)
		var user models.User
		var jwt models.JWT
		err := decoder.Decode(&user)
		if err != nil {
			utils.ResponseError(res, http.StatusBadRequest, "cannot unmarshall json")
			return
		}
		inputPass := user.Password
		row := db.QueryRow("SELECT id,nama,pass,rumah FROM usertable WHERE nim=$1 AND role=$2", user.NIM, user.Role)
		err = row.Scan(&user.ID, &user.Nama, &user.Password, &user.Rumah)
		if err != nil {
			utils.ResponseError(res, http.StatusUnauthorized, "username not found")
			return
		}
		hashPass := user.Password
		err = bcrypt.CompareHashAndPassword([]byte(hashPass), []byte(inputPass))
		if err != nil {
			utils.ResponseError(res, http.StatusUnauthorized, "password did not match")
			return
		}
		token, err := CreateToken(user)
		if err != nil {
			utils.ResponseError(res, http.StatusUnauthorized, "cannot create token")
			return
		}
		jwt = models.JWT{ID: user.ID, Token: token, ExpiresAt: expires, Role: user.Role, Nama: user.Nama, Rumah: user.Rumah, NIM: user.NIM}
		res.WriteHeader(http.StatusOK)
		jsonData, error := json.Marshal(jwt)
		if error != nil {
			utils.ResponseError(res, http.StatusInternalServerError, "cannot marshal json")
			return
		}
		res.Write(jsonData)
	}
}

//CreateToken generates token to be sent to client
func CreateToken(user models.User) (string, error) {
	secret := os.Getenv("SECRET")
	var claims = jwt.MapClaims{
		"Id":        strconv.Itoa(user.ID),
		"Nama":      user.Nama,
		"NIM":       user.NIM,
		"Rumah":     user.Rumah,
		"ExpiresAt": expires,
		"Role":      user.Role,
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	tokenString, err := token.SignedString([]byte(secret))
	if err != nil {
		return "", err
	}

	return tokenString, nil
}

//Register handles http request post related to registration of user
func (c *AuthHandler) Register(db *sql.DB) http.HandlerFunc {
	return func(res http.ResponseWriter, req *http.Request) {
		var userInfo struct {
			Rumah    string
			NIM      string
			Nama     string
			Password string
			Role     string
			Invit    string
		}
		err := json.NewDecoder(req.Body).Decode(&userInfo)
		if err != nil {
			utils.ResponseError(res, http.StatusBadRequest, "cannot unmarshall json")
			return
		}
		if userInfo.Invit != invit {
			utils.ResponseError(res, http.StatusUnauthorized, "maaf sahabat, kode invitation salah")
			return
		}
		_, err = db.Query("SELECT nama FROM usertable WHERE NIM=$1", userInfo.NIM)
		if err == nil {
			utils.ResponseError(res, http.StatusConflict, "maaf sahabat, nim ini sudah terdaftar")
			return
		}
		hashPass, err := bcrypt.GenerateFromPassword([]byte(userInfo.Password), 9)
		if err != nil {
			utils.ResponseError(res, http.StatusInternalServerError, "password encryption failed, operation aborted")
			return
		}
		stringHashPass := string(hashPass)

		insert, err := db.Prepare(`INSERT INTO usertable (nama,rumah,NIM,pass,role) VALUES ($1,$2,$3,$4,$5)`)

		if err != nil {
			utils.ResponseError(res, http.StatusInternalServerError, "db prep failed")
			return
		}

		_, err = insert.Exec(userInfo.Nama, userInfo.Rumah, userInfo.NIM, stringHashPass, userInfo.Role)

		if err != nil {
			utils.ResponseError(res, http.StatusInternalServerError, "cannot insert user into database")
			return
		}
		utils.ResponseSuccessJSON(res, http.StatusOK, "registration successful")
	}
}
