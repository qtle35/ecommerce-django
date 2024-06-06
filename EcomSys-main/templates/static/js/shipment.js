let is_staff, is_delivery;
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
            currentUsername = data.username;
            displayUsername(data.account.username);
            is_staff = data.is_staff;
            is_delivery = data.is_delivery_office;
            fetchProducts('http://127.0.0.1:8086/shipment/api/shipment-updates/')
                .then(orders => displayOrders(orders))
                .catch(error => console.error('Error fetching clothes:', error));
        })
        .catch(error => {
            console.error('There was a problem with your fetch operation:', error);
        });
});

function getProductList(products, productTypes) {
    const productList = document.createElement('ul');
    productList.classList.add('mb-4');

    products.forEach((product_id, index) => {
        let type = '';
        switch (productTypes[index]) {
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

        fetchProducts(`http://127.0.0.1:8082/product/api/${type}/${product_id}/`)
            .then(product => {
                const productItem = document.createElement('li');
                productItem.classList.add('text-gray-600', 'font-semibold');
                productItem.textContent = `Product: ${product.name}`;
                productList.appendChild(productItem);
            });
    });

    return productList;
}

function displayOrders(orders) {
    const orderList = document.getElementById('order-list');
    orderList.innerHTML = '';

    orders.forEach(order => {
        if (is_staff || is_delivery) {
            const orderContainer = document.createElement('div');
            orderContainer.classList.add('relative', 'bg-white', 'shadow-lg', 'rounded-lg', 'p-4', 'mb-4');

            const clientName = document.createElement('p');
            clientName.classList.add('text-gray-600', 'font-semibold', 'mb-2');
            clientName.textContent = `Name: ${order.client_name}`;
            orderContainer.appendChild(clientName);

            const mobileNumber = document.createElement('p');
            mobileNumber.classList.add('text-gray-600', 'font-semibold', 'mb-2');
            mobileNumber.textContent = `Mobile Number: ${order.mobile_number}`;
            orderContainer.appendChild(mobileNumber);

            const address = document.createElement('p');
            address.classList.add('text-gray-600', 'font-semibold', 'mb-2');
            address.textContent = `Address: ${order.address}`;
            orderContainer.appendChild(address);

            const productList = getProductList(order.products, order.products_type);
            orderContainer.appendChild(productList);

            const status = document.createElement('p');
            status.classList.add('text-red-600', 'font-semibold', 'mb-2');
            fetchProducts(`http://127.0.0.1:8086/shipment/api/shipment-status/`)
                .then(shipments => {
                    shipments.forEach(shipment => {
                        if (shipment.shipment === order.id) {
                            status.textContent = `Status: ${shipment.status}`;
                            const shipmentStatusId = shipment.id;

                            const buttonContainer = document.createElement('div');
                            buttonContainer.className = 'flex absolute right-0 top-0 bottom-0 my-auto mr-5';

                            if (is_staff) {
                                const deleteButton = document.createElement('button');
                                deleteButton.innerHTML = '<i class="fa-solid fa-xmark"></i>';
                                deleteButton.classList.add('text-2xl', 'text-red-600', 'font-bold', 'focus:outline-none', 'mr-8');
                                deleteButton.addEventListener('click', () => {
                                    deleteOrder(order.id, shipmentStatusId);
                                });
                                buttonContainer.appendChild(deleteButton);
                            }

                            const confirmButton = document.createElement('button');
                            confirmButton.innerHTML = '<i class="fa-solid fa-check"></i>';
                            confirmButton.classList.add('text-2xl', 'text-green-600', 'font-bold', 'focus:outline-none');
                            checkShipmentStatus(shipmentStatusId)
                                .then(isTransited => {
                                    if (isTransited) {
                                        confirmButton.disabled = true;
                                        confirmButton.classList.add('text-gray-500');
                                    }
                                });
                            confirmButton.addEventListener('click', () => {
                                confirmOrder(order.id, shipmentStatusId);
                            });
                            buttonContainer.appendChild(confirmButton);
                            orderContainer.appendChild(buttonContainer);
                        }
                    });
                });
            orderContainer.appendChild(status);
            orderList.appendChild(orderContainer);
        } else if (order.user_id === currentUserId) {
            const orderContainer = document.createElement('div');
            orderContainer.classList.add('bg-white', 'shadow-lg', 'rounded-lg', 'p-4', 'mb-4');

            const clientName = document.createElement('p');
            clientName.classList.add('text-gray-600', 'font-semibold', 'mb-2');
            clientName.textContent = `Name: ${order.client_name}`;
            orderContainer.appendChild(clientName);

            const mobileNumber = document.createElement('p');
            mobileNumber.classList.add('text-gray-600', 'font-semibold', 'mb-2');
            mobileNumber.textContent = `Mobile Number: ${order.mobile_number}`;
            orderContainer.appendChild(mobileNumber);

            const address = document.createElement('p');
            address.classList.add('text-gray-600', 'font-semibold', 'mb-2');
            address.textContent = `Address: ${order.address}`;
            orderContainer.appendChild(address);

            const productList = getProductList(order.products, order.products_type);
            orderContainer.appendChild(productList);

            const status = document.createElement('p');
            status.classList.add('text-red-600', 'font-semibold', 'mb-2');
            fetchProducts(`http://127.0.0.1:8086/shipment/api/shipment-status/`)
                .then(shipments => {
                    shipments.forEach(shipment => {
                        console.log(shipment, order.id)
                        if (shipment.shipment === order.id) {
                            status.textContent = `Status: ${shipment.status}`;
                        }
                    })
                });
            orderContainer.appendChild(status);
            orderList.appendChild(orderContainer);
        }
    });
}

function deleteOrder(shipmentUpdateId, shipmentStatusId) {
    console.log(shipmentUpdateId, shipmentStatusId);
    fetch(`http://127.0.0.1:8086/shipment/api/shipment-status/${shipmentStatusId}/`, {
        method: 'DELETE'
    }).then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        } else {
            fetch(`http://127.0.0.1:8086/shipment/api/shipment-updates/${shipmentUpdateId}/`, {
                method: 'DELETE'
            }).then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                } else {
                    window.location.reload();
                }
            })
                .catch(error => console.error('There was an error deleting cart item:', error));
        }
    })
        .catch(error => console.error('There was an error deleting cart item:', error));
}

function confirmOrder(shipmentUpdateId, shipmentStatusId) {
    let status;
    if (is_staff) {
        status = 'Transiting';
    } else if (is_delivery) {
        status = 'Transited';
    }
    fetch(`http://127.0.0.1:8086/shipment/api/shipment-status/${shipmentStatusId}/`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'shipment': shipmentUpdateId,
            'status': status
        })
    }).then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        } else {
            window.location.reload();
        }
    })
        .catch(error => console.error('There was an error deleting cart item:', error));
}

async function checkShipmentStatus(shipmentStatusId) {
    try {
        const response = await fetch(`http://127.0.0.1:8086/shipment/api/shipment-status/${shipmentStatusId}/`);
        const data = await response.json();
        return data.status === "Transited";
    } catch (error) {
        console.error("Error while fetching shipment status:", error);
        return false;
    }
}
