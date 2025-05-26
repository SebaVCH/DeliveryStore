package controllers

import (
	"github.com/SebaVCH/DeliveryStore/internal/usecase"
	"github.com/gin-gonic/gin"
)

type OrderController struct {
	orderUseCase usecase.OrderUseCase
}

func NewOrderController(useCase usecase.OrderUseCase) *OrderController {
	return &OrderController{
		orderUseCase: useCase,
	}
}

func (ctrl *OrderController) CreateOrder(c *gin.Context) {
	ctrl.orderUseCase.CreateOrder(c)
}

func (ctrl *OrderController) GetAllOrders(c *gin.Context) {
	ctrl.orderUseCase.GetAllOrders(c)
}

func (ctrl *OrderController) SetEliminated(c *gin.Context) {
	ctrl.orderUseCase.SetEliminated(c)
}
