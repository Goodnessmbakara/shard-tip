# ShardTip Verification API Documentation

## Overview

The ShardTip Verification API provides a public endpoint to verify whether a wallet address has completed required tipping activities on the Shardeum Unstablenet. This API is designed to support hackathon verification requirements and can be used to confirm user participation in the ShardTip platform.

## Base URL

```
https://your-deployed-app.vercel.app/api/verify
```

## Endpoints

### Verify Wallet Activity

**Endpoint:** `GET /api/verify`

**Description:** Verifies if a wallet address has completed required tipping activities on ShardTip.

**Query Parameters:**
- `wallet` (required): The wallet address to verify (must be a valid Ethereum address)

**Example Request:**
```bash
curl "https://your-deployed-app.vercel.app/api/verify?wallet=0x1234567890123456789012345678901234567890"
```

**Response Format:**

#### Success Response (200 OK)
```json
{
  "status": "success",
  "data": {
    "verified": true,
    "wallet": "0x1234567890123456789012345678901234567890",
    "metrics": {
      "totalTipsSent": "0.010",
      "totalTipsReceived": "0.005",
      "pendingTips": "0.002",
      "tipTransactions": 3,
      "claimTransactions": 1,
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
    "verificationDate": "2024-01-15T10:30:00.000Z"
  },
  "timestamp": "2024-01-15T10:30:00.000Z",
  "network": "Shardeum Unstablenet",
  "chainId": 8080
}
```

#### Error Response (400 Bad Request)
```json
{
  "error": "Invalid wallet address provided",
  "status": "fail",
  "data": {
    "verified": false,
    "reason": "Invalid wallet address"
  }
}
```

#### Error Response (500 Internal Server Error)
```json
{
  "error": "Internal server error during verification",
  "status": "fail",
  "data": {
    "verified": false,
    "reason": "Verification service unavailable"
  }
}
```

## Verification Criteria

A wallet is considered **verified** if it meets **any** of the following criteria:

### 1. Minimum Activity Criterion
- **Requirement:** Total tips sent ≥ 0.005 SHM
- **Description:** User has sent at least 0.005 SHM in total tips

### 2. Recent Activity Criterion
- **Requirement:** At least 1 transaction in the last 7 days
- **Description:** User has recent activity (tips sent or claimed) within the time window

### 3. Engagement Criterion
- **Requirement:** Has received tips AND has at least 1 transaction
- **Description:** User has engaged with the platform by receiving tips

## Response Fields

### Top-Level Fields
- `status`: API response status ("success" or "fail")
- `data`: Verification result data
- `timestamp`: API response timestamp
- `network`: Blockchain network name
- `chainId`: Network chain ID

### Data Fields
- `verified`: Boolean indicating verification status
- `wallet`: The wallet address being verified
- `metrics`: Detailed activity metrics
- `criteria`: Verification criteria used
- `reason`: Human-readable explanation of verification result
- `verificationDate`: When the verification was performed

### Metrics Fields
- `totalTipsSent`: Total amount of tips sent (in SHM)
- `totalTipsReceived`: Total amount of tips received (in SHM)
- `pendingTips`: Amount of tips pending to be claimed (in SHM)
- `tipTransactions`: Number of tip transactions sent
- `claimTransactions`: Number of tip claim transactions
- `totalTransactions`: Total number of transactions
- `recentActivity`: Whether there's recent activity
- `hasMinimumActivity`: Whether minimum activity criteria is met
- `hasRecentActivity`: Whether recent activity criteria is met

### Criteria Fields
- `minimumTipAmount`: Minimum individual tip amount (0.001 SHM)
- `minimumTotalSent`: Minimum total tips sent (0.005 SHM)
- `minimumTransactions`: Minimum number of transactions (1)
- `timeWindow`: Time window for recent activity (7 days)

## Error Codes

