let stunumData = [{ stunum: "", isSelected: false }];

window.onload = () => {
  document.addEventListener("scroll", () => {
    if (Math.ceil(window.scrollY) >= window.innerHeight) {
      window.scrollTo(0, 0);
      document.getElementsByClassName("view")[0].scrollLeft = 0;
    }
  });

  initStunumData();
};

function initStunumData() {
  const localStunumData = JSON.parse(localStorage.getItem("stunumData"));
  stunumData = localStunumData ? localStunumData : stunumData;

  const box = document.getElementsByClassName("box")[0];
  stunumData.map((data) => {
    appendStuDataHTML(box, data.stunum, data.isSelected);
  });
}

function changeStunum(e) {
  if (e.type === "keydown" && e.key !== "Enter") return;

  const index = Array.from(e.target.parentNode.parentNode.children).indexOf(
    e.target.parentNode
  );
  stunumData[index].stunum = e.target.value;
  stunumData = stunumData.filter((data) => data.stunum != "");
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

function clickCbx(e) {
  const index = Array.from(e.target.parentNode.parentNode.children).indexOf(
    e.target.parentNode
  );
  stunumData[index].isSelected = e.target.checked;
  localStorage.setItem("stunumData", JSON.stringify(stunumData));
}

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
