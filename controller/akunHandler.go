package controller

import (
	"database/sql"
	"encoding/json"
	"fmt"
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

		fmt.Println("end point hit")
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
