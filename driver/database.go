package driver

import (
	"database/sql"
	"os"
	"time"

	//DRIVER FOR MYSQL
	_ "github.com/go-sql-driver/mysql"
	"github.com/lib/pq"
)

var db *sql.DB

//ConnectDB allows to open connection to database
func ConnectDB() (database *sql.DB, errs error) {

	pgURL, err := pq.ParseURL(os.Getenv("DB_URL"))

	if err != nil {
		return
	}

	db, _ := sql.Open("postgres", pgURL)
	for {
		err := db.Ping()
		if err == nil {
			return db, err
		}
		time.Sleep(5000 * time.Millisecond)
	}
}
