const profileUrl = "https://leetcode.com/u/Mhd_irfan369/";
const formatCount = (value) => new Intl.NumberFormat("en-US").format(value);

function setText(id, value) {
  const element = document.getElementById(id);
  if (element) element.textContent = value;
}

function renderDifficultyRows(difficulties) {
  const root = document.getElementById("leetcode-difficulty");
  if (!root) return;

  root.replaceChildren();
  difficulties.forEach(({ name, solved, total }) => {
    const row = document.createElement("div");
    row.className = `difficulty-row difficulty-${name.toLowerCase()}`;

    const heading = document.createElement("div");
    heading.className = "difficulty-heading";
    const label = document.createElement("span");
    label.textContent = name;
    const count = document.createElement("span");
    count.textContent = `${formatCount(solved)} / ${formatCount(total)}`;
    heading.append(label, count);

    const track = document.createElement("div");
    track.className = "difficulty-track";
    track.setAttribute("aria-hidden", "true");
    const fill = document.createElement("span");
    fill.style.width = `${total ? Math.min(100, (solved / total) * 100) : 0}%`;
    track.append(fill);

    row.append(heading, track);
    root.append(row);
  });
}

function showUnavailable() {
  const status = document.getElementById("leetcode-status");
  const dashboard = document.getElementById("leetcode-dashboard");
  if (dashboard) dashboard.setAttribute("aria-busy", "false");
  setText("leetcode-total-context", "Visit profile for current stats");
  const difficulty = document.getElementById("leetcode-difficulty");
  if (difficulty)
    difficulty.textContent = "Difficulty breakdown is temporarily unavailable.";
  if (!status) return;
  status.replaceChildren(
    document.createTextNode("Live LeetCode stats are unavailable right now. "),
  );
  const link = document.createElement("a");
  link.href = profileUrl;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.textContent = "View the LeetCode profile ↗";
  status.append(link);
}

export async function loadLeetCodePerformance() {
  const dashboard = document.getElementById("leetcode-dashboard");
  const status = document.getElementById("leetcode-status");
  const profileLink = document.getElementById("leetcode-profile-link");
  if (profileLink) profileLink.href = profileUrl;
  if (!dashboard) return;

  try {
    const response = await fetch("/api/leetcode", { cache: "no-store" });
    if (!response.ok) throw new Error("LeetCode stats request failed");
    const stats = await response.json();
    if (stats.username !== "Mhd_irfan369" || !Array.isArray(stats.difficulties))
      throw new Error("Invalid LeetCode stats");

    setText("leetcode-total-solved", formatCount(stats.totalSolved));
    setText(
      "leetcode-total-context",
      `of ${formatCount(stats.totalQuestions)} problems`,
    );
    setText(
      "leetcode-profile-rank",
      stats.profileRanking ? `#${formatCount(stats.profileRanking)}` : "—",
    );
    setText(
      "leetcode-contest-rating",
      stats.contestRating
        ? Math.round(stats.contestRating).toLocaleString("en-US")
        : "—",
    );
    setText(
      "leetcode-contests",
      stats.contestsAttended === null
        ? "—"
        : formatCount(stats.contestsAttended),
    );

    const ring = document.getElementById("leetcode-progress-ring");
    if (ring) {
      const circumference = 282.74;
      const ratio = stats.totalQuestions
        ? Math.min(1, stats.totalSolved / stats.totalQuestions)
        : 0;
      ring.style.strokeDasharray = String(circumference);
      ring.style.strokeDashoffset = String(circumference * (1 - ratio));
    }
    renderDifficultyRows(stats.difficulties);
    dashboard.setAttribute("aria-busy", "false");
    if (status) status.textContent = `Live public stats for ${stats.username}.`;
  } catch {
    showUnavailable();
  }
}
