package models

//JWT is structure of which will be sent to client
type JWT struct {
	ID        int
	Token     string
	ExpiresAt int
	Role      string
}
