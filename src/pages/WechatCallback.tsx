import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { setStoredUserId, setStoredUsername } from '../utils/uums-api';

export function WechatCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('登录中...');

  useEffect(() => {
    const token = searchParams.get('token');
    const userStr = searchParams.get('user');

    if (token && userStr) {
      try {
        const user = JSON.parse(decodeURIComponent(userStr));
        // 保存用户信息
        if (user.id) {
          setStoredUserId(String(user.id));
        }
        if (user.username) {
          setStoredUsername(user.username);
        }
        setStatus('登录成功！正在跳转...');
        setTimeout(() => {
          navigate('/');
        }, 1000);
      } catch (error) {
        console.error('解析用户信息失败:', error);
        setStatus('登录失败，请重试');
      }
    } else {
      setStatus('缺少登录信息，请重试');
    }
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-4 text-center">
        <div className="text-6xl mb-4">💬</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">微信登录</h1>
        <p className="text-gray-600 mb-6">{status}</p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          返回首页
        </button>
      </div>
    </div>
  );
}