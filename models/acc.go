package models

import "time"

//Acc handle accounting
type Acc struct {
	Date    time.Time
	Subject string
	Kredit  string
	Debit   string
	Ket     string
}
