const jsonUrl ='https://raw.githubusercontent.com/hsiangfeng/JSHomeWork/master/JSON/datastore_search.json';
const content = document.querySelector('.content');
const pageid = document.getElementById('pageid');
let jsonData = {};

function getData(){
  axios.get(jsonUrl)
    .then(function(response){
    jsonData = response.data.result.records;
    //console.log(jsonData);
    pagination(jsonData, 1);
  });
}
getData();

function pagination(jsonData, nowPage){
  console.log(nowPage);
  // 取得全部資料長度
  const dataTotal = jsonData.length;
  //console.log(dataTotal);
  
  // 設定要顯示在畫面上的資料數量
  // 預設每一頁只顯示5筆資料
  const perpage = 5;
  
  // page 按鈕總數量公式 總資料數量 / 每一頁要顯示的資料
  // 這邊要注意，因為有可能會出現餘數，所以要無條件進位。
  const pageTotal = Math.ceil(dataTotal / perpage);
  
  // 當前頁數，對應現在當前頁數
  let currentPage = nowPage;
  
  // 因為要避免當前頁數筆總頁數還要多，假設今天總頁數是 3 筆，就不可能是 4 或 5
  // 所以要在寫入一個判斷避免這種狀況。
  // 當"當前頁數"比"總頁數"大的時候，"當前頁數"就等於"總頁數"
  // 注意這一行在最前面並不是透過 nowPage 傳入賦予與 currentPage，所以才會寫這一個判斷式，但主要是預防一些無法預期的狀況，例如：nowPage 突然發神經？！
  
  if(currentPage > pageTotal){
    currentPage = pageTotal;
  }
  
  // 由前面可知最小數字為6，所以用答案來回推式
  const minData = (currentPage * perpage) - perpage + 1;
  const maxData = (currentPage * perpage);
  
  // 先建立新陣列
  const data = [];
  // 這邊將會使用 ES6 forEach 做資料處理
  // 首先必須使用索引來判斷資料位子，所以要使用index
  jsonData.forEach((item, index) => {
    //獲取陣列索引，但因為索引是從 0 開始所以要 +1
    const num  = index + 1;
    // 這邊判斷式會稍微複雜一點
    // 當 num 比 minData 大且又小於 maxData 就push進去新陣列。
    if(num >= minData && num <= maxData){
      data.push(item);
    }
  });
  
  // 用物件方式傳遞資料
  const page = {
    pageTotal,
    currentPage,
    hasPage: currentPage > 1,
    hasNext: currentPage < pageTotal,
  }
  // console.log(page);
  displayData(data);
  pageBtn(page);
}

function displayData(data){
  let str = '';
  data.forEach((item) => {
    str += `
      
    `;
  });
}