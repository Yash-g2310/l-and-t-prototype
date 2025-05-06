from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Project, ProjectWorker, ProjectUpdate
from .serializers import ProjectSerializer, ProjectWorkerSerializer, ProjectUpdateSerializer
from accounts.models import User

class IsSupervisor(permissions.BasePermission):
    """Permission to only allow supervisors to create/edit projects"""
    def has_permission(self, request, view):
        return request.user.role == 'supervisor'

class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    
    def get_permissions(self):
        """Different permissions for different actions"""
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAuthenticated(), IsSupervisor()]
        return [permissions.IsAuthenticated()]
    
    def get_queryset(self):
        """Filter projects based on user role"""
        user = self.request.user
        if user.role == 'supervisor':
            return Project.objects.filter(supervisor=user)
        else:  # worker
            return Project.objects.filter(project_workers__worker=user)
    
    def perform_create(self, serializer):
        """Set the supervisor to the current user"""
        serializer.save(supervisor=self.request.user)
    
    @action(detail=True, methods=['post'])
    def add_worker(self, request, pk=None):
        """Add a worker to a project"""
        project = self.get_object()
        try:
            worker_email = request.data.get('worker_email')
            worker = User.objects.get(email=worker_email, role='worker')
            
            # Check if worker is already added
            if ProjectWorker.objects.filter(project=project, worker=worker).exists():
                return Response({"detail": "Worker already assigned to this project"}, 
                                status=status.HTTP_400_BAD_REQUEST)
            
            project_worker = ProjectWorker.objects.create(project=project, worker=worker)
            serializer = ProjectWorkerSerializer(project_worker)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except User.DoesNotExist:
            return Response({"detail": "Worker not found with this email"}, 
                            status=status.HTTP_404_NOT_FOUND)

class ProjectUpdateViewSet(viewsets.ModelViewSet):
    queryset = ProjectUpdate.objects.all()
    serializer_class = ProjectUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Filter updates by project_id query parameter"""
        project_id = self.request.query_params.get('project_id')
        if project_id:
            return ProjectUpdate.objects.filter(project_id=project_id)
        return ProjectUpdate.objects.none()
    
    def perform_create(self, serializer):
        """Set the author to the current user"""
        serializer.save(author=self.request.user)