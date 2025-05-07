from django.db import models
from accounts.models import User
import uuid

class Project(models.Model):
    STATUS_CHOICES = (
        ('planning', 'Planning'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('on_hold', 'On Hold'),
    )
    
    title = models.CharField(max_length=255)
    description = models.TextField()
    detailed_description = models.TextField(blank=True, null=True, help_text="Technical details about the project")
    
    # Risk analysis fields
    risk_assessment = models.TextField(blank=True, null=True, help_text="Detailed risk assessment for the project")
    mitigation_strategies = models.TextField(blank=True, null=True, help_text="Strategies to mitigate identified risks")
    
    # Supply chain fields
    supply_chain_requirements = models.TextField(blank=True, null=True, help_text="Key supply chain requirements")
    
    # Resource management fields
    resource_allocation = models.TextField(blank=True, null=True, help_text="Resource allocation plan")
    equipment_requirements = models.TextField(blank=True, null=True, help_text="Required equipment for the project")
    
    # Location and timeline fields
    location = models.CharField(max_length=255)
    # Replace PointField with regular fields
    latitude = models.FloatField(blank=True, null=True)
    longitude = models.FloatField(blank=True, null=True)
    start_date = models.DateField()
    end_date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='planning')
    
    # Project management fields
    supervisor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='supervised_projects')
    estimated_workers = models.IntegerField(default=0, help_text="Approximate number of workers needed")
    current_worker_count = models.IntegerField(default=0, help_text="Current number of assigned workers")
    budget = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    current_spending = models.DecimalField(max_digits=12, decimal_places=2, default=0, help_text="Current project spending")
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.title
    
    def save(self, *args, **kwargs):
        # Remove Point reference
        super().save(*args, **kwargs)
        
        # Create a chat room for this project if it doesn't exist
        from chat.models import ChatRoom
        ChatRoom.objects.get_or_create(project=self)
        

class ProjectSupplier(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='suppliers')
    name = models.CharField(max_length=255)
    contact_person = models.CharField(max_length=255, blank=True, null=True)
    contact_email = models.EmailField(blank=True, null=True)
    contact_phone = models.CharField(max_length=20, blank=True, null=True)
    materials_provided = models.TextField(help_text="List of materials this supplier provides")
    reliability_score = models.FloatField(default=0.0, help_text="Supplier reliability score (0-100)")
    lead_time_days = models.IntegerField(default=0, help_text="Average lead time in days")
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.name} - {self.project.title}"

class ProjectWorker(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='project_workers')
    worker = models.ForeignKey(User, on_delete=models.CASCADE, related_name='assigned_projects')
    assigned_at = models.DateTimeField(auto_now_add=True)
    role_description = models.CharField(max_length=255, blank=True, null=True)
    skills = models.TextField(blank=True, null=True, help_text="Worker's relevant skills")
    performance_rating = models.FloatField(null=True, blank=True, help_text="Worker performance rating (0-5)")
    
    class Meta:
        unique_together = ('project', 'worker')
    
    def __str__(self):
        return f"{self.worker.username} - {self.project.title}"

class ProjectUpdate(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='updates')
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='authored_updates')
    title = models.CharField(max_length=255)
    content = models.TextField()
    image = models.ImageField(upload_to='project_updates/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.title} - {self.project.title}"

class ProjectTimeline(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='timeline_events')
    title = models.CharField(max_length=255)
    description = models.TextField()
    start_date = models.DateField()
    end_date = models.DateField()
    completion_percentage = models.IntegerField(default=0)
    is_milestone = models.BooleanField(default=False)
    dependencies = models.ManyToManyField('self', symmetrical=False, blank=True, related_name='dependent_events')
    responsible_person = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.title} - {self.project.title}"

class RiskAnalysis(models.Model):
    RISK_LEVEL_CHOICES = (
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('critical', 'Critical'),
    )
    
    RISK_CATEGORY_CHOICES = (
        ('supply_chain', 'Supply Chain'),
        ('workforce', 'Workforce'),
        ('financial', 'Financial'),
        ('weather', 'Weather/Environmental'),
        ('technical', 'Technical'),
        ('safety', 'Safety'),
        ('regulatory', 'Regulatory'),
        ('other', 'Other'),
    )
    
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='risks')
    title = models.CharField(max_length=255)
    description = models.TextField()
    risk_level = models.CharField(max_length=10, choices=RISK_LEVEL_CHOICES)
    risk_category = models.CharField(max_length=20, choices=RISK_CATEGORY_CHOICES, default='other')
    probability = models.FloatField(default=0.0, help_text="Probability of occurrence (0-1)")
    impact = models.FloatField(default=0.0, help_text="Impact severity (0-10)")
    mitigation_plan = models.TextField()
    contingency_plan = models.TextField(blank=True, null=True)
    is_resolved = models.BooleanField(default=False)
    resolved_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.title} - {self.project.title}"

# Remove ProjectChat class as we're using the separate chat app