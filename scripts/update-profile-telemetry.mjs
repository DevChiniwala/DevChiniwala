import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const API_ROOT = "https://api.github.com";
const DEFAULT_OWNER = "DevChiniwala";
const owner = (
  process.env.PROFILE_OWNER ||
  process.env.GITHUB_REPOSITORY_OWNER ||
  process.env.GITHUB_REPOSITORY?.split("/")[0] ||
  DEFAULT_OWNER
).trim();

if (!owner) {
  throw new Error("A GitHub profile owner is required.");
}

const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
const headers = {
  Accept: "application/vnd.github+json",
  "User-Agent": "profile-telemetry-generator",
  "X-GitHub-Api-Version": "2022-11-28",
};

if (token) {
  headers.Authorization = `Bearer ${token}`;
}

async function github(pathname) {
  const response = await fetch(`${API_ROOT}${pathname}`, { headers });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(
      `GitHub API request failed (${response.status} ${response.statusText}) for ${pathname}: ${body.slice(0, 300)}`,
    );
  }

  return response.json();
}

async function listOwnedPublicRepositories(login) {
  const repositories = [];

  for (let page = 1; ; page += 1) {
    const batch = await github(
      `/users/${encodeURIComponent(login)}/repos?type=owner&sort=full_name&direction=asc&per_page=100&page=${page}`,
    );

    repositories.push(...batch);

    if (batch.length < 100) {
      break;
    }
  }

  return repositories.filter(
    (repository) =>
      repository.private === false &&
      repository.owner?.login?.toLowerCase() === login.toLowerCase(),
  );
}

async function listMergedPublicPullRequests(login) {
  const pullRequests = [];
  const query = `author:${login} is:pr is:merged is:public`;

  for (let page = 1; ; page += 1) {
    const result = await github(
      `/search/issues?q=${encodeURIComponent(query)}&sort=updated&order=desc&per_page=100&page=${page}`,
    );

    pullRequests.push(...result.items);

    if (
      result.items.length < 100 ||
      pullRequests.length >= Math.min(result.total_count, 1000)
    ) {
      return {
        total: result.total_count,
        items: pullRequests,
      };
    }
  }
}

async function collectTelemetry() {
  const user = await github(`/users/${encodeURIComponent(owner)}`);
  const canonicalOwner = user.login;
  const ownedPublicRepositories = await listOwnedPublicRepositories(canonicalOwner);
  const mergedPullRequests = await listMergedPublicPullRequests(canonicalOwner);
  const sourceRepositories = ownedPublicRepositories.filter(
    (repository) => repository.fork === false,
  );

  const languageResults = await Promise.all(
    sourceRepositories.map((repository) =>
      github(
        `/repos/${encodeURIComponent(canonicalOwner)}/${encodeURIComponent(repository.name)}/languages`,
      ),
    ),
  );

  const languageBytes = new Map();
  for (const languages of languageResults) {
    for (const [language, bytes] of Object.entries(languages)) {
      languageBytes.set(language, (languageBytes.get(language) || 0) + bytes);
    }
  }

  const totalLanguageBytes = [...languageBytes.values()].reduce(
    (total, bytes) => total + bytes,
    0,
  );
  const rankedLanguages = [...languageBytes.entries()].sort(
    ([nameA, bytesA], [nameB, bytesB]) =>
      bytesB - bytesA || nameA.localeCompare(nameB),
  );
  const visibleLanguages = rankedLanguages.slice(0, 6);
  const otherBytes = rankedLanguages
    .slice(6)
    .reduce((total, [, bytes]) => total + bytes, 0);

  if (otherBytes > 0) {
    visibleLanguages.push(["Other", otherBytes]);
  }

  const externalRepositoriesContributed = new Set(
    mergedPullRequests.items
      .map((pullRequest) => pullRequest.repository_url.split("/repos/")[1])
      .filter(Boolean)
      .filter(
        (fullName) =>
          !fullName.toLowerCase().startsWith(`${canonicalOwner.toLowerCase()}/`),
      ),
  );

  return {
    owner: canonicalOwner,
    publicRepositories: user.public_repos,
    ownedSourceRepositories: sourceRepositories.length,
    ownedSourceStars: sourceRepositories.reduce(
      (total, repository) => total + repository.stargazers_count,
      0,
    ),
    mergedPublicPullRequests: mergedPullRequests.total,
    externalRepositoriesContributed: externalRepositoriesContributed.size,
    generatedDate: new Date().toISOString().slice(0, 10),
    languages: visibleLanguages.map(([name, bytes]) => ({
      name,
      bytes,
      percentage: totalLanguageBytes === 0 ? 0 : (bytes / totalLanguageBytes) * 100,
    })),
    totalLanguageBytes,
  };
}

