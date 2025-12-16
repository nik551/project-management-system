from django.test import TestCase
from graphene_django.utils.testing import GraphQLTestCase
from projects.models import Organization, Project, Task, TaskComment
import json

class OrganizationModelTest(TestCase):
    """Test Organization model"""
    
    def setUp(self):
        self.org = Organization.objects.create(
            name="Test Organization",
            slug="test-org",
            contact_email="test@example.com"
        )
    
    def test_organization_creation(self):
        """Test that organization is created correctly"""
        self.assertEqual(self.org.name, "Test Organization")
        self.assertEqual(self.org.slug, "test-org")
        self.assertEqual(self.org.contact_email, "test@example.com")
        self.assertIsNotNone(self.org.created_at)
    
    def test_organization_str(self):
        """Test string representation"""
        self.assertEqual(str(self.org), "Test Organization")


class ProjectModelTest(TestCase):
    """Test Project model"""
    
    def setUp(self):
        self.org = Organization.objects.create(
            name="Test Org",
            slug="test-org",
            contact_email="test@example.com"
        )
        self.project = Project.objects.create(
            organization=self.org,
            name="Test Project",
            description="Test Description",
            status="ACTIVE"
        )
    
    def test_project_creation(self):
        """Test that project is created correctly"""
        self.assertEqual(self.project.name, "Test Project")
        self.assertEqual(self.project.organization, self.org)
        self.assertEqual(self.project.status, "ACTIVE")
    
    def test_project_task_count(self):
        """Test project task counting"""
        # Create tasks
        Task.objects.create(
            project=self.project,
            title="Task 1",
            status="TODO",
            assignee_email="user@example.com"
        )
        Task.objects.create(
            project=self.project,
            title="Task 2",
            status="DONE",
            assignee_email="user@example.com"
        )
        Task.objects.create(
            project=self.project,
            title="Task 3",
            status="DONE",
            assignee_email="user@example.com"
        )
        
        # Test counts using query
        total_tasks = Task.objects.filter(project=self.project).count()
        completed_tasks = Task.objects.filter(project=self.project, status="DONE").count()
        
        self.assertEqual(total_tasks, 3)
        self.assertEqual(completed_tasks, 2)


class MultiTenancyTest(TestCase):
    """Test organization data isolation"""
    
    def setUp(self):
        # Create two organizations
        self.org1 = Organization.objects.create(
            name="Organization 1",
            slug="org-1",
            contact_email="org1@example.com"
        )
        self.org2 = Organization.objects.create(
            name="Organization 2",
            slug="org-2",
            contact_email="org2@example.com"
        )
        
        # Create projects for each org
        self.project1 = Project.objects.create(
            organization=self.org1,
            name="Org 1 Project",
            status="ACTIVE"
        )
        self.project2 = Project.objects.create(
            organization=self.org2,
            name="Org 2 Project",
            status="ACTIVE"
        )
    
    def test_organizations_are_isolated(self):
        """Test that organizations can't see each other's projects"""
        # Org 1 should only see its own project
        org1_projects = Project.objects.filter(organization=self.org1)
        self.assertEqual(org1_projects.count(), 1)
        self.assertEqual(org1_projects.first().name, "Org 1 Project")
        
        # Org 2 should only see its own project
        org2_projects = Project.objects.filter(organization=self.org2)
        self.assertEqual(org2_projects.count(), 1)
        self.assertEqual(org2_projects.first().name, "Org 2 Project")
    
    def test_tasks_are_isolated_by_project(self):
        """Test that tasks are isolated by project/organization"""
        # Create tasks for project 1
        task1 = Task.objects.create(
            project=self.project1,
            title="Task for Org 1",
            status="TODO",
            assignee_email="user@org1.com"
        )
        
        # Create tasks for project 2
        task2 = Task.objects.create(
            project=self.project2,
            title="Task for Org 2",
            status="TODO",
            assignee_email="user@org2.com"
        )
        
        # Verify isolation
        project1_tasks = Task.objects.filter(project=self.project1)
        self.assertEqual(project1_tasks.count(), 1)
        self.assertEqual(project1_tasks.first().title, "Task for Org 1")
        
        project2_tasks = Task.objects.filter(project=self.project2)
        self.assertEqual(project2_tasks.count(), 1)
        self.assertEqual(project2_tasks.first().title, "Task for Org 2")


