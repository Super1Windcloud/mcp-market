import React from 'react';

const BioRouteComponent: React.FC = () => {
  // MCP servers in the bio/medicine category
  const mcpServers = [
    { name: "genomoncology/biomcp", description: "Biomedical research MCP server providing access to PubMed, ClinicalTrials.gov, and MyVariant.info." },
    { name: "longevity-genie/biothings-mcp", description: "MCP server to interact with the BioThings API, including genes, genetic variants, drugs, and taxonomic information." },
    { name: "longevity-genie/gget-mcp", description: "MCP server providing a powerful bioinformatics toolkit for genomics queries and analysis, wrapping the popular `gget` library." },
    { name: "longevity-genie/opengenes-mcp", description: "MCP server for a queryable database for aging and longevity research from the OpenGenes project." },
    { name: "longevity-genie/synergy-age-mcp", description: "MCP server for the SynergyAge database of synergistic and antagonistic genetic interactions in longevity." },
    { name: "the-momentum/fhir-mcp-server", description: "MCP Server that connects AI agents to FHIR servers. One example use case is querying patient history in natural language." },
    { name: "wso2/fhir-mcp-server", description: "Model Context Protocol server for Fast Healthcare Interoperability Resources (FHIR) APIs. Provides seamless integration with FHIR servers, enabling AI assistants to search, retrieve, create, update, and analyze clinical healthcare data with SMART-on-FHIR authentication support." },
    { name: "JamesANZ/medical-mcp", description: "An MCP server that provides access to medical information, drug databases, and healthcare resources. Enables AI assistants to query medical data, drug interactions, and clinical guidelines." },
    { name: "the-momentum/apple-health-mcp-server", description: "An MCP server that provides access to exported data from Apple Health. Data analytics included." },
    { name: "OHNLP/omop_mcp", description: "Map clinical terminology to OMOP concepts using LLMs for healthcare data standardization and interoperability." },
  ];

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold">生物医学和生物信息学</h1>
      <p className="mb-6">生物医学和生物信息学类MCP服务器</p>
      
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

export default BioRouteComponent;