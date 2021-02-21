package controller

import (
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"os"
	"pure/models"
	"pure/utils"
	"strings"
	"time"

	jwt "github.com/dgrijalva/jwt-go"
)

//TomasHandler is for handling tomas
type TomasHandler struct {
}

//Init is to give information about houses and itemoptions
func (c *TomasHandler) Init(db *sql.DB) http.HandlerFunc {
	return func(res http.ResponseWriter, req *http.Request) {
		claims, err := Authenticate(res, req)
		if err != nil {
			utils.ResponseError(res, http.StatusUnauthorized, "unauthorized access "+err.Error())
			return
		}
		if claims["Role"] != "PBU" {
			utils.ResponseError(res, http.StatusUnauthorized, "unauthorized bukan PBU")
			return
		}

		type ItemOp struct {
			ItemID string
			Nama   string
		}

		initLoad := struct {
			Home        []string
			ItemOptions []ItemOp
		}{}

		tx, err := db.Begin()
		if err != nil {
			utils.ResponseError(res, http.StatusInternalServerError, "something was wrong with starting database transaction "+err.Error())
			return
		}

		rows, err := tx.Query("SELECT DISTINCT rumah FROM usertable")
		if err != nil {
			tx.Rollback()
			utils.ResponseError(res, http.StatusInternalServerError, "cannot iterate rows "+err.Error())
			return
		}
		for rows.Next() {
			var homeOne string
			rows.Scan(&homeOne)
			initLoad.Home = append(initLoad.Home, homeOne)
		}
		rows, err = tx.Query("SELECT id, namaprod FROM itemlist")
		if err != nil {
			tx.Rollback()
			utils.ResponseError(res, http.StatusInternalServerError, "cannot iterate rows "+err.Error())
			return
		}
		for rows.Next() {
			var itemOpOne ItemOp
			rows.Scan(&itemOpOne.ItemID, &itemOpOne.Nama)
			initLoad.ItemOptions = append(initLoad.ItemOptions, itemOpOne)
		}
		err = tx.Commit()
		if err != nil {
			tx.Rollback()
			utils.ResponseError(res, http.StatusInternalServerError, "something was wrong with comitting database transaction "+err.Error())
			return
		}
		jsonData, err := json.Marshal(initLoad)
		if err != nil {
			utils.ResponseError(res, http.StatusInternalServerError, "cannot marshal json "+err.Error())
			return
		}
		res.Write([]byte(jsonData))
	}
}

//AddItem is to add item to itemlist
func (c *TomasHandler) AddItem(db *sql.DB) http.HandlerFunc {
	return func(res http.ResponseWriter, req *http.Request) {

		claims, err := Authenticate(res, req)
		if err != nil {
			utils.ResponseError(res, http.StatusUnauthorized, "unauthorized access "+err.Error())
			return
		}
		if claims["Role"] != "PBU" {
			utils.ResponseError(res, http.StatusUnauthorized, "unauthorized bukan PBU")
			return
		}

		var itemPayload models.Item
		err = json.NewDecoder(req.Body).Decode(&itemPayload)
		if err != nil {
			utils.ResponseError(res, http.StatusInternalServerError, "cannot decode json "+err.Error())
			return
		}
		insert, err := db.Prepare("INSERT INTO itemlist (namaprod,harga,image) VALUES ($1,$2,$3)")
		if err != nil {
			utils.ResponseError(res, http.StatusInternalServerError, "cannot prepare db")
			return
		}
		_, err = insert.Exec(itemPayload.Nama, itemPayload.Harga, itemPayload.Image)
		if err != nil {
			utils.ResponseError(res, http.StatusInternalServerError, "cannot execute db "+err.Error())
			return
		}
		utils.ResponseSuccessJSON(res, http.StatusOK, `berhasil nama : `+itemPayload.Nama+"harga: "+itemPayload.Harga)
	}
}

