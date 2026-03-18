// products.js — render product list from window.ShoplyProducts
document.addEventListener('DOMContentLoaded', function(){
  var grid = document.getElementById('products-grid') || document.getElementById('products');
  var products = window.ShoplyProducts || [];
  if(!grid) return;
  grid.innerHTML = '';
  products.forEach(function(p){
    var el = document.createElement('product-card');
    el.setAttribute('product-id', p.id);
    el.setAttribute('name', p.name);
    el.setAttribute('price', p.priceText || ('$'+(p.price||0)));
    el.setAttribute('rating', String(p.rating||0));
    el.setAttribute('meta', p.meta || '');
    if(p.image) el.setAttribute('image', p.image);
  if(p.thumbHeight) el.setAttribute('thumb-height', String(p.thumbHeight));
    grid.appendChild(el);
  });
});
