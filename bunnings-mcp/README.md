# Bunnings MCP

An MCP server that finds the aisle and bay location of products at Bunnings stores.

Searches Bunnings for a similar product and returns where to find it in-store. Doesn't need to be the exact item - finding something similar gets you to the right aisle.

## Setup

```bash
npm install
npm run build
```

Puppeteer will download a Chromium browser on first install.

## Add to Claude Code

Add to your Claude Code MCP settings (`~/.claude/claude_code_config.json`):

```json
{
  "mcpServers": {
    "bunnings": {
      "command": "node",
      "args": ["/path/to/bunnings-mcp/dist/index.js"]
    }
  }
}
```

## Usage

Once connected, ask Claude:

- "Where can I find chain at Bunnings Alexandria?"
- "What aisle are timber screws in at Bunnings?"
- "Find garden hose at Bunnings Northland"

The tool searches bunnings.com.au, opens the first matching product, and returns the aisle/bay number.

## How it works

1. Uses Puppeteer to open bunnings.com.au
2. Searches for the product query
3. Opens the first result's product page
4. Extracts the aisle/bay location info
5. Returns the product name, location, and URL

## Tool

### `find_in_store`

| Parameter | Required | Description |
|-----------|----------|-------------|
| `query` | Yes | What you're looking for (e.g. "chain", "timber screws") |
| `store` | No | Bunnings store name or suburb (e.g. "Alexandria") |
