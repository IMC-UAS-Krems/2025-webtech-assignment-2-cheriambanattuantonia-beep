(function () {
  const cart = [];
  // shortcut DOM selectors (inspired by jQuery-style syntax,but
  // written manually)
  // DOM Manipulation inspired by common patterns in
  // youtube channel:Web Dev Simplified
    const $ = (s, r = document) => r.querySelector(s);
    const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
   
   
    //money formatting-standatd JS tofixed usage 8MDN number.tofixed
    //color formatting custom

    const money = v => `$${v.toFixed(2)}`;
   



  const cartBody=$('#cart-items');
  const elSubtotal=$('#cart-subtotal');
  const elDiscount=$('#cart-discount');
  const elTotal=$('#cart-total');
  const checkoutBtn=$('#checkout-btn');
  const checkoutSection=$('#checkout-section');
  const checkoutForm=$('#checkout-form');

//bootstrap modal elements
//source:bootstrap 5 modal documentation
  const thankyouModalEl=$('#thankYouModal');
  const modalMsg=$('#confirmation-message');
  const modalItems=$('#confirmation-items');
  const modalTotal=$('#confirmation-total');

  //escape HTML to prevent accidental HTML injection
  // pattern inspired by MDN :"safe string handling"
  // https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML#security_considerations

  function escapeHtml(s){
      return String(s)
      .replace(/&/g,"&amp;")
      .replace(/</g,"&lt;")
      .replace(/>/g,"&gt;");
  }
   
   
// youtube channel:Traversy Media
 //cart math:reduce()
        //Traversy Media "shopping Cart Project"
        //code explained "javascript shopping cart and 
        // MDN Array.reduce documentation"
    function calculateTotals(){
    const subtotal = cart.reduce((s, it) => s + it.qty * it.price, 0);
    const count = cart.reduce((s, it) => s + it.qty, 0);
    const discount = count >= 3 ? subtotal * 0.1 : 0;
    const total = subtotal - discount;
    return { subtotal, discount, total };
}

// Youtube channel:code explained
 //cart math:reduce()
function findItem(id){
    return cart.find(it=> String(it.id)===String(id));
  }

     function renderCart(){
        cartBody.innerHTML="";

        if(cart.length ===0){
            cartBody.innerHTML=` 
            <tr><td colspan="4" class="text-center text-muted small">Cart is empty</td></tr>
        `;
            }else{
            cart.forEach(item => {
                const tr = document.createElement("tr");
                tr.innerHTML=`
                <td>${escapeHtml(item.name)}</td>

                <td class="text-center">
                <div class="btn-group btn-group-sm">
                <button class="btn btn-outline-secondary dec" data-id="${item.id}">-</button>
                <span class="px-2">${item.qty}</span>
                <button class="btn btn-outline-secondary inc" data-id="${item.id}">+</button>
                </div>
                </td>

                <td class="text-end">${money(item.qty*item.price)}</td>
                
                <td class="text-end">
                <button class="btn btn-sm btn-outline-danger rem" data-id="${item.id}">&times;</button>
                </td>
                 `;
                 cartBody.appendChild(tr);
            });
        }
        
       
        const t = calculateTotals();
        elSubtotal.textContent=money(t.subtotal);
        elDiscount.textContent=money(t.discount);
        elTotal.textContent=money(t.total);
        checkoutBtn.disabled=cart.length===0;

// channel:GreatStack
//video topic:DOM JavaScript Button Click Events

        $$('.dec',cartBody).forEach(b=>
            b.onclick=()=> changeQty(b.dataset.id,-1));
        $$('.inc',cartBody).forEach(b=> 
            b.onclick=()=>changeQty(b.dataset.id,+1));
        $$('.rem',cartBody).forEach(b=> 
            b.onclick=() => removeFromCart(b.dataset.id)
        );
     }    
     
function addToCartFromButton(btn) {
    const id = btn.dataset.id;
    const name = btn.dataset.name;
    const price = parseFloat(btn.dataset.price);
   
    const existing=findItem(id);
    if(existing) existing.qty++;
    else cart.push({id,name,price,qty:1});

    renderCart();
}


function changeQty(id, amount) {
    const item = findItem(id);
    if (!item)return;
    item.qty +=amount;
    if(item.qty <=0)removeFromCart(id);
    else renderCart();
    }

function removeFromCart(id) {
    const index = cart.findIndex(it => String(it.id) === String(id));
    if (index > -1) cart.splice(index,1);
        renderCart();
}
 function initAddButtons(){
    $$('button.add-to-cart-btn').forEach(btn=>{
        btn.onclick=()=> addToCartFromButton(btn);
    });
}
   
// channel:Web Dev Simplified
//video:Smooth Scrolling Tutorial

function showCheckout(){
    checkoutSection.classList.remove('d-none');
    checkoutSection.scrollIntoView({behavior:'smooth'});
}


function validateCheckout(){
    if(!checkoutForm.checkValidity()){
        checkoutForm.classList.add('was-validated');
        return false;
}


const phone=$('#Phone');
if(phone && !/^[0-9+\-\s()]+$/.test(phone.value.trim())){
    phone.classList.add('is-invalid');
    phone.focus();
    return false;
}

phone.classList.remove('is-invalid');

return true;

}


function gatherDonor(){
    return{
        name:$('#fullName').value.trim(),
        email:$('#email').value.trim(),
        phone: $('#Phone').value.trim(),
        zip: $('#zip').value.trim(),
        address: $('#address').value.trim(),
        city:$('#city') ? $('#city').value.trim():""
    };
}

//confirmation modal
// uses bootstrap Modal API(official docs)
// DOM list creation based on Traversy Media examples

function showConfirmation(donor){
    const totals=calculateTotals();

    modalMsg.textContent= `Thank you, ${donor.name}!`;
        modalItems.innerHTML="";

        cart.forEach(item=>{
            const li = document.createElement("li");
            li.textContent=`${item.name} × ${item.qty} — ${money(item.qty * item.price)}`;
            modalItems.appendChild(li);
        });
        modalTotal.textContent=money(totals.total);

        new bootstrap.Modal(thankyouModalEl).show();

        cart.length=0;
        renderCart();
    }

function initCheckoutForm(){
    checkoutForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    if(!validateCheckout()) return;
    showConfirmation(gatherDonor());
    checkoutForm.reset();
    checkoutForm.classList.remove('was-validated');
    checkoutSection.classList.add('d-none');
});
}

// inti()-project initializer
//pattern used in many JS projects.
function init(){
    initAddButtons();
    checkoutBtn.onclick=()=>showCheckout();
    renderCart();
    initCheckoutForm();
}

document.addEventListener('DOMContentLoaded',init);


})();
