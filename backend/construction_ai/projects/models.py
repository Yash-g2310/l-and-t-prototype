from django.db import models
from accounts.models import User

class Project(models.Model):
    STATUS_CHOICES = (
        ('planning', 'Planning'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('on_hold', 'On Hold'),
    )
    
    title = models.CharField(max_length=255)
    description = models.TextField()
    location = models.CharField(max_length=255)
    start_date = models.DateField()
    end_date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='planning')
    supervisor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='supervised_projects')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.title

class ProjectWorker(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='project_workers')
    worker = models.ForeignKey(User, on_delete=models.CASCADE, related_name='assigned_projects')
    assigned_at = models.DateTimeField(auto_now_add=True)
    
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