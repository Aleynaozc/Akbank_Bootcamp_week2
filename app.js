
let userList = [];
let productList = [];

const person = {
  firstName: "",
  surName: "",
  Balance: 0,
  product: [],
  account: [],
};
let products = {
  name: "",
  price: 0,
  quantity: 0,
};

const list = document.querySelector('#users');//Kullanıcı
const listOfProduct = document.querySelector('#products');//Ürünler
const listOfUserProduct = document.getElementById('usersProduct');//Kullanıcıların Ürünleri
const selectRemitter = document.getElementById('remitter');//Gönderen
const selectRemitte = document.getElementById('remitte');//Alıcı
const productAccountTable = document.getElementById('userInfoTble');//Hesap Hareketleri || Ürün Listesi
const tableName = document.getElementById('tableName');//Hesap Hareketleri || Ürün Listesi
const qnt = document.getElementById('quantity')

//ID üretiyoruz
const uniqueIdGenerator = () => {
  return Math.floor(Math.random() * 100000 + 1);
};

//Kullanıcı Listesini gösteriyoruz.
const showUserList = function (person) {
  let template =
    ` 
    <div class="form-check col-1 ">
    <input class="form-check-input" onclick="getCheckboxId()" type="radio" name="flexRadioDefault" placeholder="checkbox" id=${person.id} >
    </div>
     <div class="col-4 mx-4" data-label="fullName" name="firstname" >
     ${person.firstName} ${person.surName}
     </div>
     <div class="col-1" name="balance"data-label="Balance">${person.Balance}</div>
     <button class=" showBtn col-2" name="surname" data-label="Product" data-id="${person.id}" onclick="showUserProduct(this)">show</button>
     <button class="showBtn col-2" data-label="Amount" data-id="${person.id}" onclick="showAccountActivities(this)">show</button>
      `
  //Liste oluşturması için 'li' tag'i yaratıyoruz.
  const mainLi = document.createElement('li')
  mainLi.setAttribute('id', person.id)
  mainLi.classList.add('table-row');
  mainLi.innerHTML = template;
  list.appendChild(mainLi)


}
//Kullanıcı ekliyoruz.
const addUser = () => {
  let Person;

  Person = {
    ...person,
    id: uniqueIdGenerator(),
    firstName: document.getElementById('firstName').value,
    surName: document.getElementById('surName').value,
    Balance: document.getElementById('balance').value,
    isActive: false
  }
  userList = [...userList, Person]
  showUserList(Person);

  localStorage.setItem("userListLS", JSON.stringify(userList));
  document.getElementById("addPersonForm").reset();

  remitterSelect()
  remitteSelect()

}

// ÜRÜNLER \\
//Ürünleri listeliyoruz.
const showProductList = function (product) {
  let template =
    ` 
     <div class="" data-label="Product Id" name="firstname" >
     ${product.name}
     </div>
     <div class="col col-2" name="price" data-label="Amount">${product.price}</div>
     <div class="col col-2" name="quantity" id="quantity" data-label="Amount">${product.quantity}</div>
     <button class="col col-2 saleBtn "type="submit" name="saleBtn" onclick="sendProduct(this)" data-id=${product.id}  data-label="Amount"> Sale </button>
      `
  //Liste oluşturması için 'li' tag'i yaratıyoruz.
  const mainLi = document.createElement('li')
  mainLi.classList.add('table-row');
  mainLi.setAttribute('id', product.id)
  mainLi.innerHTML = template;
  listOfProduct.appendChild(mainLi)
}
//Ürünleri ekliyoruz.
const addProduct = () => {
  let Product;

  Product = {
    ...products,
    id: uniqueIdGenerator(),
    name: document.getElementById('productName').value,
    price: document.getElementById('price').value,
    quantity: document.getElementById('quantity').value
  }
  productList = [...productList, Product]
  localStorage.setItem("productListLS", JSON.stringify(productList));//Local Storage'e ürün bilgileri set edildi.
  document.getElementById("addProductForm").reset(); //Form resetlendi.
  showProductList(Product)
}
// ÜRÜN SATIŞI \\
//Tıklanılan kullanıcının checkbox id'sini çekiyoruz.
let checkboxID = 0;

