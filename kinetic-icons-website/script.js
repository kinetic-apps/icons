// Global state
let allIcons = [];
let filteredIcons = [];
let currentVariant = 'line';
let currentSearchTerm = '';

// DOM elements
const searchInput = document.getElementById('search-input');
const clearSearchBtn = document.getElementById('clear-search');
const resultsCount = document.getElementById('results-count');
const iconsGrid = document.getElementById('icons-grid');
const loading = document.getElementById('loading');
const noResults = document.getElementById('no-results');
const lineToggle = document.getElementById('line-toggle');
const line2pxToggle = document.getElementById('line2px-toggle');
const solidToggle = document.getElementById('solid-toggle');
const modal = document.getElementById('icon-modal');
const modalClose = document.getElementById('modal-close');
const modalIconName = document.getElementById('modal-icon-name');
const modalIconDisplay = document.getElementById('modal-icon-display');
const modalVariants = document.getElementById('modal-variants');
const reactCode = document.getElementById('react-code');
const iconNameCode = document.getElementById('icon-name-code');
const toast = document.getElementById('toast');

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    if (typeof window.KINETIC_ICONS_FILES !== 'undefined') {
        allIcons = window.KINETIC_ICONS_FILES;
        filteredIcons = [...allIcons];
        
        // Update stats
        const lineCount = allIcons.filter(icon => icon.variants.line).length;
        const line2pxCount = allIcons.filter(icon => icon.variants.line2px).length;
        const solidCount = allIcons.filter(icon => icon.variants.solid).length;
        
        document.getElementById('total-icons').textContent = allIcons.length;
        document.getElementById('line-count').textContent = lineCount;
        document.getElementById('line2px-count').textContent = line2pxCount;
        document.getElementById('solid-count').textContent = solidCount;
        
        renderIcons();
        setupEventListeners();
        loading.style.display = 'none';
    } else {
        loading.textContent = 'Error loading icons data';
    }
});

// Event listeners
function setupEventListeners() {
    // Search functionality
    searchInput.addEventListener('input', handleSearch);
    clearSearchBtn.addEventListener('click', clearSearch);
    
    // Variant toggle
    lineToggle.addEventListener('click', () => setVariant('line'));
    line2pxToggle.addEventListener('click', () => setVariant('line2px'));
    solidToggle.addEventListener('click', () => setVariant('solid'));
    
    // Modal
    modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    
    // Copy buttons
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('copy-btn')) {
            handleCopy(e.target);
        }
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
        if (e.key === '/' && !modal.style.display.includes('block')) {
            e.preventDefault();
            searchInput.focus();
        }
    });
}

// Search functionality
function handleSearch(e) {
    currentSearchTerm = e.target.value.toLowerCase().trim();
    
    if (currentSearchTerm) {
        clearSearchBtn.style.display = 'block';
        filteredIcons = allIcons.filter(icon => 
            icon.fileName.toLowerCase().includes(currentSearchTerm) ||
            icon.displayName.toLowerCase().includes(currentSearchTerm)
        );
    } else {
        clearSearchBtn.style.display = 'none';
        filteredIcons = [...allIcons];
    }
    
    renderIcons();
    updateResultsCount();
}

function clearSearch() {
    searchInput.value = '';
    currentSearchTerm = '';
    clearSearchBtn.style.display = 'none';
    filteredIcons = [...allIcons];
    renderIcons();
    updateResultsCount();
    searchInput.focus();
}

function updateResultsCount() {
    const count = filteredIcons.length;
    const searchText = currentSearchTerm ? ` for "${currentSearchTerm}"` : '';
    resultsCount.textContent = `${count} icon${count !== 1 ? 's' : ''}${searchText}`;
}

// Variant functionality
function setVariant(variant) {
    currentVariant = variant;
    
    // Update button states
    lineToggle.classList.toggle('active', variant === 'line');
    line2pxToggle.classList.toggle('active', variant === 'line2px');
    solidToggle.classList.toggle('active', variant === 'solid');
    
    renderIcons();
}

