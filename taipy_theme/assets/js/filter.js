// Get all the filter filters and the list items
const filters = document.querySelectorAll('.tp-pills-filter input');
const lists = document.querySelectorAll('ul.tp-filtered');
const listItems = document.querySelectorAll('ul.tp-filtered li');
let activeFilters = [];

// Attach event listeners to the filters
filters.forEach(checkbox => {
  checkbox.addEventListener('change', filterItems);
});

// Handle the "All" filter
function handleAll(callback) {
  const newFilters = Array.from(filters)
    .filter(checkbox => checkbox.checked)
    .map(checkbox => checkbox.value);

  // If "all" is checked
  if ( newFilters.includes('all') ) {
      filters.forEach(checkbox => {
        const isFilterAll = checkbox.value === 'all';
        if (
          ( !activeFilters.includes('all') && !isFilterAll ) 
          || ( activeFilters.includes('all') && isFilterAll )
        ) {
          // If "all" wasn't checked before and gets checked, then uncheck every other filter    
          // OR If "all" was checked and another filter is checked, uncheck "all"
          checkbox.checked = false;
        }
      });
  } 
  else {
    // If no other checkbox is checked, check the "all" checkbox
    const otherFiltersChecked = newFilters.length > 0;
    document.getElementById('filter-all').checked = !otherFiltersChecked;
  }

  if (callback){
    return callback();
  }
}

// Apply filters (after "All" has been handled)
function applyFilters(callback) {
  activeFilters = Array.from(filters)
    .filter(checkbox => checkbox.checked)
    .map(checkbox => checkbox.value);

  listItems.forEach(item => {
    let itemKeywords = [];
    if ( item.hasAttribute('data-keywords') ){
      itemKeywords = item.getAttribute('data-keywords').split(' ');
    }
    const shouldBeDisplayed = activeFilters.includes('all') || itemKeywords.some(keyword => activeFilters.includes(keyword));
    item.classList.toggle('is-hidden', !shouldBeDisplayed);
  });
}

function handleEmptyList() {
  lists.forEach(list => {
    const emptyStateClassName = 'emptyState-message';
    const existingMessages = list.querySelectorAll('.' + emptyStateClassName);
    const hasExistingMessages = existingMessages.length > 0;
    let isEmpty = false;
    // Mark list as empty if all <li> have the "is-hidden" class, 
    // apart from the messages <li> that could already exist
    if ( 
      (!hasExistingMessages && list.querySelectorAll('li.is-hidden').length === list.childElementCount)
      || (hasExistingMessages && list.querySelectorAll('li.is-hidden').length === list.childElementCount - existingMessages.length)
    ){
      isEmpty = true;
    }

    // Add message if list is empty after filtering
    if (isEmpty && !hasExistingMessages){
      const emptyStateMessage = document.createElement('li');
      emptyStateMessage.className = emptyStateClassName;
      emptyStateMessage.innerHTML = `
        <p>No items match your filter criteria</p>
      `;
      list.appendChild(emptyStateMessage);
    } else if (!isEmpty && hasExistingMessages){
      // Remove existing message
      existingMessages.forEach(message => {
        list.removeChild(message);
      });
    }
  });  
}

// Final filtering sequence
function filterItems(){
  handleAll(applyFilters);
  handleEmptyList();
};

// Initially, call the filterItems function to show items based on the default checked filters
filterItems();