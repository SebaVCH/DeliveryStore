package domain

type Usuario struct {
	ID          int64   `gorm:"primaryKey"`
	PublicID    int64   `gorm:"uniqueIndex;not null"`
	Email       string  `gorm:"not null"`
	Name        string  `gorm:"not null"`
	Password    string  `gorm:"not null"`
	RoleType    int     `gorm:"not null"`
	Balance     float64 `gorm:"not null"`
	Phone       string  `gorm:"not null"`
	Address     string  `gorm:"not null"`
	Banned      bool    `gorm:"not null"`
	ReviewScore float64 `gorm:"not null,default:0"`
}