//AdmInputTomas is for
func (c *TomasHandler) AdmInputTomas(db *sql.DB) http.HandlerFunc {
	return func(res http.ResponseWriter, req *http.Request) {

		claims, err := Authenticate(res, req)
		if err != nil {
			utils.ResponseError(res, http.StatusUnauthorized, "unauthorized access "+err.Error())
			return
		}
		if claims["Role"] != "PBU" {
			utils.ResponseError(res, http.StatusUnauthorized, "unauthorized bukan PBU ")
			return
		}

		type Item struct {
			ItemID string
			Qty    string
		}
		payload := struct {
			Home  string
			Batch string
			Items []Item
		}{}

		err = json.NewDecoder(req.Body).Decode(&payload)
		if err != nil {
			utils.ResponseError(res, http.StatusInternalServerError, "cannot unmashal json "+err.Error())
			return
		}
		date := time.Now()
		tx, err := db.Begin()
		if err != nil {
			utils.ResponseError(res, http.StatusInternalServerError, "something was wrong with starting database transaction "+err.Error())
			return
		}
		stm1, err := tx.Prepare("INSERT INTO stocklist (house,itemid,date,batch,qty) VALUES ($1,$2,$3,$4,$5)")
		if err != nil {
			tx.Rollback()
			utils.ResponseError(res, http.StatusInternalServerError, "something was wrong with preparing database transaction 1 "+err.Error())
			return
		}
		stm2, err := tx.Prepare("INSERT INTO curstocklist (house,itemid,qty,batch) VALUES ($1,$2,$3,$4)")
		if err != nil {
			tx.Rollback()
			utils.ResponseError(res, http.StatusInternalServerError, "something was wrong with preparing database transaction 2 "+err.Error())
			return
		}
		for _, s := range payload.Items {
			_, err = stm1.Exec(payload.Home, s.ItemID, date, payload.Batch, s.Qty)
			if err != nil {
				tx.Rollback()
				utils.ResponseError(res, http.StatusInternalServerError, "cannot insert user into database 1 "+err.Error())
				return
			}
			_, err = stm2.Exec(payload.Home, s.ItemID, s.Qty, payload.Batch)
			if err != nil {
				tx.Rollback()
				utils.ResponseError(res, http.StatusInternalServerError, "cannot insert user into database 2 "+err.Error())
				return
			}
		}
		err = tx.Commit()
		if err != nil {
			tx.Rollback()
			utils.ResponseError(res, http.StatusInternalServerError, "something was wrong with comitting database transaction "+err.Error())
			return
		}
		utils.ResponseSuccessJSON(res, http.StatusOK, "berhasil tambah items")
	}
}

//MemInputTomas is for
func (c *TomasHandler) MemInputTomas(db *sql.DB) http.HandlerFunc {
	return func(res http.ResponseWriter, req *http.Request) {

		claims, err := Authenticate(res, req)
		if err != nil {
			utils.ResponseError(res, http.StatusUnauthorized, "unauthorized access "+err.Error())
			return
		}
		var userID = claims["Id"]
		var journal struct {
			House string
			Items []struct {
				ItemID int
				Qty    int
			}
		}
		date := time.Now()
		err = json.NewDecoder(req.Body).Decode(&journal)
		if err != nil {
			utils.ResponseError(res, http.StatusInternalServerError, "cannot unmarshall json "+err.Error())
			return
		}
		tx, err := db.Begin()
		if err != nil {
			utils.ResponseError(res, http.StatusInternalServerError, "something was wrong with starting database transaction "+err.Error())
			return
		}
		stm1, err := tx.Prepare("INSERT INTO journal (date,userid,itemid,qty,house) VALUES ($1,$2,$3,$4,$5)")
		if err != nil {
			tx.Rollback()
			utils.ResponseError(res, http.StatusInternalServerError, "something was wrong with preparing database transaction 1 "+err.Error())
			return
		}
		stm2, err := tx.Prepare("UPDATE curstocklist SET qty= qty - $1 WHERE itemid=$2 AND house=$3")
		if err != nil {
			tx.Rollback()
			utils.ResponseError(res, http.StatusInternalServerError, "something was wrong with preparing database transaction 2 "+err.Error())
			return
		}
		for _, s := range journal.Items {
			_, err = stm1.Exec(date, userID, s.ItemID, s.Qty, journal.House)
			if err != nil {
				tx.Rollback()
				utils.ResponseError(res, http.StatusInternalServerError, "cannot insert user into database 1 "+err.Error())
				return
			}
			_, err = stm2.Exec(s.Qty, s.ItemID, journal.House)
			if err != nil {
				tx.Rollback()
				utils.ResponseError(res, http.StatusInternalServerError, "cannot insert user into database 2 "+err.Error())
				return
			}
		}
		err = tx.Commit()
		if err != nil {
			tx.Rollback()
			utils.ResponseError(res, http.StatusInternalServerError, "something was wrong with comitting database transaction "+err.Error())
			return
		}
		jsonItems, _ := json.Marshal(journal.Items)
		utils.ResponseSuccessJSON(res, http.StatusOK, "transaction "+string(jsonItems)+" succeed")
	}
}

