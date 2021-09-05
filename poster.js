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
    let curentQtyObj = document.querySelector('.input-qty');

    if(curentQtyObj.value=='' || curentQtyObj.value==0){
       curentQtyObj.value=1;
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
                    let currentQty = +document.querySelector('.input-qty').value;

                    this.parentNode.parentNode.setAttribute('data-label',currentSelectedValue);



                    let dataMask = this.getAttribute('line-option-mask');


                    if(dataMask){
                       if(dataMask != 'null'){
                          imageLayerFirst.setAttribute("src", dataMask);
                          imageLayerFirst.setAttribute("data-src", dataMask);
                          imageLayerFirst.style.left = '0';
                          imageLayerFirst.style.top = '0';
                      }
                    }

                    // SIZE CLICK
                    if(attributeNum == 0) {
                       let oneId = this.getAttribute('line-option-id');
                       let productId = document.getElementById('cart-block').getAttribute('product-id');
                       let nextParent = this.parentNode.parentNode.nextElementSibling;
                       let attributeId = nextParent.getAttribute('attribute-id');
                       let nextOptionBlock = nextParent.nextElementSibling.childNodes[1];
                       let attributeTitle = nextParent.childNodes[1].innerHTML;

                       let rotateParent = this.parentNode.parentNode.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling;
                       console.log(rotateParent);
                       let rotateLines = rotateParent.querySelectorAll('.option-line');

                       for(let k = 0; k < rotateLines.length; k++) {
                           rotateLines[k].childNodes[1].checked = false;
                       }

                       rotateParent.childNodes[1].childNodes[1].childNodes[1].checked = true;
                       let rotateAttr = this.parentNode.parentNode.nextElementSibling.nextElementSibling.nextElementSibling.childNodes[1];

                       rotateAttr.innerHTML = 'Up';
                       rotateAttr.setAttribute('option-default-value','Up');
                       rotateAttr.setAttribute('data-posit','');

                       updatePrices(oneId, productId, attributeId, nextOptionBlock, attributeTitle, currentQty, i);
                    }

                    // FRAGMENTS CLICK
                    if(attributeNum == 1) {

                       let currentPrice = +this.querySelector('.price-line').innerHTML.replace('$', '');
                       let currentPriceQty = currentQty * currentPrice;
                       document.querySelector('.per-price-value').innerHTML = '$' + currentPrice;
                       document.querySelector('.input-price').innerHTML = '$' + roundPlus(currentPriceQty, 2);
                    }

                    // ROTATE CLICK
                    if(attributeNum == 2){
                       let dataMask = document.querySelector('.image-big-first').getAttribute('data-src');
                       let rotate = this.childNodes[1].value;
                       let rotatedMask;

                       if(rotate == 'Up') {
                          rotatedMask = dataMask;
                       } else {
                          let arrayPath = dataMask.split('/');
                          let arrayMask = arrayPath[3].split('.');
                          rotatedMask = '/'+arrayPath[1]+'/rotate/'+arrayPath[2]+'/'+ arrayMask[0]+'_'+ rotate+'.'+arrayMask[1];
                       }

                       imageLayerFirst.setAttribute("src", rotatedMask);
                       imageLayerFirst.style.top = '0';
                       imageLayerFirst.style.left = '0';
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

                    let optionLine, radioHtml, valueOptionLine, priceOptionLine;

                    optionLine = document.createElement("div");
                    optionLine.setAttribute("class", "option-line");
                    optionLine.setAttribute("line-option-id", listJsonData[j].option_id);
                    optionLine.setAttribute("line-option-mask", listJsonData[j].option_mask);
                    optionBlock.appendChild(optionLine);

                    // #1.1 Radio
                    radioHtml = document.createElement("input");
                    radioHtml.setAttribute("type", "radio");
                    radioHtml.setAttribute("value", listJsonData[j].option_title);
                    radioHtml.setAttribute("class", "radio-html");

                    optionLine.appendChild(radioHtml);

                    // #1.2 TiTle
                    valueOptionLine = document.createElement("span");
                    valueOptionLine.setAttribute("class", "value-line");
                    valueOptionLine.innerHTML = listJsonData[j].option_title;
                    optionLine.appendChild(valueOptionLine);

                    // #1.3 Price
                    priceOptionLine = document.createElement("span");
                    priceOptionLine.setAttribute("class", "price-line");
                    priceOptionLine.innerHTML = (listJsonData[j].price_value != '') ? '$' + listJsonData[j].price_value : '';

                    optionLine.appendChild(priceOptionLine);

                    if(attributeTitle == listJsonData[j].option_title){
                       radioHtml.checked = true;
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

                    linesOptionBlock[setInxK].querySelector('.radio-html').checked = true;
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

$('.draggable-above-image').draggable({
     containment: $('.image-area'),
     stop: function(event, ui) {
           let product = document.getElementById('cart-block').getAttribute('product-id');
           let resultPos;
           let positionLeft = parseInt(ui.position.left);
           let positionTop = parseInt(ui.position.top);
           let attributeLine = document.querySelectorAll('.attribute-line');

           let dataDefault = attributeLine[2].childNodes[1];
           let dataDefaultValue = dataDefault.getAttribute('option-default-value');

           if(positionLeft>0) resultPos = 'L'+positionLeft;
           if(positionTop>0) resultPos = 'T'+positionTop;

           if(resultPos){
              dataDefault.setAttribute('data-posit',resultPos);
              dataDefault.innerHTML = dataDefaultValue + ' ' + resultPos;
           }

           if(positionTop==0 && positionLeft==0){
              dataDefault.innerHTML = dataDefaultValue;
              dataDefault.setAttribute('data-posit','');
              this.style.top = "0px";
              this.style.left = "0px";
           }
      }
});