function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function metricCard({ x, index, value, label, detail }) {
  return `
    <g transform="translate(${x} 96)">
      <rect width="286" height="146" rx="5" fill="#10141D" stroke="#7A8A9E" stroke-width="1"/>
      <rect width="4" height="146" rx="2" fill="#00E5FF"/>
      <text class="index" x="260" y="27" text-anchor="end">${index}</text>
      <text class="metric" x="24" y="79">${escapeXml(value)}</text>
      <text class="label" x="24" y="108">${escapeXml(label)}</text>
      <text class="detail" x="24" y="130">${escapeXml(detail)}</text>
    </g>`;
}

function languageRows(languages) {
  if (languages.length === 0) {
    return '<text class="detail" x="32" y="112">No language data reported by GitHub.</text>';
  }

  return languages
    .map((language, index) => {
      const y = 80 + index * 25;
      const width = Math.max(2, Math.round((language.percentage / 100) * 530));
      const delay = (index * 0.12).toFixed(2);
      return `
      <text class="language" x="32" y="${y}">${escapeXml(language.name.toUpperCase())}</text>
      <rect x="190" y="${y - 11}" width="530" height="10" rx="2" fill="#080B10"/>
      <rect class="bar" x="190" y="${y - 11}" width="${width}" height="10" rx="2" fill="#00E5FF" opacity="0.82" style="animation-delay:${delay}s"/>
      <text class="percentage" x="752" y="${y}" text-anchor="end">${language.percentage.toFixed(1)}%</text>`;
    })
    .join("");
}

