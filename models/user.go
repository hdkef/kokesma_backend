package models

//User model for authentication
type User struct {
	ID       int
	Rumah    string
	NIM      string
	Nama     string
	Role     string
	Password string
}
