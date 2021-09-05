/*
1. attributeLineClick
2. optionLineClick
3. updatePrices
4. roundPlus
5. funQty
6. setQty
*/

let cartBlock = document.getElementById('cart-block');
let imageArea = document.querySelector('.image-area');
let imageLayerFirst = imageArea.querySelector('.image-big-first');

//1
function attributeLineClick() {
    let attributeLine = cartBlock.querySelectorAll('.attribute-line');
    let optionBlock = cartBlock.querySelectorAll('.option-block__wrap');
    const STATECLASSNAME = 'opened';
    for (let i = 0; i < attributeLine.length; i++) {
        (function(i) {
            attributeLine[i].onclick = function() {
                let activeLines = this.parentNode.querySelectorAll('.'+STATECLASSNAME);
                for(let k = 0; k < activeLines.length; k++) {
                   if(activeLines[k]!=attributeLine[i]){
                      activeLines[k].classList.remove(STATECLASSNAME)
                   }
                }
                this.classList.toggle(STATECLASSNAME)
               }
        })(i);
    }
}

//2
function optionLineClick(e) {



    const STATECLASSNAME = 'opened';

    let currentEl = e.target;
    let currentElClasses = currentEl.classList;
    let flagClick = false;
    let currentQty = +document.querySelector('.input-qty').value;

    if(currentQty=='' || currentQty==0){
       currentQty=1;
       document.querySelector('.input-price').textContent = document.querySelector('.per-price-value').textContent;
    }

    if((currentElClasses.contains('attribute-default') && currentEl.parentNode.classList.contains(STATECLASSNAME))
      ||
      (currentElClasses.contains('attribute-line') && currentElClasses.contains(STATECLASSNAME))) {
      flagClick = true;
    }

    if(flagClick == false){
       let activeLines = cartBlock.querySelectorAll('.'+STATECLASSNAME);
       for(let k = 0; k < activeLines.length; k++) {
           activeLines[k].classList.remove(STATECLASSNAME)
       }
    }

    let product = cartBlock.querySelector('.product-url');
    let optionLine = cartBlock.querySelectorAll('.option-line');
    let optionLength = optionLine.length - 1;
    let attributeLine = document.querySelectorAll('.attribute-line');
    let attributeLength = attributeLine.length - 1;

    if(attributeLength > 1) {
      let colorLines = cartBlock.querySelectorAll('.option-color');
      for(let j = 0; j < colorLines.length; j++) {
         (function(j) {
             colorLines[j].onclick = function() {
                let optionColor = this.querySelector('img').getAttribute('title');
                let optionMask = this.getAttribute('line-option-mask');
                let optionId = this.getAttribute('line-option-id');
                let prevParentNode = this.parentNode.parentNode;

                imageArea.style.backgroundImage = "url('"+optionMask+"')";

                prevParentNode.setAttribute('data-label',optionColor);
                prevParentNode.previousElementSibling.childNodes[1].setAttribute('option-default-id', optionId);
                prevParentNode.previousElementSibling.childNodes[1].innerHTML = optionColor;

                let currentPrice = +this.querySelector('img').getAttribute('data-price').replace('$', '');
                let currentPriceQty = currentQty * currentPrice;

                document.querySelector('.per-price-value').innerHTML = '$' + currentPrice;
                document.querySelector('.input-price').innerHTML = '$' + roundPlus(currentPriceQty, 2);
             }
         })(j);
      }

      for(let i = 0; i < optionLine.length; i++) {

          (function(i) {
               optionLine[i].onclick = function() {

                    let currentOptionBlock = this.parentNode;
                    let currentOptionBlockLine = currentOptionBlock.querySelectorAll('.option-line');

                    for(let j = 0; j < currentOptionBlockLine.length; j++) {
                       currentOptionBlockLine[j].querySelector(".radio-html").checked = false;
                    }

                    let attribute = this.parentNode.parentNode.previousElementSibling;
                    let attributeNum = attribute.getAttribute('attribute-num');

                    let lineOptionId = this.getAttribute("line-option-id");
                    let currentSelectedValue = this.querySelector('.value-line').innerHTML;

                    attribute.childNodes[1].innerHTML = currentSelectedValue;
                    attribute.childNodes[1].setAttribute('option-default-id', lineOptionId);
                    attribute.childNodes[1].setAttribute('option-default-value', currentSelectedValue);
                    attribute.classList.remove("opened");

                    this.querySelector('.radio-html').checked = true;
                    this.parentNode.parentNode.setAttribute('data-label',currentSelectedValue);



                    // SIZE CLICK
                    if(attributeNum == 0) {
                       let oneId = this.getAttribute('line-option-id');
                       let productId = document.getElementById('cart-block').getAttribute('product-id');
                       let nextParent = this.parentNode.parentNode.nextElementSibling;
                       let attributeId = nextParent.getAttribute('attribute-id');
                       let nextOptionBlock = nextParent.nextElementSibling.childNodes[1];
                       let attributeTitle = nextParent.childNodes[1].innerHTML;
                       updatePrices(oneId, productId, attributeId, nextOptionBlock, attributeTitle, currentQty, i);
                    }

                    // PRINT CLICK
                    if(attribute.getAttribute('attribute-title') == 'Print') {
                       let printType = this.childNodes[1].value;
                       $(".checkgray").click(function() {
                         jQuery(".checkgray").is(":checked") ? grayscale($(".bigimage")) : grayscale.reset($(".bigimage"));
                       })
                    }
                 }
         })(i);
      }
   }
}

