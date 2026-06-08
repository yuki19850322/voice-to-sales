import Anthropic from '@anthropic-ai/sdk'

const MEDIA_GUIDE: Record<string, string> = {
  LP: 'LP向け：400〜600文字、読者の不安を解消する説得力のある文体で書いてください。',
  'SNS投稿': 'SNS投稿向け：100〜150文字、感情に訴えかける短くて刺さる文体で書いてください。',
  メルマガ: 'メルマガ向け：300〜500文字、読者に語りかけるような親しみやすい文体で書いてください。',
}

export async function POST(request: Request) {
  try {
    const { review, product, media } = (await request.json()) as {
      review: string
      product: string
      media: string
    }

    if (!review?.trim() || !product?.trim() || !media) {
      return Response.json({ error: '必須項目を入力してください' }, { status: 400 })
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return Response.json({ error: 'APIキーが設定されていません' }, { status: 500 })
    }

    const client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    })

    // 使用モデル：Claude 3.5 Sonnet (claude-3-5-sonnet-20240620) - 安定版
    // 以前の claude-3-5-sonnet-20241022 は404になったため安定版に変更。
    // JSON出力の信頼性が高く、営業文生成に適している。
    // 将来的にClaude 4 Sonnetなどに移行する場合はこの行を更新してください。
    const message = await client.messages.create({
      model: 'claude-3-5-sonnet-20240620',
      max_tokens: 2048,
      temperature: 0.7,
      system: `あなたは優秀なセールスコピーライターです。
お客様の声を元に、購買意欲を高める3種類のセールス文を生成してください。
${MEDIA_GUIDE[media] ?? ''}
必ずJSON形式のみで返してください。マークダウン記法やコードブロックは使用しないでください。`,
      messages: [
        {
          role: 'user',
          content: `お客様の声：${review}
商品・サービス名：${product}
使用媒体：${media}

以下のJSON形式で3パターンを出力してください：
{
  "before_after": "ビフォーアフター型のセールス文（購入前の悩み→購入後の変化を強調）",
  "story": "ストーリー型のセールス文（お客様の体験を物語形式で再構成）",
  "catchcopy": "一言キャッチコピー（SNSや見出しに使える30文字以内）"
}`,
        },
      ],
    })

    const content = message.content[0]
    if (content.type !== 'text') {
      return Response.json({ error: '予期しないレスポンス形式です' }, { status: 500 })
    }

    // JSON抽出をより頑健に
    const jsonMatch = content.text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      console.error('Failed to extract JSON from Claude response:', content.text)
      return Response.json({ error: 'AIの応答からJSONを抽出できませんでした' }, { status: 500 })
    }

    const result = JSON.parse(jsonMatch[0])
    return Response.json(result)
  } catch (err) {
    console.error('Convert API Error:', err)

    // Anthropic関連のエラーをある程度ハンドリング
    if (err instanceof Error) {
      if (err.message.includes('rate limit')) {
        return Response.json({ error: 'AIの利用制限に達しました。しばらくしてからお試しください。' }, { status: 429 })
      }
      if (err.message.includes('invalid x-api-key') || err.message.includes('authentication')) {
        return Response.json({ error: 'APIキーが無効です。設定を確認してください。' }, { status: 500 })
      }
    }

    return Response.json({ error: '変換中にエラーが発生しました' }, { status: 500 })
  }
}
