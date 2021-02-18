package controller

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"pure/models"
	"pure/utils"
	"time"
)

//AkunHandler is to handle akuntansi
type AkunHandler struct {
}

//Insert akuntansi transaction
func (c *AkunHandler) Insert(db *sql.DB) http.HandlerFunc {

	return func(res http.ResponseWriter, req *http.Request) {

		claims, err := Authenticate(res, req)
		if err != nil {
			utils.ResponseError(res, http.StatusUnauthorized, "unauthorized access")
			return
		}
		if claims["Role"] != "ACC" {
			utils.ResponseError(res, http.StatusUnauthorized, "unauthorized bukan ACC")
			return
		}
		var accLoad models.Acc
		date := time.Now()
		err = json.NewDecoder(req.Body).Decode(&accLoad)
		_, err = db.Exec("INSERT INTO acc_table (date,subject,kredit,debit,ket) VALUES($1,$2,$3,$4,$5)", date, accLoad.Subject, accLoad.Kredit, accLoad.Debit, accLoad.Ket)
		if err != nil {
			utils.ResponseError(res, http.StatusInternalServerError, "cannot insert acc")
			return
		}
		utils.ResponseSuccessJSON(res, http.StatusOK, "transaction is recorded, subject :"+accLoad.Subject+"& ket: "+accLoad.Ket)
	}
}

//AccJurnal is to get jurnal of accounting
func (c *AkunHandler) AccJurnal(db *sql.DB) http.HandlerFunc {
	return func(res http.ResponseWriter, req *http.Request) {
		claims, err := Authenticate(res, req)
		if err != nil {
			utils.ResponseError(res, http.StatusUnauthorized, "unauthorized access")
			return
		}
		if claims["Role"] != "ACC" {
			utils.ResponseError(res, http.StatusUnauthorized, "unauthorized bukan ACC")
			return
		}
		var load struct {
			FDate string
			SDate string
		}
		err = json.NewDecoder(req.Body).Decode(&load)
		if err != nil {
			utils.ResponseError(res, http.StatusInternalServerError, "cannot unmarshal json")
			return
		}
		var accRes []models.Acc
		rows, err := db.Query("SELECT date,subject,kredit,debit,ket FROM acc_table WHERE date BETWEEN $1 AND $2", load.FDate, load.SDate)
		if err != nil {
			utils.ResponseError(res, http.StatusInternalServerError, "cannot select db")
			return
		}
		for rows.Next() {
			var accOne models.Acc
			rows.Scan(&accOne.Date, &accOne.Subject, &accOne.Kredit, &accOne.Debit, &accOne.Ket)
			accRes = append(accRes, accOne)
		}
		jsonData, err := json.Marshal(accRes)
		if err != nil {
			utils.ResponseError(res, http.StatusInternalServerError, "cannot marshal json")
			return
		}
		res.Write([]byte(jsonData))
	}
}
