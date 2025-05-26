package controllers

import (
	"github.com/SebaVCH/DeliveryStore/internal/usecase"
	"github.com/gin-gonic/gin"
)

type cartController struct {
	cartUseCase usecase.CartUseCase
}

func NewCartController(cartUseCase usecase.CartUseCase) *cartController {
	return &cartController{
		cartUseCase: cartUseCase,
	}
}

func (cc *cartController) CreateCart(c *gin.Context) {
	cc.cartUseCase.CreateCart(c)
}

func (cc *cartController) GetAllCarts(c *gin.Context) {
	cc.cartUseCase.GetAllCarts(c)
}

func (cc *cartController) GetTopProducts(c *gin.Context) {
	cc.cartUseCase.GetTopProducts(c)
}
