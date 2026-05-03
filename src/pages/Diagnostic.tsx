import { useState, useEffect } from 'react';

export function DiagnosticPage() {
  const [diagnostics, setDiagnostics] = useState<Record<string, any>>({});

  const runDiagnostics = async () => {
    const results: Record<string, any> = {};

    // 1. Check localStorage
    const localStorageData: Record<string, string> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        localStorageData[key] = localStorage.getItem(key) || '';
      }
    }
    results.localStorage = localStorageData;
    results.localStorageSummary = `Found ${localStorage.length} items in localStorage`;

    // 2. Test direct API call
    try {
      const response = await fetch('http://localhost:3000/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'student1', password: 'student123' }),
      });
      const data = await response.json();
      results.apiDirectCall = {
        success: true,
        status: response.status,
        data: data
      };
    } catch (error: any) {
      results.apiDirectCall = {
        success: false,
        error: error.message
      };
    }

    // 3. Test with no-cors mode
    try {
      const response = await fetch('http://localhost:3000/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'student1', password: 'student123' }),
        mode: 'no-cors'
      });
      const text = await response.text();
      results.apiNoCors = {
        success: true,
        status: response.status,
        text: text
      };
    } catch (error: any) {
      results.apiNoCors = {
        success: false,
        error: error.message
      };
    }

    // 4. Check if backend is reachable
    try {
      const pingResponse = await fetch('http://localhost:3000/health');
      const pingData = await pingResponse.json();
      results.backendPing = {
        success: true,
        data: pingData
      };
    } catch (error: any) {
      results.backendPing = {
        success: false,
        error: error.message
      };
    }

    // 5. Check token endpoint
    try {
      const tokenResponse = await fetch('http://localhost:3000/api/auth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          app_id: 'app_zsdcqS4iIXiUiLIj',
          app_secret: 'secret_LKbKFcZ4JXeFhhYkDKWlW3nKSCFDv3Ke'
        }),
      });
      const tokenData = await tokenResponse.json();
      results.tokenEndpoint = {
        success: true,
        data: tokenData
      };

      // 6. Test verify with token
      if (tokenData.data?.access_token) {
        try {
          const verifyWithTokenResponse = await fetch('http://localhost:3000/api/auth/verify', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${tokenData.data.access_token}`
            },
            body: JSON.stringify({ username: 'student1', password: 'student123' }),
          });
          const verifyData = await verifyWithTokenResponse.json();
          results.verifyWithToken = {
            success: true,
            data: verifyData
          };
        } catch (error: any) {
          results.verifyWithToken = {
            success: false,
            error: error.message
          };
        }
      }
    } catch (error: any) {
      results.tokenEndpoint = {
        success: false,
        error: error.message
      };
    }

    // 7. Browser info
    results.browser = {
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      online: navigator.onLine
    };

    setDiagnostics(results);
  };

  useEffect(() => {
    runDiagnostics();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">诊断页面</h1>
          <button
            onClick={runDiagnostics}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            重新运行诊断
          </button>
        </div>

        {Object.entries(diagnostics).map(([key, value]) => (
          <div key={key} className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-3 capitalize">
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </h2>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-96">
              {JSON.stringify(value, null, 2)}
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
}