package controllers

import (
	"github.com/SebaVCH/DeliveryStore/internal/usecase"
	"github.com/gin-gonic/gin"
)

type ShippingController struct {
	shippingUseCase usecase.ShippingUseCase
}

func NewShippingController(useCase usecase.ShippingUseCase) *ShippingController {
	return &ShippingController{
		shippingUseCase: useCase,
	}
}

func (ctrl *ShippingController) CreateShipping(c *gin.Context) {
	ctrl.shippingUseCase.CreateShipping(c)
}
func (ctrl *ShippingController) GetAllShipping(c *gin.Context) {
	ctrl.shippingUseCase.GetAllShipping(c)
}
func (ctrl *ShippingController) UpdateShipping(c *gin.Context) {
	ctrl.shippingUseCase.UpdateShipping(c)
}

func (ctrl *ShippingController) GetByDeliveryID(c *gin.Context) {
	ctrl.shippingUseCase.GetByDeliveryID(c)
}
