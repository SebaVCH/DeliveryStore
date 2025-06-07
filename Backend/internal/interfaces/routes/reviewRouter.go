package routes

import (
	controllers "github.com/SebaVCH/DeliveryStore/internal/interfaces/controller"
	"github.com/SebaVCH/DeliveryStore/internal/interfaces/middleware"
	"github.com/SebaVCH/DeliveryStore/internal/repository"
	"github.com/SebaVCH/DeliveryStore/internal/usecase"
	"github.com/gin-gonic/gin"
)

func SetupReviewRouter(router *gin.Engine) {
	reviewRepo := repository.NewReviewRepository()
	reviewUseCase := usecase.NewReviewUseCase(reviewRepo)
	reviewController := controllers.NewReviewController(reviewUseCase)

	protected := router.Group("/review")
	protected.Use(middleware.AuthMiddleware())
	protected.POST("/:id", reviewController.CreateReview)
	protected.GET("/", reviewController.GetAllReviews)
	protected.DELETE("/:id", reviewController.DeleteReview)
}
