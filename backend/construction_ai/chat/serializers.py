from rest_framework import serializers
from .models import ChatRoom, Message
from accounts.models import User
from projects.serializers import UserSerializer

class MessageSerializer(serializers.ModelSerializer):
    sender = UserSerializer(read_only=True)
    sender_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        write_only=True,
        source='sender',
        required=False
    )
    
    class Meta:
        model = Message
        fields = [
            'id', 'chat_room', 'sender', 'sender_id', 'content', 
            'is_ai_response', 'is_update', 'created_at'
        ]
        read_only_fields = ['is_ai_response']

class ChatRoomSerializer(serializers.ModelSerializer):
    messages = MessageSerializer(many=True, read_only=True)
    project_title = serializers.CharField(source='project.title', read_only=True)
    
    class Meta:
        model = ChatRoom
        fields = ['id', 'project', 'project_title', 'messages', 'created_at']