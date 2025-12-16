import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client/react';
import { GET_ORGANIZATIONS, GET_PROJECTS_BY_ORG } from '../graphql/queries';
import type { GetOrganizationsData, GetProjectsByOrgData, Organization, Project } from '../types';
import ProjectList from '../components/features/ProjectList';
import CreateProjectModal from '../components/features/CreateProjectModal';

export default function Dashboard() {
  const [selectedOrg, setSelectedOrg] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: orgData, loading: orgLoading, error: orgError } = useQuery<GetOrganizationsData>(
    GET_ORGANIZATIONS
  );

  const { 
    data: projectData, 
    loading: projectLoading, 
    refetch 
  } = useQuery<GetProjectsByOrgData>(GET_PROJECTS_BY_ORG, {
    variables: { organizationSlug: selectedOrg },
    skip: !selectedOrg,
  });

  useEffect(() => {
    const organizations = orgData?.allOrganizations;
    
    if (organizations && organizations.length > 0 && !selectedOrg) {
      setSelectedOrg(organizations[0].slug);
    }
  }, [orgData, selectedOrg]);

  

  if (orgLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (orgError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading organizations</p>
          <p className="text-gray-600">{orgError.message}</p>
        </div>
      </div>
    );
  }

  const organizations: Organization[] = orgData?.allOrganizations || [];
  const projects: Project[] = projectData?.projectsByOrganization || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Project Management
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Manage your projects and tasks efficiently
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Organization Selector */}
              {organizations.length > 0 && (
                <select
                  value={selectedOrg}
                  onChange={(e) => setSelectedOrg(e.target.value)}
                  className="block w-64 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                >
                  {organizations.map((org) => (
                    <option key={org.id} value={org.slug}>
                      {org.name}
                    </option>
                  ))}
                </select>
              )}

              <button
                onClick={() => setIsModalOpen(true)}
                disabled={!selectedOrg}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                + New Project
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {projectLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <ProjectList projects={projects} />
        )}
      </main>

      {/* Create Project Modal */}
      {isModalOpen && (
        <CreateProjectModal
          organizationSlug={selectedOrg}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => {
            setIsModalOpen(false);
            refetch();
          }}
        />
      )}
    </div>
  );
}