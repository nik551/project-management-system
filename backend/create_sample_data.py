import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from projects.models import Organization, Project, Task, TaskComment
from datetime import datetime, timedelta

print("Creating sample data...")

# Create Organizations
org1, created = Organization.objects.get_or_create(
    slug="tech-startup",
    defaults={
        "name": "Tech Startup Inc",
        "contact_email": "contact@techstartup.com"
    }
)
print(f"Organization: {org1.name}")

org2, created = Organization.objects.get_or_create(
    slug="design-agency",
    defaults={
        "name": "Design Agency",
        "contact_email": "hello@designagency.com"
    }
)
print(f"Organization: {org2.name}")

# Create Projects
project1, created = Project.objects.get_or_create(
    organization=org1,
    name="Website Redesign",
    defaults={
        "description": "Complete overhaul of company website",
        "status": "ACTIVE",
        "due_date": (datetime.now() + timedelta(days=30)).date()
    }
)
print(f"Project: {project1.name}")

project2, created = Project.objects.get_or_create(
    organization=org1,
    name="Mobile App Development",
    defaults={
        "description": "New mobile app for iOS and Android",
        "status": "ACTIVE",
        "due_date": (datetime.now() + timedelta(days=60)).date()
    }
)
print(f" Project: {project2.name}")

# Create Tasks
task1, created = Task.objects.get_or_create(
    project=project1,
    title="Create wireframes",
    defaults={
        "description": "Design wireframes for all pages",
        "status": "DONE",
        "assignee_email": "designer@techstartup.com"
    }
)
print(f"Task: {task1.title}")

task2, created = Task.objects.get_or_create(
    project=project1,
    title="Develop homepage",
    defaults={
        "description": "Implement homepage with new design",
        "status": "IN_PROGRESS",
        "assignee_email": "dev@techstartup.com"
    }
)
print(f"Task: {task2.title}")

task3, created = Task.objects.get_or_create(
    project=project1,
    title="Write content",
    defaults={
        "description": "Update all website copy",
        "status": "TODO",
        "assignee_email": "content@techstartup.com"
    }
)
print(f" Task: {task3.title}")

# Create Comments
comment1, created = TaskComment.objects.get_or_create(
    task=task2,
    author_email="manager@techstartup.com",
    defaults={
        "content": "Looking good so far! Can we adjust the header spacing?"
    }
)
print(f"Comment on: {task2.title}")

print("\n Sample data created successfully!")
print(f"Organizations: {Organization.objects.count()}")
print(f"Projects: {Project.objects.count()}")
print(f"Tasks: {Task.objects.count()}")
print(f"Comments: {TaskComment.objects.count()}")