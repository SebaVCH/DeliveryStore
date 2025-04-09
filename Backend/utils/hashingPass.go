package utils

import "golang.org/x/crypto/bcrypt"

func HashPassword(pass string) string {
	hash, err := bcrypt.GenerateFromPassword([]byte(pass), bcrypt.MinCost)
	if err != nil {
		panic(err)
	}
	return string(hash)
}
