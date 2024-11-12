// open modal
function openAddressModal() {
    const modal = new bootstrap.Modal(document.getElementById('addressModal'));
    modal.show();
}

// initial default shipping and billing address
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('billingAddressText').innerHTML = "C-290, 5th Down Street, Manchester, UK";
    document.getElementById('shippingAddressText').innerHTML = "E/90, 15th Downtown Street, South Bay, Manchester, UK 89021";
});

function setSelectedAddress() {
    const selectedBillingAddress = document.querySelector('input[name="billingAddress"]:checked');
    const selectedShippingAddress = document.querySelector('input[name="shippingAddress"]:checked');

    if (selectedShippingAddress && selectedBillingAddress) {
        document.getElementById('billingAddressText').innerHTML = selectedBillingAddress.value;
        document.getElementById('shippingAddressText').innerHTML = selectedShippingAddress.value;
        const modalElement = document.getElementById('addressModal');
        const modalInstance = bootstrap.Modal.getInstance(modalElement);
        if (modalInstance) {
            modalInstance.hide();
        }
    } else {
        alert("Please select an address type.");
    }
}

// add new address
let addressCount = 3;
function addNewAddress() {
    const flatNumberInput = document.getElementById('flatNumber');
    const streetNameInput = document.getElementById('streetName');
    const cityInput = document.getElementById('city');
    const countryInput = document.getElementById('country');
    const zipCodeInput = document.getElementById('zipCode');

    const flat = flatNumberInput.value;
    const street = streetNameInput.value;
    const city = cityInput.value;
    const country = countryInput.value;
    const zipCode = zipCodeInput.value;

    if (flat && street && city && country && zipCode) {
        const billingId = `billing${addressCount}`;
        const shippingId = `shipping${addressCount}`;

        const newAddress = `
         <div class="col-12 col-lg-6">
                <div class="card p-3 h-100">
                    <p>${flat}, ${street}, ${city}, ${country}, ${zipCode}</p>
                    <div class="d-flex gap-2">
                        <div class="d-flex align-items-center">
                            <input type="radio" name="billingAddress" id="${billingId}" value="${flat}, ${street}, ${city}, ${country}, ${zipCode}">
                            <label for="${billingId}" class="ms-2">Set Billing Address</label>
                        </div>
                    
                        <div class="d-flex align-items-center">
                            <input type="radio" name="shippingAddress" id="${shippingId}" value="${flat}, ${street}, ${city}, ${country}, ${zipCode}">
                            <label for="${shippingId}" class="ms-2">Set Shipping Address</label>
                        </div>
                    </div>
                </div>
        </div>`;
        document.querySelector('.modal-address').insertAdjacentHTML('beforeend', newAddress);
        flatNumberInput.value = '';
        streetNameInput.value = '';
        cityInput.value = '';
        countryInput.value = '';
        zipCodeInput.value = '';

        addressCount++;
    } else {
        alert("Fields are required.");
    }
}

let quantities = { 1: 1, 2: 1 };
function updateTotal() {
    const price1 = quantities[1] * 64;
    const price2 = quantities[2] * 46;
    const totalAmount = price1 + price2 + 10; // 10 as shipping charge 

    const totalElements = document.querySelectorAll('.totalAmount');
    totalElements.forEach(item => {
        item.innerText = totalAmount;
    });
}

function selectQuantity(quantity, price, itemId) {
    // console.log(quantities, itemId);
    quantities[itemId] = quantity;
    document.getElementById(`dropdownQuantity${itemId}`).textContent = quantity;
    updateTotal();
}

function removeItem(itemId) {
    const confirmed = confirm("Are you sure you want to remove this item from the cart?");
    if (confirmed) {
        document.getElementById(`item${itemId}`).style.display = 'none';
        quantities[itemId] = 0;
        updateTotal();
    }
}

// open paymentSuccess modal
function openPaymentSuccessModal() {
    const modalElement = document.getElementById('paymentSuccessModal');
    const modal = new bootstrap.Modal(modalElement);
    modal.show();

    setTimeout(() => {
        modal.hide();
    }, 2000);
}

document.addEventListener('DOMContentLoaded', function () {
    const selectedPaymentMethod = document.querySelectorAll('input[name="paymentMethod"]');

    function updatePaymentFields(selectedMethod) {
        document.getElementById('debitCardField').style.display = selectedMethod === 'debitCard' ? 'block' : 'none';
        document.getElementById('netBankingField').style.display = selectedMethod === 'netBanking' ? 'block' : 'none';
        document.getElementById('upiField').style.display = selectedMethod === 'googlePay' ? 'block' : 'none';
    }

    selectedPaymentMethod.forEach(item => {
        item.addEventListener('change', function () {
            updatePaymentFields(this.id);
        });
    });

    updatePaymentFields('debitCard');

    const cardNumber = document.getElementById('cardNumber');
    const validDate = document.getElementById('validDate');
    const cvv = document.getElementById('cvv');
    const paymentForm = document.getElementById('paymentForm');

    paymentForm.addEventListener('submit', function (event) {
        event.preventDefault();
        let isValid = true;
        const errors = [];

        if (cardNumber.value !== "1001200130014001") {
            errors.push("Invalid card number");
            isValid = false;
        }

        if (validDate.value !== "03/2023") {
            errors.push("Invalid date");
            isValid = false;
        }

        if (cvv.value !== "123") {
            errors.push("Invalid CVV");
            isValid = false;
        }

        const existingError = document.getElementById('formError');
        if (existingError) {
            existingError.remove();
        }

        if (!isValid) {
            const errorElement = document.createElement('p');
            errorElement.id = 'formError';
            errorElement.classList.add('text-danger', 'text-center');
            errorElement.innerHTML = errors.join("<br>");

            paymentForm.appendChild(errorElement);
        } else {
            openPaymentSuccessModal()
            cardNumber.value = '';
            validDate.value = '';
            cvv.value = '';

            quantities = { 1: 1, 2: 1 };
            document.getElementById(`dropdownQuantity1`).textContent = 1;
            document.getElementById(`dropdownQuantity2`).textContent = 1;
            updateTotal();
        }
    });
});