// Render icons
function renderIcons() {
    // Filter icons that have the current variant
    const iconsToShow = filteredIcons.filter(icon => {
        return icon.variants[currentVariant];
    });
    
    if (iconsToShow.length === 0) {
        iconsGrid.style.display = 'none';
        noResults.style.display = 'block';
        return;
    }
    
    iconsGrid.style.display = 'grid';
    noResults.style.display = 'none';
    
    iconsGrid.innerHTML = iconsToShow.map(icon => createIconElement(icon)).join('');
    
    // Load all SVGs after rendering
    loadAllSVGs();
}

function createIconElement(icon) {
    const hasLine = icon.variants.line;
    const hasLine2px = icon.variants.line2px;
    const hasSolid = icon.variants.solid;
    
    return `
        <div class="icon-item" onclick="openModal('${icon.fileName}')" data-icon="${icon.fileName}">
            <div class="variant-badges">
                <div class="variant-badge ${hasLine ? 'available' : ''}" title="Line 1.5px variant"></div>
                <div class="variant-badge ${hasLine2px ? 'available' : ''}" title="Line 2px variant"></div>
                <div class="variant-badge ${hasSolid ? 'available' : ''}" title="Solid variant"></div>
            </div>
            <div class="icon-display">
                ${createIconSVG(icon.fileName, currentVariant)}
            </div>
            <div class="icon-name">${icon.displayName}</div>
        </div>
    `;
}

// Create icon SVG by loading actual SVG files
function createIconSVG(fileName, variant) {
    // fileName is already the correct file name (e.g., "arrow-up", "battery-charging-01")
    
    // Determine the path based on variant (now within the website folder)
    let svgPath;
    if (variant === 'line') {
        svgPath = `icons/Line/1.5px/${fileName}.svg`;
    } else if (variant === 'line2px') {
        svgPath = `icons/Line/2px/${fileName}.svg`;
    } else {
        svgPath = `icons/Solid/${fileName}.svg`;
    }
    
    // Create a container with the SVG path as data attribute
    // We'll load the actual SVG content asynchronously
    return `<div class="svg-container" data-svg-path="${svgPath}" data-icon-name="${fileName}" data-variant="${variant}"></div>`;
}

// Load SVG content for all visible icons
async function loadAllSVGs() {
    const svgContainers = document.querySelectorAll('.svg-container');
    
    svgContainers.forEach(async (container) => {
        const svgPath = container.getAttribute('data-svg-path');
        const iconName = container.getAttribute('data-icon-name');
        const variant = container.getAttribute('data-variant');
        
        try {
            const response = await fetch(svgPath);
            if (response.ok) {
                let svgContent = await response.text();
                
                // Parse the SVG and set proper attributes
                const parser = new DOMParser();
                const svgDoc = parser.parseFromString(svgContent, 'image/svg+xml');
                const svgElement = svgDoc.querySelector('svg');
                
                if (svgElement) {
                    // Set consistent size
                    svgElement.setAttribute('width', '48');
                    svgElement.setAttribute('height', '48');
                    
                    // Ensure proper stroke/fill based on variant
                    if (variant === 'line' || variant === 'line2px') {
                        svgElement.setAttribute('stroke', 'currentColor');
                        svgElement.setAttribute('fill', 'none');
                    } else {
                        svgElement.setAttribute('fill', 'currentColor');
                        svgElement.setAttribute('stroke', 'none');
                    }
                    
                    container.innerHTML = svgElement.outerHTML;
                }
            } else {
                // Fallback if SVG not found
                container.innerHTML = `
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                        <text x="12" y="16" text-anchor="middle" font-size="8" fill="currentColor">${iconName.charAt(0).toUpperCase()}</text>
                    </svg>
                `;
            }
        } catch (error) {
            console.error(`Failed to load SVG for ${iconName}:`, error);
            // Fallback on error
            container.innerHTML = `
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <text x="12" y="16" text-anchor="middle" font-size="8" fill="currentColor">${iconName.charAt(0).toUpperCase()}</text>
                </svg>
            `;
        }
    });
}

