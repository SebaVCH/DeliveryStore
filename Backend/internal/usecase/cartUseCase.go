package usecase

import (
	"github.com/SebaVCH/DeliveryStore/internal/domain"
	"github.com/SebaVCH/DeliveryStore/internal/repository"
	"github.com/gin-gonic/gin"
	"net/http"
)

type CartUseCase interface {
	CreateCart(c *gin.Context)
	GetAllCarts(c *gin.Context)
	GetTopProducts(c *gin.Context)
}

type cartUseCase struct {
	repo repository.CartRepository
}

func NewCartUseCase(repo repository.CartRepository) CartUseCase {
	return &cartUseCase{repo: repo}
}

func (uc *cartUseCase) CreateCart(c *gin.Context) {
	var cart domain.Cart
	if err := c.ShouldBindJSON(&cart); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Formato de carrito inválido"})
		return
	}

	if err := uc.repo.CreateCart(cart); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Carrito creado"})
}

func (uc *cartUseCase) GetAllCarts(c *gin.Context) {
	carts, err := uc.repo.GetAllCarts()
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}
	c.JSON(http.StatusOK, carts)
}

func (uc *cartUseCase) GetTopProducts(c *gin.Context) {
	quantity := c.Param("quantity")
	if quantity == "" {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Cantidad inválida"})
		return
	}
	topProducts, err := uc.repo.GetTopProducts(quantity)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Cantidad inválida"})
		return
	}
	c.JSON(http.StatusOK, topProducts)
}
