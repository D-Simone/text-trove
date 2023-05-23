// Function to handle form submission and saving a new template
function handleFormSubmit(event) {
  event.preventDefault();

  // Get the input values from the form
  const titleInput = document.getElementById('templateTitle');
  const contentInput = document.getElementById('templateContent');

  // Create a new template object
  const template = {
    title: titleInput.value,
    content: contentInput.value,
  };

  // Save the template only if both title and content are not empty
  if (template.title.trim() !== '' && template.content.trim() !== '') {
    // Save the template to the storage
    saveTemplate(template);

    // Reset the form inputs
    titleInput.value = '';
    contentInput.value = '';
  }
}

// Function to copy the template content to the clipboard
function copyTemplate(content) {
  navigator.clipboard.writeText(content)
    .then(() => {
      console.log('Template content copied to clipboard:', content);
    })
    .catch((error) => {
      console.error('Failed to copy template content to clipboard:', error);
    });
}

// Function to save the template to the storage
function saveTemplate(template) {
  // Add the template to the results container
  const resultsContainer = document.getElementById('resultsContainer');

  // Create the template element
  const templateElement = document.createElement('div');
  templateElement.classList.add('entry', 'custom'); // Add 'custom' class

  // Create the icon element
  const iconElement = document.createElement('div');
  iconElement.classList.add('icon');
  iconElement.innerHTML = `<svg fill="none" viewBox="0 0 24 24" height="20" width="20">
                              <path stroke-linejoin="round" stroke-linecap="round" stroke-width="2" stroke="#171718" d="M13 2H13.2727C16.5339 2 18.1645 2 19.2969 2.79784C19.6214 3.02643 19.9094 3.29752 20.1523 3.60289C21 4.66867 21 6.20336 21 9.27273V11.8182C21 14.7814 21 16.2629 20.5311 17.4462C19.7772 19.3486 18.1829 20.8491 16.1616 21.5586C14.9044 22 13.3302 22 10.1818 22C8.38275 22 7.48322 22 6.76478 21.7478C5.60979 21.3424 4.69875 20.4849 4.26796 19.3979C4 18.7217 4 17.8751 4 16.1818V12"></path>
                              <path stroke-linejoin="round" stroke-linecap="round" stroke-width="2" stroke="#171718" d="M21 12C21 13.8409 19.5076 15.3333 17.6667 15.3333C17.0009 15.3333 16.216 15.2167 15.5686 15.3901C14.9935 15.5442 14.5442 15.9935 14.3901 16.5686C14.2167 17.216 14.3333 18.0009 14.3333 18.6667C14.3333 20.5076 12.8409 22 11 22"></path>
                              <path stroke-linecap="round" stroke-width="2" stroke="#171718" d="M11 6L3 6M7 2V10"></path>
                            </svg>`;

  // Create the description element
  const descElement = document.createElement('div');
  descElement.classList.add('desc');

  const titleLabel = document.createElement('label');
  titleLabel.textContent = template.title;

  const contentSpan = document.createElement('span');
  contentSpan.textContent = template.content;

  descElement.appendChild(titleLabel);
  descElement.appendChild(contentSpan);

  // Create the badge button element
  const badgeButton = document.createElement('button');
  badgeButton.classList.add('badge');
  badgeButton.textContent = 'Copy';
  badgeButton.addEventListener('click', () => {
    copyTemplate(template.content);
  });

  // Append the elements to the template element
  templateElement.appendChild(iconElement);
  templateElement.appendChild(descElement);
  templateElement.appendChild(badgeButton);

  // Append the template element to the results container
  resultsContainer.appendChild(templateElement);
}

function loadTemplatesFromJSON() {
  fetch('./templates/template.json')
    .then((response) => response.json())
    .then((data) => {
      data.forEach((template) => {
        if (template.default) {
          // Add the template as a default template
          addDefaultTemplate(template);
        } else {
          // Add the template as a custom template
          saveTemplate(template);
        }
      });
    })
    .catch((error) => console.error('Failed to load templates from JSON:', error));
}

