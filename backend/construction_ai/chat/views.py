from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
import requests
from .models import ChatRoom, Message
from .serializers import ChatRoomSerializer, MessageSerializer
from projects.models import Project

class ChatRoomViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = ChatRoomSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Return chat rooms the user has access to"""
        user = self.request.user
        if user.role == 'supervisor':
            return ChatRoom.objects.filter(project__supervisor=user)
        else:  # worker
            return ChatRoom.objects.filter(project__project_workers__worker=user)

class MessageViewSet(viewsets.ModelViewSet):
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]
    http_method_names = ['get', 'post']
    
    def get_queryset(self):
        """Return messages for a specific chat room"""
        chat_room_id = self.request.query_params.get('chat_room_id')
        if chat_room_id:
            # Check if user has access to this chat room
            user = self.request.user
            chat_room = ChatRoom.objects.get(id=chat_room_id)
            
            if (user.role == 'supervisor' and chat_room.project.supervisor == user) or \
               (user.role == 'worker' and chat_room.project.project_workers.filter(worker=user).exists()):
                return Message.objects.filter(chat_room_id=chat_room_id)
        return Message.objects.none()
    
    def perform_create(self, serializer):
        """Create a message and generate AI response"""
        chat_room_id = self.request.data.get('chat_room_id')
        if not chat_room_id:
            return Response({"detail": "chat_room_id is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        chat_room = ChatRoom.objects.get(id=chat_room_id)
        user_message = serializer.save(sender=self.request.user, chat_room=chat_room)
        
        # Process with LLM (Eliza OS) and create AI response
        ai_response = self.get_ai_response(user_message.content, chat_room.project)
        Message.objects.create(
            sender=self.request.user,  # Using same sender but marking as AI response
            chat_room=chat_room,
            content=ai_response,
            is_ai_response=True
        )
    
    def get_ai_response(self, user_message, project):
        """Generate AI response using LLM (placeholder for now)"""
        # Collect project context for better AI responses
        project_context = f"Project: {project.title}\nDescription: {project.description}\nStatus: {project.status}"
        
        try:
            # This is a placeholder - you'll need to implement the actual LLM integration with Eliza OS
            # For now, return a simple response
            return f"I understand your question about {project.title}. Let me analyze this further based on the project details."
        except Exception as e:
            return f"Sorry, I couldn't process your request due to an error. Please try again later."