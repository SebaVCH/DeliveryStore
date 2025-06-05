package utils

import (
	"database/sql"
	"github.com/SebaVCH/DeliveryStore/internal/domain"
	"gorm.io/gorm"
)

func SyncQuantitySold(db *gorm.DB) error {
	var products []domain.Product
	if err := db.Find(&products).Error; err != nil {
		return err
	}

	for _, product := range products {
		var total sql.NullInt64
		err := db.Table("carts").
			Where("id_product = ? AND payed = ?", product.ID, true).
			Select("SUM(quantity)").Scan(&total).Error
		if err != nil {
			return err
		}

		if err := db.Model(&domain.Product{}).
			Where("id = ?", product.ID).
			Update("quantity_sold", total).Error; err != nil {
			return err
		}
	}
	return nil
}
