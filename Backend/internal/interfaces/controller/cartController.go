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

func (cc *cartController) GetCartsByBuyerID(c *gin.Context) {
	cc.cartUseCase.GetCartsByBuyerID(c)
}

func (cc *cartController) GetFinalPrice(c *gin.Context) {
	cc.cartUseCase.GetFinalPrice(c)
}

func (cc *cartController) PayTheCart(c *gin.Context) {
	cc.cartUseCase.PayTheCart(c)
}
