package main

import (
	"database/sql"
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"pure/controller"
	"pure/driver"
	"pure/utils"

	"github.com/NYTimes/gziphandler"
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
	defer db.Close()

	auth := controller.AuthHandler{}
	tomas := controller.TomasHandler{}
	akun := controller.AkunHandler{}

	router := mux.NewRouter()

	router.HandleFunc("/login", utils.Cors(auth.Login(db)))
	router.HandleFunc("/register", utils.Cors(auth.Register(db)))
	router.HandleFunc("/tomas/init", utils.Cors(tomas.Init(db)))
	router.HandleFunc("/tomas/additem", utils.Cors(tomas.AddItem(db)))
	router.HandleFunc("/tomas/adminputtomas", utils.Cors(tomas.AdmInputTomas(db)))
	router.HandleFunc("/tomas/meminputtomas", utils.Cors(tomas.MemInputTomas(db)))
	router.HandleFunc("/tomas/meminitcurstock", utils.Cors(tomas.MemInitCurstock(db)))
	router.HandleFunc("/tomas/meminitjournal", utils.Cors(tomas.MemInitJournal(db)))
	router.HandleFunc("/tomas/admmonitor", utils.Cors(tomas.AdmMonitor(db)))
	router.HandleFunc("/tomas/backupreset", utils.Cors(tomas.BackupReset(db)))
	router.HandleFunc("/acc/insert", utils.Cors(akun.Insert(db)))
	router.HandleFunc("/acc/journal", utils.Cors(akun.AccJurnal(db)))

	// spa := spaHandler{staticPath: "dist/pure", indexPath: "index.html"}
	// router.PathPrefix("/").Handler(spa)

	var PORT = os.Getenv("PORT")

	address := fmt.Sprintf(":%v", PORT)

	fmt.Println("about to begin listening...")

	err = http.ListenAndServe(address, gziphandler.GzipHandler(router))

	if err != nil {
		panic(err)
	}
}
