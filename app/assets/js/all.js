AOS.init({
  once: true,
  offset: 50,
});
AOS.refresh();

const url = 'https://raw.githubusercontent.com/hexschool/KCGTravel/master/datastore_search.json'; //高旅網  api
const select = document.querySelector('.select-group'); //行政區
const tabsList = document.querySelector('.tabs-list'); //熱門區
const subtitle = document.querySelector('.subtitle'); //卡片標題
const cardList = document.querySelector('.card-list'); //卡片  ul
const pageList = document.querySelector('.pagination-list'); // 分頁

let data = [];
let page = {};

// axios get data  串接外部 api
function getData() {
  axios.get(url)
    .then(function (response) {
      data = response.data.result.records;
      console.log(data);
      renderData(data);
    });
}
getData();


// 渲染 select filter  初始化
function renderData(showData) {
  // 渲染有存在的行政區到選單欄位
  let selectGroup = showData.map((item) => {
    return item.Zone;
  });

  let newSelect = selectGroup.filter((item, index) => {
    return selectGroup.indexOf(item) == index;
  
  });

  let selectStr = `<option value="高雄全區" selected">-- 高雄全區 --</option>`;
  newSelect.forEach(function (item) {
    let list = `<option value="${item}">${item}</option>`;
    selectStr += list;
  });

  select.innerHTML = selectStr;
  subtitle.textContent = '高雄全區';

  pagination(showData, 1);
}

// 渲染所有清單資料到畫面上
function updateData(showData) {
  let str = '';
  showData.forEach(function (item) {
    let content = `
    <li class="card">
      <div class="card-header" style="background-image:url(${item.Picture1})" title="${item.Picdescribe1}">
        <div class="card-title">
          <h4>${item.Name}</h4>
          <p>${item.Zone}</p>
        </div>
      </div>
      <ul class="card-body">
        <li>
          <i class="fas fa-clock"></i>
          <p>${item.Opentime}</p>
        </li>
        <li>
          <i class="fas fa-map-marker-alt"></i>
          <p>${item.Add}</p>
        </li>
        <li class="card-footer-list d-flex flex-lg-column justify-content-lg-start align-items-lg-start">
          <div class="card-footer-item" data-charge="free">
            <i class="fas fa-mobile-alt"></i>
            <p>${item.Tel}</p>
          </div>
          <div class="card-footer-item" data-display=${item.Ticketinfo == '免費參觀' ? "" : "d-none"}>
            <i class="fas fa-tag"></i>
            <p>${item.Ticketinfo}</p>
          </div>
        </li>
      </ul>
    </li>
    `;
    str += content;
  });
  cardList.innerHTML = str;
}

//監聽select change event
select.addEventListener('change', switchDataSelect, false);

function switchDataSelect(e) {
  if (e.target.value == '') {
    return;
  }

  let chosenDistrict = e.target.value;
  dataFilter(chosenDistrict);

  // 切換分頁
  if (e.target.dataset.type === 'tab' || e.target.dataset.type === 'num') {
    const page = e.target.dataset.page;
    dataFilter(chosenDistrict);
    pagination(dataFilter(chosenDistrict), page);
  }
  return false;
}
// 監聽 tabs click事件
tabsList.addEventListener('click', switchDataTabs, false);

function switchDataTabs(e){
  e.preventDefault();
  if(e.target.nodeName !== 'A'){
    return;
  };

  let chosenTab = e.target.dataset.district;

  dataFilter(chosenTab);

  // 切換分頁
  if(e.target.dataset.type === 'page' || e.target.dataset.type === 'num'){
    const page = e.target.dataset.page;
    const title = subtitle.textContent;
    dataFilter(title);
    pagination(dataFilter(title), page);
  }
  return false;
}



// 輸入showData 資料，用來計算 page 數量資料
function pagination(data, nowPage) {
  const dataTotal = data.length;
  const showPerPage = 6;
  // 可能會有餘數 -> 無條件進位
  const pageTotal = Math.ceil(dataTotal / showPerPage);
  let currentPage = nowPage;

  // 當 "當前頁數" 比 "總頁數" 大的時候，"當前頁數" 就等於 "總頁數"
  if (currentPage > pageTotal) {
    currentPage = pageTotal;
  }

  // 最小值公式 -> 當前可顯示的最少資料量
  const minData = (currentPage * showPerPage) - showPerPage + 1;

  // 最大值公式 
  const maxData = (currentPage * showPerPage);

  let currentPageData = [];
  //處理資料
  data.forEach((item, index) => {
  //獲取陣列索引，但因為索引是從 0 開始所以要 +1
    const num = index + 1;

    if (num >= minData && num <= maxData) {
      currentPageData.push(item); //用來篩選的陣列
    };
  });

  // 用物件方式來傳遞資料
  const page = {
    dataTotal,
    pageTotal,
    currentPage,
    hasPage: currentPage > 1, //boolean
    hasNext: currentPage < dataTotal,
  };
  // console.log(page);
  updateData(currentPageData);  //再重新渲染一次畫面
  pageBtn(page, nowPage);
}

// 新增頁數功能 渲染在畫面中 ->放到renderData
function pageBtn(page, current) {
  //console.log(page);
  let str = '';
  const pageLen = page.pageTotal; //總共頁數
  const now = parseInt(page.currentPage);
  
  if(current > 1){
    str += `
    <li class="page-item">
      <a href="#" class="page-link active" data-type="page" data-page="${now - 1}">
        <i class="fas fa-angle-left"></i> prev
      </a>
    </li>
    `;
  }else{
    str += `
      <li class="page-item">
        <a href="#" class="page-link active" data-type="page" data-page="${now}">
          <i class="fas fa-angle-left"></i> prev
        </a>
      </li>
    `;
  };

  for(let i = 1; i <= pageLen; i++){
    if(parseInt(page.currentPage) === i){
      str += `
      <li class="page-item">
        <a href="#" class="page-link active" data-type="num" data-page="${i}">${i}</a>
      </li>
      `;
    }else{
      str += `
      <li class="page-item">
        <a href="#" class="page-link" data-type="num" data-page="${i}">${i}</a>
      </li>
      `;
    };
  };

  if(current < pageLen){
    str += `
    <li class="page-item">
      <a href="#" class="page-link active" data-type="page" data-page="${now + 1}">
        next <i class="fas fa-angle-right"></i>
      </a>
    </li>
    `;
  }else{
    str += `
    <li class="page-item">
      <a href="#" class="page-link" data-type="page" data-page="${now}">
        next <i class="fas fa-angle-right"></i>
      </a>
    </li>
    `;
  };

  pageList.innerHTML = str;
}

//user 點擊換頁功能 監聽 pageList click event
  pageList.addEventListener('click', switchPage, false);

// 這一段無效 只能用全區 data
function switchPage(e){
  e.preventDefault();
  if(e.target.nodeName !== 'A'){
    return;
  };
  
  const pageClicked = parseInt(e.target.dataset.page);
  pagination(data, pageClicked);
}

// 用這行取代 switch Page 防止換頁監聽資訊遺漏
function dataFilter(chosenDistrict){
  let filterData = [];
  
  data.filter(function(item){
    if(chosenDistrict === item.Zone){
      filterData.push(item);
    } else if (chosenDistrict === '高雄全區'){
      filterData = data;  //將data陣列裡全部的資料放入filterData的陣列裡
    }
    return filterData;
  });
  
  select.value = chosenDistrict;
  subtitle.textContent = chosenDistrict;
  pagination(filterData, 1);
  return filterData;
}