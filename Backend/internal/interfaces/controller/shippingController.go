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

func (ctrl *ShippingController) UpdateShipping(c *gin.Context) {
	ctrl.shippingUseCase.UpdateShipping(c)
}

func (ctrl *ShippingController) GetCompletedByDeliveryID(c *gin.Context) {
	ctrl.shippingUseCase.GetCompletedByDeliveryID(c)
}
func (ctrl *ShippingController) GetIncompletedByDeliveryID(c *gin.Context) {
	ctrl.shippingUseCase.GetIncompletedByDeliveryID(c)
}

func (ctrl *ShippingController) UndeliveredShipments(c *gin.Context) {
	ctrl.shippingUseCase.UndeliveredShipments(c)
}
func (ctrl *ShippingController) DeliveredShipments(c *gin.Context) {
	ctrl.shippingUseCase.DeliveredShipments(c)
}