//Authenticate is a middleware to authenticate http options
func Authenticate(res http.ResponseWriter, req *http.Request) (jwt.MapClaims, error) {
	authHeader := req.Header.Get("Auth")
	bearerToken := strings.Split(authHeader, " ")
	var errs = errors.New("Verification failed")
	var claimsModel = jwt.MapClaims{
		"Id":        "",
		"Subject":   "",
		"ExpiresAt": 0,
		"Issuer":    "",
		"Role":      "",
	}
	if len(bearerToken) == 2 {
		authToken := bearerToken[1]
		token, err := jwt.Parse(authToken, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("there was an error")
			}
			return []byte(os.Getenv("SECRET")), nil
		})
		if err != nil {
			return claimsModel, errs
		}
		claims, ok := token.Claims.(jwt.MapClaims)
		if ok && token.Valid {
			claimsModel = claims
			return claimsModel, nil
		}
	}
	return claimsModel, errs
}

//MemInitCurstock is to handle curstock
func (c *TomasHandler) MemInitCurstock(db *sql.DB) http.HandlerFunc {
	return func(res http.ResponseWriter, req *http.Request) {
		claims, err := Authenticate(res, req)
		if err != nil {
			utils.ResponseError(res, http.StatusUnauthorized, "Unauthorized Access")
			return
		}
		house := claims["Rumah"]
		type CurStock struct {
			ItemID int
			Nama   string
			Qty    int
			Image  string
			Harga  int
		}
		var curStockSlice []CurStock
		rows, err := db.Query("SELECT itemlist.namaprod,curstocklist.qty, itemlist.image, itemlist.harga, itemlist.id FROM curstocklist INNER JOIN itemlist ON curstocklist.itemid = itemlist.id AND curstocklist.house = $1", house)
		if err != nil {
			utils.ResponseError(res, http.StatusInternalServerError, "cannot select")
			return
		}
		for rows.Next() {
			var oneInventory CurStock
			err = rows.Scan(&oneInventory.Nama, &oneInventory.Qty, &oneInventory.Image, &oneInventory.Harga, &oneInventory.ItemID)
			if err != nil {
				utils.ResponseError(res, http.StatusInternalServerError, "not found")
				return
			}
			curStockSlice = append(curStockSlice, oneInventory)
		}
		jsonData, err := json.Marshal(curStockSlice)
		if err != nil {
			utils.ResponseError(res, http.StatusInternalServerError, "cannot marshal json "+err.Error())
			return
		}
		res.Write([]byte(jsonData))
	}
}

