(() => {
  const text = (el) => (el.innerText || el.textContent || "").trim().replace(/\s+/g, " ");
  const visible = (el) => {
    const rect = el.getBoundingClientRect();
    const style = getComputedStyle(el);
    return rect.width > 20 && rect.height > 10 && style.display !== "none" && style.visibility !== "hidden";
  };
  const toast = (message) => {
    let box = document.getElementById("__codexAutoNextToast");
    if (!box) {
      box = document.createElement("div");
      box.id = "__codexAutoNextToast";
      box.style.cssText = [
        "position:fixed",
        "right:16px",
        "bottom:16px",
        "z-index:2147483647",
        "background:#111",
        "color:#fff",
        "padding:10px 14px",
        "border-radius:8px",
        "font:14px sans-serif",
        "box-shadow:0 4px 18px #0004",
      ].join(";");
      document.body.appendChild(box);
    }
    box.textContent = message;
    setTimeout(() => box.remove(), 3500);
  };
  const clickableRow = (el) => {
    let node = el;
    for (let i = 0; i < 6 && node.parentElement; i += 1, node = node.parentElement) {
      const style = getComputedStyle(node);
      if (style.cursor === "pointer" || node.onclick || node.getAttribute("role") === "button") return node;
    }
    return el.closest("div,li,a,button") || el;
  };
  const inSidebar = (el) => {
    const rect = el.getBoundingClientRect();
    return rect.left > window.innerWidth * 0.55;
  };
  const lessonRows = () => {
    const rows = [];
    [...document.querySelectorAll(".viewer-table-tree-node-title")]
      .filter((el) => visible(el) && inSidebar(el) && /^\d{2}\s/.test(text(el)))
      .map((el) => {
        const node = el.closest(".el-tree-node");
        return node?.querySelector(".el-tree-node__content") || clickableRow(el);
      })
      .filter((el) => visible(el) && inSidebar(el))
      .forEach((el) => {
        if (!rows.includes(el)) rows.push(el);
      });
    return rows;
  };
  const rowTitle = (row) => text(row.querySelector(".viewer-table-tree-node-title") || row);
  const activeByTitle = (rows) => {
    const titleMatch = text(document.body).match(/(?:^|\s)(\d{2}\s+[^\n\r]+?)\s+课程目录/);
    if (!titleMatch) return -1;
    const currentTitle = titleMatch[1].trim();
    return rows.findIndex((row) => rowTitle(row) === currentTitle);
  };
  const activeByCurrentClass = (rows) => {
    return rows.findIndex((row) => {
      const node = row.closest(".el-tree-node");
      return node && String(node.className || "").includes("is-current");
    });
  };
  const activeScore = (el) => {
    const style = getComputedStyle(el);
    const className = String(el.className || "");
    return (
      (className.match(/active|current|selected|playing|choose/i) ? 10 : 0) +
      (style.backgroundColor &&
      style.backgroundColor !== "rgba(0, 0, 0, 0)" &&
      style.backgroundColor !== "transparent"
        ? 1
        : 0)
    );
  };
  const goNext = () => {
    const rows = lessonRows();
    let activeIndex = activeByCurrentClass(rows);
    if (activeIndex < 0) activeIndex = activeByTitle(rows);
    if (activeIndex < 0) activeIndex = 0;
    let bestScore = -1;
    if (activeIndex === 0) {
      rows.forEach((row, index) => {
        const score = activeScore(row);
        if (score > bestScore) {
          bestScore = score;
          activeIndex = index;
        }
      });
    }
    const next = rows[activeIndex + 1];
    if (!next) {
      toast("没找到下一节");
      return;
    }
    next.scrollIntoView({ block: "center" });
    next.click();
    toast("已自动切到下一节");
    setTimeout(() => document.querySelector("video")?.play?.().catch(() => {}), 1500);
  };
  const bind = () => {
    const video = document.querySelector("video");
    if (!video || video.__codexAutoNext) return;
    video.__codexAutoNext = true;
    video.addEventListener("ended", goNext);
    toast("已开启：播完自动下一节");
  };
  clearInterval(window.__codexAutoNextTimer);
  window.__codexAutoNextTimer = setInterval(bind, 1000);
  bind();
  return "auto-next installed";
})();
