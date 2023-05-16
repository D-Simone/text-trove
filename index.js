// Function to handle form submission and saving a new template
function handleFormSubmit(event) {
    event.preventDefault();

    // Get the input values from the form
    const titleInput = document.getElementById('templateTitle');
    const contentInput = document.getElementById('templateContent');

    // Validate the inputs
    if (titleInput.value.trim() === '' || contentInput.value.trim() === '') {
        alert('Please enter a title and content for the template.');
        return;
    }

    // Create a new template object
    const template = {
        title: titleInput.value,
        content: contentInput.value,
    };

    // Save the template to the table and storage
    saveTemplate(template);

    // Clear the form inputs
    titleInput.value = '';
    contentInput.value = '';
}

// Function to copy the template content to the clipboard
function copyTemplate(content) {
    const textarea = document.createElement('textarea');
    textarea.value = content;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    alert('Template content copied to clipboard!');
}

// Function to save the template to the table and storage
function saveTemplate(template) {
    // Create a new row in the table
    const tableBody = document.querySelector('table tbody');
    const newRow = document.createElement('tr');

    // Create table cells for the template title, content, and actions
    const titleCell = document.createElement('td');
    titleCell.textContent = template.title;

    const contentCell = document.createElement('td');
    contentCell.textContent = template.content;

    const actionsCell = document.createElement('td');
    const copyButton = document.createElement('button');
    copyButton.textContent = 'Copy';
    copyButton.addEventListener('click', () => {
        copyTemplate(template.content);
    });
    actionsCell.appendChild(copyButton);

    newRow.appendChild(titleCell);
    newRow.appendChild(contentCell);
    newRow.appendChild(actionsCell);

    tableBody.appendChild(newRow);
}

// Function to populate the table with templates
function populateTable(templates) {
    const tableBody = document.querySelector('table tbody');

    templates.forEach((template) => {
        const newRow = document.createElement('tr');

        const titleCell = document.createElement('td');
        titleCell.textContent = template.title;

        const contentCell = document.createElement('td');
        contentCell.textContent = template.content;

        const actionsCell = document.createElement('td');
        const copyButton = document.createElement('button');
        copyButton.textContent = 'Copy';
        copyButton.addEventListener('click', () => {
            copyTemplate(template.content);
        });
        actionsCell.appendChild(copyButton);

        newRow.appendChild(titleCell);
        newRow.appendChild(contentCell);
        newRow.appendChild(actionsCell);

        tableBody.appendChild(newRow);
    });
}

// Function to load templates from template.json
function loadTemplatesFromJSON(callback) {
    fetch('./templates/template.json')
        .then((response) => response.json())
        .then((data) => callback(data))
        .catch((error) => console.error('Failed to load templates from JSON:', error));
}

// Load existing templates on page load
document.addEventListener('DOMContentLoaded', () => {


    loadTemplatesFromJSON((templates) => {
        populateTable(templates);
    });
});

// Add event listener to the form for template submission
const templateForm = document.getElementById('templateForm');
templateForm.addEventListener('submit', handleFormSubmit);

// Function to set the table to default state
function setToDefault() {
    loadTemplatesFromJSON((templates) => {
      const tableBody = document.querySelector('table tbody');
      tableBody.innerHTML = '';
      populateTable(templates);
    });
  }

// Add event listener to the "Set to Default" button
const setToDefaultButton = document.getElementById('setToDefaultButton');
setToDefaultButton.addEventListener('click', setToDefault);