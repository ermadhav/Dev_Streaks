import { useEffect, useState } from "react";

const GITHUB_TOKEN = process.env.EXPO_PUBLIC_GITHUB_TOKEN ?? "";

type Repo = {
  id: string;
  name: string;
  description: string;
  stars: number;
  language: string;
  url: string;
};

const repoCache = new Map<string, { starred: Repo[]; popular: Repo[] }>();

export function useGithubRepos(username: string, enabled = true) {
  const cleanUsername = username.trim();
  const [starred, setStarred] = useState<Repo[]>([]);
  const [popular, setPopular] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!enabled || !cleanUsername || !GITHUB_TOKEN) return;

    const cached = repoCache.get(cleanUsername);
    if (cached) {
      setStarred(cached.starred);
      setPopular(cached.popular);
      return;
    }

    let cancelled = false;

    async function fetchRepos() {
      try {
        setLoading(true);

        const res = await fetch("https://api.github.com/graphql", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${GITHUB_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: `
              query ($username: String!) {
                user(login: $username) {
                  starredRepositories(first: 6) {
                    nodes {
                      id name description stargazerCount
                      primaryLanguage { name } url
                    }
                  }
                  repositories(
                    first: 6
                    ownerAffiliations: OWNER
                    orderBy: { field: STARGAZERS, direction: DESC }
                  ) {
                    nodes {
                      id name description stargazerCount
                      primaryLanguage { name } url
                    }
                  }
                }
              }
            `,
            variables: { username: cleanUsername },
          }),
        });

        const json = await res.json();
        const user = json?.data?.user;
        if (!user) return;

        const starredRepos = user.starredRepositories.nodes.map(mapRepo);
        const popularRepos = user.repositories.nodes.map(mapRepo);

        if (!cancelled) {
          setStarred(starredRepos);
          setPopular(popularRepos);
        }

        repoCache.set(cleanUsername, {
          starred: starredRepos,
          popular: popularRepos,
        });
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchRepos();
    return () => {
      cancelled = true;
    };
  }, [cleanUsername, enabled]);

  return { starred, popular, loading };
}

function mapRepo(r: any): Repo {
  return {
    id: r.id,
    name: r.name,
    description: r.description || "No description",
    stars: r.stargazerCount,
    language: r.primaryLanguage?.name || "—",
    url: r.url,
  };
}
