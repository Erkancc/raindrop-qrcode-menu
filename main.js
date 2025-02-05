const accessToken = "7909ec52-e118-4e08-a3b9-c8bf8e5079f0";
const collectionsUrl = "https://api.raindrop.io/rest/v1/collections";
const categoryTabs = document.getElementById('categoryTabs').querySelector('ul');
const menuContent = document.getElementById('menuContent');
const cart = [];
const cartButton = document.getElementById('cartButton');
const cartPopup = document.getElementById('cartPopup');
const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const closeCartButton = document.getElementById('closeCartButton');
const shareButton = document.getElementById('shareButton');
const qrButton = document.getElementById('qrButton');
const qrModal = document.getElementById('qrModal');
const qrCodeContainer = document.getElementById('qrCode');
const closeQrButton = document.getElementById('closeQrButton');

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

        // Render categories in tabs
        categoryTabs.innerHTML = collections.map(collection => `
                <li>
                    <a href="#${collection._id}" 
                       class="category-tab block px-4 py-2"
                       data-category-id="${collection._id}">
                        ${collection.title}
                    </a>
                </li>
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
                                    <div class="quantity-controls">
                                        <button class="quantity-button" onclick="updateQuantity('${item.title}', '${item.excerpt}', -1)">-</button>
                                        <span id="quantity-${item.title}" class="quantity">0</span>
                                        <button class="quantity-button" onclick="updateQuantity('${item.title}', '${item.excerpt}', 1)">+</button>
                                    </div>
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
                    document.querySelectorAll('.category-tab').forEach(tab => {
                        tab.classList.toggle('active',
                            tab.getAttribute('data-category-id') === entry.target.id);
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
        document.querySelectorAll('.category-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = tab.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);
                targetSection.scrollIntoView({ behavior: 'smooth' });
            });
        });

    } catch (error) {
        console.error('Error fetching data:', error);
        menuContent.innerHTML = '<p class="text-red-500">Failed to load menu items. Please try again later.</p>';
    }
}

function updateQuantity(title, price, change) {
    const item = cart.find(i => i.title === title);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            cart.splice(cart.indexOf(item), 1);
        }
    } else if (change > 0) {
        cart.push({ title, price, quantity: change });
    }
    document.getElementById(`quantity-${title}`).textContent = item ? item.quantity : 0;
    updateCartCount();
}

function updateCartCount() {
    cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
}

cartButton.addEventListener('click', () => {
    cartPopup.classList.toggle('hidden');
    renderCartItems();
});

closeCartButton.addEventListener('click', () => {
    cartPopup.classList.add('hidden');
});

function renderCartItems() {
    cartItems.innerHTML = cart.map(item => `
        <li class="flex justify-between items-center">
            <span>${item.title} x ${item.quantity}</span>
            <span>${item.price}₺</span>
        </li>
    `).join('');
}

shareButton.addEventListener('click', () => {
    const cartItemsText = cart.map(item => `${item.title} x ${item.quantity} - ${item.price}₺`).join('\n');
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(cartItemsText)}`;
    window.open(whatsappUrl, '_blank');
});

qrButton.addEventListener('click', () => {
    const cartItemsText = cart.map(item => `${item.title} x ${item.quantity} - ${item.price}₺`).join('\n');
    qrCodeContainer.innerHTML = '';
    QRCode.toCanvas(qrCodeContainer, cartItemsText, function (error) {
        if (error) console.error(error);
        qrModal.classList.remove('hidden');
    });
});

closeQrButton.addEventListener('click', () => {
    qrModal.classList.add('hidden');
});

fetchData();