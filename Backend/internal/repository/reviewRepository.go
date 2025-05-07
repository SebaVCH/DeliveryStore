package repository

import (
	"github.com/SebaVCH/DeliveryStore/internal/domain"
	"gorm.io/gorm"
)

type ReviewRepository interface {
	Create(review *domain.Review) error
	GetByID(id int) (*domain.Review, error)
	GetBySeller(SellerID int) ([]domain.Review, error)
	GetByBuyer(BuyerID int) ([]domain.Review, error)
}

type reviewRepository struct {
	db *gorm.DB
}

func NewReviewRepository(db *gorm.DB) ReviewRepository {
	return &reviewRepository{db: db}
}

func (r *reviewRepository) Create(review *domain.Review) error {
	return r.db.Create(review).Error
}

func (r *reviewRepository) GetByID(id int) (*domain.Review, error) {
	var review domain.Review
	if err := r.db.First(&review, id).Error; err != nil {
		return nil, err
	}
	return &review, nil
}

func (r *reviewRepository) GetBySeller(SellerID int) ([]domain.Review, error) {
	var reviews []domain.Review
	if err := r.db.Where("seller_id = ?", SellerID).Find(&reviews).Error; err != nil {
		return nil, err
	}
	return reviews, nil
}

func (r *reviewRepository) GetByBuyer(BuyerID int) ([]domain.Review, error) {
	var reviews []domain.Review
	if err := r.db.Where("buyer_id = ?", BuyerID).Find(&reviews).Error; err != nil {
		return nil, err
	}
	return reviews, nil
}
