import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const THEMES = [
  { id: 'tutorial', name: '연습게임', icon: '🔍', color: 'bg-blue-900/40' },
  { id: 'season1', name: '정규 시즌 1', icon: '🎬', color: 'bg-red-900/40' },
  { id: 'special', name: '단편선', icon: '📖', color: 'bg-purple-900/40' },
  { id: 'horror', name: '공포 특집', icon: '👻', color: 'bg-green-900/40' }
];

const SCENARIOS = [
  { 
    id: 'scenario0', 
    themeId: 'tutorial',
    title: '격포항 밀실 실종사건', 
    desc: '💡 룰과 시스템을 익히는 연습용 사건입니다.',
    level: '연습게임'
  },
  { 
    id: 'scenario1', 
    themeId: 'tutorial',
    title: '보령 펜션 살인사건', 
    desc: '프라이빗 스파에서 벌어진 참극.',
    level: '⭐⭐⭐'
  },
  { 
    id: 'scenario2', 
    themeId: 'tutorial',
    title: '검은 장미 가면 무도회', 
    desc: '정전과 함께 벌어진 단 10초의 살인.',
    level: '⭐⭐⭐⭐⭐'
  },
  { 
    id: 'scenario3', 
    themeId: 'tutorial',
    title: '한겨울 캠핑장 사망사건', 
    desc: '영하 15도 고급 글램핑장의 비밀.',
    level: '⭐⭐⭐⭐'
  }
];

export default function Lobby() {
  const [viewMode, setViewMode] = useState('themes'); // 'themes' | 'scenarios'
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [selectedScenario, setSelectedScenario] = useState('');
  
  const navigate = useNavigate();

  // 특정 테마 선택 시 시나리오 목록으로 전환
  const handleThemeSelect = (themeId) => {
    setSelectedTheme(themeId);
    setViewMode('scenarios');
    // 해당 테마의 첫 시나리오 자동 선택
    const firstInTheme = SCENARIOS.find(s => s.themeId === themeId);
    if (firstInTheme) setSelectedScenario(firstInTheme.id);
  };

  const handleJoin = () => {
    if (!selectedScenario) return;
    localStorage.setItem('scenarioId', selectedScenario);
    navigate('/game');
  };

  return (
    <div className="flex flex-col items-center min-h-screen py-10 px-6 bg-gray-900 text-white font-sans">
      {/* 상단 타이틀 */}
      <div className="text-center mb-8">
        <h1 className="text-5xl font-black text-red-600 mb-2 tracking-widest drop-shadow-lg">
          CRIME SCENE
        </h1>
        <p className="text-gray-400 text-sm">진실을 밝히는 자, 누구인가</p>
      </div>

      {/* 1단계: 테마 선택 화면 */}
      {viewMode === 'themes' && (
        <div className="w-full max-w-md animate-fadeIn">
          <h2 className="text-xl font-bold mb-6 text-center text-gray-300">사건 테마를 선택하세요</h2>
          <div className="grid grid-cols-2 gap-4">
            {THEMES.map((theme) => (
              <div
                key={theme.id}
                onClick={() => handleThemeSelect(theme.id)}
                className={`aspect-square flex flex-col items-center justify-center rounded-2xl cursor-pointer border-2 border-gray-700 transition-all active:scale-95 hover:border-red-500 ${theme.color}`}
              >
                <span className="text-4xl mb-3">{theme.icon}</span>
                <span className="font-bold text-lg">{theme.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2단계: 시나리오 선택 화면 */}
      {viewMode === 'scenarios' && (
        <div className="w-full max-w-sm flex flex-col flex-1 animate-fadeIn">
          <div className="flex items-center mb-6">
            <button 
              onClick={() => setViewMode('themes')}
              className="text-gray-400 hover:text-white flex items-center transition-colors"
            >
              <span className="mr-2">←</span> 테마 변경
            </button>
            <h2 className="ml-4 font-bold text-xl text-red-500">
              {THEMES.find(t => t.id === selectedTheme)?.name}
            </h2>
          </div>

          {/* 💡 시나리오 리스트 영역: 하단 여백을 pb-40으로 넉넉하게 수정 */}
          <div className="space-y-4 flex-1 pb-40"> 
            {SCENARIOS.filter(s => s.themeId === selectedTheme).map((scenario) => (
              <div 
                key={scenario.id}
                onClick={() => setSelectedScenario(scenario.id)}
                className={`p-5 rounded-xl cursor-pointer border-2 transition-all ${
                  selectedScenario === scenario.id 
                    ? 'border-red-600 bg-gray-800 shadow-xl' 
                    : 'border-gray-700 bg-gray-800/40 opacity-70'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg leading-tight">{scenario.title}</h3>
                  <span className="text-xs text-yellow-500 shrink-0 ml-2">{scenario.level}</span>
                </div>
                <p className="text-gray-400 text-xs leading-relaxed">{scenario.desc}</p>
              </div>
            ))}
            
            {/* 💡 추가 팁: 리스트 맨 마지막에 명시적인 투명 공간 추가 */}
            <div className="h-10 w-full"></div>
          </div>

          {/* 💡 하단 고정 버튼 영역 */}
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-gray-900 border-t border-gray-800 max-w-md mx-auto z-10">
            <button
              onClick={handleJoin}
              disabled={!selectedScenario}
              className={`w-full py-4 font-bold text-xl rounded-lg shadow-2xl transition-all active:scale-95 ${
                selectedScenario 
                  ? 'bg-red-700 hover:bg-red-600 text-white' 
                  : 'bg-gray-700 text-gray-500 cursor-not-allowed'
              }`}
            >
              사건 현장 입장하기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}