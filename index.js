let editorInstance; // Declare a variable to store the editor instance

// Function to initialize the TinyMCE editor
function initEditor() {
  const textarea = document.getElementById('templateContent');

  // Destroy the previous instance if it exists
  if (editorInstance) {
    editorInstance.destroy();
  }

  // Initialize the editor
  tinymce.init({
    target: textarea,
    plugins: 'link table code',
    toolbar: 'undo redo | styleselect | bold italic | alignleft aligncenter alignright | table | link | code',
    menubar: false,
    statusbar: false,
    width: '100%',
    height: '75vh',
    content_css: '../vendor/tinymce/js/tinymce/skins/content/default/content.min.css',
    placeholder: 'Enter your content here...',
    setup: function (editor) {
      editorInstance = editor; // Assign the editor instance to the variable
    }
  });
}

function handleFormSubmit(event) {
  event.preventDefault();

  // Get the input values from the form
  const titleInput = document.getElementById('templateTitle');
  const contentInput = editorInstance.getContent(); // Get the content from the TinyMCE editor

  // Create a new template object
  const template = {
    title: titleInput.value,
    content: contentInput,
  };

  // Save the template only if both title and content are not empty
  if (template.title.trim() !== '' && template.content.trim() !== '') {
    // Save the template to the storage
    saveTemplate(template);

    // Reset the form inputs
    titleInput.value = '';
    editorInstance.setContent(''); // Clear the content of the TinyMCE editor
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
  const resultsContainer = document.getElementById('resultsContainer');

  const templateElement = document.createElement('div');
  templateElement.classList.add('entry');

  // Create the icon element
  const iconElement = document.createElement('div');
  iconElement.classList.add('icon');

  const descElement = document.createElement('div');
  descElement.classList.add('desc');

  const titleLabel = document.createElement('label');
  titleLabel.textContent = template.title;

  const contentSpan = document.createElement('span');
  contentSpan.textContent = sanitizeHTML(template.content);

  // Truncate the text and add an ellipsis after a certain number of characters
  const maxLength = 300; // Specify the maximum number of characters
  if (contentSpan.textContent.length > maxLength) {
    contentSpan.textContent = contentSpan.textContent.slice(0, maxLength) + '...';
  }

  descElement.appendChild(titleLabel);
  descElement.appendChild(contentSpan);

  // Create the badges container element
  const badgesContainer = document.createElement('div');
  badgesContainer.classList.add('badges-container');
  badgesContainer.classList.add('flex-row'); // Add flex-row class for horizontal alignment

  // Create the copy badge button element
  const copyBadgeButton = document.createElement('button');
  copyBadgeButton.classList.add('badge');
  copyBadgeButton.innerHTML = `<svg fill="#000" height="15" width="15" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M448 384H256c-35.3 0-64-28.7-64-64V64c0-35.3 28.7-64 64-64H396.1c12.7 0 24.9 5.1 33.9 14.1l67.9 67.9c9 9 14.1 21.2 14.1 33.9V320c0 35.3-28.7 64-64 64zM64 128h96v48H64c-8.8 0-16 7.2-16 16V448c0 8.8 7.2 16 16 16H256c8.8 0 16-7.2 16-16V416h48v32c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V192c0-35.3 28.7-64 64-64z"/></svg>`;

  copyBadgeButton.addEventListener('click', () => {
    copyTemplate(template.content);
  });

  // Create the edit badge button element
  const editBadgeButton = document.createElement('button');
  editBadgeButton.classList.add('badge');
  editBadgeButton.innerHTML = `<svg fill="#000" height="15" width="15" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z"/></svg>`;

  editBadgeButton.addEventListener('click', () => {
    // Handle edit functionality here
  });

  // Create the delete badge button element
  const deleteBadgeButton = document.createElement('button');
  deleteBadgeButton.classList.add('badge');
  deleteBadgeButton.innerHTML = `<svg fill="#000" height="15" width="15" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg>`;

  deleteBadgeButton.addEventListener('click', () => {
    // Remove the template element from the DOM
    templateElement.remove();
  });

  // Append the badges to the badges container
  badgesContainer.appendChild(copyBadgeButton);
  badgesContainer.appendChild(editBadgeButton);
  badgesContainer.appendChild(deleteBadgeButton);

  // Append the badges container to the template element
  templateElement.appendChild(iconElement);
  templateElement.appendChild(descElement);
  templateElement.appendChild(badgesContainer);

  // Append the template element to the results container
  resultsContainer.appendChild(templateElement);
}


// Function to sanitize HTML content
function sanitizeHTML(html) {
  const tempElement = document.createElement('div');
  tempElement.innerHTML = html;
  return tempElement.textContent || tempElement.innerText || '';
}

let templatesData = []; // Array to store the original templates data

function loadTemplatesFromJSON() {
  fetch('./templates/template.json')
    .then((response) => response.json())
    .then((data) => {
      templatesData = data; // Save the original templates data
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

function searchTemplates() {
  const searchInput = document.getElementById('searchInput');
  const searchTerm = searchInput.value.toLowerCase();

  // Get all the template elements
  const templateElements = document.getElementsByClassName('entry');

  // Loop through the template elements and toggle visibility based on the search term
  Array.from(templateElements).forEach((templateElement) => {
    const titleLabel = templateElement.querySelector('.desc label');
    const contentSpan = templateElement.querySelector('.desc span');

    const title = titleLabel.textContent.toLowerCase();
    const content = contentSpan.textContent.toLowerCase();

    if (title.includes(searchTerm) || content.includes(searchTerm)) {
      templateElement.style.display = 'flex'; // Show the template element
    } else {
      templateElement.style.display = 'none'; // Hide the template element
    }
  });
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

  // Create the description element
  const descElement = document.createElement('div');
  descElement.classList.add('desc');

  const titleLabel = document.createElement('label');
  titleLabel.textContent = template.title;

  const contentSpan = document.createElement('span');
  contentSpan.textContent = sanitizeHTML(template.content);

  // Truncate the text and add an ellipsis after a certain number of characters
  const maxLength = 300; // Specify the maximum number of characters
  if (contentSpan.textContent.length > maxLength) {
    contentSpan.textContent = contentSpan.textContent.slice(0, maxLength) + '...';
  }

  descElement.appendChild(titleLabel);
  descElement.appendChild(contentSpan);

  // Create the badges container element
  const badgesContainer = document.createElement('div');
  badgesContainer.classList.add('badges-container');
  badgesContainer.classList.add('flex-row'); // Add flex-row class for horizontal alignment

  // Create the copy badge button element
  const copyBadgeButton = document.createElement('button');
  copyBadgeButton.classList.add('badge');
  copyBadgeButton.innerHTML = `<svg fill="#000" height="15" width="15" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M448 384H256c-35.3 0-64-28.7-64-64V64c0-35.3 28.7-64 64-64H396.1c12.7 0 24.9 5.1 33.9 14.1l67.9 67.9c9 9 14.1 21.2 14.1 33.9V320c0 35.3-28.7 64-64 64zM64 128h96v48H64c-8.8 0-16 7.2-16 16V448c0 8.8 7.2 16 16 16H256c8.8 0 16-7.2 16-16V416h48v32c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V192c0-35.3 28.7-64 64-64z"/></svg>`;

  copyBadgeButton.addEventListener('click', () => {
    copyTemplate(template.content);
  });

  // Create the edit badge button element
  const editBadgeButton = document.createElement('button');
  editBadgeButton.classList.add('badge');
  editBadgeButton.innerHTML = `<svg fill="#000" height="15" width="15" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z"/></svg>`;

  editBadgeButton.addEventListener('click', () => {
    // Handle edit functionality here
  });

  // Create the delete badge button element
  const deleteBadgeButton = document.createElement('button');
  deleteBadgeButton.classList.add('badge');
  deleteBadgeButton.innerHTML = `<svg fill="#000" height="15" width="15" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg>`;

  deleteBadgeButton.addEventListener('click', () => {
    // Remove the template element from the DOM
    templateElement.remove();
  });

  // Append the badges to the badges container
  badgesContainer.appendChild(copyBadgeButton);
  badgesContainer.appendChild(editBadgeButton);
  badgesContainer.appendChild(deleteBadgeButton);

  // Append the badges container to the template element
  templateElement.appendChild(iconElement);
  templateElement.appendChild(descElement);
  templateElement.appendChild(badgesContainer);

  // Append the template element to the results container
  resultsContainer.appendChild(templateElement);
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

document.addEventListener('DOMContentLoaded', () => {
  // Load templates from the JSON file and populate the results container
  loadTemplatesFromJSON();

  // Initialize the TinyMCE editor
  initEditor();

  // Add event listener to the form for template submission
  const templateForm = document.getElementById('templateForm');
  templateForm.addEventListener('submit', handleFormSubmit);

  // Add event listener to the "Display Clipboard" button
  const displayClipboardButton = document.getElementById('displayClipboardButton');
  displayClipboardButton.addEventListener('click', displayClipboardContent);

  // Add event listener to the search input
  const searchInput = document.getElementById('searchInput');
  searchInput.addEventListener('input', searchTemplates);
});


/*
code
<svg height="20" width="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M392.8 1.2c-17-4.9-34.7 5-39.6 22l-128 448c-4.9 17 5 34.7 22 39.6s34.7-5 39.6-22l128-448c4.9-17-5-34.7-22-39.6zm80.6 120.1c-12.5 12.5-12.5 32.8 0 45.3L562.7 256l-89.4 89.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l112-112c12.5-12.5 12.5-32.8 0-45.3l-112-112c-12.5-12.5-32.8-12.5-45.3 0zm-306.7 0c-12.5-12.5-32.8-12.5-45.3 0l-112 112c-12.5 12.5-12.5 32.8 0 45.3l112 112c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256l89.4-89.4c12.5-12.5 12.5-32.8 0-45.3z"/></svg>
envelope
<svg height="20" width="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M64 112c-8.8 0-16 7.2-16 16v22.1L220.5 291.7c20.7 17 50.4 17 71.1 0L464 150.1V128c0-8.8-7.2-16-16-16H64zM48 212.2V384c0 8.8 7.2 16 16 16H448c8.8 0 16-7.2 16-16V212.2L322 328.8c-38.4 31.5-93.7 31.5-132 0L48 212.2zM0 128C0 92.7 28.7 64 64 64H448c35.3 0 64 28.7 64 64V384c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128z"/></svg>
speech bubble
<svg height="20" width="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M123.6 391.3c12.9-9.4 29.6-11.8 44.6-6.4c26.5 9.6 56.2 15.1 87.8 15.1c124.7 0 208-80.5 208-160s-83.3-160-208-160S48 160.5 48 240c0 32 12.4 62.8 35.7 89.2c8.6 9.7 12.8 22.5 11.8 35.5c-1.4 18.1-5.7 34.7-11.3 49.4c17-7.9 31.1-16.7 39.4-22.7zM21.2 431.9c1.8-2.7 3.5-5.4 5.1-8.1c10-16.6 19.5-38.4 21.4-62.9C17.7 326.8 0 285.1 0 240C0 125.1 114.6 32 256 32s256 93.1 256 208s-114.6 208-256 208c-37.1 0-72.3-6.4-104.1-17.9c-11.9 8.7-31.3 20.6-54.3 30.6c-15.1 6.6-32.3 12.6-50.1 16.1c-.8 .2-1.6 .3-2.4 .5c-4.4 .8-8.7 1.5-13.2 1.9c-.2 0-.5 .1-.7 .1c-5.1 .5-10.2 .8-15.3 .8c-6.5 0-12.3-3.9-14.8-9.9c-2.5-6-1.1-12.8 3.4-17.4c4.1-4.2 7.8-8.7 11.3-13.5c1.7-2.3 3.3-4.6 4.8-6.9c.1-.2 .2-.3 .3-.5z"/></svg>
address book
<svg height="20" width="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M384 48c8.8 0 16 7.2 16 16V448c0 8.8-7.2 16-16 16H96c-8.8 0-16-7.2-16-16V64c0-8.8 7.2-16 16-16H384zM96 0C60.7 0 32 28.7 32 64V448c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V64c0-35.3-28.7-64-64-64H96zM240 256a64 64 0 1 0 0-128 64 64 0 1 0 0 128zm-32 32c-44.2 0-80 35.8-80 80c0 8.8 7.2 16 16 16H336c8.8 0 16-7.2 16-16c0-44.2-35.8-80-80-80H208zM512 80c0-8.8-7.2-16-16-16s-16 7.2-16 16v64c0 8.8 7.2 16 16 16s16-7.2 16-16V80zM496 192c-8.8 0-16 7.2-16 16v64c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm16 144c0-8.8-7.2-16-16-16s-16 7.2-16 16v64c0 8.8 7.2 16 16 16s16-7.2 16-16V336z"/></svg>
list
<svg height="20" width="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M64 144a48 48 0 1 0 0-96 48 48 0 1 0 0 96zM192 64c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zM64 464a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm48-208a48 48 0 1 0 -96 0 48 48 0 1 0 96 0z"/></svg>

warning
<svg height="20" width="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M256 32c14.2 0 27.3 7.5 34.5 19.8l216 368c7.3 12.4 7.3 27.7 .2 40.1S486.3 480 472 480H40c-14.3 0-27.6-7.7-34.7-20.1s-7-27.8 .2-40.1l216-368C228.7 39.5 241.8 32 256 32zm0 128c-13.3 0-24 10.7-24 24V296c0 13.3 10.7 24 24 24s24-10.7 24-24V184c0-13.3-10.7-24-24-24zm32 224a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z"/></svg>
exclamation
<svg height="20" width="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-384c13.3 0 24 10.7 24 24V264c0 13.3-10.7 24-24 24s-24-10.7-24-24V152c0-13.3 10.7-24 24-24zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"/></svg>
*/