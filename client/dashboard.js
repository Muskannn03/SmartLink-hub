const token = localStorage.getItem("token");
const payload = JSON.parse(atob(token.split(".")[1]));
if (!token) {
  window.location.href = "login.html";
}

document.getElementById("viewLink").href =
  `smartlink.html?user=${payload.id}`;
const API = "http://localhost:3000";

function loadLinks() {
  authFetch("http://localhost:3000/api/links")
    .then(res => res.json())
    .then(data => {
      const list = document.getElementById("linksList");
      list.innerHTML = "";

      data.forEach(link => {
        list.innerHTML += `<li>${link.title}</li>`;
      });
    });
}

loadLinks();


function loadAnalytics() {
  fetch(`${API}/api/analytics`)
    .then(res => res.json())
    .then(data => {
      const chart = document.getElementById("chart");
      chart.innerHTML = "";

      const keys = Object.keys(data);

      if (keys.length === 0) {
        chart.innerHTML = `<div class="chart-empty">No clicks yet</div>`;
        return;
      }

      const max = Math.max(...Object.values(data));

      keys.forEach(key => {
        const value = data[key];
        const height = (value / max) * 100;

        const bar = document.createElement("div");
        bar.className = "bar";
        bar.style.height = `${height}%`;
        bar.setAttribute("data-value", value);

        const label = document.createElement("span");
        label.innerText = key;

        bar.appendChild(label);
        chart.appendChild(bar);
      });
    });
}
loadAnalytics();


function addLink() {
  const title = document.getElementById("title").value;
  const url = document.getElementById("url").value;
  const priority = document.getElementById("priority").value;
  const device = document.getElementById("deviceRule").value;
  const time = document.getElementById("timeRule").value;

  authFetch("http://localhost:3000/api/links", {
    method: "POST",
    body: JSON.stringify({
      title,
      url,
      priority,
      device,
      time
    })
  })
  .then(res => res.json())
  .then(() => loadLinks());
}


function addRule() {
  fetch(`${API}/api/rules`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      target: ruleTarget.value,
      condition: condition.value,
      value: value.value,
      action: "hide"
    })
  }).then(() => {
    alert("Rule added");
  });
}
function authFetch(url, options = {}) {
  const token = localStorage.getItem("token");

  return fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  }).then(res => {
    if (res.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "login.html";
      throw new Error("Unauthorized");
    }
    return res;
  });
}
authFetch("http://localhost:3000/api/links")
  .then(res => res.json())
  .then(data => console.log(data));

  function logout() {
  localStorage.removeItem("token");
  window.location.href = "login.html";
}


loadLinks();
loadAnalytics();


if (!token) {
  window.location.href = "/client/login.html";
}
