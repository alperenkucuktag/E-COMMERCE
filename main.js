const categoryList=document.querySelector(".categories")
const ürünAlanı=document.querySelector(".products")
const sepetButon=document.querySelector("#sepet")
const kapatBtn=document.querySelector("#kapatBtn")
const modal=document.querySelector(".modal-wrapper")
const sepetList=document.querySelector("#Sepetlist")
const ToplamFiyat=document.querySelector("#toplamFiyat")
const totalCount=document.querySelector("#sayac")
const realModal=document.querySelector(".modal")



//API

//baseUrl
//html in yüklenme anı

const baseUrl="https://api.escuelajs.co/api/v1"//v1 categories de yazabilirdik
//*kategori bilgilerini alma
//1-apiye istek at
//2-gelen veriyi işle
//3-gelen verileri kart şeklinde ekrana basıcak fonksiyonu çalıştır
//4-cevap hatalı olorsa kullanıcıyı biliglendir
document.addEventListener("DOMContentLoaded",()=>{
    fetchCategories()
    fetchProduct()

})
//Json parse ile response json benzer mantıkta çalışır
function fetchCategories() {
       //base url yerine https://api.escuelajs.co/api/v1 yazsaydık yine aynı sonucu alırdık
    fetch(`${baseUrl}/categories`)
    //json şeklinde almasını istedik,response a ali veya ayşe deseydik yine aynısı olurdu o bir değişken
    .then((response)=>response.json())//bunu çevir dataya at
    .then((data)=>{
        // 1 ve5 kategorileri arasında veri çek demek
        renderCategories(data.slice(1,5))
    })
    .catch((error)=>console.log(error))

    
}

function renderCategories(categories) {
    //kategoriler dizisindeki herbir obje için çalışır
   
    categories.forEach((category)=>{
        //1-div oluşturma
        const categoryDiv=document.createElement("div")
        //2-div e class ekleme
        categoryDiv.classList.add("category-card")
        //3-divin içeriğini belirleme
        categoryDiv.innerHTML=`
        <img src=${category.image}/>
        <p>${category.name}</p>
        `
        categoryList.appendChild(categoryDiv)

    })
    
}
//ürünler için istek at

async function fetchProduct() {
    try {
        const response=await fetch(`${baseUrl}/products`)
        const data = await response.json()
       
        renderProducts(data.slice(0,25))
        //hata olursa yakalar
    } catch (error) {
        console.log(error);
    }
    
}

function renderProducts(products) {
    console.log(products);
    const productsHTML= products.map(
        (product) => `
        <div class="card">
          <img src=${product.images[0]} />
          <h4>${product.title}</h4>
          <h4>${
            product.category.name ? product.category.name : 'Diğer'
          }</h4>
          <div class="action">
            <span>${product.price} &#8378;</span>
            <button onclick="addToBasket({id:${product.id},title:'${
      product.title
    }',price:${product.price},img:'${
      product.images[0]
    }',amount:1})">Sepete Ekle</button>
          </div>
        </div>
 `
    )

    .join(" ")

    ürünAlanı.innerHTML+=productsHTML
    
}

function addToBasket() {
    
}

//SEPET

let basket=[]
let total=[]
function addToBasket(product) {
    // ürün sepete daha önce eklendi mi ?
    const found = basket.find((i) => i.id === product.id);
  
    if (found) {
      // eleman sepette var > miktarı arttır
      found.amount++;
    } else {
      // eleman sepette yok > sepete ekle
      basket.push(product);
    }
  }

function renderBasket() {
    const cardsHTML=basket

    .map(
        (product)=>`

        <div class="item">
        <img src=${product.img}>
        <h3 class="title">${product.title}
        <h4 class="price">${product.price} &#8378;</h4>
        <p>Miktar : ${product.amount}</p>
        <img onclick="deleteItem(${product.id})" id="delete" src="images/e-trash.png"
        </div>
        
        `

    )
    .join(" ")
    sepetList.innerHTML=cardsHTML
     

    calculateTotal()
    
}

//Sepetten Ürün Silme

function deleteItem(deleteid) {

     //kaldırılcak ürünler dışındaki tüm ürünleri al
    basket=basket.filter((i)=>i.id !== deleteid)
    

   //sepet listesini güncelle
    renderBasket()
    
    
}



function calculateTotal() {
    //Dizilerde Toplama işlemi için reduce metodu kullanılır
const sum=basket.reduce((sum,i)=>sum+i.price*i.amount,0)
//sepetteki toplam ürün sayısını hesaplanır
//sen sondaki 0 başlama değeri istersen değiştir ve dene
const amount=basket.reduce((sum,i)=>sum+i.amount,0)
//Toplam değeri html tarafına gönderiyoruz
ToplamFiyat.innerText=sum + ' ' + '₺'
totalCount.innerText=amount+' '+'Ürün'


}

sepetButon.addEventListener("click",()=>{
    modal.classList.add("active")
    renderBasket()
})

kapatBtn.addEventListener("click",()=>{
    modal.classList.remove("active")
})
