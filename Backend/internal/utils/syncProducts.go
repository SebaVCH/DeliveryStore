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

func SyncRatingProducts(db *gorm.DB) error {
	var products []domain.Product
	if err := db.Find(&products).Error; err != nil {
		return err
	}

	for _, product := range products {
		var avgRating float64
		err := db.Table("reviews").
			Select("COALESCE(ROUND(AVG(rating), 1), 0)").
			Joins("JOIN pr_relations ON reviews.id = pr_relations.review_id").
			Where("pr_relations.product_id = ?", product.ID).
			Scan(&avgRating).Error
		if err != nil {
			return err
		}

		if err := db.Model(&domain.Product{}).
			Where("id = ?", product.ID).
			Update("review_score", avgRating).Error; err != nil {
			return err
		}
	}
	return nil
}

func SyncRatingSellers(db *gorm.DB) error {
	var sellers []domain.Usuario
	if err := db.Find(&sellers).Error; err != nil {
		return err
	}

	for _, seller := range sellers {
		var avgRating float64
		err := db.Table("products").
			Select("COALESCE(ROUND(AVG(review_score), 1), 0)").
			Where("seller_id = ?", seller.ID).
			Scan(&avgRating).Error
		if err != nil {
			return err
		}

		if err := db.Model(&seller).Update("review_score", avgRating).Error; err != nil {
			return err
		}
	}

	return nil
}