//MemInitJournal is for initializing mem
func (c *TomasHandler) MemInitJournal(db *sql.DB) http.HandlerFunc {
	return func(res http.ResponseWriter, req *http.Request) {
		claims, err := Authenticate(res, req)
		if err != nil {
			utils.ResponseError(res, http.StatusUnauthorized, "Unauthorized Access")
			return
		}
		userID := claims["Id"]
		type Journal struct {
			Date  time.Time
			Nama  string
			Qty   int
			Total int
		}
		var journalSlice []Journal
		rows, err := db.Query("SELECT journal.date, journal.qty, itemlist.namaprod, journal.qty * itemlist.harga FROM journal INNER JOIN itemlist ON journal.itemid = itemlist.id AND journal.userid = $1", userID)
		if err != nil {
			utils.ResponseError(res, http.StatusInternalServerError, "cannot query to db")
			return
		}
		for rows.Next() {
			var journalOne Journal
			err = rows.Scan(&journalOne.Date, &journalOne.Qty, &journalOne.Nama, &journalOne.Total)
			if err != nil {
				utils.ResponseError(res, http.StatusInternalServerError, "cannot assign jurnal to value / not found "+err.Error())
				return
			}
			journalSlice = append(journalSlice, journalOne)
		}
		jsonData, err := json.Marshal(journalSlice)
		if err != nil {
			utils.ResponseError(res, http.StatusInternalServerError, "cannot marshal json "+err.Error())
			return
		}
		res.Write([]byte(jsonData))
	}
}

//AdmMonitor is to monitor
func (c *TomasHandler) AdmMonitor(db *sql.DB) http.HandlerFunc {
	return func(res http.ResponseWriter, req *http.Request) {

		claims, err := Authenticate(res, req)
		if err != nil {
			utils.ResponseError(res, http.StatusUnauthorized, "unauthorized access "+err.Error())
			return
		}
		if claims["Role"] != "PBU" {
			utils.ResponseError(res, http.StatusUnauthorized, "unauthorized bukan PBU ")
			return
		}

		var load struct {
			Rumah string
		}
		type Stock struct {
			Nama  string
			Qty   int
			Harga int
		}
		type CurStock struct {
			Nama string
			Qty  int
		}
		type Journal struct {
			Date  time.Time
			Nama  string
			Qty   int
			Total int
		}
		var monitor struct {
			User     []string
			Journal  []Journal
			Curstock []CurStock
			Stock    []Stock
			Sum      int
		}
		err = json.NewDecoder(req.Body).Decode(&load)
		if err != nil {
			utils.ResponseError(res, http.StatusInternalServerError, "cannot unmarshal json "+err.Error())
			return
		}
		tx, err := db.Begin()
		if err != nil {
			utils.ResponseError(res, http.StatusInternalServerError, "something was wrong with starting database transaction "+err.Error())
			return
		}
		rows, err := tx.Query("SELECT nama FROM usertable WHERE rumah=$1", load.Rumah)
		if err != nil {
			tx.Rollback()
			utils.ResponseError(res, http.StatusInternalServerError, "cannot db query "+err.Error())
			return
		}
		for rows.Next() {
			var user string
			err = rows.Scan(&user)
			if err != nil {
				tx.Rollback()
				utils.ResponseError(res, http.StatusInternalServerError, "not found user "+err.Error())
				return
			}
			monitor.User = append(monitor.User, user)
		}
		rows, err = tx.Query("SELECT journal.date, journal.qty, itemlist.namaprod, journal.qty * itemlist.harga FROM journal INNER JOIN itemlist ON journal.itemid = itemlist.id AND journal.house = $1", load.Rumah)
		if err != nil {
			tx.Rollback()
			utils.ResponseError(res, http.StatusInternalServerError, "cannot db query "+err.Error())
			return
		}
		for rows.Next() {
			var journal Journal
			err = rows.Scan(&journal.Date, &journal.Qty, &journal.Nama, &journal.Total)
			if err != nil {
				tx.Rollback()
				utils.ResponseError(res, http.StatusInternalServerError, "not found journal "+err.Error())
				return
			}
			monitor.Journal = append(monitor.Journal, journal)
		}
		rows, err = tx.Query("SELECT itemlist.namaprod,curstocklist.qty FROM curstocklist INNER JOIN itemlist ON curstocklist.itemid = itemlist.id AND curstocklist.house = $1", load.Rumah)
		if err != nil {
			tx.Rollback()
			utils.ResponseError(res, http.StatusInternalServerError, "cannot db query "+err.Error())
			return
		}
		for rows.Next() {
			var curstock CurStock
			err = rows.Scan(&curstock.Nama, &curstock.Qty)
			if err != nil {
				tx.Rollback()
				utils.ResponseError(res, http.StatusInternalServerError, "not found curstock "+err.Error())
				return
			}
			monitor.Curstock = append(monitor.Curstock, curstock)
		}
		rows, err = tx.Query("SELECT itemlist.namaprod,stocklist.qty,itemlist.harga FROM stocklist INNER JOIN itemlist ON stocklist.itemid = itemlist.id AND stocklist.house = $1", load.Rumah)
		if err != nil {
			tx.Rollback()
			utils.ResponseError(res, http.StatusInternalServerError, "cannot db query "+err.Error())
			return
		}
		for rows.Next() {
			var stock Stock
			err = rows.Scan(&stock.Nama, &stock.Qty, &stock.Harga)
			if err != nil {
				tx.Rollback()
				utils.ResponseError(res, http.StatusInternalServerError, "not found curstock "+err.Error())
				return
			}
			monitor.Stock = append(monitor.Stock, stock)
		}
		err = tx.Commit()
		if err != nil {
			tx.Rollback()
			utils.ResponseError(res, http.StatusInternalServerError, "something was wrong with comitting database transaction "+err.Error())
			return
		}
		var sum int
		for _, j := range monitor.Journal {
			sum = sum + j.Total
		}
		monitor.Sum = sum
		jsonData, err := json.Marshal(monitor)
		if err != nil {
			utils.ResponseError(res, http.StatusInternalServerError, "cannot marshall json "+err.Error())
			return
		}
		res.Write([]byte(jsonData))
	}
}

