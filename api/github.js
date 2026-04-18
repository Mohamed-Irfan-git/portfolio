export default async function handler(req, res) {
  const GH = "Mohamed-Irfan-git";

  try {
    const r = await fetch(
      `https://api.github.com/users/${GH}/repos?per_page=100&type=public`,
      {
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`
        }
      }
    );

    const data = await r.json();
    res.status(r.status).json(data);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}