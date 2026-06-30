<script setup>
import { ref, computed, watch } from 'vue'

const step = ref(1)
const totalSteps = 9
const showCopy = ref(false)

const network = ref('host')
const dbType = ref('sqlite')
const pgsql = ref({ container: 'go-harvest-postgres', port: '5432', db: 'harvest', user: 'harvest', pass: '' })
const email = ref('')
const token = ref('')
const autoUpdate = ref('true')
const crontabDelay = ref('30m')
const logRetention = ref('15')
const scheduleReload = ref('2m')
const useCustomHosts = ref(false)
const speedtest = ref(false)
const redis = ref({ enabled: false, host: 'go-harvest-redis', port: '6379' })
const volume = ref({ path: '/docker/harvest' })
const imageTag = ref('latest')
const downloader = ref({ id: '', name: '', host: '', port: '', user: '', pass: '', ssl: false })
const webdav = ref({ enabled: false, url: '', user: '', pass: '' })

function goStep(n) {
  if (n < 1 || n > totalSteps.value) return
  step.value = n
}
function prev() { if (step.value > 1) step.value-- }
function next() { if (step.value < totalSteps.value) step.value++ }

const compose = computed(() => {
  const envs = [
    `HARVEST_CRON_RANDOM_DELAY_MAX=${crontabDelay.value}`,
    `HARVEST_DB_LOG_RETENTION_DAYS=${logRetention.value}`,
    `HARVEST_SCHEDULE_RELOAD_INTERVAL=${scheduleReload.value}`,
  ]
  if (useCustomHosts.value) envs.push('USE_CUSTOM_HOSTS=true')
  if (speedtest.value) envs.push('AUTO_SPEEDTEST=true')
  if (email.value) envs.push(`HARVEST_ADMIN_EMAIL=${email.value}`)
  if (token.value) envs.push(`HARVEST_AUTH_TOKEN=${token.value}`)
  if (autoUpdate.value === 'false') envs.push('AUTO_UPDATE=false')
  if (autoUpdate.value === 'true') envs.push('AUTO_UPDATE=true')
  if (autoUpdate.value === 'tag') envs.push('AUTO_UPDATE_TAG=true')

  const isBridge = network.value === 'bridge'
  const lines = ['services:']

  if (dbType.value === 'pgsql') {
    lines.push('  go-harvest-postgres:')
    lines.push('    image: postgres:17-alpine')
    lines.push('    container_name: go-harvest-postgres')
    lines.push('    restart: unless-stopped')
    lines.push('    environment:')
    lines.push(`      - POSTGRES_DB=${pgsql.db}`)
    lines.push(`      - POSTGRES_USER=${pgsql.user}`)
    lines.push(`      - POSTGRES_PASSWORD=${pgsql.pass}`)
    lines.push('    volumes:')
    lines.push(`      - ${volume.path}/pgdata:/var/lib/postgresql/data/pgdata`)
    lines.push('    healthcheck:')
    lines.push(`      test: ["CMD", "pg_isready", "-U", "${pgsql.user}"]`)
    lines.push('      interval: 2s')
    lines.push('      retries: 30')
  }

  lines.push('  go-harvest:')
  lines.push('    restart: unless-stopped')
  lines.push(`    image: newptools/go-harvest:${imageTag.value}`)
  lines.push('    container_name: go-harvest')

  if (isBridge) {
    lines.push('    ports:')
    lines.push('      - 5173:5173')
    lines.push('      - 8080:8080')
  }
  lines.push('    volumes:')
  lines.push(`      - ${volume.path}/data:/app/data`)
  if (useCustomHosts.value) lines.push('      - /etc/hosts:/etc/hosts:ro')
  lines.push('    environment:')
  envs.forEach((e) => lines.push(`      - ${e}`))

  if (dbType.value === 'pgsql') {
    lines.push('    depends_on:')
    lines.push('      go-harvest-postgres:')
    lines.push('        condition: service_healthy')
  }
  if (redis.value.enabled) {
    lines.push('')
    lines.push('  go-harvest-redis:')
    lines.push('    image: redis:7-alpine')
    lines.push('    container_name: go-harvest-redis')
    lines.push('    restart: unless-stopped')
    if (isBridge) lines.push('    ports:\n      - 6379:6379')
  }
  lines.push('')
  return lines.join('\n')
})

