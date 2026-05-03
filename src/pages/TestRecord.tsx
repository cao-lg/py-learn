import { useState } from 'react';
import { uumsClient } from '../utils/uums-api';

export function TestRecordPage() {
  const [testResult, setTestResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testRecordStudy = async () => {
    setLoading(true);
    setTestResult('测试中...\n');

    try {
      // 先检查 localStorage
      const appId = localStorage.getItem('uums_app_id');
      const appSecret = localStorage.getItem('uums_app_secret');
      const userId = localStorage.getItem('uums_user_id');

      setTestResult(prev => prev + `localStorage 检查:\n`);
      setTestResult(prev => prev + `  uums_app_id: ${appId || '未设置'}\n`);
      setTestResult(prev => prev + `  uums_app_secret: ${appSecret || '未设置'}\n`);
      setTestResult(prev => prev + `  uums_user_id: ${userId || '未设置'}\n\n`);

      if (!appId || !appSecret) {
        setTestResult(prev => prev + `❌ 缺少 app_id 或 app_secret\n`);
        setLoading(false);
        return;
      }

      // 测试获取 token
      setTestResult(prev => prev + `尝试获取 token...\n`);
      const testRecord = await uumsClient.recordStudyRecord({
        user_id: parseInt(userId || '2'),
        class_id: undefined,
        exercise_title: '测试章节',
        exercise_type: 'practice',
        score: 80,
        total_score: 100,
        duration: 300,
        completed_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
      });

      setTestResult(prev => prev + `\nAPI 返回结果:\n`);
      setTestResult(prev => prev + JSON.stringify(testRecord, null, 2));

      if (testRecord && testRecord.code === 0) {
        setTestResult(prev => prev + `\n\n✅ 记录保存成功!`);
      } else {
        setTestResult(prev => prev + `\n\n❌ 记录保存失败`);
      }
    } catch (error: any) {
      setTestResult(prev => prev + `\n\n❌ 错误: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">记录保存测试页面</h1>

        <button
          onClick={testRecordStudy}
          disabled={loading}
          className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 mb-4"
        >
          {loading ? '测试中...' : '测试保存记录'}
        </button>

        <div className="bg-white rounded-lg shadow p-4">
          <pre className="whitespace-pre-wrap text-sm font-mono">{testResult}</pre>
        </div>
      </div>
    </div>
  );
}