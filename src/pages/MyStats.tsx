import { useState, useEffect } from 'react';
import { API_BASE } from '../utils/uums-api';
import { getStoredUserId, getStoredUsername } from '../utils/uums-api';

interface StudyRecord {
  id: number;
  user_id: number;
  exercise_title: string;
  exercise_type: string;
  score: number;
  total_score: number;
  duration: number;
  completed_at: string;
  chapter_id: string;
  chapter_name: string;
  mastery_level: string;
}

interface ChapterStats {
  chapterId: string;
  chapterName: string;
  attempts: number;
  avgScore: number;
  bestScore: number;
  masteryLevel: string;
}

interface ExamRecord {
  id: number;
  user_id: number;
  exam_title: string;
  score: number;
  total_score: number;
  status: string;
  submitted_at: string;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  progress?: number;
  requirement?: string;
}

interface Feedback {
  encouragement: string;
  strengths: string[];
  weaknesses: string[];
  nextSuggestion: string;
}

interface Progress {
  vsLastWeek: {
    practiceCount: number;
    scoreImprovement: number;
    timeInvestment: number;
  };
  streak: number;
  bestStreak: number;
}

const examTitles: Record<string, string> = {
  ch01_basics: '第一章测验',
  ch02_variables: '第二章测验',
  ch03_operators: '第三章测验',
  ch04_control_flow: '第四章测验',
  ch05_functions: '第五章测验',
  ch06_data_structures: '第六章测验',
  ch07_strings: '第七章测验',
  ch08_file_io: '第八章测验',
  ch09_exception: '第九章测验',
  ch10_oop: '第十章测验',
  mid_term: '期中考试',
  final_exam: '期末考试',
};

