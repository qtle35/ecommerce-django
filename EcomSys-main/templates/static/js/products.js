document.addEventListener('DOMContentLoaded', function () {
    const token = sessionStorage.getItem('token');
    const type = sessionStorage.getItem('type');
    if (!token) {
        confirm("Vui lòng đăng nhập!")
        if (confirm) {
            window.location.href = "login.html";
        }
    }

    const decodeTokenUrl = 'http://127.0.0.1:8081/user/login/api/decode-token/';

    fetch(decodeTokenUrl, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            if (!response.ok) {
                console.log(response);
                alert("Vui lòng đăng nhập lại!")
                if (confirm) {
                    window.location.href = "login.html";
                }
            }
            return response.json();
        })
        .then(data => {
            currentUserId = data.id;
            productType = type;
            displayUsername(data.account.username);
            displayProductType(type);
            let productUrl = 'http://127.0.0.1:8082/product/api/' + type + '/';
            fetchProducts(productUrl)
                .then(products => displayProducts(products, 'product-section', 1))
                .catch(error => console.error('Error fetching books:', error));
        })
        .catch(error => {
            console.error('There was a problem with your fetch operation:', error);
        });
});

function displayProducts(products, sectionId, currentPage) {
    const productList = document.getElementById('product-list');
    const pagination = document.getElementById('pagination');

    productList.innerHTML = '';
    pagination.innerHTML = '';

    const itemsPerPage = 8;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    const paginatedProducts = products.slice(startIndex, endIndex);

    paginatedProducts.forEach(product => {
        const productContainer = document.createElement('div');
        productContainer.classList.add('w-60', 'bg-white', 'shadow-lg', 'border', 'border-black', 'rounded-lg', 'overflow-hidden', 'm-4', 'flex', 'flex-col');

        const contentWrapper = document.createElement('div');
        contentWrapper.classList.add('flex', 'flex-col', 'h-full', 'justify-between');

        const productImage = document.createElement('img');
        productImage.src = product.image;
        productImage.classList.add('w-72', 'h-80', 'p-3', 'object-contain');
        contentWrapper.appendChild(productImage);

        const productName = document.createElement('div');
        productName.textContent = product.name;
        productName.classList.add('px-4', 'py-2', 'text-gray-800', 'font-semibold');
        contentWrapper.appendChild(productName);

        const productPrice = document.createElement('div');
        let price = formatPrice(product.price);
        productPrice.textContent = `Price: ${price} VND`;
        productPrice.classList.add('px-4', 'py-2', 'text-red-500');
        contentWrapper.appendChild(productPrice);

        const addToCartButton = document.createElement('button');
        addToCartButton.textContent = 'Add to Cart';
        addToCartButton.classList.add('w-full', 'py-2', 'bg-blue-500', 'text-white', 'uppercase', 'font-semibold', 'tracking-wider', 'hover:bg-blue-600', 'focus:outline-none', 'focus:bg-blue-600', 'transition', 'duration-300', 'ease-in-out', 'rounded-b-lg');
        addToCartButton.addEventListener('click', () => {
            openPopup(product, productType);
        });

        productContainer.appendChild(contentWrapper);
        productContainer.appendChild(addToCartButton);

        productList.appendChild(productContainer);
    });

    const totalPages = Math.ceil(products.length / itemsPerPage);
    for (let i = 1; i <= totalPages; i++) {
        const pageItem = document.createElement('li');
        const pageLink = document.createElement('a');
        pageLink.href = `?page=${i}`;
        pageLink.textContent = i;
        pageLink.classList.add('px-3', 'py-2');
        if (i === currentPage) {
            pageLink.classList.add('bg-blue-500', 'text-white');
        } else {
            pageLink.classList.add('text-blue-500', 'hover:bg-blue-200');
        }
        pageLink.addEventListener('click', function (event) {
            event.preventDefault();
            displayProducts(products, 'product-section', i);
            window.history.pushState({}, '', `?page=${i}`);
        });
        pageItem.appendChild(pageLink);
        pagination.appendChild(pageItem);
    }
}

