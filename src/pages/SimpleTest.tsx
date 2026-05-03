import { useState, useEffect } from 'react';

export function SimpleTestPage() {
  const [testResult, setTestResult] = useState<string>('');
  const [localStorageData, setLocalStorageData] = useState<Record<string, string>>({});

  useEffect(() => {
    const data: Record<string, string> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        data[key] = localStorage.getItem(key) || '';
      }
    }
    setLocalStorageData(data);
  }, []);

  const testDirectApi = async () => {
    setTestResult('测试中...');
    try {
      const response = await fetch('http://localhost:3000/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'student1', password: 'student123' }),
      });
      const data = await response.json();
      setTestResult('成功! ' + JSON.stringify(data));
    } catch (error: any) {
      setTestResult('失败: ' + error.message);
    }
  };

  const testWithCredentials = async () => {
    setTestResult('测试中...');
    try {
      const response = await fetch('http://localhost:3000/api/auth/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer test-token'
        },
        credentials: 'include',
        body: JSON.stringify({ username: 'student1', password: 'student123' }),
      });
      const data = await response.json();
      setTestResult('成功! ' + JSON.stringify(data));
    } catch (error: any) {
      setTestResult('失败: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">简单测试页面</h1>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">LocalStorage 数据</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(localStorageData, null, 2)}
          </pre>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">API 测试</h2>
          <div className="space-y-4">
            <button
              onClick={testDirectApi}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              测试直接 API 调用
            </button>

            <button
              onClick={testWithCredentials}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              测试带 Credentials 的 API 调用
            </button>
          </div>

          {testResult && (
            <div className="mt-4 p-4 bg-gray-100 rounded">
              <pre className="text-sm">{testResult}</pre>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Browser Info</h2>
          <ul className="space-y-2 text-sm">
            <li>User Agent: {navigator.userAgent}</li>
            <li>Current URL: {window.location.href}</li>
            <li>Referrer: {document.referrer || 'N/A'}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}