class GraphQLQueryTest(GraphQLTestCase):
    """Test GraphQL queries"""
    
    GRAPHQL_URL = '/graphql/'
    
    def setUp(self):
        # Create test data
        self.org = Organization.objects.create(
            name="Test Org",
            slug="test-org",
            contact_email="test@example.com"
        )
        self.project = Project.objects.create(
            organization=self.org,
            name="Test Project",
            description="Test Description",
            status="ACTIVE"
        )
    
    def test_list_organizations(self):
        """Test listing all organizations"""
        response = self.query(
            '''
            query {
              allOrganizations {
                id
                name
                slug
              }
            }
            '''
        )
        
        self.assertResponseNoErrors(response)
        content = response.json()
        self.assertEqual(len(content['data']['allOrganizations']), 1)
        self.assertEqual(content['data']['allOrganizations'][0]['name'], "Test Org")
    
    def test_list_projects_by_organization(self):
        """Test listing projects for an organization"""
        response = self.query(
            '''
            query {
              projectsByOrganization(organizationSlug: "test-org") {
                id
                name
                status
                taskCount
                completedTasks
              }
            }
            '''
        )
        
        self.assertResponseNoErrors(response)
        content = response.json()
        projects = content['data']['projectsByOrganization']
        self.assertEqual(len(projects), 1)
        self.assertEqual(projects[0]['name'], "Test Project")
        self.assertEqual(projects[0]['status'], "ACTIVE")
        self.assertEqual(projects[0]['taskCount'], 0)
    
    def test_get_single_project(self):
        """Test getting a single project by ID"""
        response = self.query(
            f'''
            query {{
              project(id: "{self.project.id}") {{
                id
                name
                description
                status
              }}
            }}
            '''
        )
        
        self.assertResponseNoErrors(response)
        content = response.json()
        project = content['data']['project']
        self.assertEqual(project['name'], "Test Project")
        self.assertEqual(project['description'], "Test Description")


class GraphQLMutationTest(GraphQLTestCase):
    """Test GraphQL mutations"""
    
    GRAPHQL_URL = '/graphql/'
    
    def setUp(self):
        self.org = Organization.objects.create(
            name="Test Org",
            slug="test-org",
            contact_email="test@example.com"
        )
        self.project = Project.objects.create(
            organization=self.org,
            name="Test Project",
            status="ACTIVE"
        )
    
    def test_create_project(self):
        """Test creating a project"""
        response = self.query(
            '''
            mutation {
              createProject(
                organizationSlug: "test-org",
                name: "New Project",
                description: "New Description",
                status: "ACTIVE"
              ) {
                project {
                  id
                  name
                  description
                  status
                }
              }
            }
            '''
        )
        
        self.assertResponseNoErrors(response)
        content = response.json()
        project = content['data']['createProject']['project']
        self.assertEqual(project['name'], "New Project")
        self.assertEqual(project['description'], "New Description")
        
        # Verify project was created in database
        self.assertTrue(
            Project.objects.filter(name="New Project").exists()
        )
    
    def test_create_task(self):
        """Test creating a task"""
        response = self.query(
            f'''
            mutation {{
              createTask(
                projectId: "{self.project.id}",
                title: "New Task",
                description: "Task Description",
                status: "TODO",
                assigneeEmail: "user@example.com"
              ) {{
                task {{
                  id
                  title
                  description
                  status
                  assigneeEmail
                }}
              }}
            }}
            '''
        )
        
        self.assertResponseNoErrors(response)
        content = response.json()
        task = content['data']['createTask']['task']
        self.assertEqual(task['title'], "New Task")
        self.assertEqual(task['status'], "TODO")
        self.assertEqual(task['assigneeEmail'], "user@example.com")
        
        # Verify task was created in database
        self.assertTrue(
            Task.objects.filter(title="New Task").exists()
        )
    
    def test_update_task_status(self):
        """Test updating task status"""
        task = Task.objects.create(
            project=self.project,
            title="Test Task",
            status="TODO",
            assignee_email="user@example.com"
        )
        
        response = self.query(
            f'''
            mutation {{
              updateTask(
                id: "{task.id}",
                status: "DONE"
              ) {{
                task {{
                  id
                  status
                }}
              }}
            }}
            '''
        )
        
        self.assertResponseNoErrors(response)
        content = response.json()
        updated_task = content['data']['updateTask']['task']
        self.assertEqual(updated_task['status'], "DONE")
        
        # Verify in database
        task.refresh_from_db()
        self.assertEqual(task.status, "DONE")
    
    def test_create_comment(self):
        """Test creating a comment on a task"""
        task = Task.objects.create(
            project=self.project,
            title="Test Task",
            status="TODO",
            assignee_email="user@example.com"
        )
        
        response = self.query(
            f'''
            mutation {{
              createComment(
                taskId: "{task.id}",
                content: "This is a test comment",
                authorEmail: "author@example.com"
              ) {{
                comment {{
                  id
                  content
                  authorEmail
                }}
              }}
            }}
            '''
        )
        
        self.assertResponseNoErrors(response)
        content = response.json()
        comment = content['data']['createComment']['comment']
        self.assertEqual(comment['content'], "This is a test comment")
        self.assertEqual(comment['authorEmail'], "author@example.com")
        
        # Verify comment was created in database
        self.assertTrue(
            TaskComment.objects.filter(content="This is a test comment").exists()
        )