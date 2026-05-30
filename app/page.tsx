'use client'

import { useState, useEffect } from 'react'

type MediaType = 'LP' | 'SNS投稿' | 'メルマガ'

interface ConvertResult {
  before_after: string
  story: string
  catchcopy: string
}

const MEDIA_OPTIONS: MediaType[] = ['LP', 'SNS投稿', 'メルマガ']

// ============================================
// 無料利用回数制限（1日3回）
// ============================================
const USAGE_KEY = 'voice-to-sales-usage'
const MAX_FREE_USES = 3

interface UsageData {
  date: string // YYYY-MM-DD
  count: number
}

// 今日の日付を YYYY-MM-DD 形式で取得
function getToday(): string {
  return new Date().toISOString().split('T')[0]
}

// localStorageから利用データを読み込む
function loadUsage(): UsageData {
  if (typeof window === 'undefined') {
    return { date: getToday(), count: 0 }
  }

  try {
    const saved = localStorage.getItem(USAGE_KEY)
    if (!saved) {
      return { date: getToday(), count: 0 }
    }

    const data: UsageData = JSON.parse(saved)

    // 日付が変わっていたらリセット
    if (data.date !== getToday()) {
      const resetData = { date: getToday(), count: 0 }
      localStorage.setItem(USAGE_KEY, JSON.stringify(resetData))
      return resetData
    }

    return data
  } catch {
    return { date: getToday(), count: 0 }
  }
}

// 利用データを保存
function saveUsage(data: UsageData) {
  if (typeof window === 'undefined') return
  localStorage.setItem(USAGE_KEY, JSON.stringify(data))
}

// 残り利用回数を計算
function getRemainingUses(): number {
  const usage = loadUsage()
  return Math.max(0, MAX_FREE_USES - usage.count)
}

// 利用回数を1つ消費
function consumeOneUse(): number {
  const usage = loadUsage()
  const newCount = usage.count + 1
  const newData: UsageData = {
    date: getToday(),
    count: newCount,
  }
  saveUsage(newData)
  return Math.max(0, MAX_FREE_USES - newCount)
}

export default function Home() {
  const [review, setReview] = useState('')
  const [product, setProduct] = useState('')
  const [media, setMedia] = useState<MediaType>('LP')
  const [result, setResult] = useState<ConvertResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState<string | null>(null)
  const [remainingUses, setRemainingUses] = useState<number>(MAX_FREE_USES)
  const [usageLoaded, setUsageLoaded] = useState(false)

  // 初回マウント時に利用回数を読み込む
  useEffect(() => {
    const remaining = getRemainingUses()
    setRemainingUses(remaining)
    setUsageLoaded(true)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // 利用回数チェック
    if (remainingUses <= 0) {
      setError('本日の無料利用回数（3回）を超えました。明日またお試しください。')
      return
    }

    setLoading(true)
    setError('')
    setResult(null)

    try {
      const res = await fetch('/api/convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ review, product, media }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error ?? 'エラーが発生しました')
      }

      // 変換成功 → 回数を消費
      const newRemaining = consumeOneUse()
      setRemainingUses(newRemaining)

      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  // 利用回数が0の場合のメッセージ
  const isLimitReached = remainingUses <= 0

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
      <div className="max-w-2xl mx-auto">

        {/* ヘッダー */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            お客様の声 → セールス文変換
          </h1>
          <p className="text-gray-500">
            口コミ・レビューを貼るだけで、3種類のセールス文を自動生成
          </p>
        </div>

        {/* 入力フォーム */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-5"
        >
          {/* お客様の声 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              お客様の声・口コミ <span className="text-red-500">*</span>
            </label>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              required
              rows={5}
              placeholder="例：このコーチングを受けて3ヶ月で売上が2倍になりました。最初は半信半疑でしたが、毎週の振り返りで自分の強みに気づけて..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* 商品・サービス名 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              商品・サービス名 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              required
              placeholder="例：売上アップ3ヶ月コーチングプログラム"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* 使いたい媒体 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              使いたい媒体 <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-6">
              {MEDIA_OPTIONS.map((m) => (
                <label key={m} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="media"
                    value={m}
                    checked={media === m}
                    onChange={() => setMedia(m)}
                    className="text-blue-600"
                  />
                  <span className="text-sm text-gray-700">{m}</span>
                </label>
              ))}
            </div>
          </div>

          {/* エラーメッセージ */}
          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
              {error}
            </div>
          )}

          {/* 利用回数表示 + 変換ボタン */}
          <div className="space-y-3">
            {/* 残り回数表示 */}
            {usageLoaded && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">
                  今日の無料利用回数
                </span>
                <span className={`font-medium ${isLimitReached ? 'text-red-600' : 'text-gray-700'}`}>
                  残り {remainingUses} / {MAX_FREE_USES} 回
                </span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !usageLoaded || isLimitReached}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.985]"
            >
              {loading ? (
                <>
                  <Spinner />
                  <span>変換中...</span>
                </>
              ) : isLimitReached ? (
                '本日の利用回数上限に達しました'
              ) : (
                '変換する →'
              )}
            </button>

            {/* 回数上限時の案内 */}
            {isLimitReached && (
              <p className="text-center text-sm text-gray-500">
                明日になればまた無料でご利用いただけます。
              </p>
            )}
          </div>
        </form>

        {/* 出力エリア */}
        {result && (
          <div className="mt-8 space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">生成されたセールス文</h2>

            <OutputCard
              title="ビフォーアフター型"
              description="購入前の悩み → 購入後の変化を強調"
              content={result.before_after}
              isCopied={copied === 'before_after'}
              onCopy={() => copyToClipboard(result.before_after, 'before_after')}
            />
            <OutputCard
              title="ストーリー型"
              description="お客様の体験を物語形式で再構成"
              content={result.story}
              isCopied={copied === 'story'}
              onCopy={() => copyToClipboard(result.story, 'story')}
            />
            <OutputCard
              title="一言キャッチコピー"
              description="SNSや見出しに使える30文字以内"
              content={result.catchcopy}
              isCopied={copied === 'catchcopy'}
              onCopy={() => copyToClipboard(result.catchcopy, 'catchcopy')}
            />
          </div>
        )}
      </div>
    </main>
  )
}

// ローディングスピナー
function Spinner() {
  return (
    <svg
      className="animate-spin h-4 w-4 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  )
}

function OutputCard({
  title,
  description,
  content,
  isCopied,
  onCopy,
}: {
  title: string
  description: string
  content: string
  isCopied: boolean
  onCopy: () => void
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold text-gray-900 text-sm">{title}</h3>
          <p className="text-xs text-gray-400 mt-0.5">{description}</p>
        </div>
        <button
          onClick={onCopy}
          className={`text-xs px-3 py-1.5 rounded-lg transition-all shrink-0 ml-4 ${
            isCopied
              ? 'bg-green-100 text-green-700'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
          }`}
        >
          {isCopied ? '✓ コピー済み' : 'コピー'}
        </button>
      </div>
      <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{content}</p>
    </div>
  )
}
