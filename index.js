import toastr from 'toastr'; // If the import doesn't work, try using './node_modules/toastr/toastr.js' instead
import 'toastr/build/toastr.css';

toastr.options = {
  "closeButton": false,
  "debug": false,
  "newestOnTop": false,
  "progressBar": true,
  "positionClass": "toast-bottom-center",
  "preventDuplicates": false,
  "onclick": null,
  "showDuration": "300",
  "hideDuration": "1000",
  "timeOut": "5000",
  "extendedTimeOut": "1000",
  "showEasing": "swing",
  "hideEasing": "linear",
  "showMethod": "slideDown",
  "hideMethod": "fadeOut"
}

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

  const titleInput = document.getElementById('templateTitle');
  const contentInput = editorInstance.getContent();

  // Get the sanitizeHTML toggle input element
  const sanitizeHTMLToggle = document.getElementById('sanitizeHTML');

  // Check if the title and content fields are empty
  if (!titleInput.value.trim() && !contentInput.trim()) {
    toastr.error('Title and Content are required.');
  } else if (!titleInput.value.trim() || !contentInput.trim()) {
    // Show a warning toaster if either the title or content is empty
    toastr.warning('Please fill in both Title and Content fields.');
  } else {
    // Create a new template object
    const template = {
      title: titleInput.value,
      content: sanitizeHTMLToggle.checked ? sanitizeHTML(contentInput) : contentInput,
    };

    // Save the template to the server only if both title and content are not empty
    if (template.title.trim() !== '' && template.content.trim() !== '') {
      // Send the template data to the server
      fetch('http://localhost:3000/submit-template', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(template),
      })
        .then((response) => {
          if (response.ok) {
            // Clear the form inputs
            titleInput.value = '';
            editorInstance.setContent(''); // Clear the content of the TinyMCE editor

            // Fetch templates immediately after saving a new one
            fetchTemplates();

            // Show the success toast
            toastr.success('Template saved successfully.');
          } else {
            // Show the error toast
            toastr.error('Failed to submit template. Please try again.');
          }
        })
    }
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
    toastr.info('Template content copied to clipboard.');
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
  deleteBadgeButton.classList.add('badge', 'delete-button');
  deleteBadgeButton.innerHTML = `<svg fill="#000" height="15" width="15" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg>`;
  deleteBadgeButton.addEventListener('click', () => {
    // Check if the template is not default before deleting
    if (!template.is_default) {
      const title = templateElement.querySelector('.desc label').textContent;
      // Send a request to delete the template from the server
      fetch(`http://localhost:3000/delete-template/${template.id}`, {
        method: 'DELETE',
      })
        .then((response) => response.json())
        .then((data) => {
          console.log('Template deleted successfully:', data);
          templateElement.remove(); // Remove the template element from the DOM
          // Show the success toast
          toastr.success(`Template "${title}" deleted successfully.`);
        })
        .catch((error) => {
          console.error('Failed to delete template:', error);
          alert('Failed to delete template. Please try again.');
        });
    }
  });

  // Append the badges to the badges container
  badgesContainer.appendChild(copyBadgeButton);
  // Add the delete and edit badge button only if the template is not default
  if (!template.is_default) {
    badgesContainer.appendChild(editBadgeButton);
    badgesContainer.appendChild(deleteBadgeButton);
  }

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


// Function to display the fetched templates in the frontend
function displayTemplates(data) {
  const resultsContainer = document.getElementById('resultsContainer');

  // Clear the existing content in the results container
  resultsContainer.innerHTML = '';

  data.forEach((template) => {
    saveTemplate(template);
  });
}

// Function to fetch templates from the server
function fetchTemplates() {
  fetch('http://localhost:3000/get-templates') // Update the API endpoint to match the correct route in your server
    .then((response) => response.json())
    .then((data) => {
      console.log('Templates received:', data);
      displayTemplates(data); // Call your displayTemplates function to show the fetched templates
    })
    .catch((error) => {
      console.error('Failed to fetch templates:', error);
    });
}

document.addEventListener('DOMContentLoaded', () => {
  // Initialize the TinyMCE editor
  initEditor();

  // Add event listener to the form for template submission
  const templateForm = document.getElementById('templateForm');
  templateForm.addEventListener('submit', handleFormSubmit);

  // Add event listener to the search input
  const searchInput = document.getElementById('searchInput');
  searchInput.addEventListener('input', searchTemplates);

  // Add event listener to the delete badge button
  const resultsContainer = document.getElementById('resultsContainer');
  resultsContainer.addEventListener('click', (event) => {
    if (event.target.classList.contains('delete-button')) {
      const templateElement = event.target.closest('.entry');
      if (templateElement) {
        templateElement.remove(); // Remove the template element from the DOM
      }
    }
  });

  // Fetch templates when the DOM is loaded
  fetchTemplates();
});