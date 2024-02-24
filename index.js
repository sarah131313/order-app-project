import { menuArray } from "./data.js"

//.................................................................

const menuListEL = document.getElementById("menu-list")
const orderListEl = document.getElementById("order-list")
const totalPriceEl = document.getElementById("total-price")
const completeOrderEL = document.getElementById("complete-order")
const paymentPartEl = document.getElementById("payment-part")


// Control the add icons............................................. 

document.addEventListener("click", function(e){
    if(e.target.dataset.plus){
        handlePlus(e.target.dataset.plus)
        
    }else if (e.target.dataset.remove){
        removeFood(e.target.dataset.remove)
        
    }
})

// Display payment modal when clicked to complete order button .............
completeOrderEL.addEventListener("click", function(){
    paymentPartEl.style.display = "block"
})

//Close payment modal when clicked X .........................................
document.getElementById("close-btn").addEventListener("click", function(){
    paymentPartEl.style.display = "none"
     
})

// FORM  .......................................................................
document.getElementById("final-payment").addEventListener("click", function(e){
    e.preventDefault()
    
    const paymentFormEl = document.getElementById("payment-form")
    const loginFormData = new FormData(paymentFormEl)
    const name = loginFormData.get("name")
    if(validateForm()){
    
        paymentPartEl.style.display = "none"
        
        document.getElementById("order-title").textContent = ""
        
        totalPriceEl.style.borderTop = ""
            
        totalPriceEl.innerHTML = ""
            
        completeOrderEL.innerHTML = ""
        
        orderListEl.innerHTML = `<div class="order-ready">Thanks, ${name}! Your order is on its way!</div> `
    }
    
})

// Form's conditions .......................................................

function validateForm() {
        const nameInput = document.getElementById("name");
        const cardInput = document.getElementById("card");
        const cvvInput = document.getElementById("cvv");

        if (nameInput.value.length < 2) {
            alert("Name must be at least 2 characters long.");
            return false; // Prevent form submission
        }

        if (!/^[A-Za-z\s]+$/.test(nameInput.value)) {
            alert("Name can only contain letters and spaces.");
            return false; // Prevent form submission
        }

        if (!/^\d{16}$/.test(cardInput.value)) {
            alert("Please enter a valid 16-digit card number.");
            return false; // Prevent form submission
        }

        if (!/^\d{3}$/.test(cvvInput.value)) {
            alert("Please enter a valid 3-digit CVV.");
            return false; // Prevent form submission
        }

        return true; // Allow form submission if all validations pass
    }
    
    
// Function to remove food item from the order list ......................................
function removeFood(nameRef) {
    const foodItems = document.querySelectorAll(".list-food")
    
    
    foodItems.forEach(food => {
        if (food.querySelector("h2[data-name]").dataset.name === nameRef  ) {
            
            food.remove()
            
            //Update the total Price 
            
            const priceEl = food.querySelector("h2:last-of-type")
            const price = parseFloat(priceEl.textContent.replace('$', ''))
            
            const totalPriceFoodEl = document.getElementById("total-price-value")
            let totalPrice = parseFloat(totalPriceFoodEl.textContent.replace('$', ''))
            
            totalPrice -= price; // Subtract the price of the removed item
            totalPriceFoodEl.textContent = `$${totalPrice.toFixed(2)}`
            
            
            
            
        }
       
        
    })
    
    //log out Your order list is empty when the order list is empty  
    if (foodItems.length === 1) {
        
        document.getElementById("order-title").textContent = ""
        
        totalPriceEl.style.borderTop = ""
        
        totalPriceEl.innerHTML = ""
        
        completeOrderEL.innerHTML = `<div id="order-empty">Your Order list is empty</div> `
     }
    
}



// Add food to order list...............................................
function handlePlus(foodId){
    
    const targetFoodObj = menuArray.filter(food =>
         food.id.toString() === foodId 
    )[0]
    
    let renderFood = ''
    const {name} = targetFoodObj
    let {price} =targetFoodObj
    
        
     // Check if the item does not already exist in the order list
        const existingItem = orderListEl.querySelector(`[data-name="${name}"]`);
        document.getElementById("order-title").textContent = "Your Order"
        
        if (!existingItem) {
            renderFood = `<div class="list-food">
                            
                            <h2 data-name="${name}">${name}<p class="remove" data-remove="${name}">remove</p></h2>
                            <h2>$${price}</h2>
                            
                        </div>`
            orderListEl.innerHTML += renderFood 
            
        } 
        
        else {
            const priceEl = existingItem.nextElementSibling; // Find the price element of the existing item
            const currentPrice = parseFloat(priceEl.textContent.replace('$', '')) // Extract the current price from the price element
            const updatedPrice = currentPrice + price // Calculate the updated price by adding the new price to the current price
            priceEl.textContent = `$${updatedPrice.toFixed(2)}` // Update the text content of the price element to display the updated price
        }
        
        const totalPrice = calculateTotalPrice()// Function to calculate the total price with 10% discount
        
        totalPriceEl.style.borderTop = "1px solid black"
        
        totalPriceEl.innerHTML = `<h2>Total Price<span>10% discount on orders over $50</span></h2>
                                  <h2 id="total-price-value">$${totalPrice.toFixed(2)}</h2>`
        
        completeOrderEL.innerHTML = `<button id="order-btn">Complete order</button>`

    
    
}


// Total Price with Discount of 10% ................................................
function calculateTotalPrice() {
    const foodItems = orderListEl.querySelectorAll(".list-food")
    let totalPrice = 0
    
    foodItems.forEach(item => {
        const priceEl = item.querySelector("h2:last-child")
        const price = parseFloat(priceEl.textContent.replace('$', ''))
        totalPrice += price
        
    })
    // Apply discount if total price is greater than $50
    if (totalPrice > 50) {
        const discount = totalPrice * 0.1 // 10% discount
        totalPrice -= discount // Apply the discount
    }

    return totalPrice

    
}



//Function to render the menuArray items on HTML menu list 
function renderList(Arr) {

    return Arr.map(food => {
        let renderHtml = ''
        const { name, ingredients, price, emoji, id } = food

        return renderHtml = `  <div class="menu">
                                    <div class="left-part">
                                        <div class="food-type">
                                            <h1 id="food-type">${emoji}</h1>
                                        </div>
                                        <div class="food-desc">
                                            <h2>${name}</h2>
                                            <p id="ingredients">${ingredients}</p>
                                            <h3>$${price}</h3>
                                        </div>
                                     </div>
                                    <div>
                                       <i class="fa-solid fa-circle-plus" 
                                       data-plus="${id}"
                                       ></i>
                                    </div>
                                    
                                   
                                </div>`
    }).join("")

    

}

function render(){
   menuListEL.innerHTML = renderList(menuArray)
}

render() 