const copied = ref(false)
function copyCompose() {
  if (!showCopy.value) return
  const text = compose.value
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(text).then(() => { copied.value = true; setTimeout(() => copied.value = false, 2000) })
  } else {
    const el = document.createElement('textarea')
    el.value = text
    el.style.position = 'fixed'; el.style.opacity = '0'
    document.body.appendChild(el)
    el.select(); document.execCommand('copy'); document.body.removeChild(el)
    copied.value = true; setTimeout(() => copied.value = false, 2000)
  }
}
watch(step, () => { if (step.value >= 2) showCopy.value = true })
</script>

<template>
  <div class="compose-wizard">
    <div class="wizard-progress">
      <div class="progress-track"><div class="progress-fill" :style="{ width: ((step - 1) / (totalSteps - 1) * 100) + '%' }"></div></div>
      <div class="progress-steps">
        <div v-for="n in totalSteps" :key="n" class="progress-item" :class="{ done: n < step, active: n === step }" @click="goStep(n)">
          <div class="progress-dot">{{ n < step ? '✓' : n }}</div>
          <div class="progress-label">{{ ['网络', '数据库', '授权', '环境', '高级', '目录', '镜像', '下载', '下载器'][n - 1] }}</div>
        </div>
      </div>
    </div>

    <div v-show="step === 1" class="step-body">
      <h3>🌐 网络模式</h3>
      <p class="step-tip">选择容器网络模式。</p>
      <div class="option-grid">
        <div class="option-card" :class="{ selected: network === 'host' }" @click="network = 'host'">
          <div class="option-icon">🏠</div><div class="option-title">host 模式</div>
          <div class="option-desc">性能最好，无需端口映射。</div>
        </div>
        <div class="option-card" :class="{ selected: network === 'bridge' }" @click="network = 'bridge'">
          <div class="option-icon">🌉</div><div class="option-title">bridge 模式</div>
          <div class="option-desc">容器隔离网络，需手动映射端口。</div>
        </div>
      </div>
    </div>

    <div v-show="step === 2" class="step-body">
      <h3>🗄️ 数据库</h3>
      <p class="step-tip">SQLite 简单，PostgreSQL 生产环境。</p>
      <div class="option-grid">
        <div class="option-card" :class="{ selected: dbType === 'sqlite' }" @click="dbType = 'sqlite'">
          <div class="option-icon">📄</div><div class="option-title">SQLite</div>
        </div>
        <div class="option-card" :class="{ selected: dbType === 'pgsql' }" @click="dbType = 'pgsql'">
          <div class="option-icon">🐘</div><div class="option-title">PostgreSQL</div>
        </div>
      </div>
      <div v-if="dbType === 'pgsql'" class="form-card">
        <div class="section-title">PostgreSQL 配置</div>
        <div class="row"><span class="label">容器名</span><input v-model="pgsql.container" class="form-input" placeholder="go-harvest-postgres"></div>
        <div class="row"><span class="label">端口</span><input v-model="pgsql.port" class="form-input" placeholder="5432"></div>
        <div class="row"><span class="label">数据库</span><input v-model="pgsql.db" class="form-input" placeholder="harvest"></div>
        <div class="row"><span class="label">用户名</span><input v-model="pgsql.user" class="form-input" placeholder="harvest"></div>
        <div class="row"><span class="label">密码</span><input v-model="pgsql.pass" class="form-input" type="password" placeholder="******"></div>
      </div>
    </div>

    <div v-show="step === 3" class="step-body">
      <h3>🔑 管理员授权</h3>
      <div class="form-card">
        <div class="row"><span class="label">管理员邮箱</span><input v-model="email" class="form-input" placeholder="admin@example.com"></div>
        <div class="row"><span class="label">Token</span><input v-model="token" class="form-input" placeholder="Monkey.&amp;ze3pmoe"></div>
      </div>
    </div>

    <div v-show="step === 4" class="step-body">
      <h3>⚙️ 基础环境配置</h3>
      <div class="form-card">
        <div class="row">
          <span class="label">自动更新</span>
          <select v-model="autoUpdate" class="form-input">
            <option value="true">开启（默认）</option>
            <option value="false">关闭</option>
            <option value="tag">指定 Tag 更新</option>
          </select>
        </div>
        <div class="row"><span class="label">计划任务延时上限</span><input v-model="crontabDelay" class="form-input" placeholder="30m"></div>
        <div class="row"><span class="label">数据库日志保留天数</span><input v-model="logRetention" class="form-input" placeholder="15" type="number"></div>
        <div class="row"><span class="label">计划任务重载间隔</span><input v-model="scheduleReload" class="form-input" placeholder="2m"></div>
      </div>
    </div>

    <div v-show="step === 5" class="step-body">
      <h3>🚀 高级参数</h3>
      <div class="form-card">
        <div class="row">
          <span class="label">CloudFlare 测速</span>
          <select v-model="speedtest" class="form-input">
            <option :value="false">关闭</option>
            <option :value="true">开启</option>
          </select>
        </div>
      </div>
    </div>

    <div v-show="step === 6" class="step-body">
      <h3>📁 数据目录</h3>
      <div class="form-card">
        <div class="row"><span class="label">数据目录</span><input v-model="volume.path" class="form-input" placeholder="/docker/harvest"></div>
      </div>
    </div>

    <div v-show="step === 7" class="step-body">
      <h3>📦 镜像 Tag</h3>
      <div class="form-card">
        <div class="row"><span class="label">镜像 Tag</span><input v-model="imageTag" class="form-input" placeholder="latest"></div>
      </div>
    </div>

    <div v-show="step === 8" class="step-body">
      <h3>📥 WebDAV 下载</h3>
      <div class="form-card">
        <div class="row"><span class="label">启用</span><select v-model="webdav.enabled" class="form-input"><option :value="false">关闭</option><option :value="true">开启</option></select></div>
        <div v-if="webdav.enabled">
          <div class="row"><span class="label">WebDAV 地址</span><input v-model="webdav.url" class="form-input" placeholder="https://dav.example.com/harvest"></div>
          <div class="row"><span class="label">用户名</span><input v-model="webdav.user" class="form-input" placeholder="user"></div>
          <div class="row"><span class="label">密码</span><input v-model="webdav.pass" class="form-input" type="password" placeholder="******"></div>
        </div>
      </div>
    </div>

    <div v-show="step === 9" class="step-body">
      <h3>📡 下载器配置</h3>
      <div class="form-card">
        <div class="row"><span class="label">启用</span><select v-model="downloader.id" class="form-input"><option value="">不配置</option><option value="qb">qBittorrent</option><option value="tr">Transmission</option></select></div>
        <template v-if="downloader.id">
          <div class="row"><span class="label">名称</span><input v-model="downloader.name" class="form-input" placeholder="我的下载器"></div>
          <div class="row"><span class="label">主机</span><input v-model="downloader.host" class="form-input" placeholder="192.168.1.10"></div>
          <div class="row"><span class="label">端口</span><input v-model="downloader.port" class="form-input" placeholder="8080"></div>
          <div class="row"><span class="label">用户名</span><input v-model="downloader.user" class="form-input" placeholder="admin"></div>
          <div class="row"><span class="label">密码</span><input v-model="downloader.pass" class="form-input" type="password" placeholder="******"></div>
          <div class="row"><span class="label">SSL</span><select v-model="downloader.ssl" class="form-input"><option :value="false">关闭</option><option :value="true">开启</option></select></div>
        </template>
      </div>
    </div>

    <div class="nav-btns">
      <button v-if="step > 1" class="btn btn-prev" @click="prev">← 上一步</button>
      <button v-if="step < totalSteps" class="btn btn-next" @click="next">下一步 →</button>
      <button v-else class="btn btn-finish" @click="showCopy = true">完成</button>
    </div>

    <div class="preview-section">
      <div class="preview-header"><h3>📄 docker-compose.yml</h3><button v-if="showCopy" class="copy-btn" @click="copyCompose">{{ copied ? '✅ 已复制' : '📋 复制' }}</button></div>
      <div class="code-block"><pre><code>{{ compose }}</code></pre></div>
    </div>
  </div>
