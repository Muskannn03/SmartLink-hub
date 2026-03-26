const box = document.getElementById("linksContainer");
const toast = document.getElementById("toast");
const userId = new URLSearchParams(window.location.search).get("user");
// Detect device & time
const isMobile = /Android|iPhone/i.test(navigator.userAgent);
const deviceNow = isMobile ? "mobile" : "desktop";

document.getElementById("device").innerText = isMobile ? "📱 Mobile" : "🖥 Desktop";

const hour = new Date().getHours();
const timeNow = (hour >= 6 && hour < 18) ? "day" : "night";

document.getElementById("time").innerText =
  hour >= 18 || hour < 6 ? "🌙 Night" : "☀ Day";

// Fetch smart links
fetch("http://localhost:3000/api/smartlink")
  .then(res => res.json())
  .then(data => {
    const links = data.links;

    // Auto-priority (most clicks first)
    links.sort((a, b) => (b.clicks || 0) - (a.clicks || 0));

    box.innerHTML = "";

    links.forEach(link => {
      const a = document.createElement("a");
      a.className = "link";
      a.href = link.url;
      a.target = "_blank";
      a.innerHTML = `
        ${link.title}
        <small>${link.clicks || 0} clicks</small>
      `;

      a.onclick = () => {
        fetch("http://localhost:3000/api/click", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: link.title })
        });
      };

      box.appendChild(a);
    });
  })
  .catch(() => {
    box.innerHTML = "<p>Unable to load links</p>";
  });

// Copy Smart Link
function copySmartLink() {
  navigator.clipboard.writeText(window.location.href);
  toast.style.display = "block";
  setTimeout(() => toast.style.display = "none", 2000);
}

fetch(`http://localhost:3000/api/smartlink/${userId}`)
  .then(res => res.json())
  .then(data => {
    const box = document.getElementById("linksContainer");
    box.innerHTML = "";

    data.links.forEach(link => {
      const a = document.createElement("a");
      a.className = "link";
      a.href = link.url;
      a.target = "_blank";
      a.innerHTML = `
        ${link.title}
        <small>${link.clicks} clicks</small>
      `;

      a.onclick = () => {
        fetch(`http://localhost:3000/api/smartlink/click/${link._id}`, {
          method: "POST"
        });
      };

      box.appendChild(a);
    });
  });

function ruleMatch(link) {
  const deviceOk =
    link.device === "all" || link.device === deviceNow;

  const timeOk =
    link.time === "all" || link.time === timeNow;

  return deviceOk && timeOk;
}

fetch(`http://localhost:3000/api/smartlink/${userId}`)
  .then(res => res.json())
  .then(data => {
    const box = document.getElementById("linksContainer");
    box.innerHTML = "";

    const filtered = data.links.filter(ruleMatch);

    filtered.forEach(link => {
      const a = document.createElement("a");
      a.className = "link";
      a.href = link.url;
      a.target = "_blank";
      a.innerText = link.title;

      a.onclick = () => {
        fetch(`http://localhost:3000/api/smartlink/click/${link._id}`, {
          method: "POST"
        });
      };

      box.appendChild(a);
    });
  });
