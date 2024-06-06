document.addEventListener('DOMContentLoaded', function () {
    const token = sessionStorage.getItem('token');
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
            displayUsername(data.account.username);
            fetchProducts('http://127.0.0.1:8084/cart/api/cart-items/')
                .then(items => displayProducts(items))
                .catch(error => console.error('Error fetching clothes:', error));
        })
        .catch(error => {
            console.error('There was a problem with your fetch operation:', error);
        });
});

function displayProducts(items) {
    const productList = document.getElementById('product-list');

    productList.innerHTML = '';
    let total = 0;
    let counter = 0;
    items.forEach(item => {
        if (item.user_id === currentUserId) {
            const productContainer = document.createElement('div');
            productContainer.classList.add('bg-white', 'shadow-lg', 'border', 'border-black', 'rounded-lg', 'overflow-hidden', 'm-4', 'flex', 'relative');

            const productImage = document.createElement('img');
            productImage.classList.add('w-72', 'h-80', 'p-3', 'object-contain');

            const contentWrapper = document.createElement('div');
            contentWrapper.classList.add('flex', 'flex-col', 'p-4');

            const productName = document.createElement('div');
            productName.classList.add('text-gray-800', 'text-2xl', 'font-semibold', 'mb-2');

            const productQuantity = document.createElement('div');
            productQuantity.classList.add('flex', 'mb-2');

            const decreaseButton = document.createElement('button');
            decreaseButton.textContent = '-';
            decreaseButton.classList.add('px-2', 'py-1', 'bg-gray-300', 'text-gray-800', 'font-semibold', 'rounded', 'focus:outline-none', 'hover:bg-gray-400', 'transition', 'duration-300', 'ease-in-out');

            const quantityDisplay = document.createElement('span');
            quantityDisplay.classList.add('px-2', 'py-1', 'text-gray-800', 'font-semibold');

            const increaseButton = document.createElement('button');
            increaseButton.textContent = '+';
            increaseButton.classList.add('px-2', 'py-1', 'bg-gray-300', 'text-gray-800', 'font-semibold', 'rounded', 'focus:outline-none', 'hover:bg-gray-400', 'transition', 'duration-300', 'ease-in-out');

            const productPrice = document.createElement('div');
            productPrice.classList.add('text-red-500', 'font-semibold', 'text-lg', 'absolute', 'top-0', 'right-0', 'p-4');

            const removeButton = document.createElement('button');
            removeButton.textContent = 'Remove';
            removeButton.classList.add('absolute', 'bottom-0', 'right-0', 'w-60', 'm-3', 'py-2', 'bg-blue-500', 'text-white', 'uppercase', 'font-semibold', 'tracking-wider', 'hover:bg-blue-600', 'focus:outline-none', 'focus:bg-blue-600', 'transition', 'duration-300', 'ease-in-out', 'rounded-lg');
            removeButton.addEventListener('click', () => {
                fetch(`http://127.0.0.1:8084/cart/api/cart-items/${item.id}/`, {
                    method: 'DELETE'
                }).then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    window.location.reload();
                })
                    .catch(error => console.error('There was an error deleting cart item:', error));
            });

            let type = '';
            switch (item.product_type) {
                case 1:
                    type = 'books';
                    break;
                case 2:
                    type = 'mobiles';
                    break;
                case 3:
                    type = 'clothes';
                    break;
            }
            fetchProducts(`http://127.0.0.1:8082/product/api/${type}/${item.product_id}/`)
                .then(product => {
                    productImage.src = product.image;
                    productName.textContent = product.name;
                    quantityDisplay.textContent = item.quantity;
                    let price;
                    price = formatPrice(item.quantity * product.price);
                    productPrice.textContent = `Price: ${price} VND`;
                    total += item.quantity * product.price;
                    counter++;
                    if (counter === items.length) {
                        displayTotal(formatPrice(total));
                    }
                    increaseButton.addEventListener('click', () => {
                        item.quantity++;
                        quantityDisplay.textContent = item.quantity;
                        price = formatPrice(item.quantity * product.price);
                        productPrice.textContent = `Price: ${price} VND`;
                        total += product.price;
                        displayTotal(formatPrice(total));
                        updateCart(item);
                    });
                    decreaseButton.addEventListener('click', () => {
                        if (item.quantity > 1) {
                            item.quantity--;
                            quantityDisplay.textContent = item.quantity;
                            price = formatPrice(item.quantity * product.price);
                            productPrice.textContent = `Price: ${price} VND`;
                            total -= product.price;
                            displayTotal(formatPrice(total));
                            updateCart(item);
                        }
                    });
                });

            productQuantity.appendChild(decreaseButton);
            productQuantity.appendChild(quantityDisplay);
            productQuantity.appendChild(increaseButton);

            contentWrapper.appendChild(productName);
            contentWrapper.appendChild(productQuantity);

            productContainer.appendChild(productImage);
            productContainer.appendChild(productPrice);
            productContainer.appendChild(removeButton);
            productContainer.appendChild(contentWrapper);

            productList.appendChild(productContainer);
        }
    });
}

function updateCart(item) {
    const requestOptions = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(item)
    };

    fetch(`http://127.0.0.1:8084/cart/api/cart-items/${item.id}/`, requestOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .catch(error => console.error('There was an error updating cart item:', error));
}

function displayTotal(total) {
    const totalMoney = document.getElementById('order-summary');
    totalMoney.innerHTML = '';
    const totalLabel = document.createElement('p');
    totalLabel.textContent = "TOTAL:";
    const totalNumber = document.createElement('p');
    totalNumber.textContent = total;
    totalMoney.appendChild(totalLabel);
    totalMoney.appendChild(totalNumber);
}
