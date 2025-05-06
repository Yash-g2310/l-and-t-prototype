from django.urls import path
from .views import ProjectListCreateView, ProjectDetailView, UpdateCreateView

urlpatterns = [
    path('', ProjectListCreateView.as_view(), name='project-list-create'),
    path('<int:pk>/', ProjectDetailView.as_view(), name='project-detail'),
    path('<int:pk>/updates/', UpdateCreateView.as_view(), name='project-update'),
]
