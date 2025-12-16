import graphene
from graphene_django import DjangoObjectType
from .models import Organization, Project, Task, TaskComment


class OrganizationType(DjangoObjectType):
    class Meta:
        model = Organization
        fields = '__all__'  # Expose all fields


class ProjectType(DjangoObjectType):
    task_count = graphene.Int()
    completed_tasks = graphene.Int()

    class Meta:
        model = Project
        fields = '__all__'

    # Custom field resolvers (calculated fields)
    def resolve_task_count(self, info):
        return self.tasks.count()

    def resolve_completed_tasks(self, info):
        return self.tasks.filter(status='DONE').count()


class TaskType(DjangoObjectType):
    class Meta:
        model = Task
        fields = '__all__'


class TaskCommentType(DjangoObjectType):
    class Meta:
        model = TaskComment
        fields = '__all__'


# Define Queries (read operations)
class Query(graphene.ObjectType):
    # Get all organizations
    all_organizations = graphene.List(OrganizationType)
    
    # Get single organization by slug
    organization = graphene.Field(OrganizationType, slug=graphene.String(required=True))
    
    # Get projects for an organization
    projects_by_organization = graphene.List(
        ProjectType, 
        organization_slug=graphene.String(required=True)
    )
    
    # Get single project
    project = graphene.Field(ProjectType, id=graphene.ID(required=True))
    
    # Get tasks for a project
    tasks_by_project = graphene.List(TaskType, project_id=graphene.ID(required=True))
    
    # Get single task
    task = graphene.Field(TaskType, id=graphene.ID(required=True))
    
    # Get comments for a task
    comments_by_task = graphene.List(TaskCommentType, task_id=graphene.ID(required=True))

    # Resolver methods (how to fetch the data)
    def resolve_all_organizations(self, info):
        return Organization.objects.all()

    def resolve_organization(self, info, slug):
        return Organization.objects.get(slug=slug)

    def resolve_projects_by_organization(self, info, organization_slug):
        return Project.objects.filter(organization__slug=organization_slug)

    def resolve_project(self, info, id):
        return Project.objects.get(pk=id)

    def resolve_tasks_by_project(self, info, project_id):
        return Task.objects.filter(project_id=project_id)

    def resolve_task(self, info, id):
        return Task.objects.get(pk=id)

    def resolve_comments_by_task(self, info, task_id):
        return TaskComment.objects.filter(task_id=task_id)


# Define Mutations (write operations)
class CreateProject(graphene.Mutation):
    class Arguments:
        organization_slug = graphene.String(required=True)
        name = graphene.String(required=True)
        description = graphene.String()
        status = graphene.String()
        due_date = graphene.Date()

    project = graphene.Field(ProjectType)

    def mutate(self, info, organization_slug, name, **kwargs):
        organization = Organization.objects.get(slug=organization_slug)
        project = Project.objects.create(
            organization=organization,
            name=name,
            **kwargs
        )
        return CreateProject(project=project)


class UpdateProject(graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)
        name = graphene.String()
        description = graphene.String()
        status = graphene.String()
        due_date = graphene.Date()

    project = graphene.Field(ProjectType)

    def mutate(self, info, id, **kwargs):
        project = Project.objects.get(pk=id)
        for key, value in kwargs.items():
            if value is not None:
                setattr(project, key, value)
        project.save()
        return UpdateProject(project=project)


class CreateTask(graphene.Mutation):
    class Arguments:
        project_id = graphene.ID(required=True)
        title = graphene.String(required=True)
        description = graphene.String()
        status = graphene.String()
        assignee_email = graphene.String()
        due_date = graphene.DateTime()

    task = graphene.Field(TaskType)

    def mutate(self, info, project_id, title, **kwargs):
        project = Project.objects.get(pk=project_id)
        task = Task.objects.create(
            project=project,
            title=title,
            **kwargs
        )
        return CreateTask(task=task)


class UpdateTask(graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)
        title = graphene.String()
        description = graphene.String()
        status = graphene.String()
        assignee_email = graphene.String()
        due_date = graphene.DateTime()

    task = graphene.Field(TaskType)

    def mutate(self, info, id, **kwargs):
        task = Task.objects.get(pk=id)
        for key, value in kwargs.items():
            if value is not None:
                setattr(task, key, value)
        task.save()
        return UpdateTask(task=task)


class CreateComment(graphene.Mutation):
    class Arguments:
        task_id = graphene.ID(required=True)
        content = graphene.String(required=True)
        author_email = graphene.String(required=True)

    comment = graphene.Field(TaskCommentType)

    def mutate(self, info, task_id, content, author_email):
        task = Task.objects.get(pk=task_id)
        comment = TaskComment.objects.create(
            task=task,
            content=content,
            author_email=author_email
        )
        return CreateComment(comment=comment)


# Combine all mutations
class Mutation(graphene.ObjectType):
    create_project = CreateProject.Field()
    update_project = UpdateProject.Field()
    create_task = CreateTask.Field()
    update_task = UpdateTask.Field()
    create_comment = CreateComment.Field()


# Create schema
schema = graphene.Schema(query=Query, mutation=Mutation)