// Modal functionality
function openModal(fileName) {
    const icon = allIcons.find(i => i.fileName === fileName);
    if (!icon) return;
    
    modalIconName.textContent = icon.displayName;
    modalIconDisplay.innerHTML = createIconSVG(fileName, currentVariant);
    
    // Load the SVG in the modal
    setTimeout(() => {
        const modalSvgContainer = modalIconDisplay.querySelector('.svg-container');
        if (modalSvgContainer) {
            loadSingleSVG(modalSvgContainer);
        }
    }, 0);
    
    // Update variants
    modalVariants.innerHTML = `
        <div class="variant-badge ${icon.variants.line ? 'available' : ''}">
            Line 1.5px ${icon.variants.line ? '✓' : '✗'}
        </div>
        <div class="variant-badge ${icon.variants.line2px ? 'available' : ''}">
            Line 2px ${icon.variants.line2px ? '✓' : '✗'}
        </div>
        <div class="variant-badge ${icon.variants.solid ? 'available' : ''}">
            Solid ${icon.variants.solid ? '✓' : '✗'}
        </div>
    `;
    
    // Update code examples - convert file name back to camelCase for React usage
    const camelCaseName = fileName.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase());
    reactCode.textContent = `<Icon name="${camelCaseName}" size="md" />`;
    iconNameCode.textContent = camelCaseName;
    
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// Load a single SVG
async function loadSingleSVG(container) {
    const svgPath = container.getAttribute('data-svg-path');
    const iconName = container.getAttribute('data-icon-name');
    const variant = container.getAttribute('data-variant');
    
    try {
        const response = await fetch(svgPath);
        if (response.ok) {
            let svgContent = await response.text();
            
            // Parse the SVG and set proper attributes
            const parser = new DOMParser();
            const svgDoc = parser.parseFromString(svgContent, 'image/svg+xml');
            const svgElement = svgDoc.querySelector('svg');
            
            if (svgElement) {
                // Set consistent size for modal (larger)
                svgElement.setAttribute('width', '80');
                svgElement.setAttribute('height', '80');
                
                // Ensure proper stroke/fill based on variant
                if (variant === 'line' || variant === 'line2px') {
                    svgElement.setAttribute('stroke', 'currentColor');
                    svgElement.setAttribute('fill', 'none');
                } else {
                    svgElement.setAttribute('fill', 'currentColor');
                    svgElement.setAttribute('stroke', 'none');
                }
                
                container.innerHTML = svgElement.outerHTML;
            }
        }
    } catch (error) {
        console.error(`Failed to load SVG for ${iconName}:`, error);
    }
}

function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Copy functionality
async function handleCopy(button) {
    const copyType = button.getAttribute('data-copy');
    let textToCopy = '';
    
    if (copyType === 'react') {
        textToCopy = reactCode.textContent;
    } else if (copyType === 'name') {
        textToCopy = iconNameCode.textContent;
    }
    
    try {
        await navigator.clipboard.writeText(textToCopy);
        showToast('Copied to clipboard!');
        
        // Visual feedback
        const originalText = button.textContent;
        button.textContent = 'Copied!';
        button.style.background = '#10b981';
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '';
        }, 1000);
        
    } catch (err) {
        console.error('Failed to copy:', err);
        showToast('Failed to copy');
    }
}

function showToast(message) {
    toast.textContent = message;
    toast.style.display = 'block';
    
    setTimeout(() => {
        toast.style.display = 'none';
    }, 3000);
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Performance optimization for search
const debouncedSearch = debounce(handleSearch, 300);
searchInput.removeEventListener('input', handleSearch);
searchInput.addEventListener('input', debouncedSearch); 