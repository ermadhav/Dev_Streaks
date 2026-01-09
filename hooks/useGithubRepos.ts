import { useEffect, useState } from "react";

const GITHUB_TOKEN = process.env.EXPO_PUBLIC_GITHUB_TOKEN!;

type Repo = {
  id: string;
  name: string;
  description: string;
  stars: number;
  language: string;
  url: string;
};

type CacheEntry = {
  starred: Repo[];
  popular: Repo[];
};

const repoCache = new Map<string, CacheEntry>(); // MEMORY CACHE

export function useGithubRepos(username: string) {
  const [starred, setStarred] = useState<Repo[]>([]);
  const [popular, setPopular] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!username) return;

    //  RETURN CACHED DATA IF AVAILABLE
    const cached = repoCache.get(username);
    if (cached) {
      setStarred(cached.starred);
      setPopular(cached.popular);
      return;
    }

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
                      id
                      name
                      description
                      stargazerCount
                      primaryLanguage { name }
                      url
                    }
                  }
                  repositories(
                    first: 6
                    ownerAffiliations: OWNER
                    orderBy: { field: STARGAZERS, direction: DESC }
                  ) {
                    nodes {
                      id
                      name
                      description
                      stargazerCount
                      primaryLanguage { name }
                      url
                    }
                  }
                }
              }
            `,
            variables: { username },
          }),
        });

        const json = await res.json();
        const user = json?.data?.user;

        if (!user) throw new Error("User not found");

        const starredRepos: Repo[] =
          user.starredRepositories.nodes.map(mapRepo);

        const popularRepos: Repo[] =
          user.repositories.nodes.map(mapRepo);

        // SAVE STATE
        setStarred(starredRepos);
        setPopular(popularRepos);

        // SAVE CACHE
        repoCache.set(username, {
          starred: starredRepos,
          popular: popularRepos,
        });
      } catch (e) {
        console.log("Repo fetch error:", e);
        setStarred([]);
        setPopular([]);
      } finally {
        setLoading(false);
      }
    }

    fetchRepos();
  }, [username]);

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
