from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
import requests
from .models import ChatRoom, Message
from .serializers import ChatRoomSerializer, MessageSerializer
from projects.models import Project, ProjectWorker

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

    @action(detail=True, methods=['get'])
    def messages(self, request, pk=None):
        """Get messages for a specific chat room"""
        chat_room = self.get_object()
        messages = Message.objects.filter(chat_room=chat_room)
        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data)

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
            try:
                chat_room = ChatRoom.objects.get(id=chat_room_id)
                project = chat_room.project
                
                if (user.role == 'supervisor' and project.supervisor == user) or \
                   (user.role == 'worker' and ProjectWorker.objects.filter(project=project, worker=user).exists()):
                    return Message.objects.filter(chat_room_id=chat_room_id)
            except ChatRoom.DoesNotExist:
                pass
        return Message.objects.none()
    
    def perform_create(self, serializer):
        """Create a message and generate AI response"""
        chat_room_id = self.request.data.get('chat_room_id')
        if not chat_room_id:
            return Response({"detail": "chat_room_id is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            chat_room = ChatRoom.objects.get(id=chat_room_id)
            project = chat_room.project
            
            # Check permissions
            user = self.request.user
            if not ((user.role == 'supervisor' and project.supervisor == user) or 
                   (user.role == 'worker' and ProjectWorker.objects.filter(project=project, worker=user).exists())):
                return Response({"detail": "You don't have permission to chat in this project"}, 
                               status=status.HTTP_403_FORBIDDEN)
                
            # Save the message
            user_message = serializer.save(sender=self.request.user, chat_room=chat_room)
            
            # Check if this is marked as an update
            is_update = self.request.data.get('is_update', False)
            if is_update and user.role == 'supervisor':
                user_message.is_update = True
                user_message.save(update_fields=['is_update'])
            
            # Process with LLM and create AI response
            ai_response = self.get_ai_response(user_message.content, project)
            Message.objects.create(
                sender=self.request.user,  # Using same sender but marking as AI response
                chat_room=chat_room,
                content=ai_response,
                is_ai_response=True
            )
            
            return Response(serializer.data, status=status.HTTP_201_CREATED)
            
        except ChatRoom.DoesNotExist:
            return Response({"detail": "Chat room not found"}, status=status.HTTP_404_NOT_FOUND)
    
    def get_ai_response(self, user_message, project):
        """Generate AI response using LLM with project context"""
        # Collect project context for better AI responses
        project_context = (
            f"Project: {project.title}\n"
            f"Description: {project.description}\n"
            f"Status: {project.status}\n"
            f"Location: {project.location}\n"
            f"Timeline: {project.start_date} to {project.end_date}\n"
        )
        
        if project.risk_assessment:
            project_context += f"Risk Assessment: {project.risk_assessment}\n"
            
        if project.mitigation_strategies:
            project_context += f"Mitigation Strategies: {project.mitigation_strategies}\n"
        
        try:
            # This is a placeholder - you'll need to implement the actual LLM integration
            # In a real implementation, send the user message and project context to your LLM service
            
            # Example with GPT-like response formatting:
            return (
                f"Based on the project '{project.title}', I can assist with your query.\n\n"
                f"You asked: {user_message}\n\n"
                f"Here's my analysis: This project is currently in {project.status} phase "
                f"with a timeline from {project.start_date} to {project.end_date}. "
                f"I'll analyze this within the context of construction best practices, "
                f"risk management, and resource optimization."
            )
        except Exception as e:
            return f"Sorry, I couldn't process your request due to an error. Please try again later."