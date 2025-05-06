from rest_framework import serializers
from .models import ChatRoom, Message
from accounts.models import User

class MessageSerializer(serializers.ModelSerializer):
    sender_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Message
        fields = ['id', 'sender', 'sender_name', 'content', 'is_ai_response', 'created_at']
        read_only_fields = ['sender', 'is_ai_response']
    
    def get_sender_name(self, obj):
        return obj.sender.username

class ChatRoomSerializer(serializers.ModelSerializer):
    messages = MessageSerializer(many=True, read_only=True)
    
    class Meta:
        model = ChatRoom
        fields = ['id', 'project', 'messages', 'created_at']