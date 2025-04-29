package database

import (
	"github.com/SebaVCH/DeliveryStore/internal/domain"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var DB *gorm.DB

func StartDB() error {
	var err error
	DB, err = gorm.Open(sqlite.Open("delivery.db"), &gorm.Config{})
	if err != nil {
		return err
	}
	if err := DB.AutoMigrate(&domain.Usuario{}); err != nil {
		return err
	}
	return nil
}
