package app

import (
	"github.com/SebaVCH/DeliveryStore/config"
	"github.com/SebaVCH/DeliveryStore/database"
	"github.com/SebaVCH/DeliveryStore/routes"
)

func StartBackend() error {

	if err := config.LoadENV(); err != nil {
		return err
	}

	if err := database.StartDB(); err != nil {
		return err
	}

	if err := routes.SetupRouter().Run(":8080"); err != nil {
		return err
	}

	return nil
}
