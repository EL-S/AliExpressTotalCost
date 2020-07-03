// ==UserScript==
// @name         AliExpress Total Price
// @version      0.4
// @description  Show Total Price on AliExpress
// @author       EL-S
// @match        *://*.aliexpress.com/item/*
// @match        *://*.aliexpress.com/store/product*
// @match        *://*.aliexpress.com/wholesale*
// @match        *://*.aliexpress.com/shopcart*
// @match        *://*.aliexpress.com/w/*
// @grant        none
// @require http://code.jquery.com/jquery-3.4.1.min.js
// ==/UserScript==

function replaceValues(item) {
  if (item != "-") {
      var parent = document.getElementsByClassName('product-price')[0];
      var price_string = item.textContent;
      var currency = document.getElementsByClassName('product-price-value')[0].textContent.split(" ")[0];
      var price;
      var price2;
      if (price_string.includes("-")) {
          var price_list = price_string.split(" ");
          price = price_list[1]
          price2 = price_list[3];
      }
      else {
          price = price_string.split(" ")[1];
          price2 = '0';
      }
      var shipping = document.getElementsByClassName('product-shipping-price')[0].textContent
      if (shipping.includes("Free")) {
          shipping = 0.0
      }
      else {
          shipping = parseFloat(shipping.split(" ")[2].split("&")[0].replace("$", "").replace(",", ""));
      }
      var price_number = parseFloat(price.replace("$", "").replace(",", ""));
      var price_number2 = parseFloat(price2.replace(",", ""));
      var element = document.createElement("div");
      element.className = "product-price-current total";

      var element2 = document.createElement("span");
      element2.className = "product-price-value";
      if (price_number2 == 0) {
          element2.innerHTML = currency+" $"+(price_number+shipping).toFixed(2);
      }
      else
      {
          element2.innerHTML = currency+" $"+(price_number+shipping).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+" - "+(price_number2+shipping).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      }
      element2.style = "color:red;";
      element.appendChild(element2);
      var element3 = document.createElement("br");
      element3.className = "total";
      parent.appendChild(element3);
      parent.appendChild(element);
  }
}

function replaceSearchValues(item) {
  var price_element = item.getElementsByClassName('item-price-wrap');
  var shipping_element = item.getElementsByClassName('item-shipping-wrap');

  if (price_element.length == 1 && shipping_element.length) {
      var price_string = price_element[0].textContent;
      var price;
      var price2;
      if (price_string.includes("-")) {
          var price_list = price_string.split(" ");
          price = price_list[1]
          price2 = price_list[3];
      }
      else {
          price = price_string.split(" ")[1];
          price2 = '0';
      }
      var shipping = shipping_element[0].textContent;
      var currency = price_element[0].textContent.split(" ")[0];
      if (shipping.includes("Free")) {
          shipping = 0.0
      }
      else {
          shipping = parseFloat(shipping.split(" ")[2].split("&")[0].replace("$", "").replace(",", ""));
      }
      var price_number = parseFloat(price.replace("$", "").replace(",", ""));
      var price_number2 = parseFloat(price2.replace(",", ""));
      var element = document.createElement("div");
      element.className = "item-price-wrap";

      var element2 = document.createElement("div");
      element2.className = "item-price-rows";

      var element3 = document.createElement("span");
      element3.className = "price-current";
      if (price_number2 == 0) {
          element3.innerHTML = currency+" $"+(price_number+shipping).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      }
      else
      {
          element3.innerHTML = currency+" $"+(price_number+shipping).toFixed(2)+" - "+(price_number2+shipping).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      }
      element3.style = "color:red;";
      element2.appendChild(element3);
      element.appendChild(element2);
      price_element[0].insertAdjacentElement('afterend', element);
  }
}

function replaceCartValues(item) {
  var price_element = item.getElementsByClassName('cost-main normal');
  var shipping_element = item.getElementsByClassName('logistics-cost');

  if (price_element.length == 1 && shipping_element.length) {
      var price = price_element[0].textContent.trim().split(" ")[1];
      var shipping = shipping_element[0].textContent;
      var currency = price_element[0].textContent.trim().split(" ")[0];
      if (shipping.includes("Free")) {
          shipping = 0.0
      }
      else {
          shipping = parseFloat(shipping.split(" ")[2].split("&")[0].replace("$", "").replace(",", ""));
      }
      var price_number = parseFloat(price.replace("$", "").replace(",", ""));
      var element = document.createElement("div");
      element.className = "cost-main normal";
      var element2 = document.createElement("span");
      element2.className = "main-cost-price";
      element2.innerHTML = currency+" $"+(price_number+shipping).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      element2.style = "color:red;";
      element.appendChild(element2);
      price_element[0].insertAdjacentElement('afterend', element);
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
    var price = document.getElementsByClassName('product-price-value')[0];
    replaceValues(price);
}

// from jtc
// https://stackoverflow.com/questions/10415400/jquery-detecting-div-of-certain-class-has-been-added-to-dom
function onElementInserted(containerSelector, elementSelector, callback) {

    var onMutationsObserved = function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length) {
                var elements = $(mutation.addedNodes).find(elementSelector);
                for (var i = 0, len = elements.length; i < len; i++) {
                    callback(elements[i]);
                }
            }
        });
    };

    var target = $(containerSelector)[0];
    var config = { childList: true, subtree: true };
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
    var observer = new MutationObserver(onMutationsObserved);
    observer.observe(target, config);

}

function update_search() {
    var prices = document.getElementsByClassName('product-info');
    for (var i = 0; i < prices.length; i++) {
        replaceSearchValues(prices[i]);
    }
}

function update_cart() {
    var prices = document.getElementsByClassName('product-main');
    for (var i = 0; i < prices.length; i++) {
        replaceCartValues(prices[i]);
    }
}

function init() {
    if (/\/item/.test (location.pathname) || /\/store\product/.test (location.pathname)) {
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
    }
    else if (/\/wholesale/.test (location.pathname)) {
        update_search();
        onElementInserted('body', '.product-info', function(element) {
            update_search();
        });
    }
    else if (/\/shopcart/.test (location.pathname)) {
        update_cart();
        onElementInserted('body', '.product-main', function(element) {
            update_cart();
        });
    }
}

init()
