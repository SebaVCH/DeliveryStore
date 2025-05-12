package domain

type DeliveryPerson struct {
	ID      int     `gorm:"primaryKey"`
	Status  string  `gorm:"not null"`
	Vehicle string  `gorm:"not null"`
	Email   string  `gorm:"not null"`
	User    Usuario `gorm:"foreignKey:Email;references:Email"`
}
