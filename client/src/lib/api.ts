const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export async function fetchVulnerabilities(token: string) {
    const res = await fetch(`${API_URL}/vulnerabilities`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error(`Failed to fetch findings: ${res.status}`);
    return res.json();
}

export async function generateMockFindings(token: string) {
    const res = await fetch(`${API_URL}/vulnerabilities/generate-mock`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error(`Failed to generate findings: ${res.status}`);
    return res.json();
}

export async function createRemediationPlan(id: string, token: string) {
    const res = await fetch(`${API_URL}/remediation/${id}/plan`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error(`Failed to generate plan: ${res.status}`);
    return res.json();
}

export async function applyRemediation(id: string, token: string) {
    const res = await fetch(`${API_URL}/remediation/${id}/apply`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to apply remediation');
    return res.json();
}
const api = {
    fetchVulnerabilities,
    generateMockFindings,
    createRemediationPlan,
    applyRemediation
};

export default api;
