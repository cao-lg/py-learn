import { useState } from 'react';
import { uumsClient } from '../utils/uums-api';

export function TestLoginPage() {
  const [username, setUsername] = useState('student1');
  const [password, setPassword] = useState('student123');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const testLogin = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      console.log('Testing login with:', username, password);
      console.log('API_BASE:', 'http://localhost:3000/api');

      const response = await fetch('http://localhost:3000/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      console.log('Response:', data);
      setResult(data);

      if (data.code === 200 && data.data.valid) {
        alert('登录成功！user_id: ' + data.data.user_id);
      } else {
        setError('用户名或密码错误');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError('请求失败: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const testUumsClient = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      console.log('Testing uumsClient.verifyUser');
      const data = await uumsClient.verifyUser(username, password);
      console.log('uumsClient response:', data);
      setResult(data);

      if (data && data.code === 200 && data.data.valid) {
        alert('uumsClient登录成功！user_id: ' + data.data.user_id);
      } else {
        setError('uumsClient验证失败');
      }
    } catch (err: any) {
      console.error('uumsClient error:', err);
      setError('uumsClient失败: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6">登录测试页面</h1>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">用户名</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">密码</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div className="flex gap-4">
            <button
              onClick={testLogin}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? '测试中...' : '直接测试API'}
            </button>

            <button
              onClick={testUumsClient}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? '测试中...' : '测试uumsClient'}
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {result && (
          <div className="mt-4 p-3 bg-green-100 rounded-lg">
            <h3 className="font-medium mb-2">结果:</h3>
            <pre className="text-xs overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}