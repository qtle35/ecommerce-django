let cart_items = [];
let total = 0;
let products = [];
let product_types = [];
let my_bank = {
    BANK_ID: "vietinbank",
    ACCOUNT_NO: "104871920702",
    TEMPLATE: "compact2",
    AMOUNT: total,
    DESCRIPTION: "THANH TOAN DON HANG",
    ACCOUNT_NAME: "EcomSys"
}
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

    const itemNumber = document.getElementById('number-items');
    itemNumber.textContent = `You have ${items.length} items`;

    const totalParagraph = document.getElementById('total');

    items.forEach(item => {
        cart_items.push(item.id);
        const productContainer = document.createElement('div');
        productContainer.classList.add('bg-white', 'shadow-lg', 'border', 'border-black', 'rounded-lg', 'overflow-hidden', 'm-4', 'flex', 'relative');

        const productImage = document.createElement('img');
        productImage.classList.add('w-72', 'h-80', 'p-3', 'object-contain');

        const contentWrapper = document.createElement('div');
        contentWrapper.classList.add('flex', 'flex-col', 'p-4');

        const productName = document.createElement('div');
        productName.classList.add('text-gray-800', 'text-2xl', 'font-semibold', 'mb-2');

        const productQuantity = document.createElement('div');
        productQuantity.classList.add('text-gray-400', 'text-xl', 'font-semibold', 'mb-2');

        const productPrice = document.createElement('div');
        productPrice.classList.add('text-gray-800', 'font-semibold', 'text-xl', 'mb-2');

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
        products.push(item.product_id);
        product_types.push(item.product_type);
        fetchProducts(`http://127.0.0.1:8082/product/api/${type}/${item.product_id}/`)
            .then(product => {
                productImage.src = product.image;
                productName.textContent = product.name;
                productQuantity.textContent = `Quantity: ${item.quantity}`;
                let price;
                price = formatPrice(item.quantity * product.price);
                productPrice.textContent = `Subtotal: ${price} VND`;
                total += item.quantity * product.price;
                totalParagraph.textContent = `Total: ${formatPrice(total)} VND`;
                my_bank.AMOUNT = total;
            });
        contentWrapper.appendChild(productName);
        contentWrapper.appendChild(productQuantity);
        contentWrapper.appendChild(productPrice);

        productContainer.appendChild(productImage);
        productContainer.appendChild(contentWrapper);

        productList.appendChild(productContainer);
    });
}

function handleCheckout(name, mobileNumber, address) {
    const popup = document.createElement('div');
    popup.classList.add('fixed', 'top-0', 'left-0', 'w-full', 'h-full', 'bg-black', 'bg-opacity-50', 'flex', 'justify-center', 'items-center', 'z-50');

    const popupContent = document.createElement('div');
    popupContent.classList.add('relative', 'flex', 'flex-col', 'bg-white', 'p-4', 'rounded-lg', 'shadow-lg', 'w-3/5', 'h-fit', 'justify-center');

    const qrMessage = document.createElement('div');
    qrMessage.classList.add('text-center', 'text-gray-400', 'text-2xl', 'font-semibold', 'mb-2');
    qrMessage.textContent = 'Scan QR code to complete payment';
    popupContent.appendChild(qrMessage);

    const qrCode = document.createElement('img');
    qrCode.classList.add('self-center', 'w-3/5', 'h-3/5');
    qrCode.src = `https://img.vietqr.io/image/${my_bank.BANK_ID}-${my_bank.ACCOUNT_NO}-${my_bank.TEMPLATE}.png?amount=${my_bank.AMOUNT}&addInfo=${my_bank.DESCRIPTION}&accountName=${my_bank.ACCOUNT_NAME}`;
    popupContent.appendChild(qrCode);

    const closeButton = document.createElement('button');
    closeButton.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    closeButton.classList.add('absolute', 'top-0', 'right-0', 'mt-2', 'mr-2', 'text-xl', 'text-gray-400', 'font-semibold', 'focus:outline-none');
    closeButton.addEventListener('click', () => {
        popup.remove();
    });
    popupContent.appendChild(closeButton);

    popup.appendChild(popupContent);
    document.body.appendChild(popup);

    setInterval(() => {
        checkPaid(name, mobileNumber, address);
    }, 1000);
}

