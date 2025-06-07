package repository

import (
	"github.com/SebaVCH/DeliveryStore/internal/domain"
	"github.com/SebaVCH/DeliveryStore/internal/infrastructure/database"
	"gorm.io/gorm"
)

type ReviewRepository interface {
	CreateReview(review domain.Review) error
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

func (r *reviewRepository) CreateReview(review domain.Review) error {
	return r.db.Create(&review).Error
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
