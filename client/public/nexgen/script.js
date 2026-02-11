const form = document.getElementById('submissionForm');
const submitBtn = document.getElementById('submitBtn');
const btnText = document.querySelector('.btn-text');
const loader = document.querySelector('.loader');
const toast = document.getElementById('statusMessage');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = {
        title: document.getElementById('title').value,
        email: document.getElementById('email').value,
        content: document.getElementById('content').value
    };

    const token = localStorage.getItem('form_token');

    // UI Loading State
    submitBtn.disabled = true;
    btnText.classList.add('hidden');
    loader.classList.remove('hidden');

    try {
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const response = await fetch(`${FORM_CONFIG.API_URL}/submissions`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (response.ok) {
            showToast('Transmission Successful', 'success');
            form.reset();
        } else {
            showToast(result.error || 'Transmission Failed', 'error');
        }
    } catch (error) {
        showToast('System Offline', 'error');
    } finally {
        submitBtn.disabled = false;
        btnText.classList.remove('hidden');
        loader.classList.add('hidden');
    }
});

function showToast(message, type) {
    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.classList.remove('hidden');

    setTimeout(() => {
        toast.classList.add('hidden');
    }, 4000);
}
