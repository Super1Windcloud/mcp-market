import React from 'react';

const CloudRouteComponent: React.FC = () => {
  // MCP servers in the cloud platforms category
  const mcpServers = [
    { name: "4everland/4everland-hosting-mcp", description: "An MCP server implementation for 4EVERLAND Hosting enabling instant deployment of AI-generated code to decentralized storage networks like Greenfield, IPFS, and Arweave." },
    { name: "aashari/mcp-server-aws-sso", description: "AWS Single Sign-On (SSO) integration enabling AI systems to securely interact with AWS resources by initiating SSO login, listing accounts/roles, and executing AWS CLI commands using temporary credentials." },
    { name: "alexbakers/mcp-ipfs", description: "upload and manipulation of IPFS storage" },
    { name: "alexei-led/aws-mcp-server", description: "A lightweight but powerful server that enables AI assistants to execute AWS CLI commands, use Unix pipes, and apply prompt templates for common AWS tasks in a safe Docker environment with multi-architecture support" },
    { name: "alexei-led/k8s-mcp-server", description: "A lightweight yet robust server that empowers AI assistants to securely execute Kubernetes CLI commands (`kubectl`, `helm`, `istioctl`, and `argocd`) using Unix pipes in a safe Docker environment with multi-architecture support." },
    { name: "aliyun/alibaba-cloud-ops-mcp-server", description: "A MCP server that enables AI assistants to operation resources on Alibaba Cloud, supporting ECS, Cloud Monitor, OOS and widely used cloud products." },
    { name: "awslabs/mcp", description: "AWS MCP servers for seamless integration with AWS services and resources." },
    { name: "bright8192/esxi-mcp-server", description: "A VMware ESXi/vCenter management server based on MCP (Model Control Protocol), providing simple REST API interfaces for virtual machine management." },
    { name: "cloudflare/mcp-server-cloudflare", description: "Integration with Cloudflare services including Workers, KV, R2, and D1" },
    { name: "cyclops-ui/mcp-cyclops", description: "An MCP server that allows AI agents to manage Kubernetes resources through Cyclops abstraction" },
    { name: "elementfm/mcp", description: "Open source podcast hosting platform" },
    { name: "erikhoward/adls-mcp-server", description: "MCP Server for Azure Data Lake Storage. It can perform manage containers, read/write/upload/download operations on container files and manage file metadata." },
    { name: "espressif/esp-rainmaker-mcp", description: "Official Espressif MCP Server to manage and control ESP RainMaker Devices." },
    { name: "flux159/mcp-server-kubernetes", description: "Typescript implementation of Kubernetes cluster operations for pods, deployments, services." },
    { name: "hardik-id/azure-resource-graph-mcp-server", description: "A Model Context Protocol server for querying and analyzing Azure resources at scale using Azure Resource Graph, enabling AI assistants to explore and monitor Azure infrastructure." },
    { name: "jdubois/azure-cli-mcp", description: "A wrapper around the Azure CLI command line that allows you to talk directly to Azure" },
    { name: "johnneerdael/netskope-mcp", description: "An MCP to give access to all Netskope Private Access components within a Netskope Private Access environments including detailed setup information and LLM examples on usage." },
    { name: "kestra-io/mcp-server-python", description: "Implementation of MCP server for Kestra workflow orchestration platform." },
    { name: "liveblocks/liveblocks-mcp-server", description: "Create, modify, and delete different aspects of Liveblocks such as rooms, threads, comments, notifications, and more. Additionally, it has read access to Storage and Yjs." },
    { name: "manusa/Kubernetes MCP Server", description: "A powerful Kubernetes MCP server with additional support for OpenShift. Besides providing CRUD operations for **any** Kubernetes resource, this server provides specialized tools to interact with your cluster." },
    { name: "Nebula-Block-Data/nebulablock-mcp-server", description: "integrates with the fastmcp library to expose the full range of NebulaBlock API functionalities as accessible tools" },
    { name: "nwiizo/tfmcp", description: "A Terraform MCP server allowing AI assistants to manage and operate Terraform environments, enabling reading configurations, analyzing plans, applying configurations, and managing Terraform state." },
    { name: "openstack-kr/python-openstackmcp-server", description: "OpenStack MCP server for cloud infrastructure management based on openstacksdk." },
    { name: "pibblokto/cert-manager-mcp-server", description: "mcp server for cert-manager management and troubleshooting" },
    { name: "portainer/portainer-mcp", description: "A powerful MCP server that enables AI assistants to seamlessly interact with Portainer instances, providing natural language access to container management, deployment operations, and infrastructure monitoring capabilities." },
    { name: "pulumi/mcp-server", description: "MCP server for interacting with Pulumi using the Pulumi Automation API and Pulumi Cloud API. Enables MCP clients to perform Pulumi operations like retrieving package information, previewing changes, deploying updates, and retrieving stack outputs programmatically." },
    { name: "pythonanywhere/pythonanywhere-mcp-server", description: "MCP server implementation for PythonAnywhere cloud platform." },
    { name: "qiniu/qiniu-mcp-server", description: "A MCP built on Qiniu Cloud products, supporting access to Qiniu Cloud Storage, media processing services, etc." },
    { name: "redis/mcp-redis-cloud", description: "Manage your Redis Cloud resources effortlessly using natural language. Create databases, monitor subscriptions, and configure cloud deployments with simple commands." },
    { name: "reza-gholizade/k8s-mcp-server", description: "A Kubernetes Model Context Protocol (MCP) server that provides tools for interacting with Kubernetes clusters through a standardized interface, including API resource discovery, resource management, pod logs, metrics, and events." },
    { name: "rohitg00/kubectl-mcp-server", description: "A Model Context Protocol (MCP) server for Kubernetes that enables AI assistants like Claude, Cursor, and others to interact with Kubernetes clusters through natural language." },
    { name: "silenceper/mcp-k8s", description: "MCP-K8S is an AI-driven Kubernetes resource management tool that allows users to operate any resources in Kubernetes clusters through natural language interaction, including native resources (like Deployment, Service) and custom resources (CRD). No need to memorize complex commands - just describe your needs, and AI will accurately execute the corresponding cluster operations, greatly enhancing the usability of Kubernetes." },
    { name: "StacklokLabs/mkp", description: "MKP is a Model Context Protocol (MCP) server for Kubernetes that allows LLM-powered applications to interact with Kubernetes clusters. It provides tools for listing and applying Kubernetes resources through the MCP protocol." },
    { name: "StacklokLabs/ocireg-mcp", description: "An SSE-based MCP server that allows LLM-powered applications to interact with OCI registries. It provides tools for retrieving information about container images, listing tags, and more." },
    { name: "strowk/mcp-k8s-go", description: "Kubernetes cluster operations through MCP" },
    { name: "thunderboltsid/mcp-nutanix", description: "Go-based MCP Server for interfacing with Nutanix Prism Central resources." },
    { name: "trilogy-group/aws-pricing-mcp", description: "Get up-to-date EC2 pricing information with one call. Fast. Powered by a pre-parsed AWS pricing catalogue." },
    { name: "VmLia/books-mcp-server", description: "This is an MCP server used for querying books, and it can be applied in common MCP clients, such as Cherry Studio." },
    { name: "weibaohui/k8m", description: "Provides MCP multi-cluster Kubernetes management and operations, featuring a management interface, logging, and nearly 50 built-in tools covering common DevOps and development scenarios. Supports both standard and CRD resources." },
    { name: "weibaohui/kom", description: "Provides MCP multi-cluster Kubernetes management and operations. It can be integrated as an SDK into your own project and includes nearly 50 built-in tools covering common DevOps and development scenarios. Supports both standard and CRD resources." },
    { name: "wenhuwang/mcp-k8s-eye", description: "MCP Server for kubernetes management, and analyze your cluster, application health" },
  ];

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold">云平台</h1>
      <p className="mb-6">云平台类MCP服务器，用于访问云基础设施和资源</p>
      
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

export default CloudRouteComponent;