function renderSvg(data) {
  const cards = [
    {
      x: 32,
      index: "01",
      value: data.publicRepositories,
      label: "PUBLIC REPOSITORIES",
      detail: "reported by GitHub",
    },
    {
      x: 334,
      index: "02",
      value: data.ownedSourceStars,
      label: "STARS ACROSS OWNED SOURCE",
      detail: "public · excludes forks",
    },
    {
      x: 636,
      index: "03",
      value: data.mergedPublicPullRequests,
      label: "MERGED PULL REQUESTS",
      detail: "public GitHub search",
    },
    {
      x: 938,
      index: "04",
      value: data.externalRepositoriesContributed,
      label: "EXTERNAL REPOS CONTRIBUTED",
      detail: "unique public repositories",
    },
  ]
    .map(metricCard)
    .join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 560" width="1280" height="560" role="img" aria-labelledby="title desc">
  <title id="title">${escapeXml(data.owner)} GitHub profile telemetry</title>
  <desc id="desc">Daily generated public repository, star, merged pull request, external contribution, and language statistics from the GitHub REST API.</desc>

  <defs>
    <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
      <path d="M32 0H0V32" fill="none" stroke="#7A8A9E" stroke-width="0.5" opacity="0.1"/>
    </pattern>
    <linearGradient id="scan-gradient" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#00E5FF" stop-opacity="0"/>
      <stop offset="0.5" stop-color="#00E5FF" stop-opacity="0.12"/>
      <stop offset="1" stop-color="#00E5FF" stop-opacity="0"/>
    </linearGradient>
    <filter id="glow" x="-120%" y="-120%" width="340%" height="340%">
      <feGaussianBlur stdDeviation="3" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <style>
    .mono { font-family: 'JetBrains Mono','Fira Code','SF Mono','Cascadia Code',monospace; }
    .index { font-size: 10px; font-weight: 700; fill: #7A8A9E; letter-spacing: 1.2px; }
    .metric { font-size: 42px; font-weight: 900; fill: #F8FAFC; letter-spacing: 1px; }
    .label { font-size: 11px; font-weight: 700; fill: #00E5FF; letter-spacing: 1.15px; }
    .detail { font-size: 9px; font-weight: 500; fill: #7A8A9E; letter-spacing: 0.45px; }
    .language { font-size: 11px; font-weight: 700; fill: #F8FAFC; letter-spacing: 0.7px; }
    .percentage { font-size: 10px; font-weight: 700; fill: #7DF9FF; }
    .scan { animation: scan 9s linear infinite; }
    .bar { animation: reveal 1s ease-out both; transform-box: fill-box; transform-origin: left center; }
    .pulse { animation: pulse 2.8s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
    .orbit { animation: orbit 7s linear infinite; transform-box: fill-box; transform-origin: center; }
    .flow { animation: flow 2.4s linear infinite; }
    @keyframes scan {
      from { transform: translateX(-440px); }
      to { transform: translateX(1720px); }
    }
    @keyframes reveal {
      from { transform: scaleX(0); opacity: 0.25; }
      to { transform: scaleX(1); opacity: 0.82; }
    }
    @keyframes pulse {
      0%, 100% { opacity: 0.42; transform: scale(0.82); }
      50% { opacity: 1; transform: scale(1); }
    }
    @keyframes orbit {
      to { transform: rotate(360deg); }
    }
    @keyframes flow {
      to { stroke-dashoffset: -24; }
    }
    @media (prefers-reduced-motion: reduce) {
      .scan, .bar, .pulse, .orbit, .flow { animation: none; }
    }
  </style>

  <rect width="1280" height="560" fill="#080B10"/>
  <rect width="1280" height="560" fill="url(#grid)"/>
  <rect x="0.75" y="0.75" width="1278.5" height="558.5" fill="none" stroke="#00E5FF" stroke-width="1.5" opacity="0.85"/>
  <rect class="scan" x="-440" y="1" width="440" height="558" fill="url(#scan-gradient)"/>

  <g class="mono">
    <text x="32" y="38" font-size="12" font-weight="700" fill="#00E5FF" letter-spacing="2.7">PROFILE TELEMETRY // LIVE PUBLIC DATA</text>
    <g transform="translate(965 30)">
      <circle class="pulse" cx="0" cy="0" r="4" fill="#7DF9FF" filter="url(#glow)"/>
      <text x="14" y="4" font-size="9" font-weight="700" fill="#7DF9FF" letter-spacing="1.3">DAILY SYNC</text>
    </g>
    <text x="1248" y="38" text-anchor="end" font-size="9" fill="#7A8A9E" letter-spacing="1.1">GENERATED ${escapeXml(data.generatedDate)} UTC</text>
    <line x1="32" y1="60" x2="1248" y2="60" stroke="#7A8A9E" stroke-width="1" opacity="0.28"/>

${cards}

    <g transform="translate(32 266)">
      <rect width="790" height="258" rx="5" fill="#10141D" stroke="#7A8A9E" stroke-width="1"/>
      <text x="24" y="31" font-size="12" font-weight="700" fill="#00E5FF" letter-spacing="2">LANGUAGE DISTRIBUTION</text>
      <text x="766" y="31" text-anchor="end" font-size="9" fill="#7A8A9E" letter-spacing="1">BY GITHUB-DETECTED BYTES</text>
      <line x1="24" y1="46" x2="766" y2="46" stroke="#7A8A9E" stroke-width="1" opacity="0.24"/>
${languageRows(data.languages)}
    </g>

    <g transform="translate(838 266)">
      <rect width="410" height="258" rx="5" fill="#10141D" stroke="#7A8A9E" stroke-width="1"/>
      <text x="24" y="31" font-size="12" font-weight="700" fill="#00E5FF" letter-spacing="2">DATA SCOPE</text>
      <text x="386" y="31" text-anchor="end" font-size="9" fill="#7A8A9E" letter-spacing="1">GITHUB REST API</text>
      <line x1="24" y1="46" x2="386" y2="46" stroke="#7A8A9E" stroke-width="1" opacity="0.24"/>

      <g transform="translate(98 135)">
        <circle r="56" fill="#080B10" stroke="#00E5FF" stroke-width="1.5" opacity="0.95"/>
        <circle class="orbit" r="77" fill="none" stroke="#7A8A9E" stroke-width="1" stroke-dasharray="2 9" opacity="0.55"/>
        <circle class="pulse" cx="0" cy="0" r="9" fill="#00E5FF" filter="url(#glow)"/>
        <circle class="orbit" cx="0" cy="-77" r="5" fill="#7DF9FF"/>
        <path class="flow" d="M-42 0H42" fill="none" stroke="#7DF9FF" stroke-width="1.4" stroke-dasharray="6 6" opacity="0.58"/>
      </g>

      <g transform="translate(206 79)">
        <text font-size="10" font-weight="700" fill="#F8FAFC" letter-spacing="1.1">OWNED REPOSITORIES</text>
        <text class="detail" y="21">public repositories only</text>
        <text y="61" font-size="10" font-weight="700" fill="#F8FAFC" letter-spacing="1.1">SOURCE FILTER</text>
        <text class="detail" y="82">forks excluded from stars + code</text>
        <text y="122" font-size="10" font-weight="700" fill="#F8FAFC" letter-spacing="1.1">AUTOMATED REFRESH</text>
        <text class="detail" y="143">daily via GitHub Actions</text>
      </g>
    </g>

    <text x="32" y="546" font-size="8" fill="#7A8A9E" letter-spacing="0.8">COUNTS ARE A CURRENT SNAPSHOT · LANGUAGE SHARE USES OWNED NON-FORK PUBLIC REPOSITORIES</text>
  </g>
</svg>
`;
}

const data = await collectTelemetry();

if (process.argv.includes("--summary")) {
  process.stdout.write(`${JSON.stringify(data, null, 2)}\n`);
} else {
  const svg = renderSvg(data);
  const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
  const repositoryRoot = path.resolve(scriptDirectory, "..");
  const outputPath = process.env.PROFILE_TELEMETRY_OUTPUT
    ? path.resolve(process.env.PROFILE_TELEMETRY_OUTPUT)
    : path.join(repositoryRoot, "assets", "telemetry.svg");

  if (process.argv.includes("--stdout")) {
    process.stdout.write(svg);
  } else if (process.argv.includes("--check")) {
    const currentSvg = await readFile(outputPath, "utf8");

    if (currentSvg !== svg) {
      throw new Error(`${outputPath} is not current.`);
    }

    process.stdout.write(`${outputPath} is current.\n`);
  } else {
    await mkdir(path.dirname(outputPath), { recursive: true });
    await writeFile(outputPath, svg, "utf8");
    process.stdout.write(`Updated ${outputPath}\n`);
  }
}
