package domain

type Buyer struct {
	ID    int     `gorm:"primaryKey"`
	Email string  `gorm:"not null"`
	User  Usuario `gorm:"foreignKey:Email;references:Email"`
}
