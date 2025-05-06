from django.db.models.signals import post_save
from django.dispatch import receiver
from projects.models import Project
from .models import ChatRoom

@receiver(post_save, sender=Project)
def create_chat_room(sender, instance, created, **kwargs):
    """Create a ChatRoom whenever a new Project is created"""
    if created:
        ChatRoom.objects.create(project=instance)