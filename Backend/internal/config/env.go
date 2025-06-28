package config

import (
	"os"
)

var JwtSecret []byte

func LoadENV() error {

	JwtSecret = []byte(os.Getenv("JWT_SECRET"))
	return nil
}
