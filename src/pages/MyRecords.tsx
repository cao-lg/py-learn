import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getStoredUserId, getStoredUsername } from '../utils/uums-api';

// 练习标题说明映射
const exerciseTitleMap: Record<string, string> = {
  'ch01_basics': '第一章 Python基础',
  'ch02_control': '第二章 流程控制',
  'ch03_functions': '第三章 函数',
  'ch04_data_structures': '第四章 数据结构',
  'ch05_file_io': '第五章 文件操作',
  'ch06_oop': '第六章 面向对象',
  'ch07_modules': '第七章 模块和包',
  'ch08_exceptions': '第八章 异常处理',
  'ch09_decorators': '第九章 装饰器',
  'ch10_generators': '第十章 生成器',
  'ch11_comprehensions': '第十一章 推导式',
  'ch12_lambdas': '第十二章 Lambda函数',
  'ch13_closures': '第十三章 闭包',
  'ch14_modules': '第十四章 模块详解',
  'ch15_packaging': '第十五章 包管理',
  'default': '练习'
};

interface StudyRecord {
  id: number;
  user_id: number;
  exercise_title: string;
  exercise_type: string;
  score: number;
  total_score: number;
  duration: number;
  completed_at: string;
}

interface ExamRecord {
  id: number;
  user_id: number;
  exam_title: string;
  exam_type: string;
  score: number;
  total_score: number;
  status: string;
  submitted_at: string;
}

interface Student {
  id: number;
  username: string;
  nickname: string;
  class_id: number;
  class_name?: string;
}

