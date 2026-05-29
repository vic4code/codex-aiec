const difficulties = [
  { key: 'hard', label: '難', ratio: 0.18 },
  { key: 'mediumHard', label: '中偏難', ratio: 0.27 },
  { key: 'mediumEasy', label: '中偏易', ratio: 0.35 },
  { key: 'easy', label: '易', ratio: 0.2 },
];

const dimensions = [
  {
    id: 'security',
    name: '資安',
    icon: 'S',
    accent: '#2563eb',
    accentSoft: '#dbeafe',
    description: '涵蓋威脅辨識、防護策略與事件應變題型，確保測驗能評估基本資安素養。',
    paperShare: 0.32,
    indicators: [
      { key: 'threat', name: '威脅辨識', color: '#1d4ed8' },
      { key: 'defense', name: '防護策略', color: '#38bdf8' },
      { key: 'response', name: '事件應變', color: '#0f766e' },
    ],
    counts: {
      hard: { threat: 14, defense: 12, response: 8 },
      mediumHard: { threat: 26, defense: 21, response: 15 },
      mediumEasy: { threat: 35, defense: 31, response: 20 },
      easy: { threat: 24, defense: 29, response: 18 },
    },
  },
  {
    id: 'fairness',
    name: '公平',
    icon: 'F',
    accent: '#7c3aed',
    accentSoft: '#ede9fe',
    description: '追蹤偏誤偵測、弱勢保障與公平決策題型，避免單一難度或子指標供題不足。',
    paperShare: 0.34,
    indicators: [
      { key: 'bias', name: '偏誤偵測', color: '#6d28d9' },
      { key: 'access', name: '弱勢保障', color: '#a78bfa' },
      { key: 'decision', name: '公平決策', color: '#db2777' },
    ],
    counts: {
      hard: { bias: 9, access: 7, decision: 6 },
      mediumHard: { bias: 18, access: 15, decision: 12 },
      mediumEasy: { bias: 30, access: 26, decision: 22 },
      easy: { bias: 20, access: 18, decision: 15 },
    },
  },
  {
    id: 'privacy',
    name: '隱私',
    icon: 'P',
    accent: '#059669',
    accentSoft: '#d1fae5',
    description: '監控資料最小化、同意管理與去識別化題型，支援隱私評估情境的穩定出題。',
    paperShare: 0.34,
    indicators: [
      { key: 'minimize', name: '資料最小化', color: '#047857' },
      { key: 'consent', name: '同意管理', color: '#34d399' },
      { key: 'deid', name: '去識別化', color: '#14b8a6' },
    ],
    counts: {
      hard: { minimize: 11, consent: 10, deid: 8 },
      mediumHard: { minimize: 20, consent: 19, deid: 17 },
      mediumEasy: { minimize: 28, consent: 24, deid: 22 },
      easy: { minimize: 19, consent: 17, deid: 13 },
    },
  },
];

const controls = {
  projectCount: document.querySelector('#project-count'),
  papersPerProject: document.querySelector('#papers-per-project'),
  questionsPerPaper: document.querySelector('#questions-per-paper'),
  reuseBuffer: document.querySelector('#reuse-buffer'),
};

const summaryGrid = document.querySelector('#summary-grid');
const dimensionPanels = document.querySelector('#dimension-panels');
const priorityList = document.querySelector('#priority-list');
const overallScore = document.querySelector('#overall-score');
const overallDescription = document.querySelector('#overall-description');
const resetButton = document.querySelector('#reset-button');
const summaryTemplate = document.querySelector('#summary-card-template');
const panelTemplate = document.querySelector('#dimension-panel-template');

function getControlValues() {
  return {
    projectCount: Number(controls.projectCount.value) || 1,
    papersPerProject: Number(controls.papersPerProject.value) || 1,
    questionsPerPaper: Number(controls.questionsPerPaper.value) || 1,
    reuseBuffer: Number(controls.reuseBuffer.value) || 1,
  };
}

function sumCounts(counts) {
  return Object.values(counts).reduce((total, value) => total + value, 0);
}

