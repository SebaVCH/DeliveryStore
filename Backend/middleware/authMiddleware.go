package middleware

import (
	"github.com/SebaVCH/DeliveryStore/config"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"net/http"
	"strings"
)

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {

		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.IndentedJSON(http.StatusUnauthorized, gin.H{"error": "Token Requerido"})
			c.Abort()
			return
		}

		tokenString := strings.TrimPrefix(authHeader, "Bearer ")
		if tokenString == authHeader {
			c.IndentedJSON(http.StatusUnauthorized, gin.H{"error": "Formato de token invalido"})
			c.Abort()
			return
		}

		claims := jwt.MapClaims{}
		token, err := jwt.ParseWithClaims(tokenString, &claims, func(token *jwt.Token) (interface{}, error) {
			return config.JwtSecret, nil
		})

		if err != nil || !token.Valid {
			c.IndentedJSON(http.StatusUnauthorized, gin.H{"error": "Token invalido"})
			c.Abort()
			return
		}

		c.Set("email", claims["email"].(string))
		c.Next()

	}
}
