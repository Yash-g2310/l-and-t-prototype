# filepath: c:\Users\Yash Gupta\Desktop\lnt-prot\l-and-t-prototype\backend\construction_ai\projects\admin.py
from django.contrib import admin
from .models import Project, ProjectWorker, ProjectUpdate, ProjectSupplier, ProjectTimeline, RiskAnalysis

admin.site.register(Project)
admin.site.register(ProjectWorker)
admin.site.register(ProjectUpdate)
# Add these missing registrations:
admin.site.register(ProjectSupplier)
admin.site.register(ProjectTimeline)
admin.site.register(RiskAnalysis)