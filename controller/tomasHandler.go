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

//Init is for get some of tomas info for admin dashboard
func (c *TomasHandler) Init(db *sql.DB) http.HandlerFunc {

	return func(res http.ResponseWriter, req *http.Request) {

		claims, err := Authenticate(res, req)
		if err != nil {
			utils.ResponseError(res, http.StatusUnauthorized, "unauthorized access")
			return
		}
		if claims["Role"] != "PBU" {
			utils.ResponseError(res, http.StatusUnauthorized, "unauthorized bukan PBU")
			return
		}

		initLoad := struct {
			Home      []string
			Items     []string
			ItemsName []string
		}{}

		var homeLoad []string
		var itemLoad []string
		var itemNameLoad []string

		rows, err := db.Query("SELECT DISTINCT rumah FROM usertable")
		if err != nil {
			utils.ResponseError(res, http.StatusNoContent, "Tidak ada data rumah")
			return
		}
		for rows.Next() {
			var home string
			err = rows.Scan(&home)
			if err != nil {
				utils.ResponseError(res, http.StatusInternalServerError, "cannot assign article to value / not found")
				return
			}
			homeLoad = append(homeLoad, home)
		}
		initLoad.Home = homeLoad

		rows, err = db.Query("SELECT id, namaprod FROM itemlist")
		if err != nil {
			utils.ResponseError(res, http.StatusNoContent, "Tidak ada data rumah")
			return
		}
		for rows.Next() {
			var itemid string
			var itemname string
			err = rows.Scan(&itemid, &itemname)
			if err != nil {
				utils.ResponseError(res, http.StatusInternalServerError, "cannot assign article to value / not found")
				return
			}
			itemLoad = append(itemLoad, itemid)
			itemNameLoad = append(itemNameLoad, itemname)
		}
		initLoad.Items = itemLoad
		initLoad.ItemsName = itemNameLoad
		jsonData, err := json.Marshal(initLoad)
		if err != nil {
			utils.ResponseError(res, http.StatusInternalServerError, "cannot marshal json")
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
			utils.ResponseError(res, http.StatusUnauthorized, "unauthorized access")
			return
		}
		if claims["Role"] != "PBU" {
			utils.ResponseError(res, http.StatusUnauthorized, "unauthorized bukan PBU")
			return
		}

		var itemPayload models.Item
		err = json.NewDecoder(req.Body).Decode(&itemPayload)
		if err != nil {
			utils.ResponseError(res, http.StatusInternalServerError, "cannot decode json")
			return
		}
		insert, err := db.Prepare("INSERT INTO itemlist (namaprod,harga,image) VALUES ($1,$2,$3)")
		if err != nil {
			utils.ResponseError(res, http.StatusInternalServerError, "cannot prepare db")
			return
		}
		_, err = insert.Exec(itemPayload.Nama, itemPayload.Harga, itemPayload.Image)
		if err != nil {
			utils.ResponseError(res, http.StatusInternalServerError, "cannot execute db")
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
			utils.ResponseError(res, http.StatusUnauthorized, "unauthorized access")
			return
		}
		if claims["Role"] != "PBU" {
			utils.ResponseError(res, http.StatusUnauthorized, "unauthorized bukan PBU")
			return
		}

		var stockList models.Stock
		date := time.Now()
		err = json.NewDecoder(req.Body).Decode(&stockList)
		if err != nil {
			utils.ResponseError(res, http.StatusInternalServerError, "cannot unmarshal json")
			return
		}
		tx, err := db.Begin()
		if err != nil {
			utils.ResponseError(res, http.StatusInternalServerError, "something was wrong with starting database transaction")
			return
		}
		_, err = tx.Exec("INSERT INTO stocklist (house,itemid,date,batch,qty) VALUES ($1,$2,$3,$4,$5)", stockList.House, stockList.ItemID, date, stockList.Batch, stockList.Qty)
		if err != nil {
			tx.Rollback()
			utils.ResponseError(res, http.StatusInternalServerError, "cannot insert user into database 1")
			return
		}
		_, err = tx.Exec("INSERT INTO curstocklist (house,itemid,qty,batch) VALUES ($1,$2,$3,$4)", stockList.House, stockList.ItemID, stockList.Qty, stockList.Batch)
		if err != nil {
			tx.Rollback()
			utils.ResponseError(res, http.StatusInternalServerError, "cannot insert user into database 2")
			return
		}
		err = tx.Commit()
		if err != nil {
			utils.ResponseError(res, http.StatusInternalServerError, "something was wrong with comitting database transaction")
			return
		}
		utils.ResponseSuccessJSON(res, http.StatusOK, "berhasil item id: "+stockList.ItemID+"date: "+stockList.Batch+"qty: "+stockList.Qty)
	}
}

