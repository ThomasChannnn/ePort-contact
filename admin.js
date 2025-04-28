document.addEventListener('DOMContentLoaded', () => {
    displayPendingSuggestions();
});

function displayPendingSuggestions() {
    const pendingList = document.getElementById('pendingList');
    pendingList.innerHTML = '';
    
    pendingSuggestions.forEach(suggestion => {
        const div = document.createElement('div');
        div.className = 'contact-item';
        div.innerHTML = `
            <strong>${suggestion.name}</strong><br>
            Keywords: ${suggestion.keywords}<br>
            Phone: ${suggestion.phone.slice(0, 4)} ${suggestion.phone.slice(4)}<br>
            Type: ${suggestion.type.toUpperCase()}
            <div class="admin-actions">
                <button onclick="approveSuggestion(${suggestion.id})">Approve</button>
                <button onclick="rejectSuggestion(${suggestion.id})">Reject</button>
            </div>
        `;
        pendingList.appendChild(div);
    });
}

function approveSuggestion(suggestionId) {
    const suggestion = pendingSuggestions.find(s => s.id === suggestionId);
    
    if (suggestion.type === 'new') {
        contacts.push({
            id: contacts.length ? Math.max(...contacts.map(c => c.id)) + 1 : 1,
            name: suggestion.name,
            keywords: suggestion.keywords,
            phone: suggestion.phone
        });
    } else {
        const contactIndex = contacts.findIndex(c => c.id === suggestion.contactId);
        if (contactIndex !== -1) {
            contacts[contactIndex] = {
                id: suggestion.contactId,
                name: suggestion.name,
                keywords: suggestion.keywords,
                phone: suggestion.phone
            };
        }
    }
    
    rejectSuggestion(suggestionId);
}

function rejectSuggestion(suggestionId) {
    pendingSuggestions = pendingSuggestions.filter(s => s.id !== suggestionId);
    displayPendingSuggestions();
}