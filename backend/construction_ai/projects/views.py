from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import (
    Project, ProjectWorker, ProjectUpdate, ProjectSupplier, 
    ProjectTimeline, RiskAnalysis
)
from .serializers import (
    ProjectSerializer, ProjectWorkerSerializer, ProjectUpdateSerializer,
    ProjectSupplierSerializer, ProjectTimelineSerializer, RiskAnalysisSerializer
)
from accounts.models import User
from django.shortcuts import get_object_or_404

class IsSupervisor(permissions.BasePermission):
    """Permission to only allow supervisors to create/edit projects"""
    def has_permission(self, request, view):
        return request.user.role == 'supervisor'

class IsProjectSupervisor(permissions.BasePermission):
    """Permission to only allow the project supervisor to make changes"""
    def has_object_permission(self, request, view, obj):
        # For ProjectWorker, ProjectSupplier, etc., we need to check the project's supervisor
        if hasattr(obj, 'project'):
            return obj.project.supervisor == request.user
        # For Project model
        return obj.supervisor == request.user

class ProjectMemberPermission(permissions.BasePermission):
    """Permission to allow both supervisors and assigned workers to access"""
    def has_object_permission(self, request, view, obj):
        user = request.user
        
        # Supervisors have full access
        if user.role == 'supervisor' and obj.supervisor == user:
            return True
            
        # Workers have read-only access if they're assigned to the project
        if user.role == 'worker' and request.method in permissions.SAFE_METHODS:
            return ProjectWorker.objects.filter(project=obj, worker=user).exists()
            
        return False

