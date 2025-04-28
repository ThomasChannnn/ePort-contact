let contacts = [
    { id: 1, name: "Education Department", keywords: "education, teaching, curriculum", phone: "12345678" },
    { id: 2, name: "IT Department", keywords: "technology, computers, network", phone: "87654321" }
];

let pendingSuggestions = [];

document.addEventListener('DOMContentLoaded', () => {
    displayContacts(contacts);
    document.getElementById('searchInput').addEventListener('input', searchContacts);
    document.getElementById('suggestionForm').addEventListener('submit', handleSuggestion);
});

function displayContacts(contactsToShow) {
    const contactList = document.getElementById('contactList');
    contactList.innerHTML = '';
    contactsToShow.forEach(contact => {
        const formattedPhone = `${contact.phone.slice(0, 4)} ${contact.phone.slice(4)}`;
        const div = document.createElement('div');
        div.className = 'contact-item';
        div.innerHTML = `
            <strong>${contact.name}</strong><br>
            Keywords: ${contact.keywords}<br>
            Phone: <a class="phone-link" href="tel:+852${contact.phone}">${formattedPhone}</a>
            <button onclick="showSuggestionForm('edit', ${contact.id})">Edit</button>
        `;
        contactList.appendChild(div);
    });
}

function searchContacts() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const filteredContacts = contacts.filter(contact => 
        contact.keywords.toLowerCase().includes(searchTerm) ||
        contact.phone.includes(searchTerm.replace(/\s/g, ''))
    );
    displayContacts(filteredContacts);
}

function showSuggestionForm(mode, contactId = null) {
    const modal = document.getElementById('suggestionModal');
    const form = document.getElementById('suggestionForm');
    const formTitle = document.getElementById('formTitle');
    
    modal.style.display = 'block';
    formTitle.textContent = mode === 'new' ? 'Suggest New Contact' : 'Suggest Edit';
    
    if (mode === 'edit') {
        const contact = contacts.find(c => c.id === contactId);
        document.getElementById('deptName').value = contact.name;
        document.getElementById('keywords').value = contact.keywords;
        document.getElementById('phone').value = contact.phone;
        document.getElementById('contactId').value = contactId;
    } else {
        form.reset();
        document.getElementById('contactId').value = '';
    }
}

function closeSuggestionForm() {
    document.getElementById('suggestionModal').style.display = 'none';
}

function handleSuggestion(e) {
    e.preventDefault();
    const name = document.getElementById('deptName').value;
    const keywords = document.getElementById('keywords').value;
    const phone = document.getElementById('phone').value;
    const contactId = document.getElementById('contactId').value;

    if (!/^\d{8}$/.test(phone)) {
        alert('Phone number must be 8 digits');
        return;
    }

    const suggestion = {
        id: Date.now(),
        name,
        keywords,
        phone,
        contactId: contactId ? parseInt(contactId) : null,
        type: contactId ? 'edit' : 'new'
    };

    pendingSuggestions.push(suggestion);
    closeSuggestionForm();
    alert('Suggestion submitted for admin approval');
}