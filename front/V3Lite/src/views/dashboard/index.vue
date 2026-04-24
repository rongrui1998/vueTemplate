<script setup lang="ts">
const statCards = [
  { label: '用户量', total: '120,000', value: '2,000' },
  { label: '访问量', total: '320,000', value: '20,000' },
  { label: '下载量', total: '120,000', value: '8,000' },
  { label: '使用量', total: '50,000', value: '5,000' },
]

const traffic = [2, 8, 18, 35, 58, 66, 24, 20, 38, 72, 44, 24, 14, 9, 4, 2]
const sourceCards = [
  { title: '访问数量', value: '8,846', trend: '+18.4%' },
  { title: '访问来源', value: '技术社区', trend: '+9.2%' },
  { title: '转化效率', value: '42.8%', trend: '+3.6%' },
]
</script>

<template>
  <section class="dashboard-page">
    <div class="hero-banner">
      <div>
        <p class="hero-banner__eyebrow">Analytics Overview</p>
        <h1>接近 vben 风格的暗色后台首页骨架已经接上。</h1>
        <p class="hero-banner__desc">
          当前版本先用静态数据把布局、统计卡片和趋势区做起来，后面我们再逐步接表格示例、按钮权限和真实接口联动。
        </p>
      </div>

      <div class="hero-banner__meta">
        <span>Active Workspace</span>
        <strong>V3 Lite / Analysis Page</strong>
      </div>
    </div>

    <div class="stats-grid">
      <article v-for="card in statCards" :key="card.label" class="stat-card">
        <div class="stat-card__head">
          <span>{{ card.label }}</span>
          <div class="stat-card__badge" />
        </div>
        <strong>{{ card.value }}</strong>
        <p>
          总{{ card.label }}
          <span>{{ card.total }}</span>
        </p>
      </article>
    </div>

    <div class="trend-panel">
      <div class="trend-panel__header">
        <div>
          <span class="trend-chip trend-chip--active">流量趋势</span>
          <span class="trend-chip">月访问量</span>
        </div>
        <p>最近 16 个时段访问变化</p>
      </div>

      <div class="chart-box">
        <div
          v-for="(item, index) in traffic"
          :key="index"
          class="chart-box__bar"
          :style="{ height: `${item}%` }"
        >
          <span />
        </div>
      </div>
    </div>

    <div class="source-grid">
      <article v-for="card in sourceCards" :key="card.title" class="source-card">
        <p>{{ card.title }}</p>
        <strong>{{ card.value }}</strong>
        <span>{{ card.trend }}</span>
      </article>
    </div>
  </section>
</template>

<style scoped lang="scss">
.dashboard-page {
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 18px;
}

.hero-banner {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  padding: 20px;
  border: 1px solid rgb(255 255 255 / 6%);
  border-radius: 18px;
  background:
    radial-gradient(circle at top right, rgb(59 130 246 / 22%), transparent 26%),
    linear-gradient(180deg, rgb(17 24 39) 0%, rgb(12 18 30) 100%);
}

.hero-banner__eyebrow {
  margin: 0;
  color: #60a5fa;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.hero-banner h1 {
  margin: 10px 0 0;
  max-width: 780px;
  color: #f8fafc;
  font-size: 28px;
  line-height: 1.25;
}

.hero-banner__desc {
  max-width: 760px;
  margin: 12px 0 0;
  color: #94a3b8;
  line-height: 1.8;
}

.hero-banner__meta {
  display: flex;
  min-width: 200px;
  flex-direction: column;
  gap: 8px;
  padding: 18px;
  border: 1px solid rgb(255 255 255 / 7%);
  border-radius: 18px;
  background: rgb(15 23 42 / 78%);

  span {
    color: #64748b;
    font-size: 12px;
    text-transform: uppercase;
  }

  strong {
    color: #f8fafc;
    font-size: 15px;
  }
}

.stats-grid,
.source-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
}

.stat-card,
.source-card,
.trend-panel {
  border: 1px solid rgb(255 255 255 / 6%);
  border-radius: 18px;
  background: rgb(12 18 30 / 92%);
}

.stat-card {
  padding: 18px;

  strong {
    display: inline-block;
    margin-top: 18px;
    color: #f8fafc;
    font-size: 34px;
    line-height: 1;
  }

  p {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 18px 0 0;
    color: #94a3b8;
  }

  span {
    color: #e2e8f0;
    font-weight: 600;
  }
}

.stat-card__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #e2e8f0;
  font-size: 16px;
  font-weight: 600;
}

.stat-card__badge {
  width: 12px;
  height: 12px;
  border-radius: 999px;
  background: linear-gradient(135deg, #60a5fa 0%, #22d3ee 100%);
  box-shadow: 0 0 16px rgb(96 165 250 / 80%);
}

.trend-panel {
  padding: 18px;
}

.trend-panel__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  margin-bottom: 22px;

  p {
    margin: 0;
    color: #64748b;
    font-size: 13px;
  }
}

.trend-chip {
  display: inline-flex;
  margin-right: 10px;
  padding: 8px 12px;
  border-radius: 12px;
  background: rgb(15 23 42 / 80%);
  color: #94a3b8;
}

.trend-chip--active {
  color: #f8fafc;
  background: rgb(30 41 59 / 92%);
}

.chart-box {
  display: grid;
  align-items: end;
  grid-template-columns: repeat(16, minmax(0, 1fr));
  gap: 12px;
  min-height: 300px;
  padding: 16px 4px 4px;
  border-radius: 18px;
  background:
    linear-gradient(180deg, rgb(15 23 42 / 72%) 0%, rgb(10 15 26 / 20%) 100%),
    repeating-linear-gradient(
      to top,
      transparent 0,
      transparent 58px,
      rgb(148 163 184 / 8%) 58px,
      rgb(148 163 184 / 8%) 59px
    );
}

.chart-box__bar {
  position: relative;
  display: flex;
  align-items: flex-end;
  min-height: 12%;

  span {
    width: 100%;
    height: 100%;
    border-radius: 18px 18px 8px 8px;
    background: linear-gradient(180deg, rgb(96 165 250 / 92%) 0%, rgb(29 78 216 / 35%) 100%);
    box-shadow: 0 18px 30px rgb(37 99 235 / 18%);
  }
}

.source-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 18px;

  p {
    margin: 0;
    color: #94a3b8;
  }

  strong {
    color: #f8fafc;
    font-size: 30px;
    line-height: 1.1;
  }

  span {
    color: #34d399;
    font-weight: 600;
  }
}

@media (width <= 1280px) {
  .stats-grid,
  .source-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .hero-banner {
    flex-direction: column;
  }
}

@media (width <= 768px) {
  .dashboard-page {
    padding: 16px;
  }

  .stats-grid,
  .source-grid {
    grid-template-columns: 1fr;
  }
}
</style>