const getCheckboxId = () => {
  listOfUserProduct.innerHTML = ""
  listOfProduct.innerHTML = ""
  let checkboxes = document.querySelectorAll('input[name="flexRadioDefault"]:checked');
  checkboxes.forEach((checkbox) => {
    checkboxID = checkbox.id

    userList.map((user) => {
      if (user.id == checkbox.id) {
        productList.map((product) => {
          showProductList(product)
          //Müşteri bakiyesinden yüksek fiyatlı ürünlerin butonlarını disable yaptık.
          if (parseInt(user.Balance) < parseInt(product.price)) {
            let btnDsble = document.getElementById(`${product.id}`)
            btnDsble.lastElementChild.setAttribute("disabled", true)
          }
        })
      }
    })
  });
}
//Seçilen ürünü , seçili kişiye gönderiyoruz
function sendProduct(selectedProduct) {

  userList.map((user) => {
    if (user.id == checkboxID) {
      productList.map((product) => {
        if (product.id == selectedProduct.dataset.id) {
          checkboxID = 0;
          if (Array.isArray(user.product) && !user.product.length) {
            user.product.push(product)
          }
          else {
            user.product.forEach(prdct => {
              if (prdct.id == product.id) {
                prdct.quantity = parseInt(prdct.quantity) + parseInt(prdct.quantity)
                //Eğer  seçili kişi aynı ID'li ürüne saprdctpse,ürün miktarı  arttırılır.
              } else if (prdct.id !== product.id) {
                user.product.push(product)
                //Seçili ürünü seçilen kişinin ürün listesine gönderiyoruz.
              }
            })
          }
          user.Balance = user.Balance - product.price
          localStorage.setItem("userListLS", JSON.stringify(userList));
          list.innerHTML = ""
          LocalUserStorageList()


        }
      })
    }
  })
}
// KULLANICI ÜRÜN LİSTESİ \\ 
//Kullanıcılara ait ürünler listeleniyor.
const showUserProductList = function (prdct) {
  tableName.innerHTML = `<div class="col col-4" id="tableName">Product List</div>
  <i class="fa-solid fa-xmark" onclick="closeList()"></i>
  `
  prdct.product.map((prdct) => {
    let template =
      ` 
    <div class="" data-label="Productname" name="productName" >
    ${prdct.name}
    </div>
    <div class="col col-2" name="quantity" data-label="quantity">${prdct.quantity}</div>
      `
    //Liste oluşturması için 'li' tag'i yaratıyoruz.
    const mainLi = document.createElement('li')
    mainLi.classList.add('table-row');
    mainLi.setAttribute('id', prdct.id)
    mainLi.innerHTML = template;

    listOfUserProduct.appendChild(mainLi)
  })
}
function showUserProduct(showUser) {
  userList.map((user) => {
    if (user.id == showUser.dataset.id) {
      listOfUserProduct.innerHTML = ""
      productAccountTable.style.display = "block"
      showUserProductList(user)
    }
  })
}
//KULLANICI HESAP HAREKETLERİ \\ 
const showAccountActivities = function (as) {
  tableName.innerHTML = `<div class="col col-4" id="tableName">Product List</div>
  <i class="fa-solid fa-xmark" onclick="closeList()"></i>
  `
  remitterID = selectRemitter.options[selectRemitter.selectedIndex].id;
  console.log(as.dataset.id)
  console.log(checkboxID)
  listOfUserProduct.innerHTML = ""
  userList.map((user) => {

    if (user.id == checkboxID) {
      user.account.forEach((acc) => {
        let template =
          ` 
          <div class="" >
          
          <p> ${acc} </p>
      
          </div>
            `
        //Liste oluşturması için 'li' tag'i yaratıyoruz.
        const mainLi = document.createElement('li')
        mainLi.classList.add('table-row');
        mainLi.setAttribute('id', user.id)
        mainLi.innerHTML = template;

        listOfUserProduct.appendChild(mainLi)
      })


    }

  })
}
// HAVALE BÖLÜMÜ \\
//Gönderen 
function remitterSelect() {
  //listemizdeki kullanıcıları option olarak eklememiz gerekli
  selectRemitter.innerHTML = ""
  selectRemitter.innerHTML = "<option>Remitter</option>"
  userList.forEach(function (user) { //döngü içerisinde li elementlerimizi oluşturalım
    const optionRemitter = document.createElement("option")
    optionRemitter.innerText = `${user.firstName} ${user.surName}`
    optionRemitter.setAttribute('id', user.id)
    selectRemitter.appendChild(optionRemitter);
  })
}
//Alıcı
const remitteSelect = () => {
  remitterID = selectRemitter.options[selectRemitter.selectedIndex].id;
  selectRemitte.innerHTML = ""
  selectRemitte.innerHTML = "<option>Remitte</option>"
  userList.forEach((user) => {
    if (remitterID !== user.id) {
      const optionRemitte = document.createElement("option")
      optionRemitte.setAttribute('id', user.id)
      optionRemitte.innerText = `${user.firstName} ${user.surName}`
      selectRemitte.appendChild(optionRemitte);
    }
  })
}
//Para Havale 
const tranferMoney = function () {
  remitteID = selectRemitte.options[selectRemitte.selectedIndex].id; //Seçilen Alıcının ID'si
  remitterID = selectRemitter.options[selectRemitter.selectedIndex].id; //Seçilen Göndericinin ID'si
  const money = document.getElementById('transferMoney').value //Gönderilecek tutar.

  userList.forEach(remitterusers => {
    if (remitterusers.id == remitterID && money <= remitterusers.Balance) { //Göndericinin bakiyesi, göndereceği paradan büyük eşitse döner
      remitterusers.Balance = remitterusers.Balance - parseInt(money) //Göndericinin bakiyesinden düşer
      userList.find((remitteuser) => {
        if (remitteuser.id == remitteID) {
          remitteuser.Balance = parseInt(remitteuser.Balance) + parseInt(money) //Alıcının bakiyesine eklenir.
          remitteuser.account.push(`${remitterusers.firstName} ${remitterusers.surName} kişisinden` + `${money} $` + "para geldi")
          remitterusers.account.push(`${remitteuser.firstName} ${remitteuser.surName} kişisine ` + `${money} $` + " para gönderildi")
        }
      })
    }
  })

  document.getElementById('transferMoney').value = ""; //Input resetlenir
  document.querySelector('#users').innerHTML = ""; //Eski liste silinir.
  localStorage.setItem("userListLS", JSON.stringify(userList)); //güncel bakiyeli liste local storage'e kaydedilir
  LocalUserStorageList() //Güncel bakiyeli liste render edilir.
}
//Kullanıcı Ürün Listesini ve Hesap hareketleri kapatma.
const closeList = () => {
  productAccountTable.style.display = "none"

}
// LOCAL STORAGE GET
const LocalUserStorageList = () => {
  const userListLS = localStorage.getItem("userListLS");
  if (userListLS) {
    userList = JSON.parse(userListLS);
    userList.forEach(person => {
      showUserList(person)

    })
  }
}
const LocalProductStorageList = () => {
  const productListLS = localStorage.getItem("productListLS");
  if (productListLS) {
    productList = JSON.parse(productListLS);
    productList.forEach(product => {
      showProductList(product);
    });
  }
}

LocalUserStorageList()
LocalProductStorageList()