// 3
function updatePrices(oneId, productId, attributeId, optionBlock, attributeTitle, currentQty, i) {
    optionBlock.innerHTML = '';
    let xhr = createXHR();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
                let listJsonData = JSON.parse(xhr.responseText);
                let equalityProps = false;
                let currentPrice;

                for(let j = 0; j < listJsonData.length; j++) {

                    let optionLine, valueOptionLine, priceOptionLine;

                    optionLine = document.createElement("div");
                    optionLine.setAttribute("class", "option-color");
                    optionLine.setAttribute("line-option-id", listJsonData[j].option_id);
                    optionLine.setAttribute("line-option-mask", listJsonData[j].option_mask);
                    optionBlock.appendChild(optionLine);

                    valueOptionLine = document.createElement("img");
                    valueOptionLine.setAttribute("src", listJsonData[j].option_color_icon);
                    valueOptionLine.setAttribute("data-price", listJsonData[j].price_value);
                    valueOptionLine.setAttribute("title", listJsonData[j].option_title);
                    optionLine.appendChild(valueOptionLine);

                    if(attributeTitle == listJsonData[j].option_title){
                       equalityProps = true;
                       currentPrice = listJsonData[j].price_value;
                    }
                 }

                 if(equalityProps == false){

                    let linesOptionBlock = optionBlock.querySelectorAll('.option-line');
                    let attributeDefault = optionBlock.parentNode.previousElementSibling.querySelector('.attribute-default');
                    let setInxJ = 0;
                    let setInxK = 0;

                    for(let j = 0; j < listJsonData.length; j++) {
                        if(listJsonData[j].option_default == 1) {
                          for(let k = 0; k < linesOptionBlock.length; k++) {
                              if(linesOptionBlock[k].getAttribute('line-option-id') == listJsonData[j].option_id){
                                 setInxJ = k;
                                 setInxK = j;
                              }
                           }
                        }
                    }


                    optionBlock.parentNode.setAttribute('data-label',listJsonData[setInxJ].option_title);
                    attributeDefault.setAttribute('option-default-value',listJsonData[setInxJ].option_title);
                    attributeDefault.setAttribute('option-default-id',listJsonData[setInxJ].option_id);
                    attributeDefault.innerHTML = listJsonData[setInxJ].option_title;
                    currentPrice = listJsonData[setInxJ].price_value;
                 }

                 let resQty = currentPrice * currentQty;
                 let currentPriceQty = roundPlus(resQty, 2);

                 document.querySelector('.input-price').innerHTML = '$' + currentPriceQty;
                 document.querySelector('.per-price-value').innerHTML = '$' + currentPrice;

            } else {
                alert("Request was unsuccesfull: " + xhr.status);
            }
        }
    };
    xhr.open("get", "/?one_id=" + oneId + "&product_id=" + productId + "&attribute_id=" + attributeId, true);
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.send(null);
}

//5
function roundPlus(x, n) {
    let m = Math.pow(10, n);
    return Math.round(x * m) / m;
}

//6
function funQty() {
    let itemMinus = document.querySelector('.item-minus');
    let itemPlus = document.querySelector('.item-plus');
    let inputQty = document.querySelector('.input-qty');
        itemPlus.onclick = function(e) {
            setQty(e);
        }
        itemMinus.onclick = function(e) {
            setQty(e);
        }
        inputQty.onkeyup = function(e){
            setQty(e);
        }
    return false;
}

//7
function setQty(e){
    let dataPrice = document.querySelector('.per-price-value').innerHTML.replace('$', '');
    let curentQtyObj = document.querySelector('.input-qty');
    let curentQty = curentQtyObj.value;
    let dataQty = +curentQty;
    if(e.target.className == 'item-plus') dataQty++;
    if(e.target.className == 'item-minus') dataQty--;
    if(dataQty < 101 && dataQty > 0) {
       curentQtyObj.value = dataQty;
       let dataTotal = dataQty * dataPrice;
       dataTotal = parseFloat(dataTotal).toFixed(2);
       document.querySelector('.input-price').innerHTML = '$' + dataTotal;
    } else {
        if(dataQty > 100){
           curentQtyObj.value = curentQtyObj.value.substring(0, curentQtyObj.value.length - 1);
        }
    }
}

addEventListener('load', function(e) { attributeLineClick();}, false );
addEventListener('load', function() { funQty();}, false );
addEventListener('click', function(e) { optionLineClick(e);}, false );
