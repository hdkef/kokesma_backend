package driver

import (
	"database/sql"
	"fmt"
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
	fmt.Println(os.Getenv("DB_URL"))

	if err != nil {
		fmt.Println("cannot parse db url")
		return
	}

	db, _ := sql.Open("postgres", pgURL)
	fmt.Println("testing connection to db")
	for {
		err := db.Ping()
		if err == nil {
			fmt.Println("db connected")
			return db, err
		}
		fmt.Println("error connecting to db, retrying")
		time.Sleep(5000 * time.Millisecond)
	}
}
