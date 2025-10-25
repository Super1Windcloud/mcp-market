import React from 'react';

const VersionControlRouteComponent: React.FC = () => {
  // MCP servers in the version control category
  const mcpServers = [
    { name: "adhikasp/mcp-git-ingest", description: "Read and analyze GitHub repositories with your LLM" },
    { name: "ddukbg/github-enterprise-mcp", description: "MCP server for GitHub Enterprise API integration" },
    { name: "gitea/gitea-mcp", description: "Interactive with Gitea instances with MCP." },
    { name: "github/github-mcp-server", description: "Official GitHub server for integration with repository management, PRs, issues, and more." },
    { name: "kaiyuanxiaobing/atomgit-mcp-server", description: "Official AtomGit server for integration with repository management, PRs, issues, branches, labels, and more." },
    { name: "kopfrechner/gitlab-mr-mcp", description: "Interact seamlessly with issues and merge requests of your GitLab projects." },
    { name: "modelcontextprotocol/server-git", description: "Direct Git repository operations including reading, searching, and analyzing local repositories" },
    { name: "modelcontextprotocol/server-gitlab", description: "GitLab platform integration for project management and CI/CD operations" },
    { name: "QuentinCody/github-graphql-mcp-server", description: "Unofficial GitHub MCP server that provides access to GitHub's GraphQL API, enabling more powerful and flexible queries for repository data, issues, pull requests, and other GitHub resources." },
    { name: "Tiberriver256/mcp-server-azure-devops", description: "Azure DevOps integration for repository management, work items, and pipelines." },
    { name: "theonedev/tod", description: "A MCP server for OneDev for CI/CD pipeline editing, issue workflow automation, and pull request review" },
  ];

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold">版本控制</h1>
      <p className="mb-6">版本控制类MCP服务器，用于与Git仓库集成</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mcpServers.map((server, index) => (
          <div key={index} className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
            <h3 className="font-semibold">{server.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{server.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VersionControlRouteComponent;