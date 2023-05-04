let stunumData = [{ stunum: "", isSelected: false }];
let selectedStunum = [];

window.onload = () => {
  initStunumData();

  document.addEventListener("scroll", () => {
    if (Math.ceil(window.scrollY) >= window.innerHeight) reset();
  });

  document
    .getElementsByClassName("container")[0]
    .addEventListener("click", selectNext);
};

// ローカルストレージからstunumDataを取得し更新する
function initStunumData() {
  const localStunumData = JSON.parse(localStorage.getItem("stunumData"));
  stunumData = localStunumData ? localStunumData : stunumData;

  const box = document.getElementsByClassName("box")[0];

  stunumData.map((data) => {
    appendStuDataHTML(box, data.stunum, data.isSelected);
    if (data.isSelected) selectedStunum.push(data.stunum);
  });
}

// リセットする
function reset() {
  document.getElementsByClassName("stu_num")[0].innerText = "-";
  document.getElementsByClassName("view")[0].scrollLeft = 0;

  selectedStunum = [];
  stunumData = stunumData.map((data) => {
    return { ...data, isSelected: false };
  });

  localStorage.setItem("stunumData", JSON.stringify(stunumData));

  const cbx = document.getElementsByClassName("cbx");
  for (let i = 0; i < cbx.length; i++) cbx[i].checked = false;

  window.scrollTo(0, 0);
}

// 次のstunumを選択する
function selectNext() {
  // stuDataのうちselectedstunumに含まれないものをランダムで選択
  const unselectedStunum = stunumData.filter(
    (data) => !selectedStunum.includes(data.stunum) && data.stunum !== ""
  );

  if (unselectedStunum.length === 0) {
    document.getElementsByClassName("stu_num")[0].innerText = "fin";
    return;
  }

  const randomIndex = Math.floor(Math.random() * unselectedStunum.length);
  const nextStunum = unselectedStunum[randomIndex];

  // 選択したstunumをselectedstunumに追加
  const index = stunumData.indexOf(nextStunum);
  selectedStunum.push(nextStunum.stunum);
  stunumData[index].isSelected = true;

  // 選択したstunumをローカルストレージに保存
  localStorage.setItem("stunumData", JSON.stringify(stunumData));

  // 選択したstunumを表示
  document.getElementsByClassName("stu_num")[0].innerText = nextStunum.stunum;

  // チェックボックスをチェック
  const cbx = document.getElementsByClassName("cbx")[index];
  cbx.checked = true;
}

// stunumを変更したときの処理
function changeStunum(e) {
  if (e.type === "keydown" && e.key !== "Enter") return;

  const index = Array.from(e.target.parentNode.parentNode.children).indexOf(
    e.target.parentNode
  );
  stunumData[index].stunum = e.target.value;
  const stunums = stunumData.map((data) => data.stunum);
  stunumData = stunumData.filter((data, i) => {
    return data.stunum != "" && stunums.lastIndexOf(data.stunum) === i;
  });
  stunumData.unshift({ stunum: "", isSelected: false });

  localStorage.setItem("stunumData", JSON.stringify(stunumData));

  const box = document.getElementsByClassName("box")[0];
  for (let i = 0; i < Math.max(box.childElementCount, stunumData.length); i++) {
    if (i >= box.childElementCount) {
      appendStuDataHTML(box, stunumData[i].stunum, stunumData[i].isSelected);
    } else if (i >= stunumData.length) {
      box.removeChild(box.lastChild);
    } else {
      const stunum = document.getElementsByClassName("stunum")[i];
      const cbx = document.getElementsByClassName("cbx")[i];

      stunum.value = stunumData[i].stunum ?? "";
      cbx.checked = stunumData[i].isSelected ?? false;
    }
  }
}

// チェックボックスをクリックしたときの処理
function clickCbx(e) {
  const index = Array.from(e.target.parentNode.parentNode.children).indexOf(
    e.target.parentNode
  );
  stunumData[index].isSelected = e.target.checked;
  localStorage.setItem("stunumData", JSON.stringify(stunumData));

  if (e.target.checked) {
    selectedStunum.push(stunumData[index].stunum);
  } else {
    selectedStunum.splice(selectedStunum.indexOf(stunumData[index].stunum), 1);
  }
}

// inputたちを追加する
function appendStuDataHTML(parent, stunum, isSelected) {
  const div = document.createElement("div");

  const inputText = document.createElement("input");
  inputText.type = "text";
  inputText.className = "stunum";
  inputText.placeholder = "k23075";
  inputText.value = stunum ?? "";
  inputText.addEventListener("blur", changeStunum);
  inputText.addEventListener("keydown", changeStunum);

  const cbx = document.createElement("input");
  cbx.type = "checkbox";
  cbx.className = "cbx";
  cbx.checked = isSelected ?? false;
  cbx.addEventListener("click", clickCbx);

  div.appendChild(inputText);
  div.appendChild(cbx);

  parent.appendChild(div);
}
