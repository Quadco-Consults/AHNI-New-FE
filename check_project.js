const axios = require('axios');

const projectId = '962613ed-d960-4d3f-b0cf-1fff2574ac52';
const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;

async function fetchProject() {
  try {
    const response = await axios.get(
      `https://ahnibe.rexwift.org/api/v1/projects/${projectId}/`,
      {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      }
    );

    const project = response.data.data;

    console.log('\n=== PROJECT DETAILS ===\n');
    console.log('Title:', project.title || 'N/A');
    console.log('Project ID:', project.project_id || 'N/A');
    console.log('Status:', project.status || 'N/A');
    console.log('\n=== FINANCIAL INFO ===\n');
    console.log('Budget:', project.budget || 'N/A', project.currency || '');
    console.log('Total Obligation Amount:', project.total_obligation_amount || 'N/A');
    console.log('Currency:', project.currency || 'N/A');
    console.log('\n=== TIMELINE ===\n');
    console.log('Start Date:', project.start_date || 'N/A');
    console.log('End Date:', project.end_date || 'N/A');
    console.log('\n=== OTHER DETAILS ===\n');
    console.log('Goal:', project.goal ? project.goal.substring(0, 100) + '...' : 'N/A');
    console.log('Narrative:', project.narrative ? project.narrative.substring(0, 100) + '...' : 'N/A');
    console.log('Expected Results:', project.expected_results ? project.expected_results.substring(0, 100) + '...' : 'N/A');
    console.log('Location:', project.location?.map(l => l.name).join(', ') || 'N/A');
    console.log('Project Managers:', project.project_managers?.length || 0);
    console.log('Beneficiaries:', project.beneficiaries?.length || 0);
    console.log('Funding Sources:', project.funding_sources?.length || 0);
    console.log('Targets:', project.targets?.length || 0);

    console.log('\n=== FULL DATA STRUCTURE ===\n');
    console.log(JSON.stringify(project, null, 2));

  } catch (error) {
    console.error('Error fetching project:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

fetchProject();
