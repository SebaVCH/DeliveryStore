package config

import (
	"github.com/joho/godotenv"
	"os"
)

var JwtSecret []byte

func LoadENV() error {
	if err := godotenv.Load(); err != nil {
		return err
	}

	JwtSecret = []byte(os.Getenv("JWT_SECRET"))
	return nil
}
