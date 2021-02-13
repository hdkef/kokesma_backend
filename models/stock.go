package models

import "time"

//Stock is stock
type Stock struct {
	House  string
	ItemID string
	Date   time.Time
	Batch  string
	Qty    string
}
