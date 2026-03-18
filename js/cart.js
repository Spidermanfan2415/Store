// cart.js — simple helpers for cart page
function getCart(){
  return JSON.parse(localStorage.getItem('shoply_cart')||'[]');
}
function clearCart(){
  localStorage.removeItem('shoply_cart');
}
// expose to window for quick manual use
window.ShoplyCart = { getCart, clearCart };