function calculateTargets(dimension, values, difficulty) {
  const questionsPerPaperForDimension = values.questionsPerPaper * dimension.paperShare;
  const paperLine = Math.ceil(questionsPerPaperForDimension * difficulty.ratio * values.reuseBuffer);
  const demandLine = Math.ceil(
    values.projectCount *
      values.papersPerProject *
      questionsPerPaperForDimension *
      difficulty.ratio *
      0.22
  );

  return { paperLine, demandLine };
}

function getState(ratio) {
  if (ratio >= 1) return { key: 'healthy', label: '健康' };
  if (ratio >= 0.75) return { key: 'warning', label: '注意' };
  return { key: 'danger', label: '缺題' };
}

function buildDimensionStats(dimension, values) {
  const difficultyStats = difficulties.map((difficulty) => {
    const counts = dimension.counts[difficulty.key];
    const total = sumCounts(counts);
    const targets = calculateTargets(dimension, values, difficulty);
    const required = Math.max(targets.paperLine, targets.demandLine);
    const ratio = required === 0 ? 1 : total / required;
    return { difficulty, counts, total, ...targets, required, ratio, shortfall: Math.max(0, required - total) };
  });

  const total = difficultyStats.reduce((sum, item) => sum + item.total, 0);
  const paperLine = difficultyStats.reduce((sum, item) => sum + item.paperLine, 0);
  const demandLine = difficultyStats.reduce((sum, item) => sum + item.demandLine, 0);
  const ratio = Math.min(...difficultyStats.map((item) => item.ratio));

  return { difficultyStats, total, paperLine, demandLine, ratio, state: getState(ratio) };
}

function renderSummary(dimension, stats) {
  const card = summaryTemplate.content.cloneNode(true);
  const article = card.querySelector('.summary-card');
  article.style.setProperty('--accent', dimension.accent);
  article.style.setProperty('--accent-soft', dimension.accentSoft);
  card.querySelector('.summary-card__icon').textContent = dimension.icon;
  const status = card.querySelector('.summary-card__status');
  status.dataset.state = stats.state.key;
  status.textContent = stats.state.label;
  card.querySelector('h3').textContent = `${dimension.name}評估面向`;
  card.querySelector('p').textContent = dimension.description;
  card.querySelector('[data-total]').textContent = stats.total;
  card.querySelector('[data-paper-line]').textContent = stats.paperLine;
  card.querySelector('[data-demand-line]').textContent = stats.demandLine;
  summaryGrid.appendChild(card);
}

function renderYAxis(maxValue) {
  const roundedMax = Math.ceil(maxValue / 20) * 20 || 20;
  return [roundedMax, Math.round(roundedMax * 0.66), Math.round(roundedMax * 0.33), 0]
    .map((value) => `<span>${value}</span>`)
    .join('');
}

function renderBar(dimension, stat, maxValue) {
  const barHeight = Math.max(8, (stat.total / maxValue) * 300);
  const paperBottom = Math.min(300, (stat.paperLine / maxValue) * 300);
  const demandBottom = Math.min(300, (stat.demandLine / maxValue) * 300);
  const segments = dimension.indicators
    .map((indicator) => {
      const count = stat.counts[indicator.key];
      const height = stat.total === 0 ? 0 : (count / stat.total) * 100;
      return `<div class="bar__segment" style="height:${height}%; background:${indicator.color}" title="${indicator.name}：${count} 題">${count}</div>`;
    })
    .join('');
  const shortfallText = stat.shortfall > 0 ? `<span class="shortfall">缺 ${stat.shortfall} 題</span>` : '<span>水位充足</span>';

  return `
    <div class="bar-group">
      <div class="bar-stage">
        <div class="waterline waterline--paper" style="bottom:${paperBottom}px"><span>考卷 ${stat.paperLine}</span></div>
        <div class="waterline waterline--demand" style="bottom:${demandBottom}px"><span>需求 ${stat.demandLine}</span></div>
        <div class="bar" style="height:${barHeight}px" aria-label="${stat.difficulty.label}目前 ${stat.total} 題">
          ${segments}
        </div>
      </div>
      <div class="bar-label">
        <strong>${stat.difficulty.label} · ${stat.total} 題</strong>
        ${shortfallText}
      </div>
    </div>
  `;
}