</template>

<style scoped>
.compose-wizard { max-width: 720px; margin: 0 auto; padding: 24px 16px; }
.wizard-progress { position: relative; margin-bottom: 40px; }
.progress-track { position: absolute; top: 15px; left: 36px; right: 36px; height: 2px; background: var(--c-border, #dcdfe6); z-index: 0; }
.progress-fill { height: 100%; background: var(--c-brand, #409eff); border-radius: 2px; transition: width 0.3s ease; }
.progress-steps { display: flex; justify-content: space-between; position: relative; z-index: 1; }
.progress-item { display: flex; flex-direction: column; align-items: center; cursor: pointer; z-index: 1; }
.progress-dot { width: 32px; height: 32px; border-radius: 50%; background: var(--c-bg, #fff); border: 2px solid var(--c-border, #dcdfe6); display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 600; color: var(--c-text-lightest, #909399); transition: all 0.3s; }
.progress-item.done .progress-dot { background: var(--c-brand, #409eff); border-color: var(--c-brand, #409eff); color: #fff; }
.progress-item.active .progress-dot { box-shadow: 0 0 0 4px rgba(64, 158, 255, 0.2); }
.progress-label { margin-top: 6px; font-size: 12px; color: var(--c-text-lightest, #909399); }
.progress-item.active .progress-label { color: var(--c-brand, #409eff); font-weight: 600; }
.step-body { animation: fadeIn 0.25s ease; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
.step-body h3 { margin: 0 0 12px; font-size: 18px; }
.step-tip { color: var(--c-text-light, #606266); font-size: 14px; margin: -4px 0 12px; }
.section-title { margin: 16px 0 8px; font-size: 15px; font-weight: 700; }
.option-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 12px; }
.option-card { border: 2px solid var(--c-border, #e4e7ed); border-radius: 12px; padding: 20px; text-align: center; cursor: pointer; background: var(--c-bg, #fff); }
.option-card.selected { border-color: var(--c-brand, #409eff); }
.option-icon { font-size: 32px; margin-bottom: 8px; }
.option-title { font-size: 16px; font-weight: 700; }
.option-desc { font-size: 13px; color: var(--c-text-light, #606266); }
.form-card { background: var(--c-bg-light, #f5f7fa); border: 1px solid var(--c-border, #e4e7ed); border-radius: 10px; padding: 16px 20px; }
.row { display: flex; align-items: center; margin: 10px 0; gap: 12px; }
.label { min-width: 130px; font-weight: 600; font-size: 14px; }
.form-input { flex: 1; max-width: 380px; padding: 12px 16px; border: 2px solid var(--c-border, #dcdfe6); border-radius: 10px; font-size: 15px; background: var(--c-bg, #fff); transition: all 0.3s; box-shadow: 0 2px 4px rgba(0,0,0,0.06); }
.form-input:focus { outline: none; border-color: var(--c-brand, #409eff); box-shadow: 0 0 0 4px rgba(64, 158, 255, 0.15); }
select.form-input { -webkit-appearance: none; cursor: pointer; }
.nav-btns { display: flex; justify-content: space-between; margin-top: 24px; }
.btn { padding: 10px 28px; border-radius: 8px; font-size: 15px; font-weight: 600; cursor: pointer; border: none; }
.btn-prev { background: var(--c-bg-light, #f0f2f5); }
.btn-next { background: var(--c-brand, #409eff); color: #fff; }
.btn-finish { background: #67c23a; color: #fff; }
.preview-section { max-width: 720px; margin: 32px auto 0; }
.preview-header { display: flex; align-items: center; justify-content: space-between; }
.copy-btn { padding: 6px 18px; border: 1.5px solid var(--c-brand, #409eff); border-radius: 8px; background: rgba(64, 158, 255, 0.06); color: var(--c-brand, #409eff); cursor: pointer; }
.code-block { background: #1e1e1e; border-radius: 10px; padding: 20px; overflow-x: auto; }
.code-block code { color: #d4d4d4; font-size: 13px; font-family: 'Fira Code', 'Consolas', monospace; }
@media (max-width: 768px) {
  .compose-wizard { padding: 16px 12px; }
  .form-input { max-width: 100%; font-size: 14px; }
  .row { flex-direction: column; }
  .label { min-width: auto; }
  .option-grid { grid-template-columns: 1fr; }
}
</style>