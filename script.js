let contacts = [];
let suggestions = [];
let currentEditId = null;

document.addEventListener('DOMContentLoaded', () => {
    fetch('contacts.json')
        .then(response => response.json())
        .then(data => {
            contacts = data;
            displayContacts(contacts);
        });
});

// Format phone number as xxxx xxxx
function formatPhoneNumber(phone) {
    return phone.replace(/(\d{4})(\d{4})/, '$1 $2');
}

// Display contacts
function displayContacts(contactList) {
    const contactListUl = document.getElementById('contactList');
    contactListUl.innerHTML = '';
    contactList.forEach(contact => {
        const li = document.createElement('li');
        li.innerHTML = `
            <strong>${contact.name}</strong><br>
            Keywords: ${contact.keywords.join(', ')}<br>
            Phone: <a href="tel:+852${contact.phone}">${formatPhoneNumber(contact.phone)}</a>
            <button onclick="openSuggestModal('edit', ${contact.id})"><i class="fas fa-edit"></i> Suggest Edit</button>
        `;
        contactListUl.appendChild(li);
    });
}

// Search contacts
function searchContacts() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const filtered = contacts.filter(contact => 
        contact.keywords.some(keyword => keyword.toLowerCase().includes(query)) ||
        contact.phone.includes(query.replace(/\s/g, ''))
    );
    displayContacts(filtered);
}

// Open suggestion modal
function openSuggestModal(mode, id = null) {
    const modal = document.getElementById('suggestModal');
    const form = document.getElementById('suggestForm');
    const title = document.getElementById('modalTitle');
    
    if (mode === 'new') {
        title.textContent = 'Suggest New Contact';
        form.reset();
        document.getElementById('suggestId').value = '';
    } else {
        title.textContent = 'Suggest Edit Contact';
        const contact = contacts.find(c => c.id === id);
        document.getElementById('suggestName').value = contact.name;
        document.getElementById('suggestKeywords').value = contact.keywords.join(', ');
        document.getElementById('suggestPhone').value = contact.phone;
        document.getElementById('suggestId').value = id;
    }
    
    modal.style.display = 'block';
}

// Close suggestion modal
function closeSuggestModal() {
    document.getElementById('suggestModal').style.display = 'none';
}

// Handle form submission
document.getElementById('suggestForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('suggestName').value;
    const keywords = document.getElementById('suggestKeywords').value.split(',').map(k => k.trim());
    const phone = document.getElementById('suggestPhone').value;
    const id = document.getElementById('suggestId').value;
    
    if (!/^\d{8}$/.test(phone)) {
        alert('Phone number must be 8 digits.');
        return;
    }
    
    suggestions.push({
        id: id ? parseInt(id) : Date.now(),
        name,
        keywords,
        phone,
        isEdit: !!id
    });
    
    localStorage.setItem('suggestions', JSON.stringify(suggestions));
    alert('Suggestion submitted for admin approval.');
    closeSuggestModal();
});

// Admin login
function loginAdmin() {
    const password = document.getElementById('adminPassword').value;
    if (password === 'Eduhk1234') {
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('adminContent').style.display = 'block';
        displaySuggestions();
    } else {
        alert('Incorrect password.');
    }
}

// Display suggestions in admin panel
function displaySuggestions() {
    const suggestionList = document.getElementById('suggestionList');
    suggestionList.innerHTML = '';
    suggestions = JSON.parse(localStorage.getItem('suggestions') || '[]');
    
    suggestions.forEach(suggestion => {
        const li = document.createElement('li');
        li.innerHTML = `
            <strong>${suggestion.name}</strong><br>
            Keywords: ${suggestion.keywords.join(', ')}<br>
            Phone: ${formatPhoneNumber(suggestion.phone)}<br>
            Type: ${suggestion.isEdit ? 'Edit' : 'New'}<br>
            <button onclick="approveSuggestion(${suggestion.id})"><i class="fas fa-check"></i> Approve</button>
            <button onclick="rejectSuggestion(${suggestion.id})"><i class="fas fa-times"></i> Reject</button>
        `;
        suggestionList.appendChild(li);
    });
}

// Approve suggestion
function approveSuggestion(id) {
    const suggestion = suggestions.find(s => s.id === id);
    if (suggestion.isEdit) {
        const contact = contacts.find(c => c.id === suggestion.id);
        if (contact) {
            contact.name = suggestion.name;
            contact.keywords = suggestion.keywords;
            contact.phone = suggestion.phone;
        }
    } else {
        contacts.push({
            id: suggestion.id,
            name: suggestion.name,
            keywords: suggestion.keywords,
            phone: suggestion.phone
        });
    }
    removeSuggestion(id);
    displayContacts(contacts);
    alert('Suggestion approved.');
}

// Reject suggestion
function rejectSuggestion(id) {
    removeSuggestion(id);
    alert('Suggestion rejected.');
}

// Remove suggestion
function removeSuggestion(id) {
    suggestions = suggestions.filter(s => s.id !== id);
    localStorage.setItem('suggestions', JSON.stringify(suggestions));
    displaySuggestions();
}