package config

import (
	"github.com/joho/godotenv"
	"os"
	"path/filepath"
)

var JwtSecret []byte

func LoadENV() error {
	if err := godotenv.Load(filepath.Join("..", ".env")); err != nil {
		return err
	}

	JwtSecret = []byte(os.Getenv("JWT_SECRET"))
	return nil
}
