async function handler(req, res) {
  if (req.method && req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed." });
  }

  const headers = { Accept: "application/vnd.github+json" };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  try {
    const response = await fetch(
      "https://api.github.com/users/Mohamed-Irfan-git/repos?per_page=100&type=owner&sort=updated",
      { headers, signal: AbortSignal.timeout(9000) },
    );
    const data = await response.json();
    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=3600");
    return res.status(response.status).json(data);
  } catch {
    return res
      .status(502)
      .json({ message: "GitHub is temporarily unavailable." });
  }
}
module.exports = handler;
