const accessToken = "7909ec52-e118-4e08-a3b9-c8bf8e5079f0";
const collectionsUrl = "https://api.raindrop.io/rest/v1/collections";
const drawer = document.getElementById('drawer');
const menuToggle = document.getElementById('menuToggle');
const categoryList = document.getElementById('categoryList');
const menuContent = document.getElementById('menuContent');
const body = document.body;

// Toggle mobile menu
menuToggle.addEventListener('click', () => {
    drawer.classList.toggle('translate-x-0');
    drawer.classList.toggle('-translate-x-full');
    body.classList.toggle('drawer-open');
});
// Close drawer when clicking overlay or close button
const closeDrawer = () => {
    drawer.classList.remove('translate-x-0');
    drawer.classList.add('-translate-x-full');
    body.classList.remove('drawer-open');
};

document.querySelector('.overlay').addEventListener('click', closeDrawer);
document.getElementById('close-button').addEventListener('click', closeDrawer);

// Fetch and render categories and items
async function fetchData() {
    try {
        const response = await fetch(collectionsUrl, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        const data = await response.json();
        const collections = data.items || [];

        // Sort collections by title
        collections.sort((a, b) => a.title.localeCompare(b.title));

        // Render categories in drawer
        categoryList.innerHTML = collections.map(collection => `
                <a href="#${collection._id}" 
                   class="category-link block px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                   data-category-id="${collection._id}">
                    ${collection.title}
                    <span class="text-gray-500 text-sm">(${collection.count})</span>
                </a>
            `).join('');

        // Fetch and render items for each category
        for (const collection of collections) {
            const itemsResponse = await fetch(
                `https://api.raindrop.io/rest/v1/raindrops/${collection._id}`,
                { headers: { Authorization: `Bearer ${accessToken}` } }
            );
            const itemsData = await itemsResponse.json();
            const items = itemsData.items || [];
            console.log(items);

            const categorySection = document.createElement('section');
            categorySection.id = collection._id;
            categorySection.innerHTML = `
                    <h2 class="text-2xl font-bold mb-4 pt-4">${collection.title}</h2>
                    <div class="space-y-4">
                        ${items.map(item => `
                            <article class="menu-item">
                                <div class="menu-item-image ${!item.cover ? 'placeholder-image' : ''}">
                                    ${item.cover
                    ? `<img src="${item.cover}" alt="${item.title}" class="menu-item-image">`
                    : `<svg class="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                           </svg>`
                }
                                </div>
                                <div class="menu-item-content">
                                    <div class="menu-item-header">
                                        <h3 class="menu-item-title">${item.title}</h3>
                                        <span class="menu-item-price">${item.excerpt ? item.excerpt : ''}₺</span>
                                    </div>
                                    <p class="menu-item-desc">${item.note ? item.note : ''}</p>
                                </div>
                            </article>
                        `).join('')}
                    </div>
                `;
            menuContent.appendChild(categorySection);
        }

        // Category highlighting and smooth scroll
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    document.querySelectorAll('.category-link').forEach(link => {
                        link.classList.toggle('active',
                            link.getAttribute('data-category-id') === entry.target.id);
                    });
                }
            });
        }, {
            root: null,
            rootMargin: '0px',
            threshold: 0.3
        });

        document.querySelectorAll('section').forEach(section => {
            observer.observe(section);
        });

        // Smooth scroll to category
        document.querySelectorAll('.category-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);
                targetSection.scrollIntoView({ behavior: 'smooth' });

                if (window.innerWidth < 1024) {
                    drawer.classList.remove('translate-x-0');
                    drawer.classList.add('-translate-x-full');
                    body.classList.remove('drawer-open');
                }
            });
        });

    } catch (error) {
        console.error('Error fetching data:', error);
        menuContent.innerHTML = '<p class="text-red-500">Failed to load menu items. Please try again later.</p>';
    }
}

fetchData();