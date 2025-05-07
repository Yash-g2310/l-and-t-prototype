from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.conf import settings
from django.conf.urls.static import static

from accounts.views import RegisterView, UserProfileView
from projects.views import (
    ProjectViewSet, ProjectUpdateViewSet, ProjectWorkerViewSet,
    ProjectSupplierViewSet, ProjectTimelineViewSet, RiskAnalysisViewSet
)
from chat.views import ChatRoomViewSet, MessageViewSet

router = DefaultRouter()
router.register(r'projects', ProjectViewSet)
router.register(r'project-updates', ProjectUpdateViewSet)
router.register(r'project-workers', ProjectWorkerViewSet)
router.register(r'project-suppliers', ProjectSupplierViewSet)
router.register(r'project-timeline', ProjectTimelineViewSet)
router.register(r'project-risks', RiskAnalysisViewSet)
router.register(r'chat-rooms', ChatRoomViewSet, basename='chatroom')
router.register(r'messages', MessageViewSet, basename='message')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/auth/', include('rest_framework.urls')),
    
    # JWT Authentication
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # User management
    path('api/register/', RegisterView.as_view(), name='register'),
    path('api/profile/', UserProfileView.as_view(), name='user-profile'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)