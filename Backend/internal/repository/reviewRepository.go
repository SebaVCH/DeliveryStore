package repository

import (
	"github.com/SebaVCH/DeliveryStore/internal/domain"
	"github.com/SebaVCH/DeliveryStore/internal/infrastructure/database"
	"gorm.io/gorm"
)

type ReviewRepository interface {
	CreateReview(review domain.Review) error
	GetBySeller(SellerID int) ([]domain.Review, error)
	DeleteReview(id int) error
	GetAllReviews() ([]domain.Review, error)
}

type reviewRepository struct {
	db *gorm.DB
}

func NewReviewRepository(db *gorm.DB) ReviewRepository {
	return &reviewRepository{
		db: database.DB,
	}
}

func (r *reviewRepository) CreateReview(review domain.Review) error {
	return r.db.Create(review).Error
}

func (r *reviewRepository) GetBySeller(SellerID int) ([]domain.Review, error) {
	var reviews []domain.Review
	if err := r.db.Where("seller_id = ?", SellerID).Find(&reviews).Error; err != nil {
		return nil, err
	}
	return reviews, nil
}

func (r *reviewRepository) DeleteReview(id int) error {
	return r.db.Delete(&domain.Review{}, id).Error
}

func (r *reviewRepository) GetAllReviews() ([]domain.Review, error) {
	var reviews []domain.Review
	err := r.db.Find(&reviews).Error
	if err != nil {
		return nil, err
	}
	return reviews, nil
}
