import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SCENARIOS = [
  { 
    id: 'scenario0', 
    title: '격포항 밀실 실종사건', 
    desc: '💡 [튜토리얼] 본 게임 전 룰과 시스템을 익히는 연습용 사건입니다.',
    level: '연습게임'
  },
  { 
    id: 'scenario1', 
    title: '피로 물든 결승전', 
    desc: '대학교 체육대회 옥상 투신사건',
    level: '⭐⭐⭐'
  },
  { 
    id: 'scenario2', 
    title: '미정 (추후 업데이트)', 
    desc: '여행용 본 게임 시나리오 1',
    level: '⭐⭐⭐⭐'
  },
  { 
    id: 'scenario3', 
    title: '미정 (추후 업데이트)', 
    desc: '여행용 본 게임 시나리오 2',
    level: '⭐⭐⭐⭐⭐'
  }
];

export default function Lobby() {
  const [selectedScenario, setSelectedScenario] = useState(SCENARIOS[0].id);
  const navigate = useNavigate();

  const handleJoin = () => {
    // 선택한 시나리오 ID만 로컬 스토리지에 저장
    localStorage.setItem('scenarioId', selectedScenario);
    
    // 게임 화면으로 이동
    navigate('/game');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-10 px-6 bg-gray-900 text-white">
      {/* 타이틀 영역 */}
      <div className="text-center mb-10">
        <h1 className="text-5xl font-black text-red-600 mb-4 tracking-widest drop-shadow-md">
          CRIME SCENE
        </h1>
        <p className="text-gray-400 text-lg tracking-wide">플레이할 사건을 선택하세요</p>
      </div>

      {/* 시나리오 선택 리스트 */}
      <div className="w-full max-w-sm space-y-4 mb-10">
        {SCENARIOS.map((scenario) => (
          <div 
            key={scenario.id}
            onClick={() => setSelectedScenario(scenario.id)}
            className={`p-4 rounded-xl cursor-pointer border-2 transition-all ${
              selectedScenario === scenario.id 
                ? 'border-red-600 bg-gray-800 shadow-[0_0_15px_rgba(220,38,38,0.3)]' 
                : 'border-gray-700 bg-gray-800/50 hover:border-gray-500'
            }`}
          >
            <div className="flex justify-between items-end mb-1">
              <h3 className={`font-bold text-lg ${selectedScenario === scenario.id ? 'text-red-500' : 'text-gray-300'}`}>
                {scenario.title}
              </h3>
              <span className="text-xs text-yellow-500">{scenario.level}</span>
            </div>
            <p className="text-gray-400 text-sm">{scenario.desc}</p>
          </div>
        ))}
      </div>

      {/* 입장 버튼 */}
      <div className="w-full max-w-sm">
        <button
          onClick={handleJoin}
          className="w-full py-4 bg-red-700 hover:bg-red-600 text-white font-bold text-xl rounded-lg shadow-lg transition-all active:scale-95"
        >
          사건 현장 입장하기
        </button>
      </div>
    </div>
  );
}