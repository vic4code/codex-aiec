const candidates = [
  {
    id: 'AIEC-2048',
    seat: '100231',
    name: '林采薇',
    aiScore: 'B (72)',
    manualScore: '—',
    status: 'pending',
    statusLabel: '待批改',
    teacher: '林老師',
    aiLevel: 'B',
    essay: `近年教育科技快速發展，人工智慧協助教學的案例逐漸增加。我認為老師在課堂上使用 AI，必須先釐清教學目標，再選擇適當的工具。若能與學生共同制定使用規範，讓 AI 成為提升學習的助力，而不是取代思考的捷徑，將會更符合教育的精神。`,
    aiAdvice: `AI 評分：72 分\n分析：文章結構完整，但缺少具體案例說明。建議補充實際教學場景，以提升說服力。`,
    rubric: `評分重點：\n1. 是否清楚說明 AI 在課堂中的角色與限制。\n2. 是否提出具體且可行的教學情境。\n3. 文字是否通順並具有邏輯。`,
    questions: [
      {
        no: 'Q1',
        ai: '12 / 15',
        manual: '—',
        note: '需檢視例子完整度',
        timeline: [
          {
            time: '2024/03/02 13:05',
            title: 'AI 初評完成',
            description: 'AI 評分為 12 分，疑似缺乏案例說明。',
          },
        ],
      },
      {
        no: 'Q2',
        ai: '24 / 30',
        manual: '—',
        note: 'AI 建議補強結論',
        timeline: [],
      },
      {
        no: 'Q3',
        ai: '36 / 45',
        manual: '—',
        note: '待老師審閱',
        timeline: [],
      },
    ],
  },
  {
    id: 'AIEC-2088',
    seat: '100298',
    name: '張家瑜',
    aiScore: 'A (89)',
    manualScore: 'A (92)',
    status: 'review',
    statusLabel: '複核中',
    teacher: '張老師',
    aiLevel: 'A',
    essay: `我在高中任教時，發現即使提供相同的教材，每位學生的學習方式依然不同。因此我在課程中導入 AI 學習助理，讓學生可以用語音或文字詢問概念，再回到班級討論。老師的角色從「講授者」轉為「學習設計師」，在課堂上更能聚焦於協助學生反思，這也是我支持 AI 教學的原因。`,
    aiAdvice: `AI 評分：89 分\n分析：論述完整並提供具體案例。建議補充學生回饋或學習成效數據，以說服評審。`,
    rubric: `評分重點：\n1. 教師角色轉換的觀察是否具體。\n2. 是否說明 AI 對學生學習的影響。\n3. 是否檢視導入後的成效與可能限制。`,
    questions: [
      {
        no: 'Q1',
        ai: '14 / 15',
        manual: '15 / 15',
        note: '補充學生回饋',
        timeline: [
          {
            time: '2024/03/01 10:22',
            title: 'AI 初評完成',
            description: 'AI 評分為 14 分，結構完整。',
          },
          {
            time: '2024/03/03 09:18',
            title: '老師批改',
            description: '調整部分分數並補充意見。',
          },
        ],
      },
      {
        no: 'Q2',
        ai: '30 / 30',
        manual: '29 / 30',
        note: '人工調整 1 分，因例證略為重複',
        timeline: [],
      },
      {
        no: 'Q3',
        ai: '45 / 45',
        manual: '48 / 50',
        note: '加註建議追蹤成效資料',
        timeline: [],
      },
    ],
  },
  {
    id: 'AIEC-2155',
    seat: '100315',
    name: '楊秉辰',
    aiScore: 'C (64)',
    manualScore: 'B (76)',
    status: 'complete',
    statusLabel: '已完成',
    teacher: '楊老師',
    aiLevel: 'C',
    essay: `針對 AI 協助教學，我的看法是應該謹慎使用。AI 可以提供多元的教材與練習題，但老師仍需檢視內容是否適合學生。透過課堂觀察與即時調整，才能讓科技真正貼近學生需求。`,
    aiAdvice: `AI 評分：64 分\n分析：文章觀點明確，但缺少資料佐證。建議補充教學實例或數據，說明 AI 工具帶來的效益。`,
    rubric: `評分重點：\n1. 是否說明教師把關的必要性。\n2. 是否提出實務操作的建議。\n3. 觀點是否具備深度與反思。`,
    questions: [
      {
        no: 'Q1',
        ai: '10 / 15',
        manual: '12 / 15',
        note: '補充案例後加分',
        timeline: [
          {
            time: '2024/02/29 15:02',
            title: 'AI 初評完成',
            description: '建議補充教學情境。',
          },
          {
            time: '2024/03/04 11:37',
            title: '老師批改完成',
            description: '確認補述資料後調整為 12 分。',
          },
        ],
      },
      {
        no: 'Q2',
        ai: '18 / 30',
        manual: '24 / 30',
        note: '補充課堂觀察',
        timeline: [],
      },
      {
        no: 'Q3',
        ai: '36 / 45',
        manual: '40 / 45',
        note: '加註提醒後提升分數',
        timeline: [],
      },
    ],
  },
];

const candidateTable = document.querySelector('#candidate-table tbody');
const candidateTemplate = document.querySelector('#candidate-row');
const questionTable = document.querySelector('#question-table tbody');
const questionTemplate = document.querySelector('#question-row');
const timelineList = document.querySelector('#timeline');
const timelineTemplate = document.querySelector('#timeline-item');
const candidateInfo = document.querySelector('#candidate-info');
const candidateName = document.querySelector('#candidate-name');
const essayView = document.querySelector('#essay-view');
const questionTitle = document.querySelector('#question-title');
const toggleButtons = document.querySelectorAll('.toggle');