function renderDimensionPanel(dimension, stats) {
  const panel = panelTemplate.content.cloneNode(true);
  const article = panel.querySelector('.dimension-panel');
  article.style.setProperty('--accent', dimension.accent);
  article.style.setProperty('--accent-soft', dimension.accentSoft);
  panel.querySelector('.section-kicker').textContent = `${dimension.name} / Difficulty Coverage`;
  panel.querySelector('h2').textContent = `${dimension.name}題數健康水位`;
  const badge = panel.querySelector('.health-badge');
  badge.dataset.state = stats.state.key;
  badge.textContent = `${stats.state.label} · 最低覆蓋率 ${Math.round(stats.ratio * 100)}%`;

  const maxValue = Math.max(...stats.difficultyStats.flatMap((stat) => [stat.total, stat.paperLine, stat.demandLine])) * 1.18;
  panel.querySelector('.chart-y-axis').innerHTML = renderYAxis(maxValue);
  panel.querySelector('.bar-chart').innerHTML = stats.difficultyStats.map((stat) => renderBar(dimension, stat, maxValue)).join('');
  panel.querySelector('.legend-row').innerHTML = [
    ...dimension.indicators.map(
      (indicator) => `<span class="legend-item"><span class="legend-swatch" style="--swatch:${indicator.color}"></span>${indicator.name}</span>`
    ),
    '<span class="legend-item"><span class="legend-line" style="--swatch:#7c3aed"></span>單張考卷配比安全線</span>',
    '<span class="legend-item"><span class="legend-line" style="--swatch:#f97316"></span>下月專案需求安全線</span>',
  ].join('');
  dimensionPanels.appendChild(panel);
}

function renderPriorities(allStats) {
  const priorities = allStats
    .flatMap(({ dimension, stats }) => stats.difficultyStats.map((stat) => ({ dimension, stat })))
    .filter(({ stat }) => stat.shortfall > 0)
    .sort((a, b) => b.stat.shortfall - a.stat.shortfall)
    .slice(0, 5);

  priorityList.innerHTML = priorities.length
    ? priorities
        .map(
          ({ dimension, stat }) =>
            `<li><strong>${dimension.name}／${stat.difficulty.label}</strong> 目前 ${stat.total} 題，需達 ${stat.required} 題，建議優先補 ${stat.shortfall} 題並平均分配到子指標。</li>`
        )
        .join('')
    : '<li><strong>目前全部達標。</strong> 三個評估面向在四個難易度皆高於兩條安全水位線。</li>';
}

function renderDashboard() {
  const values = getControlValues();
  summaryGrid.innerHTML = '';
  dimensionPanels.innerHTML = '';

  const allStats = dimensions.map((dimension) => ({
    dimension,
    stats: buildDimensionStats(dimension, values),
  }));

  allStats.forEach(({ dimension, stats }) => {
    renderSummary(dimension, stats);
    renderDimensionPanel(dimension, stats);
  });

  renderPriorities(allStats);
  const score = Math.round(
    (allStats.reduce((sum, item) => sum + Math.min(item.stats.ratio, 1), 0) / allStats.length) * 100
  );
  overallScore.textContent = score;
  overallDescription.textContent = score >= 90 ? '題庫整體供給穩定' : score >= 75 ? '部分難易度需補題' : '即將到來需求有缺口風險';
}

Object.values(controls).forEach((control) => control.addEventListener('input', renderDashboard));
resetButton.addEventListener('click', () => {
  controls.projectCount.value = 12;
  controls.papersPerProject.value = 8;
  controls.questionsPerPaper.value = 20;
  controls.reuseBuffer.value = 3;
  renderDashboard();
});

renderDashboard();
