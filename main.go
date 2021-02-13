package main

import (
	"database/sql"
	"fmt"
	"net/http"
	"os"
	"pure/controller"
	"pure/driver"
	"pure/utils"

	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
)

var db *sql.DB
var err error

func init() {
	_ = godotenv.Load()
}

func main() {
	db, err = driver.ConnectDB()
	if err != nil {
		panic(err)
	}

	auth := controller.AuthHandler{}
	tomas := controller.TomasHandler{}

	router := mux.NewRouter()

	router.HandleFunc("/login", utils.Cors(auth.Login(db)))
	router.HandleFunc("/register", utils.Cors(auth.Register(db)))
	router.HandleFunc("/tomas/init", utils.Cors(tomas.Init(db)))
	router.HandleFunc("/tomas/additem", utils.Cors(tomas.AddItem(db)))
	router.HandleFunc("/tomas/adminputtomas", utils.Cors(tomas.AdmInputTomas(db)))
	router.HandleFunc("/tomas/meminputtomas", utils.Cors(tomas.MemInputTomas(db)))
	// router.HandleFunc("/tomas/memgetjournal", utils.Cors(tomas.MemGetJournal(db)))
	// router.HandleFunc("/tomas/admgetcurstocklist", utils.Cors(tomas.GetCurStockList(db)))
	router.HandleFunc("/tomas/meminit", utils.Cors(tomas.MemInit(db)))
	router.HandleFunc("/tomas/admmonitor", utils.Cors(tomas.AdmMonitor(db)))
	router.HandleFunc("/tomas/backupreset", utils.Cors(tomas.BackupReset(db)))
	var PORT = os.Getenv("PORT")

	address := fmt.Sprintf(":%v", PORT)

	err = http.ListenAndServe(address, router)
	if err != nil {
		panic(err)
	}
}