export function MyStatsPage() {
  const [userId, setUserId] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState<StudyRecord[]>([]);
  const [examRecords, setExamRecords] = useState<ExamRecord[]>([]);
  const [chapterStats, setChapterStats] = useState<ChapterStats[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'chapters' | 'exams' | 'graph' | 'achievements'>('overview');

  useEffect(() => {
    const storedUserId = getStoredUserId();
    const storedUsername = getStoredUsername();
    
    if (storedUserId) setUserId(storedUserId);
    if (storedUsername) setUsername(storedUsername);
    
    if (storedUserId) {
      loadMyStats(parseInt(storedUserId));
    } else {
      setLoading(false);
    }
  }, []);

  const loadMyStats = async (uid: number) => {
    try {
      setLoading(true);
      
      // 获取学习者完整统计（包含反馈、成就、进度等）
      const statsRes = await fetch(`${API_BASE}/learner-stats/site_1777469231464/my-stats?user_id=${uid}`);
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        if (statsData.code === 200 && statsData.data) {
          const { feedback: fb, progress: pg, achievements: ach } = statsData.data;
          
          if (fb) {
            setFeedback({
              encouragement: fb.encouragement || '',
              strengths: fb.strengths || [],
              weaknesses: fb.weaknesses || [],
              nextSuggestion: fb.nextSuggestion || ''
            });
          }
          
          if (pg) {
            setProgress({
              vsLastWeek: pg.vsLastWeek || { practiceCount: 0, scoreImprovement: 0, timeInvestment: 0 },
              streak: pg.streak || 0,
              bestStreak: pg.bestStreak || 0
            });
          }
          
          if (ach && Array.isArray(ach)) {
            setAchievements(ach.map(a => ({
              id: a.id,
              name: a.name,
              description: a.description,
              icon: a.icon,
              unlocked: a.unlocked || false,
              unlockedAt: a.unlockedAt
            })));
          }
        }
      }

      // 获取学习记录（用于列表展示）
      const recordsRes = await fetch(`${API_BASE}/site-stats/site_1777469231464/study-records?user_id=${uid}`);
      if (recordsRes.ok) {
        const recordsData = await recordsRes.json();
        if (recordsData.data?.records) {
          setRecords(recordsData.data.records);
          calculateChapterStats(recordsData.data.records);
        }
      }

      // 获取考试记录
      const examRes = await fetch(`${API_BASE}/site-stats/site_1777469231464/exam-records?user_id=${uid}`);
      if (examRes.ok) {
        const examData = await examRes.json();
        if (examData.data?.records) {
          setExamRecords(examData.data.records);
        }
      }

    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateChapterStats = (recs: StudyRecord[]) => {
    const chapterMap = new Map<string, ChapterStats>();
    
    recs.forEach(record => {
      const chapterId = record.chapter_id || record.exercise_title;
      const chapterName = record.chapter_name || examTitles[chapterId] || chapterId;
      
      if (!chapterMap.has(chapterId)) {
        chapterMap.set(chapterId, {
          chapterId,
          chapterName,
          attempts: 0,
          avgScore: 0,
          bestScore: 0,
          masteryLevel: 'not_started'
        });
      }
      
      const stats = chapterMap.get(chapterId)!;
      stats.attempts++;
      const scoreRate = record.total_score > 0 ? (record.score / record.total_score) * 100 : 0;
      stats.avgScore = (stats.avgScore * (stats.attempts - 1) + scoreRate) / stats.attempts;
      stats.bestScore = Math.max(stats.bestScore, scoreRate);
      
      // 计算掌握程度
      if (stats.bestScore >= 90) stats.masteryLevel = 'mastered';
      else if (stats.bestScore >= 75) stats.masteryLevel = 'proficient';
      else if (stats.bestScore >= 60) stats.masteryLevel = 'learning';
      else if (stats.attempts >= 3) stats.masteryLevel = 'needs_improvement';
      else stats.masteryLevel = 'not_started';
    });
    
    setChapterStats(Array.from(chapterMap.values()));
  };

  const getMasteryColor = (level: string) => {
    switch (level) {
      case 'mastered': return 'bg-green-500';
      case 'proficient': return 'bg-blue-500';
      case 'learning': return 'bg-yellow-500';
      case 'needs_improvement': return 'bg-orange-500';
      default: return 'bg-gray-300';
    }
  };

  const getMasteryText = (level: string) => {
    switch (level) {
      case 'mastered': return '已掌握';
      case 'proficient': return '熟练';
      case 'learning': return '学习中';
      case 'needs_improvement': return '需加强';
      default: return '未开始';
    }
  };

  const validRecords = records.filter(r => r.total_score > 0);
  const totalPracticeTime = validRecords.reduce((acc, r) => acc + (r.duration || 0), 0);
  const avgScore = validRecords.length > 0
    ? validRecords.reduce((acc, r) => acc + (r.score / r.total_score) * 100, 0) / validRecords.length
    : 0;
  const examAvgScore = examRecords.length > 0
    ? examRecords.reduce((acc, r) => acc + (r.total_score > 0 ? (r.score / r.total_score) * 100 : 0), 0) / examRecords.length
    : 0;

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '未知时间';
    try {
      return new Date(dateStr).toLocaleDateString('zh-CN');
    } catch {
      return '未知时间';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-300">加载中...</div>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 max-w-md w-full text-center">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">请先登录</h2>
          <p className="text-gray-600 dark:text-gray-300">登录后即可查看您的学习统计</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                我的学习统计
              </h1>
              <p className="text-gray-500 dark:text-gray-400">
                欢迎回来，{username || '学习者'}
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500 dark:text-gray-400">学习者ID</div>
              <div className="font-mono text-gray-800 dark:text-white">{userId}</div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-6 bg-gray-100 dark:bg-gray-700 rounded-lg p-1 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === 'overview'
                ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-300 shadow'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white'
            }`}
          >
            📊 学习概览
          </button>
          <button
            onClick={() => setActiveTab('chapters')}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === 'chapters'
                ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-300 shadow'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white'
            }`}
          >
            📚 章节进度
          </button>
          <button
            onClick={() => setActiveTab('exams')}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === 'exams'
                ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-300 shadow'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white'
            }`}
          >
            📝 考试记录
          </button>
          <button
            onClick={() => setActiveTab('achievements')}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === 'achievements'
                ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-300 shadow'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white'
            }`}
          >
            🏆 我的成就
          </button>
          <button
            onClick={() => setActiveTab('graph')}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === 'graph'
                ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-300 shadow'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white'
            }`}
          >
            🗺️ 知识图谱
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* 情感反馈卡片 */}
            {feedback && (
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
                <div className="text-2xl mb-2">
                  {(progress?.streak ?? 0) >= 7 ? '🔥' : (progress?.streak ?? 0) >= 3 ? '💪' : '✨'}
                </div>
                <div className="text-xl font-bold mb-2">{feedback.encouragement}</div>
                {progress && (
                  <div className="text-blue-100 text-sm">
                    连续学习 {progress.streak} 天 · 最佳纪录 {progress.bestStreak} 天
                  </div>
                )}
              </div>
            )}

            {/* 成就展示 */}
            {achievements.filter(a => a.unlocked).length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h3 className="font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                  <span>🏆</span> 已解锁成就
                </h3>
                <div className="flex flex-wrap gap-3">
                  {achievements.filter(a => a.unlocked).map((achievement) => (
                    <div key={achievement.id} className="bg-yellow-100 dark:bg-yellow-900/30 rounded-lg px-4 py-3 flex items-center gap-2">
                      <span className="text-2xl">{achievement.icon}</span>
                      <div>
                        <div className="font-medium text-gray-800 dark:text-white">{achievement.name}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{achievement.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 基本统计 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">练习次数</div>
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {records.length}
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">考试次数</div>
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                  {examRecords.length}
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">平均得分</div>
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {avgScore.toFixed(1)}%
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">总学习时长</div>
                <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                  {Math.round(totalPracticeTime / 60)}分钟
                </div>
              </div>
            </div>

            {/* 优势和建议 */}
            {feedback && (feedback.strengths.length > 0 || feedback.weaknesses.length > 0) && (
              <div className="grid md:grid-cols-2 gap-4">
                {feedback.strengths.length > 0 && (
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg shadow p-6">
                    <h3 className="font-bold text-green-700 dark:text-green-400 mb-3 flex items-center gap-2">
                      <span>💪</span> 你的优势
                    </h3>
                    <ul className="space-y-2">
                      {feedback.strengths.map((strength, index) => (
                        <li key={index} className="text-green-600 dark:text-green-300 flex items-start gap-2">
                          <span className="mt-1">•</span>
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {feedback.weaknesses.length > 0 && (
                  <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg shadow p-6">
                    <h3 className="font-bold text-orange-700 dark:text-orange-400 mb-3 flex items-center gap-2">
                      <span>📝</span> 需要加强
                    </h3>
                    <ul className="space-y-2">
                      {feedback.weaknesses.map((weakness, index) => (
                        <li key={index} className="text-orange-600 dark:text-orange-300 flex items-start gap-2">
                          <span className="mt-1">•</span>
                          {weakness}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* 下一步建议 */}
            {feedback && (
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg shadow p-6">
                <h3 className="font-bold text-blue-700 dark:text-blue-400 mb-3 flex items-center gap-2">
                  <span>💡</span> 下一步建议
                </h3>
                <p className="text-blue-600 dark:text-blue-300">{feedback.nextSuggestion}</p>
              </div>
            )}

            {/* 最近练习 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="font-bold text-gray-800 dark:text-white">最近练习</h3>
              </div>
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {records.length === 0 ? (
                  <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                    暂无练习记录
                  </div>
                ) : (
                  records.slice(0, 5).map((record) => (
                    <div key={record.id} className="p-4 flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-800 dark:text-white">
                          {record.chapter_name || record.exercise_title}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(record.completed_at)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-bold ${
                          record.total_score > 0 && (record.score / record.total_score) >= 0.9
                            ? 'text-green-600 dark:text-green-400'
                            : record.total_score > 0 && (record.score / record.total_score) >= 0.6
                            ? 'text-yellow-600 dark:text-yellow-400'
                            : 'text-red-600 dark:text-red-400'
                        }`}>
                          {record.score}/{record.total_score}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          用时{record.duration || 0}分钟
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Chapters Tab */}
        {activeTab === 'chapters' && (
          <div className="space-y-4">
            {chapterStats.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center text-gray-500 dark:text-gray-400">
                暂无章节学习数据
              </div>
            ) : (
              chapterStats.map((chapter) => (
                <div key={chapter.chapterId} className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-bold text-gray-800 dark:text-white">{chapter.chapterName}</h4>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          练习{chapter.attempts}次 | 最高分 {chapter.bestScore.toFixed(0)}%
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm text-white ${getMasteryColor(chapter.masteryLevel)}`}>
                        {getMasteryText(chapter.masteryLevel)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${getMasteryColor(chapter.masteryLevel)}`}
                        style={{ width: `${chapter.bestScore}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                      <span>0%</span>
                      <span>平均: {chapter.avgScore.toFixed(0)}%</span>
                      <span>100%</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Exams Tab */}
        {activeTab === 'exams' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {examRecords.length === 0 ? (
                <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                  暂无考试记录
                </div>
              ) : (
                examRecords.map((exam) => (
                  <div key={exam.id} className="p-4 flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-800 dark:text-white">
                        {examTitles[exam.exam_title] || exam.exam_title}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(exam.submitted_at)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-bold text-xl ${
                        exam.total_score > 0 && (exam.score / exam.total_score) >= 0.9
                          ? 'text-green-600 dark:text-green-400'
                          : exam.total_score > 0 && (exam.score / exam.total_score) >= 0.6
                          ? 'text-yellow-600 dark:text-yellow-400'
                          : 'text-red-600 dark:text-red-400'
                      }`}>
                        {exam.score}/{exam.total_score}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {exam.total_score > 0 ? ((exam.score / exam.total_score) * 100).toFixed(0) : 0}%
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            {examRecords.length > 0 && (
              <div className="p-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">考试平均分</span>
                  <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {examAvgScore.toFixed(1)}%
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Achievements Tab */}
        {activeTab === 'achievements' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <span>🎉</span> 已解锁 ({achievements.filter(a => a.unlocked).length}/{achievements.length})
              </h3>
              {achievements.filter(a => a.unlocked).length === 0 ? (
                <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                  <div className="text-4xl mb-2">🔒</div>
                  <p>开始学习后，成就会陆续解锁！</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {achievements.filter(a => a.unlocked).map((achievement) => (
                    <div key={achievement.id} className="bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 rounded-lg p-4 flex items-start gap-4 border border-yellow-200 dark:border-yellow-700">
                      <div className="text-4xl">{achievement.icon}</div>
                      <div className="flex-1">
                        <div className="font-bold text-gray-800 dark:text-white">{achievement.name}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{achievement.description}</div>
                        {achievement.unlockedAt && (
                          <div className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                            解锁于: {formatDate(achievement.unlockedAt)}
                          </div>
                        )}
                      </div>
                      <div className="text-green-500 text-2xl">✓</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {achievements.filter(a => !a.unlocked).length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h3 className="font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                  <span>🔒</span> 待解锁 ({achievements.filter(a => !a.unlocked).length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {achievements.filter(a => !a.unlocked).map((achievement) => (
                    <div key={achievement.id} className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 flex items-start gap-4 opacity-60">
                      <div className="text-4xl grayscale">{achievement.icon}</div>
                      <div className="flex-1">
                        <div className="font-bold text-gray-600 dark:text-gray-400">{achievement.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-500 mt-1">{achievement.description}</div>
                        {achievement.requirement && (
                          <div className="text-xs text-gray-400 dark:text-gray-600 mt-2">
                            条件: {achievement.requirement}
                          </div>
                        )}
                        {achievement.progress !== undefined && (
                          <div className="mt-2">
                            <div className="w-full bg-gray-300 dark:bg-gray-600 rounded-full h-2">
                              <div
                                className="bg-blue-500 h-2 rounded-full transition-all"
                                style={{ width: `${achievement.progress}%` }}
                              />
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-right">
                              {achievement.progress.toFixed(0)}%
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="text-gray-400 text-2xl">🔒</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Knowledge Graph Tab */}
        {activeTab === 'graph' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="font-bold text-gray-800 dark:text-white mb-4">我的学习路径</h3>
            {chapterStats.length === 0 ? (
              <div className="text-center text-gray-500 dark:text-gray-400 py-12">
                <div className="text-6xl mb-4">🗺️</div>
                <p>开始学习后，这里将显示您的知识图谱</p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-4 justify-center">
                {chapterStats.map((chapter) => (
                  <div
                    key={chapter.chapterId}
                    className="relative flex flex-col items-center"
                  >
                    <div
                      className={`w-20 h-20 rounded-full flex items-center justify-center text-white font-bold shadow-lg ${getMasteryColor(chapter.masteryLevel)}`}
                      title={`${chapter.chapterName}: ${getMasteryText(chapter.masteryLevel)}`}
                    >
                      <div className="text-center">
                        <div className="text-xs">{chapter.bestScore.toFixed(0)}%</div>
                      </div>
                    </div>
                    <div className="mt-2 text-center">
                      <div className="text-sm font-medium text-gray-800 dark:text-white">
                        {chapter.chapterName}
                      </div>
                      <div className={`text-xs ${
                        chapter.masteryLevel === 'mastered' ? 'text-green-600' :
                        chapter.masteryLevel === 'proficient' ? 'text-blue-600' :
                        chapter.masteryLevel === 'learning' ? 'text-yellow-600' :
                        'text-gray-500'
                      }`}>
                        {getMasteryText(chapter.masteryLevel)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
