(() => {
  const SPEED_KEY = "__codexAutoNextPlaybackRate";
  const MIN_SPEED = 0.25;
  const MAX_SPEED = 16;
  const NEXT_PLAY_DELAY_MS = 1500;
  const PPT_TO_VIDEO_DELAY_MS = 3000;
  let autoNextLocked = false;
  const text = (el) => (el.innerText || el.textContent || "").trim().replace(/\s+/g, " ");
  const visible = (el) => {
    const rect = el.getBoundingClientRect();
    const style = getComputedStyle(el);
    return rect.width > 20 && rect.height > 10 && style.display !== "none" && style.visibility !== "hidden";
  };
  const clampSpeed = (value) => {
    const speed = Number.parseFloat(value);
    if (!Number.isFinite(speed)) return 1;
    return Math.min(MAX_SPEED, Math.max(MIN_SPEED, Math.round(speed * 100) / 100));
  };
  const formatSpeed = (speed) => {
    const rounded = clampSpeed(speed);
    return String(Number.isInteger(rounded) ? rounded : Number(rounded.toFixed(2)));
  };
  const getStoredSpeed = () => {
    try {
      return clampSpeed(localStorage.getItem(SPEED_KEY) || 1);
    } catch (_) {
      return 1;
    }
  };
  const setStoredSpeed = (value) => {
    const speed = clampSpeed(value);
    try {
      localStorage.setItem(SPEED_KEY, String(speed));
    } catch (_) {}
    return speed;
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
  const syncSpeedInput = () => {
    const input = document.getElementById("__codexAutoNextRateInput");
    if (input && document.activeElement !== input) input.value = formatSpeed(getStoredSpeed());
  };
  const applySpeed = (video = document.querySelector("video")) => {
    if (!video) return;
    const speed = getStoredSpeed();
    video.__codexAutoNextApplyingRate = true;
    try {
      try {
        video.defaultPlaybackRate = speed;
      } catch (_) {}
      try {
        video.playbackRate = speed;
      } catch (_) {}
    } finally {
      setTimeout(() => {
        video.__codexAutoNextApplyingRate = false;
      }, 0);
    }
    syncSpeedInput();
  };
  const ensureSpeedControl = () => {
    let panel = document.getElementById("__codexAutoNextRateControl");
    if (!panel) {
      panel = document.createElement("div");
      panel.id = "__codexAutoNextRateControl";
      panel.style.cssText = [
        "position:fixed",
        "right:16px",
        "bottom:64px",
        "z-index:2147483647",
        "display:flex",
        "align-items:center",
        "gap:8px",
        "background:#111",
        "color:#fff",
        "padding:8px 10px",
        "border-radius:8px",
        "font:13px sans-serif",
        "box-shadow:0 4px 18px #0004",
      ].join(";");

      const label = document.createElement("label");
      label.htmlFor = "__codexAutoNextRateInput";
      label.textContent = "倍速";

      const input = document.createElement("input");
      input.id = "__codexAutoNextRateInput";
      input.type = "number";
      input.min = String(MIN_SPEED);
      input.max = String(MAX_SPEED);
      input.step = "0.1";
      input.title = "输入播放倍速，切换下一节后会继续使用";
      input.style.cssText = [
        "width:64px",
        "box-sizing:border-box",
        "border:1px solid #555",
        "border-radius:6px",
        "background:#fff",
        "color:#111",
        "padding:4px 6px",
        "font:13px sans-serif",
      ].join(";");

      const suffix = document.createElement("span");
      suffix.textContent = "x";

      const saveFromInput = () => {
        const speed = setStoredSpeed(input.value);
        input.value = formatSpeed(speed);
        applySpeed();
        toast(`播放倍速已设为 ${formatSpeed(speed)}x`);
      };
      input.addEventListener("change", saveFromInput);
      input.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          input.blur();
        }
      });

      panel.append(label, input, suffix);
      document.body.appendChild(panel);
    }
    syncSpeedInput();
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
  const treeNodes = () =>
    [...document.querySelectorAll(".viewer-table-tree .el-tree-node")]
      .filter((el) => visible(el) && inSidebar(el));
  const nodeClass = (node) => String(node?.className || "");
  const nodeTitle = (node) =>
    text(
      node?.querySelector?.(":scope > .el-tree-node__content .viewer-table-tree-node-title") ||
        node?.querySelector?.(".viewer-table-tree-node-title") ||
        node
    );
  const nodeContent = (node) =>
    node?.querySelector?.(":scope > .el-tree-node__content") ||
    node?.querySelector?.(".el-tree-node__content") ||
    clickableRow(node);
  const isLectureNode = (node) => nodeClass(node).includes("node-folder-l0");
  const isVideoNode = (node) =>
    /node-file-l(?:-sel)?-104\b/.test(nodeClass(node)) || /^\d{2}\s/.test(nodeTitle(node));
  const isPptNode = (node) =>
    /node-file-l(?:-sel)?-(101|114)\b/.test(nodeClass(node)) || /\.pptx?$/i.test(nodeTitle(node));
  const isSkipNode = (node) => /node-file-l(?:-sel)?-118\b/.test(nodeClass(node));
  const lectureNodes = () => treeNodes().filter(isLectureNode);
  const findLectureByTitle = (title) => lectureNodes().find((node) => nodeTitle(node) === title) || null;
  const resourceNodes = () =>
    treeNodes().filter((node) => !isLectureNode(node) && !isSkipNode(node));
  const childResources = (lecture) =>
    [...lecture.querySelectorAll(":scope > .el-tree-node__children > .el-tree-node")]
      .filter((node) => visible(node) && inSidebar(node) && !isSkipNode(node));
  const currentResourceNode = () => {
    const resources = resourceNodes();
    const selected = resources.find((node) => nodeClass(node).includes("is-current"));
    if (selected) return selected;

    const titleMatch = text(document.body).match(/(?:^|\s)(\d{2}\s+[^\n\r]+?)\s+课程目录/);
    if (!titleMatch) return null;
    const currentTitle = titleMatch[1].trim();
    return resources.find((node) => nodeTitle(node) === currentTitle) || null;
  };
  const lectureForResource = (node) => node?.parentElement?.closest?.(".node-folder-l0") || null;
  const clickTreeNode = (node) => {
    const target = nodeContent(node);
    if (!target) return false;
    target.scrollIntoView({ block: "center" });
    target.click();
    return true;
  };
  const expandLecture = (lecture) => {
    if (!lecture || nodeClass(lecture).includes("is-expanded")) return false;
    const icon = lecture.querySelector(":scope > .el-tree-node__content .el-tree-node__expand-icon:not(.is-leaf)");
    const target = icon || nodeContent(lecture);
    if (!target) return false;
    target.scrollIntoView({ block: "center" });
    target.click();
    return true;
  };
  const playCurrentVideo = (delay = NEXT_PLAY_DELAY_MS) => {
    setTimeout(() => {
      const video = document.querySelector("video");
      applySpeed(video);
      video?.play?.().catch(() => {});
    }, delay);
  };
  const openFirstVideoInLecture = (lecture, retry = 0) => {
    if (!lecture) {
      toast("没找到下一讲");
      return false;
    }
    const lectureTitle = nodeTitle(lecture);
    const liveLecture = findLectureByTitle(lectureTitle) || lecture;
    if (!nodeClass(liveLecture).includes("is-expanded")) {
      expandLecture(liveLecture);
      setTimeout(() => openFirstVideoInLecture(findLectureByTitle(lectureTitle) || liveLecture, retry + 1), 700);
      return true;
    }

    const children = childResources(liveLecture);
    const ppt = children.find(isPptNode);
    const firstVideo = children.find(isVideoNode);
    if (ppt && firstVideo) {
      const firstVideoTitle = nodeTitle(firstVideo);
      clickTreeNode(ppt);
      toast("已打开下一讲课件");
      setTimeout(() => {
        const refreshedLecture = findLectureByTitle(lectureTitle) || liveLecture;
        const refreshedVideo =
          childResources(refreshedLecture).find((node) => nodeTitle(node) === firstVideoTitle) || firstVideo;
        clickTreeNode(refreshedVideo);
        toast("已切到下一讲第一个视频");
        playCurrentVideo();
      }, PPT_TO_VIDEO_DELAY_MS);
      return true;
    }
    if (firstVideo) {
      clickTreeNode(firstVideo);
      toast("已切到下一讲第一个视频");
      playCurrentVideo();
      return true;
    }
    if (retry < 4) {
      expandLecture(liveLecture);
      setTimeout(() => openFirstVideoInLecture(findLectureByTitle(lectureTitle) || liveLecture, retry + 1), 700);
      return true;
    }
    toast("没找到下一讲视频");
    return false;
  };
  const goNext = () => {
    if (autoNextLocked) return;
    autoNextLocked = true;
    setTimeout(() => {
      autoNextLocked = false;
    }, PPT_TO_VIDEO_DELAY_MS + NEXT_PLAY_DELAY_MS + 1200);

    const current = currentResourceNode();
    if (!current) {
      toast("没找到当前课节");
      return;
    }

    const lecture = lectureForResource(current);
    const children = lecture ? childResources(lecture) : resourceNodes();
    const currentIndex = children.indexOf(current);
    const nextVideo = children.slice(currentIndex + 1).find(isVideoNode);
    if (nextVideo) {
      clickTreeNode(nextVideo);
      toast("已自动切到下一节");
      playCurrentVideo();
      return;
    }

    const lectures = lectureNodes();
    const lectureIndex = lectures.indexOf(lecture);
    const nextLecture = lectures.slice(lectureIndex + 1).find(isLectureNode);
    if (openFirstVideoInLecture(nextLecture)) return;

    toast("没找到下一节");
  };
  const bind = () => {
    const video = document.querySelector("video");
    if (!video) return;
    ensureSpeedControl();
    if (video.__codexAutoNextHandler !== goNext) {
      if (video.__codexAutoNextHandler) {
        video.removeEventListener("ended", video.__codexAutoNextHandler);
      }
      video.__codexAutoNextHandler = goNext;
      video.__codexAutoNext = true;
      video.addEventListener("ended", video.__codexAutoNextHandler);
      toast("已开启：播完自动下一节");
    }
    if (!video.__codexAutoNextRateKeeper) {
      video.__codexAutoNextRateKeeper = true;
      video.addEventListener("loadedmetadata", () => applySpeed(video));
      video.addEventListener("playing", () => applySpeed(video));
      video.addEventListener("ratechange", () => {
        if (!video.__codexAutoNextApplyingRate) setTimeout(() => applySpeed(video), 0);
      });
    }
    applySpeed(video);
  };
  clearInterval(window.__codexAutoNextTimer);
  window.__codexAutoNextTimer = setInterval(bind, 1000);
  bind();
  return "auto-next installed";
})();
