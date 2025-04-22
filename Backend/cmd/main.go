package main

import (
	"github.com/SebaVCH/DeliveryStore/cmd/app"
	"github.com/SebaVCH/DeliveryStore/internal/infrastructure/database"
	"log"
)

func main() {

	if err := database.StartDB(); err != nil {
		log.Fatalf("Error al iniciar la base de datos: %v", err)
	}

	if err := app.StartBackend(); err != nil {
		log.Fatalf("Error al iniciar el backend: %v", err)
	}

}
