from django.db import models
from accounts.models import User
from projects.models import Project

class ChatRoom(models.Model):
    project = models.OneToOneField(Project, on_delete=models.CASCADE, related_name='chat_room')
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Chat for {self.project.title}"

class Message(models.Model):
    chat_room = models.ForeignKey(ChatRoom, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    is_ai_response = models.BooleanField(default=False)
    is_update = models.BooleanField(default=False, help_text="Flag to indicate this is a project update via chat")
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['created_at']
    
    def __str__(self):
        return f"{self.sender.username}: {self.content[:50]}"