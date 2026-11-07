const username = 'Mhd_irfan369';
const graphqlQuery = `
  query PortfolioLeetCodeStats($username: String!) {
    allQuestionsCount { difficulty count }
    matchedUser(username: $username) {
      username
      profile { ranking }
      submitStatsGlobal {
        acSubmissionNum { difficulty count submissions }
      }
    }
    userContestRanking(username: $username) {
      attendedContestsCount
      rating
      globalRanking
    }
  }
`;

function respond(res, status, body) {
  return res.status(status).json(body);
}

async function handler(req, res) {
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
  if (req.method && req.method !== 'GET') return respond(res, 405, { message: 'Method not allowed.' });

  try {
    const response = await fetch('https://leetcode.com/graphql/', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Origin: 'https://leetcode.com',
        Referer: 'https://leetcode.com/',
        'User-Agent': 'BeyondTheSurfacePortfolio/1.0',
      },
      body: JSON.stringify({ query: graphqlQuery, variables: { username } }),
      signal: AbortSignal.timeout(12000),
    });
    if (!response.ok) return respond(res, 502, { message: 'LeetCode could not provide profile stats.' });

    const payload = await response.json();
    const profile = payload.data?.matchedUser;
    if (!profile) return respond(res, 404, { message: 'No public LeetCode stats were found.' });

    const solved = Object.fromEntries((profile.submitStatsGlobal?.acSubmissionNum ?? []).map((item) => [item.difficulty, item]));
    const questions = Object.fromEntries((payload.data?.allQuestionsCount ?? []).map((item) => [item.difficulty, item.count]));
    const contest = payload.data?.userContestRanking;
    return respond(res, 200, {
      username: profile.username,
      totalSolved: solved.All?.count ?? 0,
      totalQuestions: questions.All ?? 0,
      profileRanking: profile.profile?.ranking ?? null,
      contestRating: contest?.rating ?? null,
      contestsAttended: contest?.attendedContestsCount ?? null,
      contestGlobalRanking: contest?.globalRanking ?? null,
      difficulties: ['Easy', 'Medium', 'Hard'].map((difficulty) => ({
        name: difficulty,
        solved: solved[difficulty]?.count ?? 0,
        total: questions[difficulty] ?? 0,
      })),
    });
  } catch {
    return respond(res, 502, { message: 'LeetCode stats are temporarily unavailable.' });
  }
}

module.exports = handler;
