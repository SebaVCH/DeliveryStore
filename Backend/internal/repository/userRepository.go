package repository

import (
	"github.com/SebaVCH/DeliveryStore/internal/domain"
	"github.com/SebaVCH/DeliveryStore/internal/infrastructure/database"
	"gorm.io/gorm"
	"strconv"
)

type UserRepository interface {
	FindByEmail(email string) (domain.Usuario, error)
	Create(user domain.Usuario) error
	UpdateMyAccount(user domain.Usuario, updates map[string]interface{}) error
	Exists(email string) bool
	GetAllUsers(quantity string) ([]domain.Usuario, error)
	DeleteUser(id string) error
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

func (r *userRepository) GetAllUsers(quantity string) ([]domain.Usuario, error) {
	var users []domain.Usuario
	query := r.db.Where("banned = ?", false)

	if quantity != "all" {
		value, err := strconv.Atoi(quantity)
		if err != nil {
			return nil, err
		}
		query = query.Limit(value)
	}

	err := query.Find(&users).Error

	if err != nil {
		return nil, err
	}
	return users, nil
}

func (r *userRepository) DeleteUser(id string) error {
	err := r.db.Model(&domain.Usuario{}).Where("id = ?", id).Update("banned", true).Error
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
	r.db.Create(&user)
	user.PublicID = user.ID
	r.db.Save(&user)
	if r.db.Error != nil {
		return r.db.Error
	}
	return nil
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
	return r.db.Model(&domain.Usuario{}).Where("email = ?", user.Email).Updates(updates).Error
}
