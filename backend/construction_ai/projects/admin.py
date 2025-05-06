from django.contrib import admin
from .models import Project, ProjectWorker, ProjectUpdate

admin.site.register(Project)
admin.site.register(ProjectWorker)
admin.site.register(ProjectUpdate)