class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    
    def get_permissions(self):
        """Different permissions for different actions"""
        if self.action in ['create']:
            return [permissions.IsAuthenticated(), IsSupervisor()]
        elif self.action in ['update', 'partial_update', 'destroy']:
            return [permissions.IsAuthenticated(), IsProjectSupervisor()]
        return [permissions.IsAuthenticated(), ProjectMemberPermission()]
    
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
    
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated, IsProjectSupervisor])
    def add_worker(self, request, pk=None):
        """Add a worker to a project via email"""
        project = self.get_object()
        
        # Get email from request data
        email = request.data.get('email')
        if not email:
            return Response({"detail": "Worker email is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Look for a worker with this email
        try:
            worker = User.objects.get(email=email, role='worker')
        except User.DoesNotExist:
            return Response({"detail": "No worker found with this email"}, status=status.HTTP_404_NOT_FOUND)
        
        # Check if worker is already assigned to this project
        if ProjectWorker.objects.filter(project=project, worker=worker).exists():
            return Response({"detail": "Worker is already assigned to this project"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Create the assignment
        project_worker = ProjectWorker.objects.create(
            project=project,
            worker=worker,
            role_description=request.data.get('role_description', '')
        )
        
        # Update current worker count
        project.current_worker_count = ProjectWorker.objects.filter(project=project).count()
        project.save(update_fields=['current_worker_count'])
        
        serializer = ProjectWorkerSerializer(project_worker)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class ProjectWorkerViewSet(viewsets.ModelViewSet):
    queryset = ProjectWorker.objects.all()
    serializer_class = ProjectWorkerSerializer
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAuthenticated(), IsSupervisor()]
        return [permissions.IsAuthenticated()]
    
    def get_queryset(self):
        """Filter by project and user permissions"""
        user = self.request.user
        project_id = self.request.query_params.get('project_id')
        
        if not project_id:
            return ProjectWorker.objects.none()
            
        project = get_object_or_404(Project, id=project_id)
        
        # Supervisor sees all workers in their projects
        if user.role == 'supervisor' and project.supervisor == user:
            return ProjectWorker.objects.filter(project_id=project_id)
            
        # Workers see other workers in projects they're assigned to
        if user.role == 'worker' and ProjectWorker.objects.filter(project=project, worker=user).exists():
            return ProjectWorker.objects.filter(project_id=project_id)
            
        return ProjectWorker.objects.none()
    
    def perform_create(self, serializer):
        """Update project worker count after creating"""
        project_worker = serializer.save()
        project = project_worker.project
        project.current_worker_count = ProjectWorker.objects.filter(project=project).count()
        project.save(update_fields=['current_worker_count'])

    def perform_destroy(self, instance):
        """Update project worker count after deleting"""
        project = instance.project
        super().perform_destroy(instance)
        project.current_worker_count = ProjectWorker.objects.filter(project=project).count()
        project.save(update_fields=['current_worker_count'])

class ProjectUpdateViewSet(viewsets.ModelViewSet):
    queryset = ProjectUpdate.objects.all()
    serializer_class = ProjectUpdateSerializer
    
    def get_queryset(self):
        """Filter updates by project_id and user permissions"""
        user = self.request.user
        project_id = self.request.query_params.get('project_id')
        
        if not project_id:
            return ProjectUpdate.objects.none()
            
        project = get_object_or_404(Project, id=project_id)
        
        # Both supervisors and assigned workers can see updates
        if (user.role == 'supervisor' and project.supervisor == user) or \
           (user.role == 'worker' and ProjectWorker.objects.filter(project=project, worker=user).exists()):
            return ProjectUpdate.objects.filter(project_id=project_id)
            
        return ProjectUpdate.objects.none()
    
    def perform_create(self, serializer):
        """Set the author to the current user"""
        serializer.save(author=self.request.user)

class ProjectSupplierViewSet(viewsets.ModelViewSet):
    queryset = ProjectSupplier.objects.all()
    serializer_class = ProjectSupplierSerializer
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAuthenticated(), IsSupervisor()]
        return [permissions.IsAuthenticated()]
    
    def get_queryset(self):
        user = self.request.user
        project_id = self.request.query_params.get('project_id')
        
        if not project_id:
            return ProjectSupplier.objects.none()
            
        project = get_object_or_404(Project, id=project_id)
        
        # Both supervisors and assigned workers can see suppliers
        if (user.role == 'supervisor' and project.supervisor == user) or \
           (user.role == 'worker' and ProjectWorker.objects.filter(project=project, worker=user).exists()):
            return ProjectSupplier.objects.filter(project_id=project_id)
            
        return ProjectSupplier.objects.none()

class ProjectTimelineViewSet(viewsets.ModelViewSet):
    queryset = ProjectTimeline.objects.all()
    serializer_class = ProjectTimelineSerializer
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAuthenticated(), IsSupervisor()]
        return [permissions.IsAuthenticated()]
    
    def get_queryset(self):
        user = self.request.user
        project_id = self.request.query_params.get('project_id')
        
        if not project_id:
            return ProjectTimeline.objects.none()
            
        project = get_object_or_404(Project, id=project_id)
        
        # Both supervisors and assigned workers can see timeline
        if (user.role == 'supervisor' and project.supervisor == user) or \
           (user.role == 'worker' and ProjectWorker.objects.filter(project=project, worker=user).exists()):
            return ProjectTimeline.objects.filter(project_id=project_id)
            
        return ProjectTimeline.objects.none()

class RiskAnalysisViewSet(viewsets.ModelViewSet):
    queryset = RiskAnalysis.objects.all()
    serializer_class = RiskAnalysisSerializer
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAuthenticated(), IsSupervisor()]
        return [permissions.IsAuthenticated()]
    
    def get_queryset(self):
        user = self.request.user
        project_id = self.request.query_params.get('project_id')
        
        if not project_id:
            return RiskAnalysis.objects.none()
            
        project = get_object_or_404(Project, id=project_id)
        
        # Both supervisors and assigned workers can see risks
        if (user.role == 'supervisor' and project.supervisor == user) or \
           (user.role == 'worker' and ProjectWorker.objects.filter(project=project, worker=user).exists()):
            return RiskAnalysis.objects.filter(project_id=project_id)
            
        return RiskAnalysis.objects.none()