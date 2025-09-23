let playerGold = 5000
let cart = []
let items = []

const playerGoldEl = document.getElementById("player-gold")
const cartCountEl = document.getElementById("cart-count")
const cartBtn = document.getElementById("cart-btn")
const storePage = document.getElementById("store-page")
const checkoutPage = document.getElementById("checkout-page")
const confirmationPage = document.getElementById("confirmation-page")
const backToShopBtn = document.getElementById("back-to-shop-btn")
const completePurchaseBtn = document.getElementById("complete-purchase-btn")
const newOrderBtn = document.getElementById("new-order-btn")

async function loadItems() {
    try {
        const response = await fetch("assets/items.json")
        const data = await response.json()
        items = data.items
        renderItems()
    } catch (error) {
        console.error("Error loading items:", error)
    }
}

function renderItems() {
    const itemsContainer = document.getElementById("items-container")
    itemsContainer.innerHTML = ""

    items.forEach((item) => {
        const itemEl = document.createElement("div")
        itemEl.className = "rpg-card rounded-lg p-6 text-center"
        itemEl.innerHTML = `
            <div class="mb-4">
                <img src="${item.image}" alt="${item.name}" class="w-50 h-20 mx-auto object-cover rounded-lg">
            </div>
            <h3 class="fantasy-font text-xl font-bold text-slate-700 mb-2">${item.name}</h3>
            <p class="body-font text-slate-600 mb-4">${item.description}</p>
            <div class="gold-text text-2xl mb-4">${item.price}g</div>
            <button class="add-to-cart-btn w-full bg-rose-600 hover:bg-rose-700 text-white py-2 px-4 rounded-lg transition-colors body-font font-semibold"
                    data-item="${item.id}" data-name="${item.name}" data-price="${item.price}" data-image="${item.image}">
                Add to Cart
            </button>
        `
        itemsContainer.appendChild(itemEl)
    })

    const newAddToCartButtons = document.querySelectorAll(".add-to-cart-btn")
    newAddToCartButtons.forEach((btn) => {
        btn.addEventListener("click", addToCart)
    })
}

const init = async () => {
    updatePlayerGold()
    updateCartDisplay()
    await loadItems() // Load items from JSON

    cartBtn.addEventListener("click", showCheckout)
    backToShopBtn.addEventListener("click", showStore)
    completePurchaseBtn.addEventListener("click", completePurchase)
    newOrderBtn.addEventListener("click", showStore)
}

function addToCart(e) {
    const btn = e.target
    const item = {
        id: btn.dataset.item,
        name: btn.dataset.name,
        price: Number.parseInt(btn.dataset.price),
        image: btn.dataset.image, // Use image instead of icon
        quantity: 1,
    }

    const existingItem = cart.find((cartItem) => cartItem.id === item.id)

    if (existingItem) {
        existingItem.quantity += 1
    } else {
        cart.push(item)
    }

    updateCartDisplay()

    btn.textContent = "Added!"
    btn.classList.add("bg-green-600")
    btn.classList.remove("bg-rose-600")

    setTimeout(() => {
        btn.textContent = "Add to Cart"
        btn.classList.remove("bg-green-600")
        btn.classList.add("bg-rose-600")
    }, 1000)
}

function updateCartDisplay() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)

    if (totalItems > 0) {
        cartCountEl.textContent = totalItems
        cartCountEl.classList.remove("hidden")
    } else {
        cartCountEl.classList.add("hidden")
    }
}

function updatePlayerGold() {
    playerGoldEl.textContent = `${playerGold}g`
}

function showStore() {
    storePage.classList.remove("hidden")
    checkoutPage.classList.add("hidden")
    confirmationPage.classList.add("hidden")
}

function showCheckout() {
    if (cart.length === 0) {
        alert("Your cart is empty!")
        return
    }

    storePage.classList.add("hidden")
    checkoutPage.classList.remove("hidden")
    confirmationPage.classList.add("hidden")

    renderCartItems()
}

function renderCartItems() {
    const cartItemsEl = document.getElementById("cart-items")
    const cartTotalEl = document.getElementById("cart-total")

    cartItemsEl.innerHTML = ""
    let total = 0

    cart.forEach((item) => {
        const itemTotal = item.price * item.quantity
        total += itemTotal

        const itemEl = document.createElement("div")
        itemEl.className = "flex items-center justify-between p-4 bg-muted rounded-lg"
        itemEl.innerHTML = `
            <div class="flex items-center space-x-4">
                <img src="${item.image}" alt="${item.name}" class="w-12 h-12 object-cover rounded-lg">
                <div>
                    <div class="body-font font-semibold text-slate-700">${item.name}</div>
                    <div class="body-font text-sm text-slate-500">Quantity: ${item.quantity}</div>
                </div>
            </div>
            <div class="text-right">
                <div class="gold-text font-bold">${item.price}g each</div>
                <div class="body-font text-sm text-slate-600">Total: ${itemTotal}g</div>
            </div>
        `

        cartItemsEl.appendChild(itemEl)
    })

    cartTotalEl.textContent = `${total}g`
}

function completePurchase() {
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

    if (playerGold < total) {
        alert("Insufficient gold! You need more coins to complete this purchase.")
        return
    }

    const selectedPayment = document.querySelector('input[name="payment"]:checked')
    const paymentMethods = {
        "gold-coins": "Gold Coins 💰",
        "dragon-scale": "Dragon Scale 🐲",
        "magic-crystal": "Magic Crystal 💎",
        "ancient-rune": "Ancient Rune 📜",
    }

    playerGold -= total
    updatePlayerGold()

    showConfirmation(total, paymentMethods[selectedPayment.value])

    // clear cart
    cart = []
    updateCartDisplay()
}

function showConfirmation(total, paymentMethod) {
    storePage.classList.add("hidden")
    checkoutPage.classList.add("hidden")
    confirmationPage.classList.remove("hidden")

    // fill order summary
    const orderSummaryEl = document.getElementById("order-summary")
    const totalPaidEl = document.getElementById("total-paid")
    const paymentMethodEl = document.getElementById("payment-method")

    orderSummaryEl.innerHTML = ""

    cart.forEach((item) => {
        const itemEl = document.createElement("div")
        itemEl.className = "flex justify-between items-center"
        itemEl.innerHTML = `
            <span class="body-font">
                <img src="${item.image}" alt="${item.name}" class="w-6 h-6 inline-block mr-2 rounded">
                ${item.name} x${item.quantity}
            </span>
            <span class="gold-text font-semibold">${item.price * item.quantity}g</span>
        `
        orderSummaryEl.appendChild(itemEl)
    })

    totalPaidEl.textContent = `${total}g`
    paymentMethodEl.textContent = paymentMethod
}

init().then();