async function openPopup(product, productType) {
    switch (productType) {
        case "books":
            productType = 1;
            break;
        case "mobiles":
            productType = 2;
            break;
        case "clothes":
            productType = 3;
            break;
    }
    const popup = document.createElement('div');
    popup.classList.add('fixed', 'top-0', 'left-0', 'w-full', 'h-full', 'bg-black', 'bg-opacity-50', 'flex', 'justify-center', 'items-center', 'z-50');

    const popupContent = document.createElement('div');
    popupContent.classList.add('relative', 'flex', 'flex-row', 'bg-white', 'p-4', 'rounded-lg', 'shadow-lg', 'w-3/5', 'h-3/5');

    const productImage = document.createElement('img');
    productImage.src = product.image;
    productImage.classList.add('w-80', 'p-3', 'object-contain');
    popupContent.appendChild(productImage);

    const contentWrapper = document.createElement('div');
    contentWrapper.classList.add('flex', 'flex-col', 'h-full', 'mt-12', 'ml-5');

    const productName = document.createElement('div');
    productName.textContent = product.name;
    productName.classList.add('text-3xl', 'text-gray-800', 'font-semibold', 'mb-2');
    contentWrapper.appendChild(productName);

    if (productType === 1) {
        const productAuthor = document.createElement('div');
        const author = await getForeignKeyName(product.author, 'authors');
        productAuthor.textContent = `Author: ${author}`;
        productAuthor.classList.add('text-xl', 'text-gray-800', 'font-semibold', 'mb-2');
        contentWrapper.appendChild(productAuthor);

        const productPublisher = document.createElement('div');
        const publisher = await getForeignKeyName(product.publisher, 'publishers');
        productPublisher.textContent = `Publisher: ${publisher}`;
        productPublisher.classList.add('text-xl', 'text-gray-800', 'font-semibold', 'mb-2');
        contentWrapper.appendChild(productPublisher);

        const productCategories = document.createElement('div');
        const categoryNames = await getForeignKeyNames(product.categories, 'categories');
        const categoriesText = categoryNames.join(', ');
        productCategories.textContent = `Categories: ${categoriesText}`;
        productCategories.classList.add('text-xl', 'text-gray-800', 'font-semibold', 'mb-2');
        contentWrapper.appendChild(productCategories);

    } else if (productType === 2) {
        const productType = document.createElement('div');
        const type = await getForeignKeyName(product.type, 'mobiles-types');
        productType.textContent = `Type: ${type}`;
        productType.classList.add('text-xl', 'text-gray-800', 'font-semibold', 'mb-2');
        contentWrapper.appendChild(productType);

        const productProducer = document.createElement('div');
        productProducer.textContent = `Producer: ${product.producer}`;
        productProducer.classList.add('text-xl', 'text-gray-800', 'font-semibold', 'mb-2');
        contentWrapper.appendChild(productProducer);
    } else {
        const productStyle = document.createElement('div');
        const style = await getForeignKeyName(product.style, 'clothes-styles');
        productStyle.textContent = `Style: ${style}`;
        productStyle.classList.add('text-xl', 'text-gray-800', 'font-semibold', 'mb-2');
        contentWrapper.appendChild(productStyle);

        const productProducer = document.createElement('div');
        const producer = await getForeignKeyName(product.producer, 'clothes-producers');
        productProducer.textContent = `Producer: ${producer}`;
        productProducer.classList.add('text-xl', 'text-gray-800', 'font-semibold', 'mb-2');
        contentWrapper.appendChild(productProducer);
    }

    const productPrice = document.createElement('div');
    let price = formatPrice(product.price);
    productPrice.textContent = `Price: ${price} VND`;
    productPrice.classList.add('text-xl', 'text-red-500', 'font-semibold', 'mb-2');
    contentWrapper.appendChild(productPrice);

    let quantity = 1;
    const productQuantity = document.createElement('div');
    productQuantity.classList.add('text-xl', 'flex', 'flex-row', 'mb-2');

    const quantityLabel = document.createElement('span');
    quantityLabel.textContent = 'Quantity:';
    quantityLabel.classList.add('text-gray-800', 'font-semibold', 'mr-2');
    productQuantity.appendChild(quantityLabel);

    const decreaseButton = document.createElement('button');
    decreaseButton.textContent = '-';
    decreaseButton.classList.add('px-2', 'py-1', 'bg-gray-300', 'text-gray-800', 'font-semibold', 'rounded', 'focus:outline-none', 'hover:bg-gray-400', 'transition', 'duration-300', 'ease-in-out');

    const quantityDisplay = document.createElement('span');
    quantityDisplay.textContent = quantity;
    quantityDisplay.classList.add('px-2', 'py-1', 'text-gray-800', 'font-semibold', 'w-8', 'text-center');

    const increaseButton = document.createElement('button');
    increaseButton.textContent = '+';
    increaseButton.classList.add('px-2', 'py-1', 'bg-gray-300', 'text-gray-800', 'font-semibold', 'rounded', 'focus:outline-none', 'hover:bg-gray-400', 'transition', 'duration-300', 'ease-in-out');
    increaseButton.addEventListener('click', () => {
        quantity++;
        quantityDisplay.textContent = quantity;
    });
    decreaseButton.addEventListener('click', () => {
        if (quantity > 1) {
            quantity--;
            quantityDisplay.textContent = quantity;
        }
    });
    productQuantity.appendChild(decreaseButton);
    productQuantity.appendChild(quantityDisplay);
    productQuantity.appendChild(increaseButton);
    contentWrapper.appendChild(productQuantity);

    const addToCartButton = document.createElement('button');
    addToCartButton.textContent = 'Add to Cart';
    addToCartButton.classList.add('w-60', 'py-2', 'bg-blue-500', 'text-white', 'uppercase', 'font-semibold', 'tracking-wider', 'hover:bg-blue-600', 'focus:outline-none', 'focus:bg-blue-600', 'transition', 'duration-300', 'ease-in-out', 'rounded-lg');
    addToCartButton.addEventListener('click', () => {
        addToCart(product.id, currentUserId, productType, quantity);
        popup.remove();
    });
    contentWrapper.appendChild(addToCartButton);

    const closeButton = document.createElement('button');
    closeButton.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    closeButton.classList.add('absolute', 'top-0', 'right-0', 'mt-2', 'mr-2', 'text-red-600', 'font-semibold', 'focus:outline-none');
    closeButton.addEventListener('click', () => {
        popup.remove();
    });
    popupContent.appendChild(closeButton);
    popupContent.appendChild(contentWrapper);

    popup.appendChild(popupContent);
    document.body.appendChild(popup);
}

