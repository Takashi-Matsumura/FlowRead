import Link from 'next/link';
import { builtInMaterials } from '@/data/sample-materials/north-wind-and-sun';
import { FlowReadIcon } from '@/components/ui/FlowReadIcon';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* ヘッダー */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <FlowReadIcon size={36} />
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                FlowRead
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                訳すな。意味の流れで、理解せよ。
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* 教材一覧 */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            教材を選ぶ
          </h2>

          <div className="space-y-4">
            {builtInMaterials.map((material) => (
              <Link
                key={material.id}
                href={`/learn/${material.id}`}
                className="block bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {material.title}
                    </h3>
                    {material.description && (
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        {material.description}
                      </p>
                    )}
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-500">
                      {material.sentences.length} 文
                    </p>
                  </div>
                  <div className="flex-shrink-0 ml-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                      学習する
                    </span>
                  </div>
                </div>
              </Link>
            ))}

            {/* 教材追加カード（将来用） */}
            <div className="bg-gray-100 dark:bg-gray-800/50 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 p-6 text-center">
              <p className="text-gray-500 dark:text-gray-400">
                自分の教材を追加（準備中）
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* フッター */}
      <footer className="mt-auto border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-6">
          {/* 折りたたみ式のコンセプト説明 */}
          <details className="group mb-4">
            <summary className="flex items-center justify-center gap-2 cursor-pointer text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
              <span>FlowReadとは？</span>
              <svg
                className="w-4 h-4 transition-transform group-open:rotate-180"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              <p>
                FlowReadは、英語を翻訳するのではなく、
                <span className="font-medium text-gray-700 dark:text-gray-300">意味の流れ</span>
                として理解する力を育てます。
                左から右へ、文の順番通りに、意味を追いかけていきましょう。
              </p>
            </div>
          </details>
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
            Don&apos;t translate. Understand the flow.
          </p>
        </div>
      </footer>
    </div>
  );
}
