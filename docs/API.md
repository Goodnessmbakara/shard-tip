# ShardTip API Documentation

This document provides comprehensive documentation for the ShardTip API endpoints.

## Base URL

```
https://shard-tip.vercel.app/api
```

## Authentication

Currently, no authentication is required for API endpoints. All endpoints are publicly accessible.

## Endpoints

### 1. Wallet Verification

Verify wallet activity and tipping history on the Shardeum network.

**Endpoint:** `GET /api/verify`

**Query Parameters:**
- `wallet` (required): Ethereum wallet address to verify

**Example Request:**
```bash
curl "https://shard-tip.vercel.app/api/verify?wallet=0xEdC571996120538dB0F06AEfE5ed0c6bfa70BfB0"
```

**Example Response:**
```json
{
  "status": "success",
  "data": {
    "verified": true,
    "wallet": "0xEdC571996120538dB0F06AEfE5ed0c6bfa70BfB0",
    "metrics": {
      "totalTipsSent": "1.15",
      "totalTipsReceived": "0.0",
      "pendingTips": "0.0",
      "tipTransactions": 4,
      "claimTransactions": 0,
      "totalTransactions": 4,
      "recentActivity": true,
      "hasMinimumActivity": true,
      "hasRecentActivity": true
    },
    "criteria": {
      "minimumTipAmount": "0.001",
      "minimumTotalSent": "0.005",
      "minimumTransactions": 1,
      "timeWindow": "7 days"
    },
    "reason": "Wallet has completed required tipping activities",
    "verificationDate": "2025-08-30T16:20:12.863Z"
  },
  "timestamp": "2025-08-30T16:20:12.864Z",
  "network": "Shardeum Unstablenet",
  "chainId": 8080
}
```

**Response Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `status` | string | Response status ("success" or "error") |
| `data.verified` | boolean | Whether the wallet meets verification criteria |
| `data.wallet` | string | The verified wallet address |
| `data.metrics.totalTipsSent` | string | Total SHM sent in tips |
| `data.metrics.totalTipsReceived` | string | Total SHM received in tips |
| `data.metrics.pendingTips` | string | Pending tips available to claim |
| `data.metrics.tipTransactions` | number | Number of tip transactions sent |
| `data.metrics.claimTransactions` | number | Number of tip claim transactions |
| `data.metrics.totalTransactions` | number | Total number of transactions |
| `data.metrics.recentActivity` | boolean | Has activity in the last 7 days |
| `data.metrics.hasMinimumActivity` | boolean | Meets minimum activity requirements |
| `data.metrics.hasRecentActivity` | boolean | Has recent activity |
| `data.criteria.minimumTipAmount` | string | Minimum tip amount required |
| `data.criteria.minimumTotalSent` | string | Minimum total sent required |
| `data.criteria.minimumTransactions` | number | Minimum transactions required |
| `data.criteria.timeWindow` | string | Time window for recent activity |
| `data.reason` | string | Explanation of verification result |
| `data.verificationDate` | string | ISO timestamp of verification |
| `timestamp` | string | API response timestamp |
| `network` | string | Blockchain network name |
| `chainId` | number | Blockchain chain ID |

**Error Response:**
```json
{
  "status": "error",
  "error": "Invalid wallet address provided",
  "timestamp": "2025-08-30T16:20:12.864Z"
}
```

**Verification Criteria:**

A wallet is considered verified if it meets ALL of the following criteria:

1. **Minimum Tip Amount**: Has sent at least 0.001 SHM in a single tip
2. **Minimum Total Sent**: Has sent at least 0.005 SHM total in tips
3. **Minimum Transactions**: Has completed at least 1 tip transaction
4. **Recent Activity**: Has been active within the last 7 days

**HTTP Status Codes:**

| Code | Description |
|------|-------------|
| 200 | Success - Wallet verified |
| 400 | Bad Request - Invalid wallet address |
| 500 | Internal Server Error |

## Smart Contract Integration

The API integrates with the ShardTip smart contract deployed on Shardeum Unstablenet:

**Contract Address:** `0xA61BBB8C3FE06D39E52c2CbC22190Ddb344d86D9`

**Key Functions:**
- `tip(address creator)` - Send tips to creators
- `claimTips()` - Claim accumulated tips
- `getPendingTips(address)` - View pending tips
- `getCreatorStats(address)` - Get creator statistics

## Rate Limiting

Currently, no rate limiting is implemented. However, please use the API responsibly.

## Error Handling

All API responses include a `status` field indicating success or error. Error responses include an `error` field with a descriptive message.

**Common Error Messages:**
- `"Invalid wallet address provided"` - Invalid Ethereum address format
- `"Wallet address is required"` - Missing wallet parameter
- `"Failed to fetch blockchain data"` - Network or contract interaction error

## Usage Examples

### JavaScript/Node.js
```javascript
const verifyWallet = async (walletAddress) => {
  try {
    const response = await fetch(
      `https://shard-tip.vercel.app/api/verify?wallet=${walletAddress}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error verifying wallet:', error);
    throw error;
  }
};

// Usage
const result = await verifyWallet('0xEdC571996120538dB0F06AEfE5ed0c6bfa70BfB0');
console.log('Verification result:', result.data.verified);
```

### Python
```python
import requests

def verify_wallet(wallet_address):
    url = f"https://shard-tip.vercel.app/api/verify?wallet={wallet_address}"
    response = requests.get(url)
    return response.json()

# Usage
result = verify_wallet("0xEdC571996120538dB0F06AEfE5ed0c6bfa70BfB0")
print(f"Verified: {result['data']['verified']}")
```

### cURL
```bash
# Verify a wallet
curl "https://shard-tip.vercel.app/api/verify?wallet=0xEdC571996120538dB0F06AEfE5ed0c6bfa70BfB0"

# Pretty print JSON response
curl "https://shard-tip.vercel.app/api/verify?wallet=0xEdC571996120538dB0F06AEfE5ed0c6bfa70BfB0" | jq
```

## Support

For API support or questions:
- **GitHub Issues**: [https://github.com/Goodnessmbakara/shard-tip/issues](https://github.com/Goodnessmbakara/shard-tip/issues)
- **Live Demo**: [https://shard-tip.vercel.app/](https://shard-tip.vercel.app/)

## Changelog

### v1.0.0 (Current)
- Initial API release
- Wallet verification endpoint
- Shardeum Unstablenet integration
- Real-time blockchain data fetching
