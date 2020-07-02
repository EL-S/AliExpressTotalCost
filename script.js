// ==UserScript==
// @name         Aliexpress Total Price
// @version      0.1
// @description  Show Total Price on Aliexpress
// @author       EL-S
// @match        *://*.aliexpress.com/item/*
// @match        *://*.aliexpress.com/store/product*
// @grant        none
// @namespace https://greasyfork.org/users/298177
// @require http://code.jquery.com/jquery-3.4.1.min.js
// ==/UserScript==

function replaceValues(item, index) {
  if (item != "-") {
    var parent = document.getElementsByClassName('product-price')[0];

    var currency = document.getElementsByClassName('product-price-value')[0].textContent.split(" ")[0];
    var shipping = document.getElementsByClassName('product-shipping-price')[0].textContent
    if (shipping.includes("Free")) {
        shipping = 0.0
    }
    else {
        shipping = parseFloat(shipping.split(" ")[2].split("&")[0].replace("$", ""));
    }
    var price_number = parseFloat(item.replace("$", ""));
    var element = document.createElement("div");
    element.className = "product-price-current";
    element.className += " total";

    var element2 = document.createElement("span");
    element2.className = "product-price-value";
    var max;
    if (index > 0) {
        max = "Max ";
    }
    else {
        max = "";
    }
    element2.innerHTML = max+"Total: "+currency+" $"+(price_number+shipping).toFixed(2);
    element.appendChild(element2);
    var element3 = document.createElement("br");
    element3.className = "total";
    parent.appendChild(element3);
    parent.appendChild(element);
  }
}

function removeExisting() {
    var elements = document.getElementsByClassName('total');
    while(elements[0]) {
        elements[0].parentNode.removeChild(elements[0]);
    }
}

function update() {
    removeExisting()
    var price = document.getElementsByClassName('product-price-value')[0].textContent.split(" ").slice(1);
    price.forEach(replaceValues);
}

var checkExist = setInterval(function() {
   if (document.getElementsByClassName('product-shipping-price').length) {
       update()
       $(".product-price-value").bind('DOMSubtreeModified', function(){
           update()
       });
       $(".product-shipping-price").bind('DOMSubtreeModified', function(){
           update()
       });
       clearInterval(checkExist);
   }
}, 100);