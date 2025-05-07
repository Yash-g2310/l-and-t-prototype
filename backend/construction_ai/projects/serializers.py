from rest_framework import serializers
from .models import (
    Project, ProjectWorker, ProjectUpdate, ProjectSupplier, 
    ProjectTimeline, RiskAnalysis
)
from accounts.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role', 'profile_picture']

class ProjectSupplierSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectSupplier
        fields = [
            'id', 'project', 'name', 'contact_person', 'contact_email', 'contact_phone', 
            'materials_provided', 'reliability_score', 'lead_time_days', 'created_at'
        ]

class ProjectTimelineSerializer(serializers.ModelSerializer):
    responsible_person = UserSerializer(read_only=True)
    responsible_person_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        write_only=True,
        source='responsible_person',
        required=False,
        allow_null=True
    )
    
    class Meta:
        model = ProjectTimeline
        fields = [
            'id', 'project', 'title', 'description', 'start_date', 'end_date', 
            'completion_percentage', 'is_milestone', 'dependencies',
            'responsible_person', 'responsible_person_id', 'created_at', 'updated_at'
        ]

class RiskAnalysisSerializer(serializers.ModelSerializer):
    class Meta:
        model = RiskAnalysis
        fields = [
            'id', 'project', 'title', 'description', 'risk_level', 'risk_category',
            'probability', 'impact', 'mitigation_plan', 'contingency_plan',
            'is_resolved', 'resolved_date', 'created_at', 'updated_at'
        ]

class ProjectWorkerSerializer(serializers.ModelSerializer):
    worker = UserSerializer(read_only=True)
    worker_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(role='worker'),
        write_only=True,
        source='worker',
        required=False
    )
    worker_email = serializers.EmailField(write_only=True, required=False)
    
    class Meta:
        model = ProjectWorker
        fields = [
            'id', 'project', 'worker', 'worker_id', 'worker_email', 
            'role_description', 'skills', 'performance_rating', 'assigned_at'
        ]
    
    def create(self, validated_data):
        worker_email = validated_data.pop('worker_email', None)
        
        if worker_email and not validated_data.get('worker', None):
            try:
                worker = User.objects.get(email=worker_email, role='worker')
                validated_data['worker'] = worker
            except User.DoesNotExist:
                raise serializers.ValidationError({'worker_email': 'Worker with this email not found'})
        
        return super().create(validated_data)

class ProjectUpdateSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    
    class Meta:
        model = ProjectUpdate
        fields = ['id', 'project', 'author', 'title', 'content', 'image', 'created_at']
        read_only_fields = ['author']

class ProjectSerializer(serializers.ModelSerializer):
    supervisor = UserSerializer(read_only=True)
    workers = ProjectWorkerSerializer(source='project_workers', many=True, read_only=True)
    suppliers = ProjectSupplierSerializer(many=True, read_only=True)
    timeline_events = ProjectTimelineSerializer(many=True, read_only=True)
    risks = RiskAnalysisSerializer(many=True, read_only=True)
    updates = ProjectUpdateSerializer(many=True, read_only=True)
    lat = serializers.FloatField(write_only=True, required=False)
    lng = serializers.FloatField(write_only=True, required=False)
    
    class Meta:
        model = Project
        fields = [
            'id', 'title', 'description', 'detailed_description', 'location', 
            'risk_assessment', 'mitigation_strategies', 'supply_chain_requirements',
            'resource_allocation', 'equipment_requirements', 'start_date', 'end_date', 
            'status', 'supervisor', 'estimated_workers', 'current_worker_count',
            'budget', 'current_spending', 'created_at', 'updated_at', 
            'workers', 'suppliers', 'timeline_events', 'risks', 'updates',
            'lat', 'lng'
        ]