function addDefaultTemplate(template) {
  // Add the template to the results container
  const resultsContainer = document.getElementById('resultsContainer');

  // Create the template element
  const templateElement = document.createElement('div');
  templateElement.classList.add('entry');

  // Create the icon element
  const iconElement = document.createElement('div');
  iconElement.classList.add('icon');
  iconElement.innerHTML = `<svg fill="none" viewBox="0 0 24 24" height="20" width="20">
                              <path stroke-linejoin="round" stroke-linecap="round" stroke-width="2" stroke="#171718" d="M13 2H13.2727C16.5339 2 18.1645 2 19.2969 2.79784C19.6214 3.02643 19.9094 3.29752 20.1523 3.60289C21 4.66867 21 6.20336 21 9.27273V11.8182C21 14.7814 21 16.2629 20.5311 17.4462C19.7772 19.3486 18.1829 20.8491 16.1616 21.5586C14.9044 22 13.3302 22 10.1818 22C8.38275 22 7.48322 22 6.76478 21.7478C5.60979 21.3424 4.69875 20.4849 4.26796 19.3979C4 18.7217 4 17.8751 4 16.1818V12"></path>
                              <path stroke-linejoin="round" stroke-linecap="round" stroke-width="2" stroke="#171718" d="M21 12C21 13.8409 19.5076 15.3333 17.6667 15.3333C17.0009 15.3333 16.216 15.2167 15.5686 15.3901C14.9935 15.5442 14.5442 15.9935 14.3901 16.5686C14.2167 17.216 14.3333 18.0009 14.3333 18.6667C14.3333 20.5076 12.8409 22 11 22"></path>
                              <path stroke-linecap="round" stroke-width="2" stroke="#171718" d="M11 6L3 6M7 2V10"></path>
                            </svg>`;

  // Create the description element
  const descElement = document.createElement('div');
  descElement.classList.add('desc');

  const titleLabel = document.createElement('label');
  titleLabel.textContent = template.title;

  const contentSpan = document.createElement('span');
  contentSpan.textContent = template.content;

  descElement.appendChild(titleLabel);
  descElement.appendChild(contentSpan);

  // Create the badge button element
  const badgeButton = document.createElement('button');
  badgeButton.classList.add('badge');
  badgeButton.textContent = 'Copy';
  badgeButton.addEventListener('click', () => {
    copyTemplate(template.content);
  });

  // Append the elements to the template element
  templateElement.appendChild(iconElement);
  templateElement.appendChild(descElement);
  templateElement.appendChild(badgeButton);

  // Append the template element to the results container
  resultsContainer.appendChild(templateElement);
}

function handleSetToDefault() {
  const resultsContainer = document.getElementById('resultsContainer');

  // Get all the custom-made templates (entries with 'custom' class)
  const customEntries = resultsContainer.getElementsByClassName('custom');

  // Remove the custom-made templates
  while (customEntries.length > 0) {
    const entry = customEntries[0];
    entry.remove();
  }
}

// Load existing templates on page load
document.addEventListener('DOMContentLoaded', () => {
  // Load templates from the JSON file and populate the results container
  loadTemplatesFromJSON();

  // Add event listener to the form for template submission
  const templateForm = document.getElementById('templateForm');
  templateForm.addEventListener('submit', handleFormSubmit);

  // Add event listener to the "Set to Default" button
  const setToDefaultButton = document.getElementById('setToDefaultButton');
  setToDefaultButton.addEventListener('click', handleSetToDefault);
});

function handleSetToDefault() {
  const resultsContainer = document.getElementById('resultsContainer');

  // Get all the custom-made templates (entries with 'custom' class)
  const customEntries = resultsContainer.getElementsByClassName('custom');

  // Remove the custom-made templates
  while (customEntries.length > 0) {
    const entry = customEntries[0];
    entry.remove();
  }
}

// Function to display the current clipboard content
function displayClipboardContent() {
  navigator.clipboard.readText()
    .then((text) => {
      console.log('Current clipboard content:', text);
    })
    .catch((error) => {
      console.error('Failed to read clipboard content:', error);
    });
}

// Add event listener to the "Display Clipboard" button
const displayClipboardButton = document.getElementById('displayClipboardButton');
displayClipboardButton.addEventListener('click', displayClipboardContent);
