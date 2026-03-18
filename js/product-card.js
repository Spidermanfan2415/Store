// product-card.js — a reusable web component for product cards
class ProductCard extends HTMLElement {
  constructor(){
    super();
    this.attachShadow({mode:'open'});
    this.shadowRoot.innerHTML = `
      <style>
        :host{display:block}
        .card{background:var(--card,#0b1220);padding:12px;border-radius:12px;border:1px solid rgba(255,255,255,0.03);display:flex;flex-direction:column;gap:10px;min-height:260px}
  .media{height:110px;border-radius:8px;background:linear-gradient(180deg,#0b1220,#081224);display:flex;align-items:center;justify-content:center;overflow:hidden}
        img{width:100%;height:100%;object-fit:cover;display:block}
        .title{font-weight:700;font-size:15px}
        .meta{color:var(--muted,#9aa6bd);font-size:13px}
        .bottom{display:flex;align-items:center;gap:8px;margin-top:auto}
        .price{color:var(--accent,#4f46e5);font-weight:800}
        .btn{flex:1;padding:10px;border-radius:10px;border:none;cursor:pointer;background:var(--accent,#4f46e5);color:white;font-weight:600}
        .rating{display:flex;gap:3px;align-items:center}
        .star{color:gold;font-size:14px}
        .empty{color:rgba(255,255,255,0.12)}
      </style>
      <article class="card">
        <div class="media"><img part="image" alt="Product image"></div>
        <div>
          <div class="title" part="title"></div>
          <div class="meta" part="meta"></div>
        </div>
        <div class="bottom">
          <div>
            <div class="rating" part="rating"></div>
            <div class="price" part="price"></div>
          </div>
          <button class="btn" part="button">Add to cart</button>
        </div>
      </article>
    `;

    this.$img = this.shadowRoot.querySelector('img');
    this.$title = this.shadowRoot.querySelector('.title');
    this.$meta = this.shadowRoot.querySelector('.meta');
    this.$price = this.shadowRoot.querySelector('.price');
    this.$rating = this.shadowRoot.querySelector('.rating');
    this.$button = this.shadowRoot.querySelector('.btn');
  }

  static get observedAttributes(){ return ['name','price','rating','image','meta','thumb-height']; }

  attributeChangedCallback(n, o, v){ if(o===v) return; this.render(); }

  connectedCallback(){
    this.render();
    this.$button.addEventListener('click', ()=> this.addToCart());
  }

  render(){
    const name = this.getAttribute('name')||'Product';
    const price = this.getAttribute('price')||'$0';
    const rating = parseFloat(this.getAttribute('rating')||'0');
    const image = this.getAttribute('image')||'';
    const meta = this.getAttribute('meta')||'';
    const thumbHeight = this.getAttribute('thumb-height');

    this.$title.textContent = name;
    this.$meta.textContent = meta;
    this.$price.textContent = price;
  // set image and link wrapper
    const id = this.getAttribute('product-id') || this.slugify(name);
    const link = `product.html?id=${encodeURIComponent(id)}`;
    // Ensure the image element has a parent anchor in light DOM
    let parent = this.$img.parentElement;
    // create anchor wrapper if not present
    if(!parent || parent.tagName.toLowerCase() !== 'a'){
      const a = document.createElement('a');
      a.setAttribute('part','link');
      a.href = link;
      // move img into anchor
      parent.replaceWith(a);
      a.appendChild(this.$img);
      parent = a;
    }
    parent.href = link;
    // apply custom thumbnail height if provided
    if(thumbHeight){
      const media = this.shadowRoot.querySelector('.media');
      if(media) media.style.height = (isNaN(thumbHeight) ? thumbHeight : thumbHeight + 'px');
    }
    if(image){ this.$img.src = image; this.$img.alt = name; this.$img.style.background=''; } else { this.$img.removeAttribute('src'); this.$img.alt = name; this.$img.style.background='linear-gradient(180deg,#0f1724,#081226)'; }
    // wrap title in link (inside shadow root)
    if(this.$title.parentElement && this.$title.parentElement.tagName.toLowerCase() !== 'a'){
      const aTitle = document.createElement('a');
      aTitle.href = link;
      aTitle.style.color = 'inherit';
      aTitle.style.textDecoration = 'none';
      aTitle.appendChild(this.$title.cloneNode(true));
      this.$title.replaceWith(aTitle);
      this.$title = aTitle;
    } else {
      // update href if anchor exists
      if(this.$title.tagName && this.$title.tagName.toLowerCase() === 'a') this.$title.href = link;
    }

    // render stars (max 5)
    this.$rating.innerHTML = '';
    const full = Math.floor(rating);
    const half = (rating - full) >= 0.5;
    for(let i=0;i<5;i++){
      const span = document.createElement('span');
      span.className = 'star';
      if(i<full) span.textContent = '★';
      else if(i===full && half) span.textContent = '☆';
      else { span.textContent = '☆'; span.classList.add('empty'); }
      this.$rating.appendChild(span);
    }
  }

  addToCart(){
    const name = this.getAttribute('name')||'Product';
    const priceText = this.getAttribute('price')||'$0';
    const price = parseFloat(priceText.replace(/[^0-9.]/g,''))||0;
    const image = this.getAttribute('image')||'';
    const cart = JSON.parse(localStorage.getItem('shoply_cart')||'[]');
    cart.push({title:name,price:price,image:image,added:Date.now()});
    localStorage.setItem('shoply_cart', JSON.stringify(cart));
    // update global cart count if present
    const countEl = document.querySelector('.cart .count');
    if(countEl) countEl.textContent = cart.length;
    // feedback
    const orig = this.$button.textContent;
    this.$button.textContent = 'Added ✓';
    this.$button.disabled = true;
    setTimeout(()=>{ this.$button.textContent = orig; this.$button.disabled = false; }, 1200);
    // dispatch event
    this.dispatchEvent(new CustomEvent('added-to-cart',{detail:{title:name,price:price},bubbles:true,composed:true}));
  }

  slugify(text){
    return String(text).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');
  }
}

customElements.define('product-card', ProductCard);
