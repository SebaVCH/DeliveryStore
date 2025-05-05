package domain

type Supplier struct {
	ID       int `gorm:"primaryKey"`
	Name     string
	SellerID int
	Seller   Seller `gorm:"foreignKey:SellerID;references:ID"`
}
