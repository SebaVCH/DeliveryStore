package domain

type Usuario struct {
	Email     string `gorm:"primaryKey"`
	Name      string
	Password  string   `gorm:"not null"`
	RoleTypes []string `gorm:"type:text" gorm:"serializer:json"`
}
