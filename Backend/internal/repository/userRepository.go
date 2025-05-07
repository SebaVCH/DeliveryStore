package repository

import (
	"github.com/SebaVCH/DeliveryStore/internal/domain"
	"github.com/SebaVCH/DeliveryStore/internal/infrastructure/database"
	"gorm.io/gorm"
)

type UserRepository interface {
	FindByEmail(email string) (domain.Usuario, error)
	Create(user domain.Usuario) error
	UpdateMyAccount(user domain.Usuario, updates map[string]interface{}) error
	Exists(email string) bool
	GetAllUsers() ([]domain.Usuario, error)
	DeleteUser(email string) error
	UpdateAnyAccount(user domain.Usuario, updates map[string]interface{}) error
}

type userRepository struct {
	db *gorm.DB
}

func NewUserRepository() UserRepository {
	return &userRepository{
		db: database.DB,
	}
}

func (r *userRepository) GetAllUsers() ([]domain.Usuario, error) {
	var users []domain.Usuario
	err := r.db.Find(&users).Error
	if err != nil {
		return nil, err
	}
	return users, nil
}

func (r *userRepository) DeleteUser(email string) error {
	var user domain.Usuario
	err := r.db.Where("email = ?", email).Delete(&user).Error
	if err != nil {
		return err
	}
	return nil
}

func (r *userRepository) FindByEmail(email string) (domain.Usuario, error) {
	var user domain.Usuario
	err := r.db.Where("email = ?", email).First(&user).Error
	return user, err
}

func (r *userRepository) Create(user domain.Usuario) error {
	return r.db.Create(&user).Error
}

func (r *userRepository) UpdateMyAccount(user domain.Usuario, updates map[string]interface{}) error {
	return r.db.Model(&user).Updates(updates).Error
}

func (r *userRepository) Exists(email string) bool {
	var user domain.Usuario
	result := r.db.Where("email = ?", email).First(&user)
	return result.Error == nil
}

func (r *userRepository) UpdateAnyAccount(user domain.Usuario, updates map[string]interface{}) error {
	return r.db.Model(&user).Updates(updates).Error
}