//MemInputTomas is for
func (c *TomasHandler) MemInputTomas(db *sql.DB) http.HandlerFunc {
	return func(res http.ResponseWriter, req *http.Request) {

		claims, err := Authenticate(res, req)
		if err != nil {
			utils.ResponseError(res, http.StatusUnauthorized, "unauthorized access")
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
			utils.ResponseError(res, http.StatusInternalServerError, "cannot unmarshall json")
			return
		}
		for _, s := range journal.Items {
			tx, err := db.Begin()
			if err != nil {
				utils.ResponseError(res, http.StatusInternalServerError, "something was wrong with starting database transaction")
				return
			}
			_, err = tx.Exec("INSERT INTO journal (date,userid,itemid,qty,house) VALUES ($1,$2,$3,$4,$5)", date, userID, s.ItemID, s.Qty, journal.House)
			if err != nil {
				tx.Rollback()
				utils.ResponseError(res, http.StatusInternalServerError, "cannot insert user into database 1")
				return
			}
			_, err = tx.Exec("UPDATE curstocklist SET qty= qty - $1 WHERE itemid=$2 AND house=$3", s.Qty, s.ItemID, journal.House)
			if err != nil {
				tx.Rollback()
				utils.ResponseError(res, http.StatusInternalServerError, "cannot insert user into database 2")
				return
			}
			err = tx.Commit()
			if err != nil {
				utils.ResponseError(res, http.StatusInternalServerError, "something was wrong with comitting database transaction")
				return
			}
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

//MemInit is for initializing mem
func (c *TomasHandler) MemInit(db *sql.DB) http.HandlerFunc {
	return func(res http.ResponseWriter, req *http.Request) {
		claims, err := Authenticate(res, req)
		if err != nil {
			utils.ResponseError(res, http.StatusUnauthorized, "Unauthorized Access")
			return
		}
		userID := claims["Id"]
		type CurStock struct {
			ItemID int
			Nama   string
			Qty    int
			Image  string
			Harga  int
		}
		type Journal struct {
			Date  time.Time
			Nama  string
			Qty   int
			Total int
		}
		initLoad := struct {
			Nama     string
			Rumah    string
			NIM      string
			Curstock []CurStock
			Journal  []Journal
		}{}
		rows, err := db.Query("SELECT nama, rumah, nim FROM usertable WHERE id=$1", userID)
		if err != nil {
			utils.ResponseError(res, http.StatusInternalServerError, "cannot select")
			return
		}
		for rows.Next() {
			rows.Scan(&initLoad.Nama, &initLoad.Rumah, &initLoad.NIM)
		}
		rows, err = db.Query("SELECT itemlist.namaprod,curstocklist.qty, itemlist.image, itemlist.harga, itemlist.id FROM curstocklist INNER JOIN itemlist ON curstocklist.itemid = itemlist.id AND curstocklist.house = $1", initLoad.Rumah)
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
			initLoad.Curstock = append(initLoad.Curstock, oneInventory)
		}
		rows, err = db.Query("SELECT journal.date, journal.qty, itemlist.namaprod, journal.qty * itemlist.harga FROM journal INNER JOIN itemlist ON journal.itemid = itemlist.id AND journal.userid = $1", userID)
		if err != nil {
			utils.ResponseError(res, http.StatusInternalServerError, "cannot query to db")
			return
		}
		for rows.Next() {
			var journalOne Journal
			err = rows.Scan(&journalOne.Date, &journalOne.Qty, &journalOne.Nama, &journalOne.Total)
			if err != nil {
				utils.ResponseError(res, http.StatusInternalServerError, "cannot assign article to value / not found")
				return
			}
			initLoad.Journal = append(initLoad.Journal, journalOne)
		}
		jsonData, err := json.Marshal(initLoad)
		if err != nil {
			utils.ResponseError(res, http.StatusInternalServerError, "Unauthorized Access")
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
			utils.ResponseError(res, http.StatusUnauthorized, "unauthorized access")
			return
		}
		if claims["Role"] != "PBU" {
			utils.ResponseError(res, http.StatusUnauthorized, "unauthorized bukan PBU")
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
			utils.ResponseError(res, http.StatusInternalServerError, "cannot unmarshal json")
			return
		}
		rows, err := db.Query("SELECT nama FROM usertable WHERE rumah=$1", load.Rumah)
		if err != nil {
			utils.ResponseError(res, http.StatusInternalServerError, "cannot db query")
			return
		}
		for rows.Next() {
			var user string
			err = rows.Scan(&user)
			if err != nil {
				utils.ResponseError(res, http.StatusInternalServerError, "not found user")
				return
			}
			monitor.User = append(monitor.User, user)
		}
		rows, err = db.Query("SELECT journal.date, journal.qty, itemlist.namaprod, journal.qty * itemlist.harga FROM journal INNER JOIN itemlist ON journal.itemid = itemlist.id AND journal.house = $1", load.Rumah)
		if err != nil {
			utils.ResponseError(res, http.StatusInternalServerError, "cannot db query")
			return
		}
		for rows.Next() {
			var journal Journal
			err = rows.Scan(&journal.Date, &journal.Qty, &journal.Nama, &journal.Total)
			if err != nil {
				utils.ResponseError(res, http.StatusInternalServerError, "not found journal")
				return
			}
			monitor.Journal = append(monitor.Journal, journal)
		}
		rows, err = db.Query("SELECT itemlist.namaprod,curstocklist.qty FROM curstocklist INNER JOIN itemlist ON curstocklist.itemid = itemlist.id AND curstocklist.house = $1", load.Rumah)
		if err != nil {
			utils.ResponseError(res, http.StatusInternalServerError, "cannot db query")
			return
		}
		for rows.Next() {
			var curstock CurStock
			err = rows.Scan(&curstock.Nama, &curstock.Qty)
			if err != nil {
				utils.ResponseError(res, http.StatusInternalServerError, "not found curstock")
				return
			}
			monitor.Curstock = append(monitor.Curstock, curstock)
		}
		rows, err = db.Query("SELECT itemlist.namaprod,stocklist.qty,itemlist.harga FROM stocklist INNER JOIN itemlist ON stocklist.itemid = itemlist.id AND stocklist.house = $1", load.Rumah)
		if err != nil {
			utils.ResponseError(res, http.StatusInternalServerError, "cannot db query")
			return
		}
		for rows.Next() {
			var stock Stock
			err = rows.Scan(&stock.Nama, &stock.Qty, &stock.Harga)
			if err != nil {
				utils.ResponseError(res, http.StatusInternalServerError, "not found curstock")
				return
			}
			monitor.Stock = append(monitor.Stock, stock)
		}
		var sum int
		for _, j := range monitor.Journal {
			sum = sum + j.Total
		}
		monitor.Sum = sum
		jsonData, err := json.Marshal(monitor)
		if err != nil {
			utils.ResponseError(res, http.StatusInternalServerError, "cannot marshall json")
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
			utils.ResponseError(res, http.StatusUnauthorized, "unauthorized access")
			return
		}
		if claims["Role"] != "PBU" {
			utils.ResponseError(res, http.StatusUnauthorized, "unauthorized bukan PBU")
			return
		}
		_, err = db.Exec("INSERT INTO journal_b SELECT * FROM journal")
		if err != nil {
			utils.ResponseError(res, http.StatusInternalServerError, "cannot backup journal")
		}
		_, err = db.Exec("INSERT INTO stocklist_b SELECT * FROM stocklist")
		if err != nil {
			utils.ResponseError(res, http.StatusInternalServerError, "cannot backup stocklist")
		}
		_, err = db.Exec("INSERT INTO curstocklist_b SELECT * FROM curstocklist")
		if err != nil {
			utils.ResponseError(res, http.StatusInternalServerError, "cannot backup curstocklist")
		}
		_, err = db.Exec("DELETE FROM journal")
		if err != nil {
			utils.ResponseError(res, http.StatusInternalServerError, "cannot delete journal")
		}
		_, err = db.Exec("DELETE FROM stocklist")
		if err != nil {
			utils.ResponseError(res, http.StatusInternalServerError, "cannot delete stocklist")
		}
		_, err = db.Exec("DELETE FROM curstocklist")
		if err != nil {
			utils.ResponseError(res, http.StatusInternalServerError, "cannot delete curstocklist")
		}
		utils.ResponseSuccessJSON(res, http.StatusOK, "Success backup and reset")
	}
}
