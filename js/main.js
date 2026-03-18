// main.js — small enhancements and UI helpers
document.addEventListener('DOMContentLoaded', function(){
  // set current year in footer
  var yearEl = document.getElementById('year');
  if(yearEl) yearEl.textContent = new Date().getFullYear();

  // update cart count from localStorage
  function updateCartCount(){
    var cart = JSON.parse(localStorage.getItem('shoply_cart')||'[]');
    var countEl = document.querySelector('.cart .count');
    if(countEl) countEl.textContent = cart.length;
  }
  updateCartCount();

  // delegate add to cart buttons (buttons with class .btn.buy)
  document.body.addEventListener('click', function(e){
    var btn = e.target.closest('.btn.buy');
    if(!btn) return;
    var card = btn.closest('.card');
    if(!card) return;
    var title = card.querySelector('.product-title')?.textContent?.trim()||'Product';
    var priceText = card.querySelector('.price')?.textContent?.trim()||'$0';
    // parse price simple
    var price = parseFloat(priceText.replace(/[^0-9.]/g,''))||0;
    var cart = JSON.parse(localStorage.getItem('shoply_cart')||'[]');
    cart.push({title:title,price:price,added:Date.now()});
    localStorage.setItem('shoply_cart', JSON.stringify(cart));
    updateCartCount();
    // small feedback
    btn.textContent = 'Added ✓';
    setTimeout(()=> btn.textContent='Add to cart',1200);
  });
});
