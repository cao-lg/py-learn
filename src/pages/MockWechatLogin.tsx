import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setStoredUserId, setStoredUsername } from '../utils/uums-api';

export function MockWechatLoginPage() {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState('测试用户');

  const simulateWechatLogin = async () => {
    try {
      // 模拟调用后端API来创建用户
      const mockOpenId = `mock_openid_${Date.now()}`;
      
      // 调用我们的本地API来模拟微信登录
      const response = await fetch('http://localhost:3000/api/auth/mock-wechat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          openid: mockOpenId,
          nickname: nickname || '微信用户'
        }),
      });

      const data = await response.json();
      
      if (data.code === 0 && data.user) {
        // 保存用户信息
        setStoredUserId(String(data.user.id));
        setStoredUsername(data.user.username);
        alert('微信登录成功！');
        navigate('/');
      } else {
        alert('登录失败：' + (data.message || '未知错误'));
      }
    } catch (error) {
      console.error('模拟微信登录错误:', error);
      alert('登录失败，请重试');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-4 text-center">
        <div className="text-6xl mb-4">💬</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">模拟微信登录</h1>
        <p className="text-gray-600 mb-6">
          这是一个模拟微信登录的演示，方便你测试完整功能
        </p>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
            昵称
          </label>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="请输入昵称"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
          />
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800 text-left">
            <strong>📝 说明：</strong><br />
            • 新用户会自动创建账号<br />
            • 自动分配到学校ID: 8，班级ID: 10<br />
            • 自动获得站点访问权限
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={simulateWechatLogin}
            className="w-full py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
          >
            <span>💬</span>
            <span>模拟微信登录</span>
          </button>

          <button
            onClick={() => navigate('/')}
            className="w-full py-3 text-gray-600 hover:text-gray-800 transition-colors"
          >
            返回首页
          </button>
        </div>
      </div>
    </div>
  );
}