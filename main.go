package main

import (
	"database/sql"
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"pure/controller"
	"pure/driver"

	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
)

var db *sql.DB
var err error

func init() {
	_ = godotenv.Load()
}

type spaHandler struct {
	staticPath string
	indexPath  string
}

func (h spaHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {

	path, err := filepath.Abs(r.URL.Path)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	path = filepath.Join(h.staticPath, r.URL.Path)

	_, err = os.Stat(path)
	if os.IsNotExist(err) {
		http.ServeFile(w, r, filepath.Join(h.staticPath, h.indexPath))
		return
	} else if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	http.FileServer(http.Dir(h.staticPath)).ServeHTTP(w, r)
}

func main() {

	db, err = driver.ConnectDB()
	if err != nil {
		panic(err)
	}

	auth := controller.AuthHandler{}
	tomas := controller.TomasHandler{}

	router := mux.NewRouter()

	router.HandleFunc("/login", auth.Login(db))
	router.HandleFunc("/register", auth.Register(db))
	router.HandleFunc("/tomas/init", tomas.Init(db))
	router.HandleFunc("/tomas/additem", tomas.AddItem(db))
	router.HandleFunc("/tomas/adminputtomas", tomas.AdmInputTomas(db))
	router.HandleFunc("/tomas/meminputtomas", tomas.MemInputTomas(db))
	// router.HandleFunc("/tomas/memgetjournal", utils.Cors(tomas.MemGetJournal(db)))
	// router.HandleFunc("/tomas/admgetcurstocklist", utils.Cors(tomas.GetCurStockList(db)))
	router.HandleFunc("/tomas/meminit", tomas.MemInit(db))
	router.HandleFunc("/tomas/admmonitor", tomas.AdmMonitor(db))
	router.HandleFunc("/tomas/backupreset", tomas.BackupReset(db))

	spa := spaHandler{staticPath: "dist/pure", indexPath: "index.html"}
	router.PathPrefix("/").Handler(spa)

	var PORT = os.Getenv("PORT")

	address := fmt.Sprintf(":%v", PORT)

	err = http.ListenAndServe(address, router)
	if err != nil {
		panic(err)
	}
}