function addToCart(product_id, user_id, productType, quantity) {
    let formData = new FormData();
    formData.append('product_id', product_id);
    formData.append('user_id', user_id);
    formData.append('product_type', productType);
    formData.append('quantity', quantity);
    fetch('http://127.0.0.1:8084/cart/api/cart-items/', {
        method: 'POST',
        body: formData
    })
        .then(response => {
            if (response.ok) {
                console.log('Thêm mặt hàng thành công');
                window.location.href = "cart.html";
                return response.json();
            } else {
                return response.json().then(data => {
                    alert(data.error);
                });
            }
            throw new Error('Network response was not ok.');
        })
        .catch(error => {
            console.error('There was a problem with your fetch operation:', error);
        });
}

function displayProductType(type) {
    const capitalizedType = type.charAt(0).toUpperCase() + type.slice(1);
    const productTitle = document.getElementById('product-type');
    productTitle.textContent = capitalizedType;
}

function handleSearch() {
    const query = document.getElementById('product-searchbar').value;
    const type = sessionStorage.getItem('type');
    if (!query) {
        window.location.reload();
    }
    let product_type;
    switch (type) {
        case "books":
            product_type = 1;
            break;
        case "mobiles":
            product_type = 2;
            break;
        case "clothes":
            product_type = 3;
            break;
    }
    fetchProducts(`http://127.0.0.1:8083/search/?query=${query}&type=${product_type}`)
        .then(products => displayProducts(products, 'product-section', 1))
        .catch(error => console.error('Error fetching books:', error));
}

function handleSearchByImage() {
    let input = document.getElementById('image-input');
    const type = sessionStorage.getItem('type');
    let product_type;
    switch (type) {
        case "books":
            product_type = 1;
            break;
        case "mobiles":
            product_type = 2;
            break;
        case "clothes":
            product_type = 3;
            break;
    }
    input.onchange = function (e) {
        let file = e.target.files[0];
        let formData = new FormData();
        formData.append('image', file);
        formData.append('type', product_type);

        let promise = fetch('http://127.0.0.1:8083/search-by-image/', {
            method: 'POST',
            body: formData
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Network response was not ok.');
            })
            .then(data => {
                displayProducts(data, 'product-section', 1)
            })
            .catch(error => {
                console.error('There was a problem with your fetch operation:', error);
            });
    };
    input.click();
}