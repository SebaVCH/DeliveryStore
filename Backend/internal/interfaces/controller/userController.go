package controllers

import (
	"github.com/SebaVCH/DeliveryStore/internal/usecase"
	"github.com/gin-gonic/gin"
)

type UserController struct {
	userUseCase usecase.UserUseCase
}

func NewUserController(useCase usecase.UserUseCase) *UserController {
	return &UserController{
		userUseCase: useCase,
	}
}

func (ctrl *UserController) Register(c *gin.Context) {
	ctrl.userUseCase.Register(c)
}

func (ctrl *UserController) Login(c *gin.Context) {
	ctrl.userUseCase.Login(c)
}

func (ctrl *UserController) Info(c *gin.Context) {
	ctrl.userUseCase.Info(c)
}

func (ctrl *UserController) Update(c *gin.Context) {
	ctrl.userUseCase.Update(c)
}