| HTTP Status | Error Code | Description |
|-------------|------------|-------------|
| 400 | Invalid wallet address | The provided wallet address is not a valid Ethereum address |
| 405 | Method not allowed | Only GET requests are supported |
| 500 | Internal server error | Server error during verification process |

## Rate Limiting

- **Rate Limit:** 100 requests per minute per IP address
- **Headers:** Rate limit information is included in response headers

## CORS Support

The API supports Cross-Origin Resource Sharing (CORS) and can be called from web browsers:

```javascript
// Example JavaScript usage
const response = await fetch('https://your-deployed-app.vercel.app/api/verify?wallet=0x1234...');
const data = await response.json();
console.log(data.data.verified); // true/false
```

## Integration Examples

### JavaScript/TypeScript
```javascript
async function verifyWallet(walletAddress) {
  try {
    const response = await fetch(
      `https://your-deployed-app.vercel.app/api/verify?wallet=${walletAddress}`
    );
    const data = await response.json();
    
    if (data.status === 'success') {
      return {
        verified: data.data.verified,
        metrics: data.data.metrics,
        reason: data.data.reason
      };
    } else {
      throw new Error(data.error);
    }
  } catch (error) {
    console.error('Verification failed:', error);
    return { verified: false, error: error.message };
  }
}

// Usage
const result = await verifyWallet('0x1234567890123456789012345678901234567890');
console.log('Wallet verified:', result.verified);
```

### Python
```python
import requests

def verify_wallet(wallet_address):
    try:
        response = requests.get(
            f"https://your-deployed-app.vercel.app/api/verify",
            params={"wallet": wallet_address}
        )
        data = response.json()
        
        if data["status"] == "success":
            return {
                "verified": data["data"]["verified"],
                "metrics": data["data"]["metrics"],
                "reason": data["data"]["reason"]
            }
        else:
            raise Exception(data["error"])
    except Exception as e:
        print(f"Verification failed: {e}")
        return {"verified": False, "error": str(e)}

# Usage
result = verify_wallet("0x1234567890123456789012345678901234567890")
print(f"Wallet verified: {result['verified']}")
```

### cURL
```bash
# Basic verification
curl "https://your-deployed-app.vercel.app/api/verify?wallet=0x1234567890123456789012345678901234567890"

# With pretty printing (requires jq)
curl "https://your-deployed-app.vercel.app/api/verify?wallet=0x1234567890123456789012345678901234567890" | jq
```

## Testing

### Test Wallet Addresses

For testing purposes, you can use these example wallet addresses:

1. **Active User:** `0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6`
2. **New User:** `0x1234567890123456789012345678901234567890`

### Test Scenarios

1. **Valid Active Wallet**
   ```bash
   curl "https://your-deployed-app.vercel.app/api/verify?wallet=0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6"
   ```
   Expected: `verified: true`

2. **Invalid Wallet Address**
   ```bash
   curl "https://your-deployed-app.vercel.app/api/verify?wallet=invalid"
   ```
   Expected: `verified: false, reason: "Invalid wallet address"`

3. **Missing Wallet Parameter**
   ```bash
   curl "https://your-deployed-app.vercel.app/api/verify"
   ```
   Expected: `verified: false, reason: "Invalid wallet address"`

## Security Considerations

1. **Input Validation:** All wallet addresses are validated for proper Ethereum address format
2. **Rate Limiting:** API requests are rate-limited to prevent abuse
3. **CORS:** Proper CORS headers are set for web browser access
4. **Error Handling:** Sensitive information is not exposed in error messages
5. **Network Security:** Only Shardeum Unstablenet is supported for verification

## Support

For API support or questions:
- **Documentation:** This document
- **GitHub Issues:** [Repository Issues](https://github.com/your-repo/shard-tip/issues)
- **Network Status:** [Shardeum Status](https://docs.shardeum.org/)

## Changelog

### Version 1.0.0 (Current)
- Initial API release
- Support for wallet verification
- Comprehensive metrics and criteria
- CORS support
- Rate limiting
