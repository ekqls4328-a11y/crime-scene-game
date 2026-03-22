import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// 💡 직관적인 파일명으로 import
import scenario0Data from '../data/scenario0.json';
import scenario1Data from '../data/scenario1.json';
import scenario2Data from '../data/scenario2.json';
import scenario3Data from '../data/scenario3.json';

// 💡 ID와 데이터를 매칭해주는 객체 (로비의 id와 파일 매칭)
const SCENARIO_DB = {
  scenario0: scenario0Data,
  scenario1: scenario1Data,
  scenario2: scenario2Data,
  scenario3: scenario3Data
};

export default function Game() {
  const [myRole, setMyRole] = useState(null);
  const [scenarioId, setScenarioId] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showResult, setShowResult] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    const id = localStorage.getItem('scenarioId');
    if (!id) {
      navigate('/');
      return;
    }
    setScenarioId(id);
    
    const savedRole = localStorage.getItem('myRole');
    if (savedRole) {
      setMyRole(JSON.parse(savedRole));
    }
  }, [navigate]);

  // 💡 현재 선택된 시나리오 데이터 가져오기
  const scenarioData = SCENARIO_DB[scenarioId];

  const handleSelectRole = (suspect) => {
    const confirmCheck = window.confirm(`'${suspect.name}' 역할을 선택하시겠습니까?\n한 번 고르면 바꿀 수 없습니다!`);
    if (confirmCheck) {
      setMyRole(suspect);
      localStorage.setItem('myRole', JSON.stringify(suspect));
    }
  };

  const handleReveal = () => {
    if (window.confirm("모두의 추리와 투표가 끝났습니까?\n\n'확인'을 누르면 진범과 사건의 전말이 공개됩니다!")) {
      setShowResult(true);
    }
  };

  const handleGoLobby = () => {
    localStorage.removeItem('myRole');
    navigate('/');
  };

  // 데이터 로딩 중이거나 잘못된 ID일 때 방어 로직
  if (!scenarioData) return <div className="p-10 text-white text-center">시나리오를 불러오는 중입니다...</div>;

  // 진범 찾기 (결과 공개용)
  const killer = scenarioData.suspects.find(s => s.isKiller) || scenarioData.suspects[0];

  // --------------------------------------------------------
  // 화면 1: 아직 역할을 고르지 않았을 때
  // --------------------------------------------------------
  if (!myRole) {
    return (
      <div className="min-h-screen p-6 pb-12 bg-gray-900 text-white animate-fade-in">
        <header className="mb-6 pt-4 text-center">
          <h1 className="text-3xl font-black text-red-500 mt-2">
            {scenarioData.title}
          </h1>
        </header>

        <div className="bg-gray-800 p-5 rounded-xl border border-red-900 shadow-[0_0_15px_rgba(220,38,38,0.2)] mb-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-yellow-500"></div>
          <h2 className="text-yellow-500 font-bold mb-3 flex items-center">
            <span className="text-xl mr-2">📜</span> 사건 브리핑
          </h2>
          <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">
            {scenarioData.summary}
          </p>
        </div>

        <div className="text-center mb-4">
          <h2 className="text-xl font-bold text-white">용의자 선택</h2>
          <p className="text-sm text-gray-400 mt-1">사건 개요를 숙지한 후, 역할을 하나씩 선택해주세요.</p>
        </div>

        <div className="space-y-4">
          {scenarioData.suspects.map((suspect) => (
            <div 
              key={suspect.id}
              onClick={() => handleSelectRole(suspect)}
              className="bg-gray-800 border border-gray-700 p-5 rounded-xl shadow-md cursor-pointer hover:border-red-500 hover:bg-gray-750 transition-all"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-2xl font-bold text-red-500">{suspect.name}</h3>
                <span className="text-xs bg-gray-700 px-2 py-1 rounded text-gray-300">{suspect.role}</span>
              </div>
              <p className="text-gray-400 text-sm">{suspect.desc}</p>
            </div>
          ))}
        </div>
        
        {/* 뒤로가기 버튼 */}
        <button onClick={handleGoLobby} className="w-full mt-8 py-3 bg-gray-700 hover:bg-gray-600 rounded text-gray-300">
          다른 시나리오 고르기
        </button>
      </div>
    );
  }

  // --------------------------------------------------------
  // 화면 3: 진범 공개 (엔딩 화면)
  // --------------------------------------------------------
  if (showResult) {
    return (
      <div className="min-h-screen p-6 flex flex-col items-center justify-center bg-black text-white text-center animate-fade-in overflow-y-auto">
        <h2 className="text-xl text-gray-400 tracking-widest mb-2">사건의 전말</h2>
        <h1 className="text-4xl font-black text-white mb-8">
          진범은 바로 <br/>
          <span className="text-red-600 text-6xl block mt-4 drop-shadow-[0_0_20px_rgba(220,38,38,0.8)]">
            {killer.name}
          </span>
        </h1>

        <div className="bg-gray-900 border border-red-900 p-6 rounded-xl w-full max-w-sm mb-10 shadow-2xl">
          <h3 className="text-yellow-500 font-bold mb-4 text-lg">살해 동기 및 수법</h3>
          <p className="text-gray-300 text-sm leading-loose text-left whitespace-pre-line">
            {killer.secretBackground}
          </p>
        </div>

        <button
          onClick={handleGoLobby}
          className="w-full max-w-sm py-4 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-lg border border-gray-600 transition-colors"
        >
          다른 사건 플레이하기 (로비로)
        </button>
      </div>
    );
  }

  // --------------------------------------------------------
  // 화면 2: 역할을 고른 후 (게임 메인 대시보드)
  // --------------------------------------------------------
  return (
    <div className="min-h-screen p-6 pb-24 bg-gray-900 text-white relative">
      <header className="mb-6 pb-4 border-b border-gray-800">
        <h2 className="text-sm text-gray-400">당신의 역할</h2>
        <h1 className="text-4xl font-black text-red-600 mt-1">{myRole.name}</h1>
        <p className="text-gray-300 mt-2">{myRole.role}</p>
      </header>

      <div className="space-y-6">
        {/* 사건 브리핑 다시보기 */}
        <details className="bg-gray-800 rounded-xl border border-gray-700 [&_summary::-webkit-details-marker]:hidden">
          <summary className="p-4 cursor-pointer font-bold text-yellow-500 flex justify-between items-center focus:outline-none">
            <span className="flex items-center"><span className="mr-2">📜</span> 사건 브리핑 다시보기</span>
            <span className="text-gray-400 text-sm">▼</span>
          </summary>
          <div className="p-4 pt-0 text-sm text-gray-300 leading-relaxed whitespace-pre-line border-t border-gray-700 mt-2">
            {scenarioData.summary}
          </div>
        </details>

      {/* 💡 새로 추가된 대본 읽기 섹션 (가장 눈에 띄게!) */}
        {myRole.selfIntro && (
          <section className="bg-gray-900 p-5 rounded-xl border-2 border-green-600 shadow-[0_0_15px_rgba(22,163,74,0.3)]">
            <h3 className="text-lg font-black mb-2 text-green-500 flex items-center">
              <span className="mr-2">🎙️</span> 게임 시작 시 공개 자기소개
            </h3>
            <p className="text-sm text-gray-300 mb-3">
              친구들이 다 모이면 아래 대본을 감정을 담아 소리 내어 읽어주세요!
            </p>
            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
              <p className="text-base text-white font-bold leading-relaxed whitespace-pre-line">
                {myRole.selfIntro}
              </p>
            </div>
          </section>
        )}
        {/* 💡 새로 추가된 프로필 & 관계도 섹션 */}
        <section className="bg-gray-800 p-5 rounded-xl border border-gray-700">
          <h3 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2 text-white">
            나의 상세 프로필 및 관계도
          </h3>
          <div className="space-y-4">
            <div className="bg-gray-900 p-3 rounded-lg border border-gray-700">
              <h4 className="text-xs text-gray-400 mb-1 font-bold">인적사항 및 배경</h4>
              <p className="text-sm text-gray-300 leading-relaxed">{myRole.personalDetail}</p>
            </div>
            <div className="bg-gray-900 p-3 rounded-lg border border-blue-900">
              <h4 className="text-xs text-blue-400 mb-1 font-bold">주요 인물 관계</h4>
              <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">{myRole.relation}</p>
            </div>
          </div>
        </section>

        {/* 💡 비밀 타임라인 & 진실 섹션 (본인만 확인) */}
        <section className="bg-gray-800 p-5 rounded-xl border border-red-900 shadow-lg relative">
          <h3 className="text-xl font-bold mb-4 border-b border-red-900 pb-2 text-white flex justify-between items-center">
            <span>비밀 타임라인 & 진실</span>
            <span className="text-[10px] text-red-500 font-normal animate-pulse">절대 남에게 보여주지 마세요</span>
          </h3>
          <div className="space-y-4">
            <div>
              <h4 className="text-xs text-red-400 mb-1 font-bold">나의 실제 타임라인</h4>
              <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">{myRole.timeline}</p>
            </div>
            <div className="bg-black/40 p-3 rounded-lg border border-gray-700">
              <h4 className="text-xs text-red-500 mb-1 font-bold">사건의 진실 (숨겨진 배경)</h4>
              <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">
                {myRole.secretBackground}
              </p>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-gray-900 rounded-lg border border-yellow-700">
            <h4 className="text-xs text-yellow-600 mb-1 font-bold">다른 사람에게 주장할 알리바이</h4>
            <p className="text-sm text-yellow-500 font-bold">"{myRole.alibi}"</p>
          </div>

          {/* 💡 새로 추가된 위기 탈출 방어 가이드 */}
          {myRole.defense && (
            <div className="mt-4 p-3 bg-blue-900/20 rounded-lg border border-blue-800/50">
              <h4 className="text-xs text-blue-400 mb-1 font-bold">🛡️ 단서 추궁 시 방어 가이드 (애드리브)</h4>
              <p className="text-sm text-blue-200 leading-relaxed whitespace-pre-line">
                {myRole.defense.replace('🛡️ [위기 탈출 방어 가이드]\n', '')}
              </p>
            </div>
          )}
        </section>

        {/* 사건 현장 탐색 */}
        <section>
          <h3 className="text-xl font-bold mb-3 px-1 text-white">사건 현장 탐색</h3>
          <div className="grid grid-cols-2 gap-3">
            {scenarioData.locations?.map((loc) => (
              <button 
                key={loc.id}
                onClick={() => setSelectedLocation(loc)}
                className="bg-gray-800 py-6 px-2 rounded-lg border border-gray-700 text-gray-300 hover:bg-gray-700 hover:border-red-500 hover:text-white transition-colors active:scale-95 text-center break-keep shadow-sm font-bold"
              >
                {loc.name}
              </button>
            ))}
          </div>
        </section>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gray-900 border-t border-gray-800 max-w-md mx-auto z-10">
        <button
          onClick={handleReveal}
          className="w-full py-4 bg-red-800 hover:bg-red-700 text-white font-black text-lg rounded-lg shadow-lg transition-all"
        >
          🚨 사건의 전말 확인 (투표 종료 후)
        </button>
      </div>

      {selectedLocation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-gray-800 w-full max-w-sm rounded-2xl p-6 border border-gray-600 shadow-2xl animate-fade-in-up">
            <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-3">
              <h2 className="text-2xl font-black text-red-500">{selectedLocation.name}</h2>
              <span className="text-xs text-gray-400">발견된 단서</span>
            </div>
            
            <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
              {selectedLocation.clues.map((clue, idx) => (
                <div key={idx} className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                  <h4 className="font-bold text-yellow-500 mb-1">🔍 {clue.name}</h4>
                  <p className="text-sm text-gray-300 leading-relaxed">{clue.desc}</p>
                </div>
              ))}
            </div>

            <button
              onClick={() => setSelectedLocation(null)}
              className="w-full mt-6 py-4 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-lg transition-colors"
            >
              탐색 종료 (닫기)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}