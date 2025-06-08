package repository

import (
	"github.com/SebaVCH/DeliveryStore/internal/domain"
	"github.com/SebaVCH/DeliveryStore/internal/infrastructure/database"
	"gorm.io/gorm"
	"strconv"
)

type ReviewRepository interface {
	CreateReview(review domain.Review, productID string) error
	DeleteReview(id int) error
	GetAllReviews() ([]domain.Review, error)
}

type reviewRepository struct {
	db *gorm.DB
}

func NewReviewRepository() ReviewRepository {
	return &reviewRepository{
		db: database.DB,
	}
}

func (r *reviewRepository) CreateReview(review domain.Review, productID string) error {
	id, err := strconv.Atoi(productID)
	if err != nil {
		return err
	}

	err = r.db.Create(&review).Error
	if err != nil {
		return err
	}

	var productReview domain.PRRelation
	productReview.ProductID = id
	productReview.ReviewID = review.ID
	err = r.db.Create(&productReview).Error
	if err != nil {
		return err
	}

	var avgScore float64
	err = r.db.Model(&domain.Review{}).
		Select("COALESCE(ROUND(AVG(rating), 1), 0)").
		Joins("JOIN pr_relations ON reviews.id = pr_relations.review_id").
		Where("pr_relations.product_id = ?", id).
		Scan(&avgScore).Error
	if err != nil {
		return err
	}

	err = r.db.Model(&domain.Product{}).
		Where("id = ?", id).
		Update("review_score", avgScore).Error
	if err != nil {
		return err
	}

	var seller domain.Usuario
	err = r.db.Table("products").Where("id = ?", id).Select("seller_id").Scan(&seller).Error
	var avgRating float64
	err = r.db.Table("products").
		Select("COALESCE(ROUND(AVG(review_score), 1), 0)").
		Where("seller_id = ?", seller.ID).
		Scan(&avgRating).Error
	if err != nil {
		return err
	}

	if err := r.db.Model(&seller).Update("review_score", avgRating).Error; err != nil {
		return err
	}

	return nil
}

func (r *reviewRepository) DeleteReview(id int) error {
	return r.db.Delete(&domain.Review{}, id).Error
}

func (r *reviewRepository) GetAllReviews() ([]domain.Review, error) {
	var reviews []domain.Review
	err := r.db.Preload("Buyer").Find(&reviews).Error
	if err != nil {
		return nil, err
	}
	return reviews, nil
}
