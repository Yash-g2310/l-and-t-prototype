from django.db.models.signals import post_save
from django.dispatch import receiver
from projects.models import Project
from .models import ChatRoom

@receiver(post_save, sender=Project)
def create_chat_room(sender, instance, created, **kwargs):
    """Create a ChatRoom if one doesn't exist for this project"""
    from chat.models import ChatRoom
    ChatRoom.objects.get_or_create(project=instance)