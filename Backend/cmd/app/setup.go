package app

import (
	"github.com/SebaVCH/DeliveryStore/internal/config"
	"github.com/SebaVCH/DeliveryStore/internal/interfaces/routes"
)

func StartBackend() error {

	if err := config.LoadENV(); err != nil {
		return err
	}

	if err := routes.SetupRouter().Run(":8080"); err != nil {
		return err
	}

	return nil
}
