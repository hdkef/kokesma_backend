package models

import "time"

//Journal is
type Journal struct {
	Date     time.Time
	ItemID   string
	NamaItem string
	Qty      string
	House    string
}
