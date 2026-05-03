import type { EvalResult } from '../types';

interface TerminalProps {
  logs: string;
  result?: EvalResult | null;
  isRunning?: boolean;
}

export function Terminal({ logs, result, isRunning }: TerminalProps) {
  return (
    <div className="bg-gray-900 text-gray-100 rounded-xl p-6 font-mono text-sm min-h-[200px]">
      <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-700">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <span className="text-gray-400 text-xs">Output</span>
      </div>

      {isRunning && (
        <div className="flex items-center gap-3 text-yellow-400 animate-pulse">
          <div className="animate-spin w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full"></div>
          <span>正在加载 Python 环境，请稍候...</span>
        </div>
      )}

      {logs && (
        <pre className="whitespace-pre-wrap text-green-400 mb-4">{logs}</pre>
      )}

      {result && (
        <div
          className={`p-4 rounded-lg ${
            result.passed
              ? 'bg-green-900/30 border border-green-700'
              : 'bg-red-900/30 border border-red-700'
          }`}
        >
          <div className="flex items-center gap-3 mb-3">
            <span
              className={`w-2 h-2 rounded-full ${
                result.passed ? 'bg-green-400' : 'bg-red-400'
              }`}
            ></span>
            <span className={result.passed ? 'text-green-400' : 'text-red-400'}>
              {result.passed ? 'PASSED' : 'FAILED'}
            </span>
            <span className="text-gray-400">
              Score: {Math.round(result.score * 100)}%
            </span>
          </div>
          <p className="text-gray-200">{result.message}</p>
          {result.details && (
            <div className="mt-4 space-y-2 text-xs">
              {result.details.testCases && result.details.testCases.length > 0 ? (
              <div className="mt-3">
                <span className="text-gray-400 block mb-3">测试用例：</span>
                <div className="space-y-2">
                  {result.details.testCases.map((tc, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center gap-2 p-2 rounded ${
                        tc.passed
                          ? 'bg-green-800/30'
                          : 'bg-red-800/30'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          tc.passed ? 'bg-green-400' : 'bg-red-400'
                        }`}
                      ></span>
                      <span className="text-gray-300">{tc.name}</span>
                      {!tc.passed && tc.expected && (
                        <span className="text-gray-500 ml-auto">
                          Expected: <span className="text-green-300">{tc.expected}</span>
                        </span>
                      )}
                      {!tc.passed && tc.actual && (
                        <span className="text-gray-500">
                          Actual: <span className="text-red-300">{tc.actual}</span>
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {result.details.expected && (
                  <div>
                    <span className="text-gray-400">Expected: </span>
                    <pre className="text-green-300 inline">{result.details.expected}</pre>
                  </div>
                )}
                {result.details.actual && (
                  <div>
                    <span className="text-gray-400">Actual: </span>
                    <pre className="text-red-300 inline">{result.details.actual}</pre>
                  </div>
                )}
              </>
            )}
          </div>
          )}
        </div>
      )}

      {!logs && !result && !isRunning && (
        <p className="text-gray-500 italic">
          点击运行按钮执行代码，输出将显示在这里
        </p>
      )}
    </div>
  );
}