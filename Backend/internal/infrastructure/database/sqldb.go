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
	if err := DB.AutoMigrate(
		&domain.Cart{}, &domain.Product{}, &domain.Usuario{},
		&domain.Order{}, &domain.PRRelation{}, &domain.Review{},
		&domain.PSRelation{}, &domain.Supplier{}, &domain.Transaction{},
		&domain.Shipping{},
	); err != nil {
		return err
	}
	return nil
}
