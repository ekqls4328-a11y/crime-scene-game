import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import scenario0Data from '../data/scenario0.json';
import scenario1Data from '../data/scenario1.json';
import scenario2Data from '../data/scenario2.json';
import scenario3Data from '../data/scenario3.json';

const SCENARIO_DB = {
  scenario0: scenario0Data,
  scenario1: scenario1Data,
  scenario2: scenario2Data,
  scenario3: scenario3Data
};

// 💡 상단에 노출될 탭 목록 정의
const TABS = [
  { id: 'briefing', label: '브리핑', icon: '📜' },
  { id: 'intro', label: '자기소개', icon: '🎙️' },
  { id: 'profile', label: '프로필', icon: '👤' },
  { id: 'timeline', label: '타임라인', icon: '🔒', isSecret: true },
  { id: 'investigation', label: '현장탐색', icon: '🔍' }
];

export default function Game() {
  const [myRole, setMyRole] = useState(null);
  const [scenarioId, setScenarioId] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const [isRevealed, setIsRevealed] = useState(false);
  const [zoomedImage, setZoomedImage] = useState(null);
  
  // 💡 활성화된 탭 상태 관리 (기본값: 브리핑)
  const [activeTab, setActiveTab] = useState('briefing');
  
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

  if (!scenarioData) return <div className="p-10 text-white text-center">시나리오를 불러오는 중입니다...</div>;

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
        
        <div 
          onClick={() => setIsRevealed(true)}
          className="relative w-full max-w-sm flex flex-col items-center cursor-pointer mb-10"
        >
          {!isRevealed && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 rounded-xl">
              <span className="text-white font-bold bg-red-600 px-5 py-3 rounded-full animate-bounce shadow-[0_0_15px_rgba(220,38,38,0.8)]">
                👆 터치하여 진범 확인
              </span>
            </div>
          )}

          <div className={`transition-all duration-1000 w-full ${!isRevealed ? 'blur-xl select-none' : 'blur-0'}`}>
            <h1 className="text-4xl font-black text-white mb-8">
              진범은 바로 <br/>
              <span className="text-red-600 text-6xl block mt-4 drop-shadow-[0_0_20px_rgba(220,38,38,0.8)]">
                {killer.name}
              </span>
            </h1>

            <div className="bg-gray-900 border border-red-900 p-6 rounded-xl w-full shadow-2xl">
              <h3 className="text-yellow-500 font-bold mb-4 text-lg">살해 동기 및 수법</h3>
              <p className="text-gray-300 text-sm leading-loose text-left whitespace-pre-line">
                {killer.secretBackground}
              </p>
            </div>
          </div>
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
  // 화면 2: 역할을 고른 후 (게임 메인 대시보드 - 💡 탭 UI 적용)
  // --------------------------------------------------------
  return (
    <div className="min-h-screen pb-24 bg-gray-900 text-white relative flex flex-col">
      {/* 고정 헤더 */}
      <header className="p-6 pb-4 bg-gray-900 border-b border-gray-800 shrink-0 sticky top-0 z-20">
        <h2 className="text-sm text-gray-400">당신의 역할</h2>
        <h1 className="text-3xl font-black text-red-600 mt-1">{myRole.name}</h1>
        <p className="text-gray-300 mt-1 text-sm">{myRole.role}</p>
        
        {/* 💡 탭 네비게이션 메뉴 */}
        <div className="flex space-x-2 mt-4 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-4 py-2 rounded-full whitespace-nowrap text-sm font-bold transition-all ${
                activeTab === tab.id
                  ? tab.isSecret 
                    ? 'bg-red-800 text-white shadow-md border border-red-500' // 활성 상태 (비밀 탭)
                    : 'bg-white text-black shadow-md' // 활성 상태 (일반 탭)
                  : tab.isSecret
                    ? 'bg-red-950/30 text-red-400 border border-red-900/50 hover:bg-red-900/50' // 비활성 상태 (비밀 탭)
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700' // 비활성 상태 (일반 탭)
              }`}
            >
              <span className="mr-1">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      {/* 💡 탭 콘텐츠 영역 */}
      <div className="p-6 flex-1 animate-fadeIn">
        
        {/* 1. 브리핑 탭 */}
        {activeTab === 'briefing' && (
          <section className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
            <h3 className="bg-gray-700 p-4 font-bold text-yellow-500 flex items-center">
              <span className="mr-2">📜</span> 사건 브리핑
            </h3>
            <div className="p-5 text-sm text-gray-300 leading-relaxed whitespace-pre-line">
              {scenarioData.summary}
              {scenarioData.briefingImageUrl && (
                <div className="pt-4 border-t border-gray-700 mt-4">
                  <button
                    onClick={() => setZoomedImage(scenarioData.briefingImageUrl)}
                    className="w-full flex items-center justify-center space-x-2 py-3 bg-red-950/40 hover:bg-red-950/70 border border-red-900 text-red-300 rounded-lg transition-colors font-bold text-xs"
                  >
                    <span className="text-base">💀</span> 
                    <span>사건 현장(피해자 상태) 사진 확인</span>
                    <span className="text-red-500 text-[10px] font-normal">(약혐주의)</span>
                  </button>
                </div>
              )}
            </div>
          </section>
        )}

        {/* 2. 자기소개 탭 */}
        {activeTab === 'intro' && (
          <section className="bg-gray-900 p-5 rounded-xl border-2 border-green-600 shadow-[0_0_15px_rgba(22,163,74,0.3)]">
            <h3 className="text-lg font-black mb-2 text-green-500 flex items-center">
              <span className="mr-2">🎙️</span> 공개 자기소개 대본
            </h3>
            <p className="text-sm text-gray-300 mb-4 bg-gray-800 p-2 rounded">
              친구들이 다 모이면 아래 대본을 감정을 담아 소리 내어 읽어주세요!
            </p>
            {myRole.selfIntro ? (
              <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                <p className="text-base text-white font-bold leading-relaxed whitespace-pre-line">
                  {myRole.selfIntro}
                </p>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">등록된 자기소개 대본이 없습니다.</p>
            )}
          </section>
        )}

        {/* 3. 프로필 탭 */}
        {activeTab === 'profile' && (
          <section className="bg-gray-800 p-5 rounded-xl border border-gray-700">
            <h3 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2 text-white">
              나의 상세 프로필 및 관계도
            </h3>
            <div className="space-y-4">
              <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                <h4 className="text-xs text-gray-400 mb-2 font-bold flex items-center">
                  <span className="mr-1">📋</span> 인적사항 및 배경
                </h4>
                <p className="text-sm text-gray-300 leading-relaxed">{myRole.personalDetail}</p>
              </div>
              <div className="bg-gray-900 p-4 rounded-lg border border-blue-900">
                <h4 className="text-xs text-blue-400 mb-2 font-bold flex items-center">
                  <span className="mr-1">🔗</span> 주요 인물 관계
                </h4>
                <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">{myRole.relation}</p>
              </div>
            </div>
          </section>
        )}

        {/* 4. 비밀 타임라인 탭 */}
        {activeTab === 'timeline' && (
          <section className="bg-gray-800 p-5 rounded-xl border-2 border-red-900 shadow-lg relative animate-fadeIn">
            <h3 className="text-xl font-bold mb-4 border-b border-red-900 pb-2 text-white flex justify-between items-center">
              <span>비밀 타임라인 & 진실</span>
              <span className="text-[10px] bg-red-600 text-white px-2 py-1 rounded font-bold animate-pulse">절대 보안</span>
            </h3>
            <div className="space-y-4">
              <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                <h4 className="text-xs text-red-400 mb-2 font-bold">나의 실제 타임라인</h4>
                <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">{myRole.timeline}</p>
              </div>
              <div className="bg-black/60 p-4 rounded-lg border border-red-900/50">
                <h4 className="text-xs text-red-500 mb-2 font-bold">사건의 진실 (숨겨진 배경)</h4>
                <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">
                  {myRole.secretBackground}
                </p>
              </div>
            </div>
            
            <div className="mt-5 p-4 bg-gray-900 rounded-lg border border-yellow-700">
              <h4 className="text-xs text-yellow-600 mb-2 font-bold">다른 사람에게 주장할 알리바이</h4>
              <p className="text-sm text-yellow-500 font-bold">"{myRole.alibi}"</p>
            </div>
          </section>
        )}

        {/* 5. 현장 탐색 탭 */}
        {activeTab === 'investigation' && (
          <section className="animate-fadeIn flex flex-col space-y-6">
            
            {/* 상단: 단서 탐색 버튼 영역 */}
            <div>
              <h3 className="text-xl font-bold mb-4 px-1 text-white flex items-center">
                <span className="mr-2">🔦</span> 사건 현장 탐색
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {scenarioData.locations?.map((loc) => (
                  <button 
                    key={loc.id}
                    onClick={() => setSelectedLocation(loc)}
                    className="bg-gray-800 py-8 px-2 rounded-xl border border-gray-700 text-gray-300 hover:bg-gray-700 hover:border-red-500 hover:text-white transition-colors active:scale-95 text-center break-keep shadow-sm font-bold text-lg"
                  >
                    {loc.name}
                  </button>
                ))}
              </div>
            </div>

            {/* 💡 하단: 방어 가이드 (아코디언 방식으로 숨김 처리) */}
            {myRole.defense && (
              <details className="mt-4 bg-blue-900/20 rounded-xl border border-blue-800/50 [&_summary::-webkit-details-marker]:hidden transition-all">
                <summary className="p-4 cursor-pointer font-bold text-blue-400 flex justify-between items-center focus:outline-none">
                  <span className="flex items-center">
                    <span className="mr-2">🛡️</span> 누군가 내 단서를 추궁할 때 (방어 가이드)
                  </span>
                  <span className="text-blue-500 text-sm">▼</span>
                </summary>
                <div className="p-4 pt-0 border-t border-blue-800/50 mt-2">
                  <p className="text-sm text-blue-200 leading-relaxed whitespace-pre-line bg-blue-950/50 p-3 rounded-lg">
                    {myRole.defense.replace('🛡️ [위기 탈출 방어 가이드]\n', '')}
                  </p>
                </div>
              </details>
            )}

          </section>
        )}

      </div> {/* 탭 콘텐츠 영역 끝 */}

      {/* 하단 투표 종료 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gray-900 border-t border-gray-800 max-w-md mx-auto z-10">
        <button
          onClick={handleReveal}
          className="w-full py-4 bg-red-800 hover:bg-red-700 text-white font-black text-lg rounded-lg shadow-lg transition-all"
        >
          🚨 사건의 전말 확인 (투표 종료 후)
        </button>
      </div>

      {/* 단서 모달 */}
      {selectedLocation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-gray-800 w-full max-w-md max-h-[90vh] flex flex-col rounded-2xl p-6 border border-gray-600 shadow-2xl animate-fade-in-up">
            <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-3 shrink-0">
              <h2 className="text-2xl font-black text-red-500">{selectedLocation.name}</h2>
              <span className="text-xs text-gray-400">발견된 단서</span>
            </div>
            
            <div className="space-y-4 pr-2 overflow-y-auto flex-1 [&::-webkit-scrollbar]:hidden">
              {selectedLocation.clues.map((clue, idx) => (
                <div key={idx} className="bg-gray-900 p-4 rounded-lg border border-gray-700 flex flex-col space-y-3">
                  <h4 className="font-bold text-yellow-500">🔍 {clue.name}</h4>
                  
                  {clue.imageUrl ? (
                    <div className="w-full rounded-lg overflow-hidden border border-gray-700 shadow-inner">
                      <img 
                        src={clue.imageUrl} 
                        alt={clue.name} 
                        onClick={() => setZoomedImage(clue.imageUrl)} 
                        className="w-full h-auto object-cover cursor-zoom-in active:opacity-70 transition-opacity"
                        loading="lazy"
                      />
                    </div>
                  ) : (
                    <p className="text-sm text-gray-300 leading-relaxed">{clue.desc}</p>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={() => setSelectedLocation(null)}
              className="w-full mt-6 py-4 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-lg transition-colors shrink-0"
            >
              탐색 종료 (닫기)
            </button>
          </div>
        </div>
      )}

      {/* 이미지 줌 라이트박스 */}
      {zoomedImage && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm p-2 animate-fadeIn"
          onClick={() => setZoomedImage(null)}
        >
          <div className="relative w-full h-full flex items-center justify-center">
            <span className="absolute top-4 right-4 text-white text-xl font-bold bg-gray-800 border border-gray-600 w-10 h-10 rounded-full flex items-center justify-center cursor-pointer shadow-lg z-[101]">
              ✕
            </span>
            <img 
              src={zoomedImage} 
              alt="확대된 단서" 
              className="max-w-full max-h-full object-contain select-none"
            />
          </div>
        </div>
      )}
    </div>
  );
}