function takeShipmentInfo() {
    const popup = document.createElement('div');
    popup.classList.add('fixed', 'top-0', 'left-0', 'w-full', 'h-full', 'bg-black', 'bg-opacity-50', 'flex', 'justify-center', 'items-center', 'z-50');

    const popupContent = document.createElement('div');
    popupContent.classList.add('relative', 'flex', 'flex-col', 'bg-white', 'p-8', 'rounded-lg', 'shadow-lg', 'w-3/5', 'h-3/5');

    const message = document.createElement('div');
    message.classList.add('text-center', 'text-gray-400', 'text-2xl', 'font-semibold', 'mb-2');
    message.textContent = 'Nhập thông tin giao hàng';
    popupContent.appendChild(message);

    const nameLabel = document.createElement('label');
    nameLabel.textContent = 'Name:';
    nameLabel.className = 'w-80 mb-2 text-gray-800 font-semibold';
    const nameInput = document.createElement('input');
    nameInput.setAttribute('type', 'text');
    nameInput.className = 'w-full px-4 py-2 mt-1 mb-4 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500';
    nameLabel.appendChild(nameInput);
    popupContent.appendChild(nameLabel);

    const mobileLabel = document.createElement('label');
    mobileLabel.textContent = 'Mobile Number:';
    mobileLabel.className = 'w-80 mb-2 text-gray-800 font-semibold';
    const mobileInput = document.createElement('input');
    mobileInput.setAttribute('type', 'text');
    mobileInput.addEventListener('input', function (event) {
        const value = event.target.value;
        event.target.value = value.replace(/\D/g, '');
    });
    mobileInput.className = 'w-full px-4 py-2 mt-1 mb-4 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500';
    mobileLabel.appendChild(mobileInput);
    popupContent.appendChild(mobileLabel);

    const addressLabel = document.createElement('label');
    addressLabel.textContent = 'Address:';
    addressLabel.className = 'w-80 mb-2 text-gray-800 font-semibold';
    const addressInput = document.createElement('input');
    addressInput.setAttribute('type', 'text');
    addressInput.className = 'w-full px-4 py-2 mt-1 mb-4 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500';
    addressLabel.appendChild(addressInput);
    popupContent.appendChild(addressLabel);

    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'flex justify-center';

    const cancelButton = document.createElement('button');
    cancelButton.textContent = 'Cancel';
    cancelButton.className = 'mr-2 w-60 m-3 py-2 bg-gray-400 text-white uppercase font-semibold tracking-wider hover:bg-gray-500 focus:outline-none focus:bg-gray-500 transition duration-300 ease-in-out rounded-lg';
    cancelButton.onclick = function () {
        popup.remove();
    };
    buttonContainer.appendChild(cancelButton);

    const submitButton = document.createElement('button');
    submitButton.textContent = 'Next';
    submitButton.className = 'mr-2 w-60 m-3 py-2 bg-pink-400 text-white uppercase font-semibold tracking-wider hover:bg-pink-500 focus:outline-none focus:bg-pink-500 transition duration-300 ease-in-out rounded-lg';
    submitButton.addEventListener('click', function () {
        const name = nameInput.value;
        const mobileNumber = mobileInput.value;
        const address = addressInput.value;
        my_bank.DESCRIPTION = my_bank.DESCRIPTION + ` CUA ${mobileNumber}`;
        handleCheckout(name, mobileNumber, address);
    });
    buttonContainer.appendChild(submitButton);
    popupContent.appendChild(buttonContainer);

    popup.appendChild(popupContent);
    document.body.appendChild(popup);
}

function deleteCartItems(item) {
    fetch(`http://127.0.0.1:8084/cart/api/cart-items/${item}/`, {
        method: 'DELETE'
    }).then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
    })
        .catch(error => console.error('There was an error deleting cart item:', error));
}

function initPayment() {
    return fetch('http://127.0.0.1:8085/payment/api/init-payment/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'user_id': currentUserId,
            'username': currentUsername,
            'cart_items': cart_items,
            'total_price': total,
            'payment_mode': 'Banking',
        })
    });
}

function updatePaymentStatus(paymentId) {
    console.log(paymentId)
    return fetch('http://127.0.0.1:8085/payment/api/payment-status/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'payment': paymentId,
            'status': 1
        })
    });
}

function initShipment(paymentStatusId, name, mobileNumber, address) {
    fetch('http://127.0.0.1:8086/shipment/api/shipment-updates/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'payment_status_id': paymentStatusId,
            'user_id': currentUserId,
            'client_name': name,
            'mobile_number': mobileNumber,
            'address': address,
            'products': products,
            'products_type': product_types
        })
    })
        .then(response => {
            if (response.ok) {
                response.json().then(data => {
                    updateShipmentStatus(data.id)
                        .then(response => {
                            if (response.ok) {
                                window.location.href = 'shipment.html';
                            }
                        })
                })
            }
        })
        .catch(error => {
            console.error('There was a problem with your fetch operation:', error);
        });
}

function updateShipmentStatus(shipmentId) {
    return fetch('http://127.0.0.1:8086/shipment/api/shipment-status/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'shipment': shipmentId,
        })
    });
}

function handleUpdatePaymentStatusResponse(response, data, name, mobileNumber, address) {
    if (response.ok) {
        alert('Thanh toán thành công');
        data.cart_items.forEach(item => {
            deleteCartItems(item);
        });
        response.json().then(data => {
            initShipment(data.id, name, mobileNumber, address);
        })
    } else {
        return response.json().then(data => {
            console.log(data.detail);
            throw new Error('Failed to update payment status.');
        });
    }
}

async function checkPaid(name, mobileNumber, address) {
    try {
        const response = await fetch("https://script.googleusercontent.com/macros/echo?user_content_key=5wCXwSzx8Tv5wyIsC7PWlFiUjhu9YE5otQDcXGSjaMURRxooBJVuwS5dhTMYstKQvRWkGli2TWEJopt3bzKu76x5GfbBF7pBm5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnOYldl1fOWGaAP8x2Mrc0DMXgeiy1KGB6Q8xOkU-8nDDuDOw5r98iK2JetQy4zkebaugHKbfLwzIR0Q4TmKN3_vz0ib1IC3sm9z9Jw9Md8uu&lib=MGGgpe8YTQe5KoH6LauzIyHcXGD38jLy9");
        const data = await response.json();
        const lastPaid = data.data[data.data.length - 1];
        if (lastPaid["Giá trị"] >= my_bank.AMOUNT && lastPaid["Mô tả"].includes(my_bank.DESCRIPTION)) {
            console.log("success!");
            initPayment()
            .then(response => {
                return response.json().then(data =>
                    updatePaymentStatus(data.id)
                        .then(response => handleUpdatePaymentStatusResponse(response, data, name, mobileNumber, address))
                        .catch(error => console.error('There was a problem with your fetch operation:', error))
                )
            })
            .catch(error => console.error('There was a problem with your fetch operation:', error));
        }
    }
    catch {
        console.error("Có lỗi xảy ra!");
    }
}