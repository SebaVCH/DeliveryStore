package utils

import (
	"github.com/SebaVCH/DeliveryStore/internal/config"
	"github.com/SebaVCH/DeliveryStore/internal/domain"
	"github.com/golang-jwt/jwt/v5"
	"time"
)

func GenerateToken(user domain.Usuario) (string, error) {

	claims := jwt.MapClaims{
		"email": user.Email,
		"exp":   time.Now().Add(time.Hour * 24).Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	jwtSecret := config.JwtSecret

	return token.SignedString(jwtSecret)
}
