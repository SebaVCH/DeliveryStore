package app

import (
	"github.com/SebaVCH/DeliveryStore/internal/config"
	"github.com/SebaVCH/DeliveryStore/internal/infrastructure/database"
	"github.com/SebaVCH/DeliveryStore/internal/interfaces/routes"
	"github.com/SebaVCH/DeliveryStore/internal/utils"
)

func StartBackend() error {

	if err := config.LoadENV(); err != nil {
		return err
	}

	if err := utils.SyncQuantitySold(database.DB); err != nil {
		return err
	}
	if err := utils.SyncRating(database.DB); err != nil {
		return err
	}

	if err := routes.SetupRouter().Run(":8080"); err != nil {
		return err
	}

	return nil
}
