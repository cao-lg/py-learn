import { useState, useEffect } from 'react';
import { AdminLayout } from '../components/AdminLayout';
import { API_BASE } from '../utils/uums-api';

interface ChapterNode {
  id: string;
  name: string;
  attempts: number;
  avgScore: number;
  completionRate: number;
  masteryLevel: 'mastered' | 'learning' | 'weak' | 'not-started';
  dependencies: string[];
  position?: { x: number; y: number };
}

interface StudentProgress {
  userId: number;
  userName: string;
  chapters: {
    chapterId: string;
    masteryLevel: string;
    lastPractice?: string;
  }[];
}

export function KnowledgeGraphPage() {
  const [chapters, setChapters] = useState<ChapterNode[]>([]);
  const [studentProgress, setStudentProgress] = useState<StudentProgress[]>([]);
  const [selectedView, setSelectedView] = useState<'chapter' | 'student' | 'heatmap'>('chapter');
  const [selectedStudent, setSelectedStudent] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // 获取统计数据
      const statsRes = await fetch(`${API_BASE}/stats`);
      const statsData = await statsRes.json();

      // 构建章节节点
      const chapterNodes: ChapterNode[] = [
        { id: 'ch01_basics', name: '第一章 基础语法', attempts: 0, avgScore: 0, completionRate: 0, masteryLevel: 'not-started', dependencies: [] },
        { id: 'ch02_variables', name: '第二章 变量', attempts: 0, avgScore: 0, completionRate: 0, masteryLevel: 'not-started', dependencies: ['ch01_basics'] },
        { id: 'ch03_operators', name: '第三章 运算符', attempts: 0, avgScore: 0, completionRate: 0, masteryLevel: 'not-started', dependencies: ['ch02_variables'] },
        { id: 'ch04_control_flow', name: '第四章 控制流', attempts: 0, avgScore: 0, completionRate: 0, masteryLevel: 'not-started', dependencies: ['ch03_operators'] },
        { id: 'ch05_functions', name: '第五章 函数', attempts: 0, avgScore: 0, completionRate: 0, masteryLevel: 'not-started', dependencies: ['ch04_control_flow'] },
        { id: 'ch06_data_structures', name: '第六章 数据结构', attempts: 0, avgScore: 0, completionRate: 0, masteryLevel: 'not-started', dependencies: ['ch05_functions'] },
        { id: 'ch07_strings', name: '第七章 字符串', attempts: 0, avgScore: 0, completionRate: 0, masteryLevel: 'not-started', dependencies: ['ch06_data_structures'] },
        { id: 'ch08_file_io', name: '第八章 文件IO', attempts: 0, avgScore: 0, completionRate: 0, masteryLevel: 'not-started', dependencies: ['ch07_strings'] },
        { id: 'ch09_exception', name: '第九章 异常处理', attempts: 0, avgScore: 0, completionRate: 0, masteryLevel: 'not-started', dependencies: ['ch08_file_io'] },
        { id: 'ch10_oop', name: '第十章 面向对象', attempts: 0, avgScore: 0, completionRate: 0, masteryLevel: 'not-started', dependencies: ['ch09_exception'] },
      ];

      // 从统计数据更新章节信息
      if (statsData.topChapters) {
        statsData.topChapters.forEach((ch: any) => {
          const node = chapterNodes.find(n => n.id === ch.chapterId);
          if (node) {
            node.attempts = ch.attempts;
            node.avgScore = ch.avgScore;
            node.completionRate = ch.completionRate;
            node.masteryLevel = ch.avgScore >= 80 ? 'mastered' : ch.avgScore >= 60 ? 'learning' : ch.avgScore > 0 ? 'weak' : 'not-started';
          }
        });
      }

      // 计算位置（圆形布局）
      const radius = 280;
      const centerX = 300;
      const centerY = 300;
      chapterNodes.forEach((node, index) => {
        const angle = (index / chapterNodes.length) * 2 * Math.PI - Math.PI / 2;
        node.position = {
          x: centerX + radius * Math.cos(angle),
          y: centerY + radius * Math.sin(angle)
        };
      });

      setChapters(chapterNodes);

      // 获取学生学习进度
      const studyRes = await fetch(`${API_BASE}/site-stats/site_1777469231464/study-records`);
      const studyData = await studyRes.json();

      // 按学生分组
      const progressMap = new Map<number, StudentProgress>();
      
      if (studyData.data) {
        studyData.data.forEach((record: any) => {
          if (!progressMap.has(record.user_id)) {
            progressMap.set(record.user_id, {
              userId: record.user_id,
              userName: record.user_id === 12 ? '系统管理员' : `学生${record.user_id}`,
              chapters: []
            });
          }
          const progress = progressMap.get(record.user_id)!;
          const existingChapter = progress.chapters.find(c => c.chapterId === record.chapter_id);
          
          if (record.chapter_id && !existingChapter) {
            progress.chapters.push({
              chapterId: record.chapter_id,
              masteryLevel: record.mastery_level || (record.score / record.total_score >= 0.8 ? 'mastered' : record.score / record.total_score >= 0.6 ? 'learning' : 'weak'),
              lastPractice: record.completed_at
            });
          }
        });
      }

      setStudentProgress(Array.from(progressMap.values()));
      setLoading(false);
    } catch (error) {
      console.error('Failed to load knowledge graph data:', error);
      setLoading(false);
    }
  };

  const getMasteryColor = (level: string) => {
    switch (level) {
      case 'mastered': return '#10b981';
      case 'learning': return '#f59e0b';
      case 'weak': return '#ef4444';
      default: return '#e5e7eb';
    }
  };

  const getMasteryLabel = (level: string) => {
    switch (level) {
      case 'mastered': return '已掌握';
      case 'learning': return '学习中';
      case 'weak': return '需加强';
      default: return '未开始';
    }
  };

  if (loading) {
    return (
      <AdminLayout title="知识图谱分析">
        <div className="flex items-center justify-center min-h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="知识图谱分析">
      {/* 视图切换 */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setSelectedView('chapter')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            selectedView === 'chapter' 
              ? 'bg-purple-600 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          📚 章节关系图
        </button>
        <button
          onClick={() => setSelectedView('student')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            selectedView === 'student' 
              ? 'bg-purple-600 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          👨‍🎓 学习进度图
        </button>
        <button
          onClick={() => setSelectedView('heatmap')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            selectedView === 'heatmap' 
              ? 'bg-purple-600 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          🔥 掌握度热力图
        </button>
      </div>

      {/* 图例 */}
      <div className="bg-white rounded-xl p-4 mb-6 shadow-lg border border-gray-200">
        <div className="flex items-center gap-6">
          <span className="text-sm font-medium text-gray-600">掌握程度：</span>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-emerald-500"></div>
            <span className="text-sm">已掌握 (≥80%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-amber-500"></div>
            <span className="text-sm">学习中 (60-79%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-red-500"></div>
            <span className="text-sm">需加强 (40-59%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-gray-200"></div>
            <span className="text-sm">未开始</span>
          </div>
        </div>
      </div>

      {/* 章节关系图 */}
      {selectedView === 'chapter' && (
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Python 学习路径图</h3>
          <svg width="600" height="600" className="mx-auto">
            {/* 连接线 */}
            {chapters.map(chapter => (
              chapter.dependencies.map(depId => {
                const dep = chapters.find(c => c.id === depId);
                if (!dep || !chapter.position || !dep.position) return null;
                return (
                  <line
                    key={`${depId}-${chapter.id}`}
                    x1={dep.position.x}
                    y1={dep.position.y}
                    x2={chapter.position.x}
                    y2={chapter.position.y}
                    stroke="#d1d5db"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                  />
                );
              })
            ))}
            
            {/* 章节节点 */}
            {chapters.map((chapter, index) => (
              <g key={chapter.id} transform={`translate(${chapter.position?.x || 0}, ${chapter.position?.y || 0})`}>
                <circle
                  r={20 + chapter.attempts * 2}
                  fill={getMasteryColor(chapter.masteryLevel)}
                  opacity="0.8"
                  stroke="#fff"
                  strokeWidth="3"
                />
                <text
                  textAnchor="middle"
                  dy="0.3em"
                  fill="#fff"
                  fontSize="12"
                  fontWeight="bold"
                >
                  {index + 1}
                </text>
                <text
                  y="35"
                  textAnchor="middle"
                  fill="#374151"
                  fontSize="11"
                >
                  {chapter.name.replace('第', '').replace('章 ', '\n')}
                </text>
                {chapter.avgScore > 0 && (
                  <text
                    y="48"
                    textAnchor="middle"
                    fill="#6b7280"
                    fontSize="10"
                  >
                    {chapter.avgScore}%
                  </text>
                )}
              </g>
            ))}
          </svg>
          
          {/* 统计信息 */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-emerald-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-emerald-600">
                {chapters.filter(c => c.masteryLevel === 'mastered').length}
              </div>
              <div className="text-sm text-emerald-600">已掌握章节</div>
            </div>
            <div className="bg-amber-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-amber-600">
                {chapters.filter(c => c.masteryLevel === 'learning').length}
              </div>
              <div className="text-sm text-amber-600">学习中的章节</div>
            </div>
            <div className="bg-red-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-red-600">
                {chapters.filter(c => c.masteryLevel === 'weak').length}
              </div>
              <div className="text-sm text-red-600">需要加强的章节</div>
            </div>
          </div>
        </div>
      )}

      {/* 学习进度图 */}
      {selectedView === 'student' && (
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">学生学习进度</h3>
          
          {/* 学生选择 */}
          <div className="mb-4">
            <select
              value={selectedStudent || ''}
              onChange={(e) => setSelectedStudent(Number(e.target.value))}
              className="px-4 py-2 rounded-lg border border-gray-300"
            >
              <option value="">选择学生...</option>
              {studentProgress.map(s => (
                <option key={s.userId} value={s.userId}>{s.userName}</option>
              ))}
            </select>
          </div>

          {selectedStudent && (
            <div className="mt-4">
              {(() => {
                const student = studentProgress.find(s => s.userId === selectedStudent);
                if (!student) return null;
                
                return (
                  <div>
                    <div className="mb-4">
                      <span className="font-medium">学生：{student.userName}</span>
                      <span className="ml-4 text-sm text-gray-500">
                        已学习 {student.chapters.length} / {chapters.length} 章
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {chapters.map((chapter, index) => {
                        const progress = student.chapters.find(c => c.chapterId === chapter.id);
                        const masteryLevel = progress?.masteryLevel || 'not-started';
                        
                        return (
                          <div
                            key={chapter.id}
                            className="flex flex-col items-center p-3 rounded-lg border-2"
                            style={{ 
                              borderColor: getMasteryColor(masteryLevel),
                              backgroundColor: getMasteryColor(masteryLevel) + '20'
                            }}
                          >
                            <div 
                              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                              style={{ backgroundColor: getMasteryColor(masteryLevel) }}
                            >
                              {index + 1}
                            </div>
                            <div className="text-xs mt-1 text-center max-w-16">
                              {chapter.name.replace('第一章 ', '').replace('第二章 ', '').replace('第三章 ', '').replace('第四章 ', '').replace('第五章 ', '').replace('第六章 ', '').replace('第七章 ', '').replace('第八章 ', '').replace('第九章 ', '').replace('第十章 ', '')}
                            </div>
                            <div className="text-xs mt-1 px-2 py-0.5 rounded-full" style={{ backgroundColor: getMasteryColor(masteryLevel), color: 'white' }}>
                              {getMasteryLabel(masteryLevel)}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {!selectedStudent && (
            <div className="text-center py-12 text-gray-500">
              <div className="text-4xl mb-2">👈</div>
              <p>请选择一个学生查看学习进度</p>
            </div>
          )}
        </div>
      )}

      {/* 掌握度热力图 */}
      {selectedView === 'heatmap' && (
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">学生-章节掌握度矩阵</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">学生</th>
                  {chapters.map((chapter, idx) => (
                    <th key={chapter.id} className="px-3 py-2 text-center text-xs font-medium text-gray-600">
                      Ch{idx + 1}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {studentProgress.map(student => (
                  <tr key={student.userId} className="border-t">
                    <td className="px-4 py-3 text-sm font-medium text-gray-700">
                      {student.userName}
                    </td>
                    {chapters.map((chapter) => {
                      const progress = student.chapters.find(c => c.chapterId === chapter.id);
                      const masteryLevel = progress?.masteryLevel || 'not-started';
                      
                      return (
                        <td 
                          key={chapter.id} 
                          className="px-3 py-3 text-center"
                          title={`${chapter.name}: ${getMasteryLabel(masteryLevel)}`}
                        >
                          <div 
                            className="w-8 h-8 rounded mx-auto flex items-center justify-center text-white text-xs font-bold"
                            style={{ backgroundColor: getMasteryColor(masteryLevel) }}
                          >
                            {progress ? Math.round(parseFloat(progress.masteryLevel === 'mastered' ? '100' : progress.masteryLevel === 'learning' ? '70' : '40')) : '-'}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 text-sm text-gray-500">
            <p>* 表头 Ch1-Ch10 对应第1-10章，颜色越深表示掌握程度越高</p>
            <p>* 数值代表掌握度百分比</p>
          </div>
        </div>
      )}

      {/* 统计卡片 */}
      <div className="grid md:grid-cols-4 gap-6 mt-6">
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
          <div className="text-sm opacity-80 mb-1">总章节数</div>
          <div className="text-3xl font-bold">{chapters.length}</div>
        </div>
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-6 text-white shadow-lg">
          <div className="text-sm opacity-80 mb-1">已掌握</div>
          <div className="text-3xl font-bold">
            {chapters.filter(c => c.masteryLevel === 'mastered').length}
          </div>
        </div>
        <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl p-6 text-white shadow-lg">
          <div className="text-sm opacity-80 mb-1">学习进度</div>
          <div className="text-3xl font-bold">
            {Math.round((chapters.filter(c => c.masteryLevel !== 'not-started').length / chapters.length) * 100)}%
          </div>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
          <div className="text-sm opacity-80 mb-1">平均分数</div>
          <div className="text-3xl font-bold">
            {chapters.length > 0 ? Math.round(chapters.reduce((a, c) => a + c.avgScore, 0) / chapters.filter(c => c.avgScore > 0).length || 0) : 0}%
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

