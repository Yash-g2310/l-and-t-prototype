from rest_framework import serializers
from .models import Project, ProjectWorker, ProjectUpdate
from accounts.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role', 'profile_picture']

class ProjectSerializer(serializers.ModelSerializer):
    supervisor = UserSerializer(read_only=True)
    supervisor_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(role='supervisor'),
        write_only=True,
        source='supervisor'
    )
    
    class Meta:
        model = Project
        fields = ['id', 'title', 'description', 'location', 'start_date', 
                  'end_date', 'status', 'supervisor', 'supervisor_id', 
                  'created_at', 'updated_at']

class ProjectWorkerSerializer(serializers.ModelSerializer):
    worker = UserSerializer(read_only=True)
    worker_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(role='worker'),
        write_only=True,
        source='worker'
    )
    project = ProjectSerializer(read_only=True)
    project_id = serializers.PrimaryKeyRelatedField(
        queryset=Project.objects.all(),
        write_only=True,
        source='project'
    )
    
    class Meta:
        model = ProjectWorker
        fields = ['id', 'project', 'project_id', 'worker', 'worker_id', 'assigned_at']

class ProjectUpdateSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    
    class Meta:
        model = ProjectUpdate
        fields = ['id', 'project', 'author', 'title', 'content', 'image', 'created_at']
        read_only_fields = ['author']