export function MyRecordsPage() {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState<string>('student');
  const [loading, setLoading] = useState(true);
  const [myStudyRecords, setMyStudyRecords] = useState<StudyRecord[]>([]);
  const [myExamRecords, setMyExamRecords] = useState<ExamRecord[]>([]);
  const [classStudents, setClassStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<number | null>(null);
  const [studentStudyRecords, setStudentStudyRecords] = useState<StudyRecord[]>([]);
  const [studentExamRecords, setStudentExamRecords] = useState<ExamRecord[]>([]);
  const [activeTab, setActiveTab] = useState<'study' | 'exam'>('study');
  const [activeClassTab, setActiveClassTab] = useState<'study' | 'exam'>('study');

  useEffect(() => {
    const storedUserId = getStoredUserId();
    const storedUsername = getStoredUsername();

    if (!storedUserId || !storedUsername) {
      navigate('/');
      return;
    }

    // 获取用户详细信息
    fetchUserDetails(storedUserId);
  }, [navigate]);

  // 获取练习标题的说明
  const getExerciseTitle = (title: string | null): string => {
    if (!title) return '练习';
    const lowerTitle = title.toLowerCase();
    for (const key of Object.keys(exerciseTitleMap)) {
      if (lowerTitle.includes(key.toLowerCase())) {
        return exerciseTitleMap[key];
      }
    }
    return title || '练习';
  };

  const fetchUserDetails = async (id: string) => {
    try {
      const response = await fetch('http://localhost:3000/api/users/' + id);
      const data = await response.json();
      if (data.code === 0) {
        setUserRole(data.data.role || 'student');
        
        // 根据角色加载不同数据
        if (data.data.role === 'teacher') {
          // 老师：获取他班级的所有学生
          fetchClassStudents(data.data.class_id);
        } else {
          // 学生：获取本人的学习记录
          fetchMyRecords(parseInt(id));
        }
      }
    } catch (error) {
      console.error('获取用户信息失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyRecords = async (userId: number) => {
    try {
      // 获取本人的学习记录
      const studyResponse = await fetch('http://localhost:3000/api/site-stats/site_1777469231464/study-records?user_id=' + userId);
      const studyData = await studyResponse.json();
      if (studyData.data) {
        setMyStudyRecords(studyData.data);
      }

      // 获取本人的考试记录
      const examResponse = await fetch('http://localhost:3000/api/site-stats/site_1777469231464/exam-records?user_id=' + userId);
      const examData = await examResponse.json();
      if (examData.data) {
        setMyExamRecords(examData.data);
      }
    } catch (error) {
      console.error('获取记录失败:', error);
    }
  };

  const fetchClassStudents = async (classId: number) => {
    try {
      // 从班级API获取学生列表
      const response = await fetch('http://localhost:3000/api/classes/' + classId + '/students');
      const data = await response.json();
      if (data.code === 0 && data.data) {
        setClassStudents(data.data);
      }
    } catch (error) {
      console.error('获取班级学生失败:', error);
    }
  };

  const fetchStudentRecords = async (studentId: number) => {
    try {
      // 获取学生的学习记录
      const studyResponse = await fetch('http://localhost:3000/api/site-stats/site_1777469231464/study-records?user_id=' + studentId);
      const studyData = await studyResponse.json();
      if (studyData.data) {
        setStudentStudyRecords(studyData.data);
      }

      // 获取学生的考试记录
      const examResponse = await fetch('http://localhost:3000/api/site-stats/site_1777469231464/exam-records?user_id=' + studentId);
      const examData = await examResponse.json();
      if (examData.data) {
        setStudentExamRecords(examData.data);
      }
    } catch (error) {
      console.error('获取学生学习记录失败:', error);
    }
  };

  const handleStudentSelect = (studentId: number) => {
    setSelectedStudent(studentId);
    fetchStudentRecords(studentId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">加载中...</p>
        </div>
      </div>
    );
  }

  // 老师视图
  if (userRole === 'teacher') {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">📊 我的班级</h1>
            <p className="text-gray-600 dark:text-gray-400">查看班级学生的行为记录</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* 学生列表 */}
            <div className="md:col-span-1 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">📋 班级学生</h2>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {classStudents.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-8">暂无学生数据</p>
                ) : (
                  classStudents.map((student) => (
                    <button
                      key={student.id}
                      onClick={() => handleStudentSelect(student.id)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        selectedStudent === student.id
                          ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                          : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <div className="font-medium">{student.nickname || student.username}</div>
                      <div className="text-sm text-gray-500">ID: {student.id}</div>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* 学生详情 */}
            <div className="md:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              {selectedStudent ? (
                <>
                  <div className="mb-4">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {classStudents.find(s => s.id === selectedStudent)?.nickname || classStudents.find(s => s.id === selectedStudent)?.username} 的学习记录
                    </h2>
                  </div>

                  {/* 标签页 */}
                  <div className="flex gap-2 mb-4">
                    <button
                      onClick={() => setActiveClassTab('study')}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        activeClassTab === 'study'
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      📝 练习记录
                    </button>
                    <button
                      onClick={() => setActiveClassTab('exam')}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        activeClassTab === 'exam'
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      📋 考试记录
                    </button>
                  </div>

                  {/* 练习记录 */}
                  {activeClassTab === 'study' && (
                    <div className="overflow-x-auto">
                      {studentStudyRecords.length === 0 ? (
                        <p className="text-gray-500 dark:text-gray-400 text-center py-8">暂无练习记录</p>
                      ) : (
                        <table className="w-full">
                          <thead className="bg-gray-50 dark:bg-gray-900">
                            <tr>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">练习名称</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">类型</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">得分</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">时长</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">完成时间</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {studentStudyRecords.map((record) => (
                              <tr key={record.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                  <div>{getExerciseTitle(record.exercise_title)}</div>
                                  {record.exercise_title && <div className="text-xs text-gray-400">{record.exercise_title}</div>}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{record.exercise_type}</td>
                                <td className="px-4 py-3 text-sm">
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    (record.score / record.total_score) >= 0.6
                                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                      : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                  }`}>
                                    {record.score}/{record.total_score}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{record.duration}秒</td>
                                <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                                  {new Date(record.completed_at).toLocaleString('zh-CN')}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  )}

                  {/* 考试记录 */}
                  {activeClassTab === 'exam' && (
                    <div className="overflow-x-auto">
                      {studentExamRecords.length === 0 ? (
                        <p className="text-gray-500 dark:text-gray-400 text-center py-8">暂无考试记录</p>
                      ) : (
                        <table className="w-full">
                          <thead className="bg-gray-50 dark:bg-gray-900">
                            <tr>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">考试名称</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">类型</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">得分</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">状态</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">提交时间</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {studentExamRecords.map((record) => (
                              <tr key={record.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{record.exam_title}</td>
                                <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{record.exam_type}</td>
                                <td className="px-4 py-3 text-sm">
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    (record.score / record.total_score) >= 0.6
                                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                      : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                  }`}>
                                    {record.score}/{record.total_score}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-sm">
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    record.status === 'graded'
                                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                                  }`}>
                                    {record.status === 'graded' ? '已评分' : '待评分'}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                                  {new Date(record.submitted_at).toLocaleString('zh-CN')}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <span className="text-6xl mb-4 block">👈</span>
                  <p className="text-gray-500 dark:text-gray-400">请从左侧选择一个学生查看学习记录</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 学生视图
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">📚 我的学习记录</h1>
          <p className="text-gray-600 dark:text-gray-400">查看您的练习和考试成绩</p>
        </div>

        {/* 标签页 */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('study')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'study'
                ? 'bg-purple-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            📝 练习记录
          </button>
          <button
            onClick={() => setActiveTab('exam')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'exam'
                ? 'bg-purple-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            📋 考试记录
          </button>
        </div>

        {/* 练习记录 */}
        {activeTab === 'study' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              {myStudyRecords.length === 0 ? (
                <div className="text-center py-12">
                  <span className="text-6xl mb-4 block">📝</span>
                  <p className="text-gray-500 dark:text-gray-400">暂无练习记录</p>
                  <Link
                    to="/practice"
                    className="inline-block mt-4 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    去练习
                  </Link>
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-900">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">练习名称</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">类型</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">得分</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">时长</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">完成时间</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {myStudyRecords.map((record) => (
                      <tr key={record.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                          <div>{getExerciseTitle(record.exercise_title)}</div>
                          {record.exercise_title && <div className="text-xs text-gray-400">{record.exercise_title}</div>}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                          {record.exercise_type === 'homework' ? '作业' : '练习'}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            (record.score / record.total_score) >= 0.6
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                              : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                          }`}>
                            {record.score}/{record.total_score}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                          {Math.floor(record.duration / 60)}分{record.duration % 60}秒
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                          {new Date(record.completed_at).toLocaleString('zh-CN')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* 考试记录 */}
        {activeTab === 'exam' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              {myExamRecords.length === 0 ? (
                <div className="text-center py-12">
                  <span className="text-6xl mb-4 block">📋</span>
                  <p className="text-gray-500 dark:text-gray-400">暂无考试记录</p>
                  <Link
                    to="/exam"
                    className="inline-block mt-4 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    参加考试
                  </Link>
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-900">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">考试名称</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">类型</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">得分</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">状态</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">提交时间</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {myExamRecords.map((record) => (
                      <tr key={record.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{record.exam_title}</td>
                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                          {record.exam_type === 'mid_term' ? '期中' : record.exam_type === 'final_exam' ? '期末' : '测验'}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            (record.score / record.total_score) >= 0.6
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                              : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                          }`}>
                            {record.score}/{record.total_score}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            record.status === 'graded'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                          }`}>
                            {record.status === 'graded' ? '已评分' : '待评分'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                          {new Date(record.submitted_at).toLocaleString('zh-CN')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}