//BackupReset is for
func (c *TomasHandler) BackupReset(db *sql.DB) http.HandlerFunc {
	return func(res http.ResponseWriter, req *http.Request) {
		claims, err := Authenticate(res, req)
		if err != nil {
			utils.ResponseError(res, http.StatusUnauthorized, "unauthorized access "+err.Error())
			return
		}
		if claims["Role"] != "PBU" {
			utils.ResponseError(res, http.StatusUnauthorized, "unauthorized bukan PBU ")
			return
		}
		tx, err := db.Begin()
		if err != nil {
			utils.ResponseError(res, http.StatusInternalServerError, "something was wrong with starting database transaction "+err.Error())
			return
		}
		_, err = tx.Exec("INSERT INTO journal_b SELECT * FROM journal")
		if err != nil {
			tx.Rollback()
			utils.ResponseError(res, http.StatusInternalServerError, "cannot backup journal "+err.Error())
			return
		}
		_, err = tx.Exec("INSERT INTO stocklist_b SELECT * FROM stocklist")
		if err != nil {
			tx.Rollback()
			utils.ResponseError(res, http.StatusInternalServerError, "cannot backup stocklist "+err.Error())
			return
		}
		_, err = tx.Exec("INSERT INTO curstocklist_b SELECT * FROM curstocklist")
		if err != nil {
			tx.Rollback()
			utils.ResponseError(res, http.StatusInternalServerError, "cannot backup curstocklist "+err.Error())
			return
		}
		_, err = tx.Exec("DELETE FROM journal")
		if err != nil {
			tx.Rollback()
			utils.ResponseError(res, http.StatusInternalServerError, "cannot delete journal "+err.Error())
			return
		}
		_, err = tx.Exec("DELETE FROM stocklist")
		if err != nil {
			tx.Rollback()
			utils.ResponseError(res, http.StatusInternalServerError, "cannot delete stocklist "+err.Error())
			return
		}
		_, err = tx.Exec("DELETE FROM curstocklist")
		if err != nil {
			tx.Rollback()
			utils.ResponseError(res, http.StatusInternalServerError, "cannot delete curstocklist "+err.Error())
			return
		}
		err = tx.Commit()
		if err != nil {
			tx.Rollback()
			utils.ResponseError(res, http.StatusInternalServerError, "something was wrong with comitting database transaction "+err.Error())
			return
		}
		utils.ResponseSuccessJSON(res, http.StatusOK, "Success backup and reset")
	}
}