let currentCandidate = null;
let currentQuestion = null;

function renderCandidates() {
  candidates.forEach((candidate, index) => {
    const row = candidateTemplate.content.cloneNode(true);
    const tr = row.querySelector('tr');
    tr.dataset.index = index;

    row.querySelector('.candidate__name').textContent = candidate.name;
    row.querySelector('.candidate__id').textContent = candidate.id;
    row.querySelector('.badge--ai').textContent = candidate.aiScore;
    row.querySelector('.badge--manual').textContent = candidate.manualScore;

    const status = row.querySelector('.status-pill');
    status.dataset.status = candidate.status;
    status.textContent = candidate.statusLabel;

    candidateTable.appendChild(row);
  });
}

function renderCandidateInfo(candidate) {
  const infoValues = [candidate.seat, candidate.id, candidate.teacher, candidate.aiLevel];
  candidateInfo.querySelectorAll('dd').forEach((dd, index) => {
    dd.textContent = infoValues[index];
  });
  candidateName.textContent = `${candidate.name} · ${candidate.id}`;
}

function renderQuestions(candidate) {
  questionTable.innerHTML = '';

  candidate.questions.forEach((question, index) => {
    const row = questionTemplate.content.cloneNode(true);
    const tr = row.querySelector('tr');
    tr.dataset.index = index;

    row.querySelector('th').textContent = question.no;
    const [aiScoreCell, manualScoreCell] = row.querySelectorAll('td');

    aiScoreCell.querySelector('.score').textContent = question.ai;
    manualScoreCell.querySelector('.score').textContent = question.manual;

    const aiTrend = aiScoreCell.querySelector('.score-trend');
    aiTrend.textContent = index === 0 ? 'AI 初評' : 'AI';
    const manualTrend = manualScoreCell.querySelector('.score-trend');
    manualTrend.textContent = question.manual === '—' ? '待批改' : '老師';

    row.querySelector('.note').textContent = question.note;

    questionTable.appendChild(row);
  });
}

function renderTimeline(question) {
  timelineList.innerHTML = '';
  if (!question.timeline.length) {
    const emptyItem = document.createElement('li');
    emptyItem.className = 'timeline__item timeline__item--empty';
    emptyItem.textContent = '目前沒有批改紀錄';
    timelineList.appendChild(emptyItem);
    return;
  }

  question.timeline.forEach((record) => {
    const node = timelineTemplate.content.cloneNode(true);
    node.querySelector('.timeline__time').textContent = record.time;
    node.querySelector('.timeline__title').textContent = record.title;
    node.querySelector('.timeline__description').textContent = record.description;
    timelineList.appendChild(node);
  });
}

function clearActiveRows(selector) {
  document.querySelectorAll(`${selector} tr`).forEach((row) =>
    row.classList.remove('is-active')
  );
}

function setEssayView(candidate, question, view = 'essay') {
  toggleButtons.forEach((button) => {
    const isActive = button.dataset.view === view;
    button.classList.toggle('is-active', isActive);
  });

  if (view === 'essay') {
    questionTitle.textContent = `${question.no} · 作答內容`;
    essayView.textContent = candidate.essay;
  } else if (view === 'ai') {
    questionTitle.textContent = `${question.no} · AI 建議`; 
    essayView.textContent = candidate.aiAdvice;
  } else {
    questionTitle.textContent = `${question.no} · 評分規準`;
    essayView.textContent = candidate.rubric;
  }
}

function handleCandidateClick(event) {
  const row = event.target.closest('tr');
  if (!row) return;

  const index = Number(row.dataset.index);
  currentCandidate = candidates[index];
  currentQuestion = currentCandidate.questions[0];

  clearActiveRows('#candidate-table tbody');
  row.classList.add('is-active');

  renderCandidateInfo(currentCandidate);
  renderQuestions(currentCandidate);
  renderTimeline(currentQuestion);
  setEssayView(currentCandidate, currentQuestion, 'essay');

  const firstQuestionRow = document.querySelector('#question-table tbody tr');
  if (firstQuestionRow) {
    firstQuestionRow.classList.add('is-active');
  }
}

function handleQuestionClick(event) {
  const row = event.target.closest('tr');
  if (!row || !currentCandidate) return;

  const index = Number(row.dataset.index);
  currentQuestion = currentCandidate.questions[index];

  clearActiveRows('#question-table tbody');
  row.classList.add('is-active');

  renderTimeline(currentQuestion);
  setEssayView(currentCandidate, currentQuestion);
}

function handleToggleClick(event) {
  const button = event.target.closest('.toggle');
  if (!button || !currentCandidate || !currentQuestion) return;
  const view = button.dataset.view;
  setEssayView(currentCandidate, currentQuestion, view);
}

renderCandidates();
candidateTable.addEventListener('click', handleCandidateClick);
questionTable.addEventListener('click', handleQuestionClick);
toggleButtons.forEach((button) => button.addEventListener('click', handleToggleClick));

// Select the first candidate by default when the page loads
if (candidates.length) {
  const firstRow = document.querySelector('#candidate-table tbody tr');
  if (firstRow) {
    firstRow.click();
  }
}
