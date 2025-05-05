package repository

import (
	"github.com/SebaVCH/DeliveryStore/internal/domain"
	"github.com/SebaVCH/DeliveryStore/internal/infrastructure/database"
	"gorm.io/gorm"
)

type UserRepository interface {
	FindByEmail(email string) (domain.Usuario, error)
	Create(user domain.Usuario) error
	Update(user domain.Usuario, updates map[string]interface{}) error
	Exists(email string) bool
}

type userRepository struct {
	db *gorm.DB
}

func NewUserRepository() UserRepository {
	return &userRepository{
		db: database.DB,
	}
}

func (r *userRepository) FindByEmail(email string) (domain.Usuario, error) {
	var user domain.Usuario
	err := r.db.Where("email = ?", email).First(&user).Error
	return user, err
}

func (r *userRepository) Create(user domain.Usuario) error {
	return r.db.Create(&user).Error
}

func (r *userRepository) Update(user domain.Usuario, updates map[string]interface{}) error {
	return r.db.Model(&user).Updates(updates).Error
}

func (r *userRepository) Exists(email string) bool {
	var user domain.Usuario
	result := r.db.Where("email = ?", email).First(&user)
	return result.Error == nil
}
