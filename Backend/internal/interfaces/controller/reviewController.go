package controllers

import (
	"github.com/SebaVCH/DeliveryStore/internal/usecase"
	"github.com/gin-gonic/gin"
)

type ReviewController struct {
	ReviewUseCase usecase.ReviewUseCase
}

func NewReviewController(reviewUseCase usecase.ReviewUseCase) *ReviewController {
	return &ReviewController{
		ReviewUseCase: reviewUseCase,
	}
}

func (rc *ReviewController) CreateReview(c *gin.Context) {
	rc.ReviewUseCase.CreateReview(c)
}

func (rc *ReviewController) GetAllReviews(c *gin.Context) {
	rc.ReviewUseCase.GetAllReviews(c)
}

func (rc *ReviewController) DeleteReview(c *gin.Context) {
	rc.ReviewUseCase.DeleteReview(c)
}

func (rc *ReviewController) GetBySeller(c *gin.Context) {
	rc.ReviewUseCase.GetBySeller(c)
}
