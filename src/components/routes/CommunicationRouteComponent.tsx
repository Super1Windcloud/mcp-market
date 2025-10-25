import React from 'react';

const CommunicationRouteComponent: React.FC = () => {
  // MCP servers in the communication category
  const mcpServers = [
    { name: "AbdelStark/nostr-mcp", description: "A Nostr MCP server that allows to interact with Nostr, enabling posting notes, and more." },
    { name: "adhikasp/mcp-twikit", description: "Interact with Twitter search and timeline" },
    { name: "agentmail-toolkit/mcp", description: "An MCP server to create inboxes on the fly to send, receive, and take actions on email. We aren't AI agents for email, but email for AI Agents." },
    { name: "areweai/tsgram-mcp", description: "TSgram: Telegram + Claude with local workspace access on your phone in typescript. Read, write, and vibe code on the go!" },
    { name: "arpitbatra123/mcp-googletasks", description: "An MCP server to interface with the Google Tasks API" },
    { name: "Cactusinhand/mcp_server_notify", description: "A MCP server that send desktop notifications with sound effect when agent tasks are completed." },
    { name: "PhononX/cv-mcp-server", description: "MCP Server that connects AI Agents to Carbon Voice. Create, manage, and interact with voice messages, conversations, direct messages, folders, voice memos, AI actions and more in Carbon Voice." },
    { name: "carterlasalle/mac_messages_mcp", description: "An MCP server that securely interfaces with your iMessage database via the Model Context Protocol (MCP), allowing LLMs to query and analyze iMessage conversations. It includes robust phone number validation, attachment processing, contact management, group chat handling, and full support for sending and receiving messages." },
    { name: "chaindead/telegram-mcp", description: "Telegram API integration for accessing user data, managing dialogs (chats, channels, groups), retrieving messages, and handling read status" },
    { name: "chigwell/telegram-mcp", description: "Telegram API integration for accessing user data, managing dialogs (chats, channels, groups), retrieving messages, sending messages and handling read status." },
    { name: "Danielpeter-99/calcom-mcp", description: "MCP server for Calcom. Manage event types, create bookings, and access Cal.com scheduling data through LLMs." },
    { name: "elie222/inbox-zero", description: "An MCP server for Inbox Zero. Adds functionality on top of Gmail like finding out which emails you need to reply to or need to follow up on." },
    { name: "gerkensm/callcenter.js-mcp", description: "An MCP server to make phone calls using VoIP/SIP and OpenAI's Realtime API and observe the transcript." },
    { name: "gitmotion/ntfy-me-mcp", description: "An ntfy MCP server for sending/fetching ntfy notifications to your self-hosted ntfy server from AI Agents (supports secure token auth & more - use with npx or docker!)" },
    { name: "gotoolkits/wecombot", description: "An MCP server application that sends various types of messages to the WeCom group robot." },
    { name: "hannesrudolph/imessage-query-fastmcp-mcp-server", description: "An MCP server that provides safe access to your iMessage database through Model Context Protocol (MCP), enabling LLMs to query and analyze iMessage conversations with proper phone number validation and attachment handling" },
    { name: "i-am-bee/acp-mcp", description: "An MCP server acting as an adapter into the ACP ecosystem. Seamlessly exposes ACP agents to MCP clients, bridging the communication gap between the two protocols." },
    { name: "InditexTech/mcp-teams-server", description: "MCP server that integrates Microsoft Teams messaging (read, post, mention, list members and threads)" },
    { name: "Infobip/mcp", description: "Official Infobip MCP server for integrating Infobip global cloud communication platform. It equips AI agents with communication superpowers, allowing them to send and receive SMS and RCS messages, interact with WhatsApp and Viber, automate communication workflows, and manage customer data, all in a production-ready environment." },
    { name: "jagan-shanmugam/mattermost-mcp-host", description: "A MCP server along with MCP host that provides access to Mattermost teams, channels and messages. MCP host is integrated as a bot in Mattermost with access to MCP servers that can be configured." },
    { name: "jaipandya/producthunt-mcp-server", description: "MCP server for Product Hunt. Interact with trending posts, comments, collections, users, and more." },
    { name: "joinly-ai/joinly", description: "MCP server to interact with browser-based meeting platforms (Zoom, Teams, Google Meet). Enables AI agents to send bots to online meetings, gather live transcripts, speak text, and send messages in the meeting chat." },
    { name: "keturiosakys/bluesky-context-server", description: "Bluesky instance integration for querying and interaction" },
    { name: "khan2a/telephony-mcp-server", description: "MCP Telephony server for automating voice calls with Speech-to-Text and Speech Recognition to summarize call conversations. Send and receive SMS, detect voicemail, and integrate with Vonage APIs for advanced telephony workflows." },
    { name: "korotovsky/slack-mcp-server", description: "The most powerful MCP server for Slack Workspaces." },
    { name: "lharries/whatsapp-mcp", description: "An MCP server for searching your personal WhatsApp messages, contacts and sending messages to individuals or groups" },
    { name: "line/line-bot-mcp-server", description: "MCP Server for Integrating LINE Official Account" },
    { name: "OverQuotaAI/chatterboxio-mcp-server", description: "MCP server implementation for ChatterBox.io, enabling AI agents to send bots to online meetings (Zoom, Google Meet) and obtain transcripts and recordings." },
    { name: "wyattjoh/imessage-mcp", description: "A Model Context Protocol server for reading iMessage data from macOS." },
    { name: "sawa-zen/vrchat-mcp", description: "This is an MCP server for interacting with the VRChat API. You can retrieve information about friends, worlds, avatars, and more in VRChat." },
    { name: "softeria/ms-365-mcp-server", description: "MCP server that connects to Microsoft Office and the whole Microsoft 365 suite using Graph API (including Outlook, mail, files, Excel, calendar)" },
    { name: "saseq/discord-mcp", description: "A MCP server for the Discord integration. Enable your AI assistants to seamlessly interact with Discord. Enhance your Discord experience with powerful automation capabilities." },
    { name: "teddyzxcv/ntfy-mcp", description: "The MCP server that keeps you informed by sending the notification on phone using ntfy" },
    { name: "userad/didlogic_mcp", description: "An MCP server for DIDLogic. Adds functionality to manage SIP endpoints, numbers and destinations." },
    { name: "YCloud-Developers/ycloud-whatsapp-mcp-server", description: "MCP server for WhatsApp Business Platform by YCloud." },
    { name: "zcaceres/gtasks-mcp", description: "An MCP server to Manage Google Tasks" },
    { name: "ztxtxwd/open-feishu-mcp-server", description: "A Model Context Protocol (MCP) server with built-in Feishu OAuth authentication, supporting remote connections and providing comprehensive Feishu document management tools including block creation, content updates, and advanced features." },
  ];

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold">沟通</h1>
      <p className="mb-6">沟通类MCP服务器，用于与通信平台集成</p>
      
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

export default CommunicationRouteComponent;