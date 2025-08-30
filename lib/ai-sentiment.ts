import axios from "axios"

interface HuggingFaceResponse {
  label: string
  score: number
}

interface SentimentResult {
  amount: number
  confidence: number
  reasoning: string
}

export async function getSentimentSuggestion(content: string): Promise<number> {
  try {
    // Use Hugging Face's free inference API
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/distilbert-base-uncased-finetuned-sst-2-english",
      {
        inputs: content,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 10000, // 10 second timeout
      },
    )

    const results: HuggingFaceResponse[] = response.data

    if (!results || results.length === 0) {
      throw new Error("No sentiment analysis results")
    }

    // Find the positive sentiment score
    const positiveResult = results.find((result) => result.label === "POSITIVE")
    const positiveScore = positiveResult?.score || 0

    // Map sentiment score to tip amount with more nuanced suggestions
    if (positiveScore > 0.9) {
      return 0.02 // Extremely positive content
    } else if (positiveScore > 0.8) {
      return 0.01 // Very positive content
    } else if (positiveScore > 0.7) {
      return 0.007 // Positive content
    } else if (positiveScore > 0.6) {
      return 0.005 // Moderately positive content
    } else if (positiveScore > 0.4) {
      return 0.003 // Neutral-positive content
    } else {
      return 0.001 // Default minimum tip
    }
  } catch (error) {
    console.error("AI sentiment analysis failed:", error)
    // Return default suggestion on error
    return 0.001
  }
}

export async function getDetailedSentimentSuggestion(content: string): Promise<SentimentResult> {
  try {
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/distilbert-base-uncased-finetuned-sst-2-english",
      {
        inputs: content,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 10000,
      },
    )

    const results: HuggingFaceResponse[] = response.data

    if (!results || results.length === 0) {
      throw new Error("No sentiment analysis results")
    }

    const positiveResult = results.find((result) => result.label === "POSITIVE")
    const negativeResult = results.find((result) => result.label === "NEGATIVE")

    const positiveScore = positiveResult?.score || 0
    const negativeScore = negativeResult?.score || 0
    const confidence = Math.max(positiveScore, negativeScore)

    let amount: number
    let reasoning: string

    if (positiveScore > 0.9) {
      amount = 0.02
      reasoning = "Extremely positive sentiment detected - this content is highly engaging!"
    } else if (positiveScore > 0.8) {
      amount = 0.01
      reasoning = "Very positive sentiment - this creator deserves strong support!"
    } else if (positiveScore > 0.7) {
      amount = 0.007
      reasoning = "Positive sentiment detected - good content worth supporting!"
    } else if (positiveScore > 0.6) {
      amount = 0.005
      reasoning = "Moderately positive content - a nice tip to show appreciation!"
    } else if (positiveScore > 0.4) {
      amount = 0.003
      reasoning = "Neutral to positive content - a small tip to encourage!"
    } else {
      amount = 0.001
      reasoning = "Standard tip amount for any content you want to support!"
    }

    return {
      amount,
      confidence,
      reasoning,
    }
  } catch (error) {
    console.error("Detailed sentiment analysis failed:", error)
    return {
      amount: 0.001,
      confidence: 0.5,
      reasoning: "Unable to analyze sentiment - using standard tip amount",
    }
  }
}

export function analyzeContentLength(content: string): number {
  const wordCount = content.trim().split(/\s+/).length

  if (wordCount > 500) {
    return 1.5 // Long-form content multiplier
  } else if (wordCount > 200) {
    return 1.3 // Medium-form content multiplier
  } else if (wordCount > 50) {
    return 1.1 // Short-form content multiplier
  } else {
    return 1.0 // Very short content
  }
}

export async function getEnhancedTipSuggestion(content: string): Promise<SentimentResult> {
  const sentimentResult = await getDetailedSentimentSuggestion(content)
  const lengthMultiplier = analyzeContentLength(content)

  const enhancedAmount = Math.min(sentimentResult.amount * lengthMultiplier, 0.05) // Cap at 0.05 SHM

  return {
    amount: enhancedAmount,
    confidence: sentimentResult.confidence,
    reasoning: `${sentimentResult.reasoning} Content length factor applied (${lengthMultiplier.toFixed(1)}x).`,
  }
}
