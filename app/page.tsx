import Link from 'next/link';
import { builtInMaterials } from '@/data/sample-materials/north-wind-and-sun';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* ヘッダー */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            FlowRead
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            訳すな。意味の流れで、理解せよ。
          </p>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* コンセプト */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl p-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              英語を「流れ」で理解する
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              FlowReadは、英語を翻訳するのではなく、
              <span className="font-semibold">意味の流れ</span>
              として理解する力を育てます。
              左から右へ、文の順番通りに、意味を追いかけていきましょう。
            </p>
          </div>
        </section>

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
        <div className="max-w-4xl mx-auto px-4 py-6 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Don&apos;t translate. Understand the flow.
          </p>
        </div>
      </footer>
    </div>
  );
}
