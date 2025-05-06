from rest_framework import permissions

class IsSupervisor(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.role == 'supervisor'

class IsProjectMember(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        # Supervisors see all; workers only their assigned
        if request.user.role == 'supervisor':
            return obj.created_by == request.user
        return request.user in obj.workers.all()
