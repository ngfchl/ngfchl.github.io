---
title: 02. 安装教程
description:
published: true
date: 2025-12-01T04:41:00.192Z
tags: [ 安装, ]
editor: markdown
dateCreated: 2024-09-29T14:32:58.877Z
---

<script setup>
import { ref, computed } from 'vue'

const activeStep = ref(1)
const copied = ref(false)
const showAdvanced = ref(false)
const totalSteps = 7

// 镜像配置
const registry = ref('')
const imageTag = ref('latest')
const registries = [
  { label: 'Docker Hub 官方源', value: '' },
  { label: 'docker.xuanyuan.me', value: 'docker.xuanyuan.me' },
  { label: 'docker.1ms.run', value: 'docker.1ms.run' },
  { label: 'dockerhub.icu', value: 'dockerhub.icu' },
  { label: 'hub.rat.dev', value: 'hub.rat.dev' },
  { label: 'docker.wanpeng.top', value: 'docker.wanpeng.top' },
  { label: 'doublezonline.cloud', value: 'doublezonline.cloud' },
  { label: 'docker.mrxn.net', value: 'docker.mrxn.net' },
  { label: 'docker.anyhub.us.kg', value: 'docker.anyhub.us.kg' },
  { label: 'dislabaiot.xyz', value: 'dislabaiot.xyz' },
  { label: 'docker.fxxk.dedyn.io', value: 'docker.fxxk.dedyn.io' },
  { label: 'docker-mirror.aigc2d.com', value: 'docker-mirror.aigc2d.com' },
  { label: 'dockerproxy.net', value: 'dockerproxy.net' },
  { label: 'docker.kejilion.pro', value: 'docker.kejilion.pro' },
  { label: 'docker.1panel.live', value: 'docker.1panel.live' },
]

// 网络配置
const network = ref('host')
const port = ref('5173')

// 数据库
const dbType = ref('sqlite')
const pgsqlContainer = ref('go-harvest-postgres')
const pgsqlPort = ref('5432')
const pgsqlDb = ref('harvest')
const pgsqlUser = ref('harvest')
const pgsqlPass = ref('')
const dataPath = ref('.')

// 授权
const email = ref('')
const token = ref('')

// 运行参数
const logLevel = ref('info')
const autoUpdate = ref(true)
const autoSpeedtest = ref(false)
const gitProxy = ref('https://gh-proxy.org/')
const redisPort = ref('6379')
const redisConnection = ref('')
const crontabDelay = ref('30m')
const logRetention = ref('15')
const scheduleReload = ref('2m')

// 路径映射
const downloaders = ref([
  { src: '', dest: '/downloaders/1' },
  { src: '', dest: '/downloaders/2' },
  { src: '', dest: '/downloaders/3' },
])

function nextStep() { if (activeStep.value < totalSteps) activeStep.value++ }
function addDownloader() { downloaders.value.push({ src: '', dest: `/downloaders/${downloaders.value.length + 1}` }) }
function removeDownloader(i) { downloaders.value.splice(i, 1) }

const compose = computed(() => {
  const isBridge = network.value === 'bridge'
  const isPgsql = dbType.value === 'pgsql'
  const imgBase = registry.value ? `${registry.value}/newptools/go-harvest` : 'newptools/go-harvest'
  const lines = ['services:']

  if (isPgsql) {
    lines.push('  go-harvest-postgres:')
    lines.push('    image: postgres:17-alpine')
    lines.push(`    container_name: ${pgsqlContainer.value}`)
    lines.push('    restart: unless-stopped')
    lines.push('    environment:')
    lines.push(`      - POSTGRES_DB=${pgsqlDb.value}`)
    lines.push(`      - POSTGRES_USER=${pgsqlUser.value}`)
    lines.push(`      - POSTGRES_PASSWORD=${pgsqlPass.value}`)
    lines.push('    volumes:')
    lines.push(`      - ${dataPath.value}/db:/var/lib/postgresql/data/pgdata`)
    lines.push('    healthcheck:')
    lines.push(`      test: ["CMD", "pg_isready", "-U", "${pgsqlUser.value}"]`)
    lines.push('      interval: 2s')
    lines.push('      retries: 30')
  }

  lines.push('  go-harvest:')
  lines.push('    restart: unless-stopped')
  lines.push(`    image: ${imgBase}:${imageTag.value}`)
  lines.push('    container_name: go-harvest')
  if (isBridge) {
    lines.push('    ports:')
    lines.push(`      - ${port.value}:5173`)
  }
  lines.push('    volumes:')
  lines.push(`      - ${dataPath.value}/db:/app/db`)
  lines.push(`      - ${dataPath.value}/sites:/app/sites`)
  lines.push(`      - ${dataPath.value}/icons:/app/icons`)
  downloaders.value.forEach(d => {
    if (d.src.trim()) lines.push(`      - ${d.src.trim()}:${d.dest}`)
  })
  lines.push('    environment:')
  lines.push(`      - EMAIL=${email.value}`)
  lines.push(`      - TOKEN=${token.value}`)
  if (!isBridge) lines.push(`      - GO_WEB_PORT=${port.value}`)
  lines.push(`      - AUTO_UPDATE=${autoUpdate.value}`)
  if (autoSpeedtest.value) lines.push('      - AUTO_SPEEDTEST=true')
  if (gitProxy.value) lines.push(`      - GIT_PROXY=${gitProxy.value}`)
  if (logLevel.value !== 'info') lines.push(`      - LOGGER_LEVEL=${logLevel.value}`)
  lines.push(`      - HARVEST_CRON_RANDOM_DELAY_MAX=${crontabDelay.value}`)
  lines.push(`      - HARVEST_DB_LOG_RETENTION_DAYS=${logRetention.value}`)
  lines.push(`      - HARVEST_SCHEDULE_RELOAD_INTERVAL=${scheduleReload.value}`)
  lines.push(`      - REDIS_SERVER_PORT=${redisPort.value}`)
  if (redisConnection.value) lines.push(`      - CACHE_REDIS_CONNECTION=${redisConnection.value}`)
  if (isPgsql) {
    lines.push(`      - POSTGRES_HOST=${pgsqlContainer.value}`)
    lines.push(`      - POSTGRES_PORT=${pgsqlPort.value}`)
    lines.push(`      - POSTGRES_DB=${pgsqlDb.value}`)
    lines.push(`      - POSTGRES_USER=${pgsqlUser.value}`)
    lines.push(`      - POSTGRES_PASSWORD=${pgsqlPass.value}`)
    lines.push('    depends_on:')
    lines.push(`      ${pgsqlContainer.value}:`)
    lines.push('        condition: service_healthy')
  }
  lines.push('')
  return lines.join('\n')
})

function copyCompose() {
  navigator.clipboard.writeText(compose.value).then(() => {
    copied.value = true
    setTimeout(() => copied.value = false, 2000)
  })
}

const steps = [
  { title: '镜像配置', icon: '📦' },
  { title: '网络模式', icon: '🌐' },
  { title: '数据库', icon: '🗄️' },
  { title: '授权信息', icon: '🔑' },
  { title: '运行参数', icon: '⚙️' },
  { title: '数据目录', icon: '📁' },
  { title: '下载器路径映射', icon: '📡' },
]
</script>

<div class="compose-wizard">

<div v-for="(s, i) in steps" :key="i" class="accordion-item" :class="{ 'is-active': activeStep === i + 1, 'is-done': i + 1 < activeStep }">
<div class="accordion-header" :class="{ 'is-clickable': i + 1 < activeStep }" @click="i + 1 < activeStep && (activeStep = i + 1)">
<span class="accordion-icon">{{ i + 1 < activeStep ? '✓' : s.icon }}</span>
<span class="accordion-title">{{ s.title }}</span>
<span class="accordion-status" v-if="i + 1 < activeStep">已完成</span>
<span class="accordion-arrow" v-else></span>
</div>
<div class="accordion-body" v-show="activeStep === i + 1">

<!-- 1. 镜像配置 -->
<template v-if="i === 0">
<p class="step-tip">选择 Docker 镜像源和版本，国内用户建议选择加速源。</p>
<div class="el-card">
<div class="el-card__header">镜像源</div>
<div class="el-card__body">
<div class="el-form-item">
<label class="el-form-item__label">加速源</label>
<div class="el-form-item__content">
<select v-model="registry" class="el-input__inner"><option v-for="r in registries" :key="r.value" :value="r.value">{{ r.label }}</option></select>
<p class="field-tip">选择第三方加速源可提升拉取速度</p>
</div>
</div>
<div class="el-form-item">
<label class="el-form-item__label">镜像版本</label>
<div class="el-form-item__content">
<div class="el-radio-group">
<label class="el-radio-button" :class="{ 'is-active': imageTag === 'latest' }" @click="imageTag = 'latest'"><input type="radio" class="el-radio-button__original-radio" :checked="imageTag === 'latest'"><span class="el-radio-button__inner">稳定版</span></label>
<label class="el-radio-button" :class="{ 'is-active': imageTag === 'dev' }" @click="imageTag = 'dev'"><input type="radio" class="el-radio-button__original-radio" :checked="imageTag === 'dev'"><span class="el-radio-button__inner">开发版</span></label>
</div>
<p class="field-tip">latest 为稳定版，dev 为开发版</p>
</div>
</div>
</div>
</div>
</template>

<!-- 2. 网络模式 -->
<template v-if="i === 1">
<div class="el-card">
<div class="el-card__header">网络模式</div>
<div class="el-card__body">
<p class="field-desc">主机模式性能最佳，无需端口映射；桥接模式需手动映射端口。</p>
<div class="el-radio-group">
<label class="el-radio-button" :class="{ 'is-active': network === 'host' }" @click="network = 'host'">
<input type="radio" class="el-radio-button__original-radio" :checked="network === 'host'">
<span class="el-radio-button__inner">🏠 主机模式</span>
</label>
<label class="el-radio-button" :class="{ 'is-active': network === 'bridge' }" @click="network = 'bridge'">
<input type="radio" class="el-radio-button__original-radio" :checked="network === 'bridge'">
<span class="el-radio-button__inner">🌉 桥接模式</span>
</label>
</div>
<div class="el-form-item" style="margin-top:12px">
<label class="el-form-item__label">访问端口</label>
<div class="el-form-item__content">
<input v-model="port" class="el-input__inner" placeholder="5173">
<p class="field-tip">主机模式为 GO_WEB_PORT，桥接模式为宿主机映射端口</p>
</div>
</div>
</div>
</div>
</template>

<!-- 3. 数据库 -->
<template v-if="i === 2">
<div class="el-card">
<div class="el-card__header">数据库类型</div>
<div class="el-card__body">
<p class="field-desc">SQLite 简单轻量无需额外服务，PostgreSQL 适合多用户生产环境。</p>
<div class="el-radio-group">
<label class="el-radio-button" :class="{ 'is-active': dbType === 'sqlite' }" @click="dbType = 'sqlite'">
<input type="radio" class="el-radio-button__original-radio" :checked="dbType === 'sqlite'">
<span class="el-radio-button__inner">📄 SQLite</span>
</label>
<label class="el-radio-button" :class="{ 'is-active': dbType === 'pgsql' }" @click="dbType = 'pgsql'">
<input type="radio" class="el-radio-button__original-radio" :checked="dbType === 'pgsql'">
<span class="el-radio-button__inner">🐘 PostgreSQL</span>
</label>
</div>
<div v-if="dbType === 'pgsql'" style="margin-top:12px">
<div class="el-form-item"><label class="el-form-item__label">容器名</label><div class="el-form-item__content"><input v-model="pgsqlContainer" class="el-input__inner" placeholder="go-harvest-postgres"><p class="field-tip">Docker Compose 中的服务名，harvest 容器通过此名连接</p></div></div>
<div class="el-form-item"><label class="el-form-item__label">端口</label><div class="el-form-item__content"><input v-model="pgsqlPort" class="el-input__inner" placeholder="5432"><p class="field-tip">PostgreSQL 容器内监听端口</p></div></div>
<div class="el-form-item"><label class="el-form-item__label">数据库</label><div class="el-form-item__content"><input v-model="pgsqlDb" class="el-input__inner" placeholder="harvest"><p class="field-tip">自动创建的数据库名称</p></div></div>
<div class="el-form-item"><label class="el-form-item__label">用户名</label><div class="el-form-item__content"><input v-model="pgsqlUser" class="el-input__inner" placeholder="harvest"></div></div>
<div class="el-form-item"><label class="el-form-item__label">密码</label><div class="el-form-item__content"><input v-model="pgsqlPass" class="el-input__inner" type="password" placeholder="******"><p class="field-tip">请设置强密码</p></div></div>
</div>
</div>
</div>
</template>

<!-- 4. 授权信息 -->
<template v-if="i === 3">
<p class="step-tip">EMAIL 和 TOKEN 是启动授权必需变量，用于校验合法用户身份。</p>
<div class="el-card">
<div class="el-card__body">
<div class="el-form-item"><label class="el-form-item__label">EMAIL</label><div class="el-form-item__content"><input v-model="email" class="el-input__inner" placeholder="admin@example.com"><p class="field-tip">管理员邮箱，也兼容 DJANGO_SUPERUSER_EMAIL</p></div></div>
<div class="el-form-item"><label class="el-form-item__label">TOKEN</label><div class="el-form-item__content"><input v-model="token" class="el-input__inner" placeholder="eyJhbGciOiJIUzI1NiIs..."><p class="field-tip">启动时请求远端授权接口校验</p></div></div>
</div>
</div>
</template>

<!-- 5. 运行参数 -->
<template v-if="i === 4">
<div class="el-card">
<div class="el-card__header">基础</div>
<div class="el-card__body">
<div class="el-form-item"><label class="el-form-item__label">日志级别</label><div class="el-form-item__content"><div class="el-radio-group"><label class="el-radio-button" :class="{ 'is-active': logLevel === 'info' }" @click="logLevel = 'info'"><input type="radio" class="el-radio-button__original-radio" :checked="logLevel === 'info'"><span class="el-radio-button__inner">info</span></label><label class="el-radio-button" :class="{ 'is-active': logLevel === 'debug' }" @click="logLevel = 'debug'"><input type="radio" class="el-radio-button__original-radio" :checked="logLevel === 'debug'"><span class="el-radio-button__inner">debug</span></label></div><p class="field-tip">debug 输出更详细的调试信息</p></div></div>
<div class="el-form-item"><label class="el-form-item__label">启动时自动更新</label><div class="el-form-item__content"><div class="el-switch" :class="{ 'is-checked': autoUpdate }" @click="autoUpdate = !autoUpdate"><span class="el-switch__core"></span></div><p class="field-tip">容器启动时自动检查并执行更新</p></div></div>
<div class="el-form-item"><label class="el-form-item__label">自动测速</label><div class="el-form-item__content"><div class="el-switch" :class="{ 'is-checked': autoSpeedtest }" @click="autoSpeedtest = !autoSpeedtest"><span class="el-switch__core"></span></div><p class="field-tip">启动时自动执行 CloudFlare 测速并应用</p></div></div>
<div class="el-form-item"><label class="el-form-item__label">Git 代理</label><div class="el-form-item__content"><input v-model="gitProxy" class="el-input__inner" placeholder="https://gh-proxy.org/"><p class="field-tip">用于站点配置、WebUI、Release 等 GitHub 资源访问代理</p></div></div>
</div>
</div>
<div class="el-card" style="margin-top:12px">
<div class="el-card__header">Redis</div>
<div class="el-card__body">
<p class="field-desc">留空使用容器内置 Redis，配置连接地址则使用外置 Redis。</p>
<div class="el-radio-group" style="margin-bottom:16px">
<label class="el-radio-button" :class="{ 'is-active': !redisConnection }" @click="redisConnection = ''">
<input type="radio" class="el-radio-button__original-radio" :checked="!redisConnection">
<span class="el-radio-button__inner">容器内置</span>
</label>
<label class="el-radio-button" :class="{ 'is-active': !!redisConnection }" @click="redisConnection = redisConnection || 'redis://'">
<input type="radio" class="el-radio-button__original-radio" :checked="!!redisConnection">
<span class="el-radio-button__inner">外置 Redis</span>
</label>
</div>
<div v-if="!redisConnection">
<div class="el-form-item"><label class="el-form-item__label">端口</label><div class="el-form-item__content"><input v-model="redisPort" class="el-input__inner" placeholder="6379"><p class="field-tip">容器内置 Redis 监听端口</p></div></div>
</div>
<div v-else>
<div class="el-form-item"><label class="el-form-item__label">连接地址</label><div class="el-form-item__content"><input v-model="redisConnection" class="el-input__inner" placeholder="redis://host:6379/db"><p class="field-tip">格式 redis://host:port/db</p></div></div>
</div>
</div>
</div>
<button class="el-button el-button--text" @click="showAdvanced = !showAdvanced" style="margin-top:12px;width:100%;text-align:center;border:1px dashed #dcdfe6;padding:8px 0;border-radius:4px">{{ showAdvanced ? '收起高级选项 ▲' : '展开高级选项 ▼' }}</button>
<div v-show="showAdvanced" class="el-card" style="margin-top:12px">
<div class="el-card__header">定时任务</div>
<div class="el-card__body">
<div class="el-form-item"><label class="el-form-item__label">Cron 延时上限</label><div class="el-form-item__content"><input v-model="crontabDelay" class="el-input__inner" placeholder="30m"><p class="field-tip">计划任务随机延时的最大值，设置为 0 关闭延时</p></div></div>
<div class="el-form-item"><label class="el-form-item__label">日志保留天数</label><div class="el-form-item__content"><input v-model="logRetention" class="el-input__inner" type="number" placeholder="15"><p class="field-tip">超过天数的日志自动清理</p></div></div>
<div class="el-form-item"><label class="el-form-item__label">计划任务扫描间隔</label><div class="el-form-item__content"><input v-model="scheduleReload" class="el-input__inner" placeholder="2m"><p class="field-tip">计划任务扫描间隔</p></div></div>
</div>
</div>
</template>

<!-- 6. 数据目录 -->
<template v-if="i === 5">
<p class="step-tip">填写相对于 docker-compose.yml 所在目录的路径，安装脚本会自动创建子文件夹并映射。</p>
<div class="el-card">
<div class="el-card__body">
<div class="el-form-item"><label class="el-form-item__label">上级目录</label><div class="el-form-item__content"><input v-model="dataPath" class="el-input__inner" placeholder="."><p class="field-tip">填写 . 表示 docker-compose.yml 所在目录</p></div></div>
</div>
</div>
<div class="el-tip-card">
<div>自动映射：</div>
<div><code>{{ dataPath }}/db → /app/db</code> <span class="tip-comment">数据库、配置、日志</span></div>
<div><code>{{ dataPath }}/sites → /app/sites</code> <span class="tip-comment">自定义站点配置</span></div>
<div><code>{{ dataPath }}/icons → /app/icons</code> <span class="tip-comment">站点图标</span></div>
</div>
</template>

<!-- 7. 路径映射 -->
<template v-if="i === 6">
<p class="step-tip">配置下载器种子文件目录映射，格式 <code>宿主机路径:容器路径</code>。冒号前面为空的行会被忽略，下载器种子文件映射固定以 <code>/downloaders/</code> 开头。</p>
<div v-for="(d, idx) in downloaders" :key="idx" class="mapping-row">
<div class="el-form-item" style="margin-bottom:0"><div class="el-form-item__content" style="display:flex;gap:8px;align-items:center">
<input v-model="d.src" class="el-input__inner" placeholder="宿主机路径（如 /volume1/downloads）" style="flex:3">
<span style="color:#909399">:</span>
<input v-model="d.dest" class="el-input__inner" placeholder="容器路径" style="flex:2">
<button class="el-button el-button--danger el-button--mini" @click="removeDownloader(idx)" v-if="downloaders.length > 1">✕</button>
</div></div>
</div>
<button class="el-button el-button--text" @click="addDownloader">+ 添加目录</button>
<p class="field-tip" style="margin-top:8px">QB 和 TR 下载器均映射到种子文件夹的上一级目录</p>
</template>

<!-- 下一步按钮 -->
<div class="step-next" v-if="activeStep < totalSteps">
<button class="el-button el-button--primary" @click="nextStep">下一步 →</button>
</div>

</div>
</div>

<!-- 预览 -->
<div class="preview-card">
<div class="el-card__header" style="display:flex;justify-content:space-between;align-items:center">
<span>📄 docker-compose.yml</span>
<button class="el-button el-button--small" @click="copyCompose">{{ copied ? '✅ 已复制' : '📋 复制' }}</button>
</div>
<div class="el-card__body"><pre class="code-block"><code>{{ compose }}</code></pre></div>
</div>

</div>

<style scoped>
.compose-wizard { max-width: 100%; margin: 0; padding: 8px 4px; }
.accordion-item { border: 1px solid #ebeef5; border-radius: 4px; margin-bottom: 8px; overflow: hidden; background: #fff; transition: box-shadow .2s; }
.accordion-item.is-active { box-shadow: 0 2px 12px rgba(0,0,0,.08); }
.accordion-item.is-done .accordion-header { background: #f0f9eb; }
.accordion-header { display: flex; align-items: center; padding: 14px 20px; user-select: none; }
.accordion-item.is-active .accordion-header { border-bottom: 1px solid #ebeef5; background: #fafafa; }
.accordion-icon { font-size: 18px; margin-right: 10px; }
.accordion-title { flex: 1; font-size: 15px; font-weight: 600; color: #303133; }
.accordion-status { font-size: 12px; color: #67c23a; font-weight: 500; }
.accordion-arrow { width: 0; height: 0; border-left: 5px solid transparent; border-right: 5px solid transparent; border-top: 6px solid #409eff; }
.accordion-body { padding: 16px 20px; animation: fadeIn .2s; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }
.step-tip { font-size: 13px; color: #909399; margin: 0 0 14px; line-height: 1.6; }
.step-next { display: flex; justify-content: flex-end; padding-top: 16px; }
.field-desc { font-size: 13px; color: #606266; margin: 0 0 12px; line-height: 1.6; }
.field-tip { font-size: 12px; color: #909399; margin: 4px 0 0; line-height: 1.4; }
.tip-comment { color: #909399; font-size: 12px; margin-left: 6px; }
.el-tip-card { margin-top: 12px; padding: 12px 16px; background: #f0f9ff; border: 1px solid #b3d8ff; border-radius: 4px; font-size: 13px; color: #409eff; line-height: 1.8; }
.el-tip-card code { background: #ecf5ff; padding: 2px 6px; border-radius: 3px; font-size: 12px; }
.preview-card { border: 1px solid #ebeef5; border-radius: 4px; overflow: hidden; background: #fff; margin-top: 24px; }
.el-card { border: 1px solid #ebeef5; border-radius: 4px; overflow: hidden; background: #fff; }
.el-card__header { padding: 12px 20px; border-bottom: 1px solid #ebeef5; font-weight: 600; font-size: 14px; color: #303133; }
.el-card__body { padding: 20px; }
.el-radio-group { display: inline-flex; margin-bottom: 4px; }
.el-radio-button { position: relative; cursor: pointer; }
.el-radio-button__original-radio { position: absolute; opacity: 0; width: 0; height: 0; }
.el-radio-button__inner { display: inline-block; padding: 10px 20px; font-size: 14px; border: 1px solid #dcdfe6; border-right: 0; background: #fff; color: #606266; transition: all .15s; }
.el-radio-button:first-child .el-radio-button__inner { border-radius: 4px 0 0 4px; }
.el-radio-button:last-child .el-radio-button__inner { border-radius: 0 4px 4px 0; border-right: 1px solid #dcdfe6; }
.el-radio-button.is-active .el-radio-button__inner { background: #409eff; border-color: #409eff; color: #fff; }
.el-form-item { display: flex; align-items: center; margin-bottom: 16px; }
.el-form-item:last-child { margin-bottom: 0; }
.el-form-item__label { min-width: 100px; font-size: 14px; color: #606266; font-weight: 500; }
.el-form-item__content { flex: 1; }
.el-input__inner { width: 100%; padding: 0 12px; height: 36px; line-height: 36px; border: 1px solid #dcdfe6; border-radius: 4px; font-size: 14px; color: #606266; background: #fff; outline: none; transition: border-color .2s; box-sizing: border-box; }
.el-input__inner:focus { border-color: #409eff; }
.el-switch { display: inline-flex; align-items: center; cursor: pointer; }
.el-switch__core { display: inline-block; width: 40px; height: 20px; border-radius: 10px; background: #dcdfe6; position: relative; transition: background .3s; }
.el-switch__core::after { content: ''; position: absolute; width: 16px; height: 16px; border-radius: 50%; background: #fff; top: 2px; left: 2px; transition: transform .3s; }
.el-switch.is-checked .el-switch__core { background: #409eff; }
.el-switch.is-checked .el-switch__core::after { transform: translateX(20px); }
.el-button { display: inline-flex; align-items: center; justify-content: center; padding: 8px 16px; font-size: 13px; border-radius: 4px; border: 1px solid #dcdfe6; cursor: pointer; transition: all .15s; font-weight: 500; }
.el-button--small { padding: 6px 12px; font-size: 12px; }
.el-button--mini { padding: 4px 8px; font-size: 12px; }
.el-button--text { border: none; color: #409eff; background: none; padding: 4px 0; }
.el-button--text:hover { color: #66b1ff; }
.el-button--primary { background: #409eff; border-color: #409eff; color: #fff; padding: 10px 24px; }
.el-button--primary:hover { background: #66b1ff; border-color: #66b1ff; }
.el-button--danger { color: #f56c6c; border-color: #fbc4c4; background: #fef0f0; }
.el-button--danger:hover { color: #fff; background: #f56c6c; border-color: #f56c6c; }
.el-button:hover { border-color: #409eff; color: #409eff; }
.mapping-row { margin-bottom: 10px; }
.code-block { margin: 0; background: #1e1e1e; border-radius: 4px; padding: 16px; overflow-x: auto; }
.code-block code { color: #d4d4d4; font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace; font-size: 13px; line-height: 1.6; white-space: pre; }
@media (max-width: 768px) {
.compose-wizard { padding: 12px 8px; }
.accordion-header { padding: 12px 14px; }
.accordion-body { padding: 12px 14px; }
.el-card__header { padding: 10px 14px; }
.el-card__body { padding: 14px; }
.el-form-item { flex-wrap: wrap; }
.el-form-item__label { min-width: auto; width: 100%; margin-bottom: 4px; }
.el-radio-button__inner { padding: 8px 14px; font-size: 13px; }
.step-next { padding-top: 12px; }
.el-button--primary { padding: 8px 18px; }
}
</style>

# 安装教程

> 鉴于原Harvest项目Docker内存占用较大，先以使用go重新实现了Docker服务端，特此更新教程

#### docker-compose非常方便，目前各大NAS系统均已支持使用docker-compose的方式部署，本项目也不再提供手动创建容器的教程，太繁琐

> 安装教程以群晰为例，但是各家均大差不差，参照群晰的配置安装即可
>
> <font color=orange size=3>推荐使用 docker-compose 【项目（群晢）】【Compose（飞牛）】方式安装</font>
>
> 常用 Docker 镜像源地址：

```json
{
  "registry-mirrors": [
    "https://docker.xuanyuan.me",
    "https://docker.1ms.run",
    "https://dockerhub.icu",
    "https://hub.rat.dev",
    "https://docker.wanpeng.top",
    "https://doublezonline.cloud",
    "https://docker.mrxn.net",
    "https://docker.anyhub.us.kg",
    "https://dislabaiot.xyz",
    "https://docker.fxxk.dedyn.io",
    "https://docker-mirror.aigc2d.com",
    "https://dockerproxy.net",
    "https://docker.kejilion.pro",
    "https://docker.1panel.live"
  ]
}
```

## 1. 项目简介

Go Harvest 是 Harvest 的 GoFrame 重写版本，面向 PT 站点管理、签到、数据抓取、种子搜索、下载器管理、辅种、通知和自动化任务。

当前主要功能：

- WebUI 页面和 REST API。
- SQLite / PostgreSQL 初始化。
- 用户登录、JWT 鉴权、Swagger UI。
- 我的站点管理、站点配置管理、站点数据抓取、签到、搜索。
- qBittorrent / Transmission 下载器管理和种子控制。
- 种子推送、批量推送、辅种、种子迁移。
- 计划任务、手动任务、任务结果记录。
- 通知推送和消息历史。
- TMDB / 豆瓣查询。
- 旧版数据导入、数据备份导入导出。
- 主程序、站点配置、WebUI 更新。
- 服务器状态、服务状态、实时日志。

## 2. 推荐部署方式

推荐使用 Docker 镜像运行。镜像内包含：

- Go Harvest 主程序。
- Redis，可在未配置外置 Redis 时由容器内部启动。
- 内置站点配置和 WebUI 静态文件。

### 2.1 SQLite 单容器部署

SQLite 是最简单的部署方式，只需要一个 Go Harvest 容器。建议在项目目录下创建 `docker-compose.yml` 和 `.env`，然后通过 `.env`
管理敏感配置和端口。

完整 `docker-compose.yml` 示例：

```yaml
services:
  harvest:
    image: newptools/go-harvest:latest
    container_name: go-harvest
    restart: unless-stopped
#    env_file: # 使用.env管理环境变量的将这三行打开
#      - path: ./db/.env
#        required: false
    environment:
      TZ: ${TZ:-Asia/Shanghai}
      LOGGER_LEVEL: ${LOGGER_LEVEL:-info}

      # 启动授权校验必填。EMAIL 也可写成 DJANGO_SUPERUSER_EMAIL。
      EMAIL: ${EMAIL}
      TOKEN: ${TOKEN}

      # 对外访问端口（WebUI / API / Swagger 均通过此端口）。
      GO_WEB_PORT: ${GO_WEB_PORT:-5173}

      # 运行资源和并发设置。
      HARVEST_MEMORY_LIMIT: ${HARVEST_MEMORY_LIMIT:-}
      HARVEST_GOGC: ${HARVEST_GOGC:-80}
      HARVEST_SITE_TASK_CONCURRENCY: ${HARVEST_SITE_TASK_CONCURRENCY:-5}
      HARVEST_DOWNLOADER_TASK_CONCURRENCY: ${HARVEST_DOWNLOADER_TASK_CONCURRENCY:-2}
      HARVEST_DOWNLOADER_STATUS_CONCURRENCY: ${HARVEST_DOWNLOADER_STATUS_CONCURRENCY:-3}
      HARVEST_WS_STATUS_CONCURRENCY: ${HARVEST_WS_STATUS_CONCURRENCY:-3}
      HARVEST_PUSH_DOWNLOAD_CONCURRENCY: ${HARVEST_PUSH_DOWNLOAD_CONCURRENCY:-2}
      HARVEST_DB_LOG_RETENTION_DAYS: ${HARVEST_DB_LOG_RETENTION_DAYS:-15}

      # 留空时使用容器内置 Redis；配置后使用外置 Redis。
      CACHE_REDIS_CONNECTION: ${CACHE_REDIS_CONNECTION:-}
      REDIS_SERVER_PORT: ${REDIS_SERVER_PORT:-6379}
      REDIS_MAXMEMORY: ${REDIS_MAXMEMORY:-128mb}
      REDIS_MAXMEMORY_POLICY: ${REDIS_MAXMEMORY_POLICY:-allkeys-lru}

      # GitHub 资源代理，用于站点配置、WebUI、Release 更新等。
      GIT_PROXY: ${GIT_PROXY:-https://gh-proxy.org/}
    ports:
      - "5173:${GO_WEB_PORT:-5173}"
    volumes:
      # 配置、SQLite 数据库、日志、媒体文件。
      - ./db:/app/db
      # 自定义站点配置。
      - ./sites:/app/sites
      # 下载器相关目录。
      - ./downloaders:/downloaders
      # 图标目录，供 WebUI 或接口访问站点/应用图标。
      - ./db/icons:/icons
    healthcheck:
      test: [ "CMD-SHELL", "curl -fsS http://127.0.0.1:${GO_WEB_PORT:-5173}/api.json >/dev/null" ]
      interval: 20s
      timeout: 5s
      retries: 10
      start_period: 30s
```

`.env` 示例：

```env
TZ=Asia/Shanghai
LOGGER_LEVEL=info

# 授权信息，启动时会请求远端授权接口校验。
EMAIL=your-email@example.com
TOKEN=your-auth-token

# 对外访问端口。
GO_WEB_PORT=5173

# 并发和资源控制。
HARVEST_GOGC=80
HARVEST_SITE_TASK_CONCURRENCY=5
HARVEST_DOWNLOADER_TASK_CONCURRENCY=2
HARVEST_DOWNLOADER_STATUS_CONCURRENCY=3
HARVEST_WS_STATUS_CONCURRENCY=3
HARVEST_PUSH_DOWNLOAD_CONCURRENCY=2
HARVEST_DB_LOG_RETENTION_DAYS=15

# 缓存。留空使用容器内置 Redis。
CACHE_REDIS_CONNECTION=
REDIS_SERVER_PORT=6379
REDIS_MAXMEMORY=128mb
REDIS_MAXMEMORY_POLICY=allkeys-lru

# GitHub 资源代理。
GIT_PROXY=https://gh-proxy.org/
```

启动：

```bash
mkdir -p db/icons sites downloads downloaders
docker compose up -d
```

Compose 会自动读取当前目录下的 `.env`。如果 `.env` 不在当前目录，可以显式指定：

```bash
docker compose --env-file /path/to/.env up -d
```

默认访问地址：

- WebUI: `http://127.0.0.1:5173`
- 初始化页面: `http://127.0.0.1:5173/setup`
- Swagger UI: `http://127.0.0.1:5173/swagger`
- OpenAPI JSON: `http://127.0.0.1:5173/api.json`

默认挂载目录：

- `./db:/app/db`，配置、数据库、日志、媒体文件。
- `./sites:/app/sites`，用户自定义站点配置。
- `./downloaders:/downloaders`，下载器相关目录。
- `./db/icons:/icons`，图标目录。建议放在 `db/icons` 下，便于随数据目录一起备份和迁移。

SQLite 数据库初始化时固定使用：

```text
/app/db/data.sqlite3
```

### 2.2 PostgreSQL 部署

如果希望使用 PostgreSQL，可以在 SQLite 单容器 Compose 基础上增加 PostgreSQL 服务。完整示例：

```yaml
services:
  go-harvest-postgres:
    image: postgres:17-alpine
    container_name: go-harvest-postgres
    restart: unless-stopped
    environment:
      TZ: ${TZ:-Asia/Shanghai}
      POSTGRES_DB: ${POSTGRES_DB:-goharvest}
      POSTGRES_USER: ${POSTGRES_USER:-goharvest}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-goharvest}
      POSTGRES_PORT: ${POSTGRES_PORT:-5432}
      PGDATA: /var/lib/postgresql/data/pgdata
    volumes:
      - ./postgres-data:/var/lib/postgresql/data
    healthcheck:
      test: [ "CMD-SHELL", "pg_isready -U \"$${POSTGRES_USER}\" -d \"$${POSTGRES_DB}\"" ]
      interval: 2s
      timeout: 3s
      retries: 30
      start_period: 2s

  go-harvest:
    image: newptools/go-harvest:latest
    container_name: go-harvest
    restart: unless-stopped
    depends_on:
      go-harvest-postgres:
        condition: service_healthy
#    env_file: # 使用.env管理环境变量的将这三行打开
#      - path: ./db/.env
#        required: false
    environment:
      TZ: ${TZ:-Asia/Shanghai}
      LOGGER_LEVEL: ${LOGGER_LEVEL:-info}

      # 启动授权校验必填。EMAIL 也可写成 DJANGO_SUPERUSER_EMAIL。
      EMAIL: ${EMAIL}
      TOKEN: ${TOKEN}

      GO_WEB_PORT: ${GO_WEB_PORT:-5173}

      HARVEST_MEMORY_LIMIT: ${HARVEST_MEMORY_LIMIT:-}
      HARVEST_GOGC: ${HARVEST_GOGC:-80}
      HARVEST_SITE_TASK_CONCURRENCY: ${HARVEST_SITE_TASK_CONCURRENCY:-5}
      HARVEST_DOWNLOADER_TASK_CONCURRENCY: ${HARVEST_DOWNLOADER_TASK_CONCURRENCY:-2}
      HARVEST_DOWNLOADER_STATUS_CONCURRENCY: ${HARVEST_DOWNLOADER_STATUS_CONCURRENCY:-3}
      HARVEST_WS_STATUS_CONCURRENCY: ${HARVEST_WS_STATUS_CONCURRENCY:-3}
      HARVEST_PUSH_DOWNLOAD_CONCURRENCY: ${HARVEST_PUSH_DOWNLOAD_CONCURRENCY:-2}
      HARVEST_DB_LOG_RETENTION_DAYS: ${HARVEST_DB_LOG_RETENTION_DAYS:-15}

      CACHE_REDIS_CONNECTION: ${CACHE_REDIS_CONNECTION:-}
      REDIS_SERVER_PORT: ${REDIS_SERVER_PORT:-6379}
      REDIS_MAXMEMORY: ${REDIS_MAXMEMORY:-128mb}
      REDIS_MAXMEMORY_POLICY: ${REDIS_MAXMEMORY_POLICY:-allkeys-lru}
      GIT_PROXY: ${GIT_PROXY:-https://gh-proxy.org/}
    ports:
      - "5173:${GO_WEB_PORT:-5173}"
    volumes:
      - ./db:/app/db
      - ./sites:/app/sites
      - ./downloaders:/downloaders
      - ./db/icons:/icons
    healthcheck:
      test: [ "CMD-SHELL", "curl -fsS http://127.0.0.1:${GO_WEB_PORT:-5173}/api.json >/dev/null" ]
      interval: 20s
      timeout: 5s
      retries: 10
      start_period: 30s
```

PostgreSQL `.env` 示例可在 SQLite `.env` 基础上追加：

```env
POSTGRES_DB=goharvest
POSTGRES_USER=goharvest
POSTGRES_PASSWORD=change-me
POSTGRES_PORT=5432
```

启动：

```bash
mkdir -p db/icons sites downloads downloaders postgres-data
docker compose -f docker-compose.pgsql.yml up -d
```

如果使用自定义 `.env` 路径：

```bash
docker compose --env-file /path/to/.env -f docker-compose.pgsql.yml up -d
```

默认 PostgreSQL 环境变量：

```env
POSTGRES_DB=goharvest
POSTGRES_USER=goharvest
POSTGRES_PASSWORD=goharvest
POSTGRES_PORT=5432
```

初始化页面中选择 PostgreSQL，并填写数据库地址、端口、库名、用户和密码。

使用上面的 Compose 时，初始化页面中 PostgreSQL 连接信息通常填写：

```text
Host: go-harvest-postgres
Port: 5432
Database: goharvest
User: goharvest
Password: .env 中的 POSTGRES_PASSWORD
```

### 2.3 常用环境变量

容器启动常用环境变量：

```env
TZ=Asia/Shanghai
LOGGER_LEVEL=info
EMAIL=your-email@example.com
TOKEN=your-auth-token
GO_WEB_PORT=5173
HARVEST_MEMORY_LIMIT=
HARVEST_GOGC=80
HARVEST_SITE_TASK_CONCURRENCY=5
HARVEST_DOWNLOADER_TASK_CONCURRENCY=2
HARVEST_DOWNLOADER_STATUS_CONCURRENCY=3
HARVEST_WS_STATUS_CONCURRENCY=3
HARVEST_PUSH_DOWNLOAD_CONCURRENCY=2
HARVEST_DB_LOG_RETENTION_DAYS=15
CACHE_REDIS_CONNECTION=
REDIS_SERVER_PORT=6379
REDIS_MAXMEMORY=128mb
REDIS_MAXMEMORY_POLICY=allkeys-lru
GIT_PROXY=https://gh-proxy.org/
```

说明：

- `EMAIL` / `TOKEN` 是启动授权校验所需环境变量。`EMAIL` 也兼容 `DJANGO_SUPERUSER_EMAIL`。
- `GO_WEB_PORT` 是对外访问端口（WebUI / API / Swagger 均通过此端口），默认 `5173`。
- `CACHE_REDIS_CONNECTION` 存在时使用外置 Redis，例如 `redis://192.168.1.10:6379/15`。
- `CACHE_REDIS_CONNECTION` 留空时，容器内部 Redis 会使用 `REDIS_SERVER_PORT`。
- `GIT_PROXY` 用于站点配置、WebUI、Release 等 GitHub 资源访问代理。

## 3. docker-compose 部署教程

> 本教程以群晖 Container Manager 为例，其他 NAS（如飞牛）操作类似。

### 3.1 创建 compose 项目

1. 在 File Station 的 docker 文件夹下创建 harvest 文件夹，在 harvest 下创建 db 文件夹（用于保存数据库和配置文件）

   ![img.png](/images/install/img.png)
   ![img_1.png](/images/install/img_1.png)
   ![img_2.png](/images/install/img_2.png)
   ![img_3.png](/images/install/img_3.png)
   ![img_4.png](/images/install/img_4.png)

2. 打开 Container Manager，选择「项目」，新增，输入项目名称，选择项目文件夹（harvest）

   ![img_5.png](/images/install/img_5.png)
   ![img_6.png](/images/install/img_6.png)

### 3.2 配置 compose 脚本

1. 选择创建 `docker-compose.yml`

   ![img_7.png](/images/install/img_7.png)

2. 复制配置文件内容，粘贴到输入框。粘贴不了的刷新下网页，修改填写你的端口、授权码（EMAIL / TOKEN），以及网络模式。

   > <font color="orange">重点说明</font>
   >
   > **下载器文件夹的映射规则**：冒号前面是本地文件夹，冒号后面是容器内路径。
   > 下载器种子文件映射目录固定格式为 `/downloaders/` 开头。如不需要辅种功能，下载器可以不映射。
   > <font color="yellow">QB 下载器和 TR 下载器均映射到种子文件夹的上一级</font>
   >
   > **端口映射**：所有对外访问均通过 `GO_WEB_PORT` 端口，默认 `5173`

   ![img_8.png](/images/install/img_8.png)
   ![img_9.png](/images/install/img_9.png)
   ![img_10.png](/images/install/img_10.png)

3. 修改完成之后点击下一步，点击「完成」就会自动下载镜像并生成容器。

   ![img_11.png](/images/install/img_11.png)
   ![img_12.png](/images/install/img_12.png)
   ![img_13.png](/images/install/img_13.png)
   ![img_14.png](/images/install/img_14.png)

### 3.3 错误处理

1. 如果容器启动失败，Exit Code 1，不要急，点击关闭。exit code 0 表示成功

   ![img_15.png](/images/install/img_15.png)

    1. 检查 EMAIL 和 TOKEN 是否正确

    2. 检查授权文件是否放到 db 文件夹

    3. 点击项目名称，进去之后会看到容器下面有一行红字，这里会显示缺少目录（例如 sites 文件夹）。到 harvest
       文件夹下手动创建对应文件夹，然后重新启动容器。

       ![img_16.png](/images/install/img_16.png)
       ![img_17.png](/images/install/img_17.png)
       ![img_18.png](/images/install/img_18.png)

2. 等待几分钟后，就可以通过 `http://IP:端口映射出来的端口` 访问 WebUI 了

    1. 首次访问会进入初始化页面，按提示填写信息
    2. 希望查看启动进度的可以点击容器名称，然后点右上角的操作 => 打开终端机 查看实时日志

   ![img_19.png](/images/install/img_19.png)
   ![img_20.png](/images/install/img_20.png)
   ![img_21.png](/images/install/img_21.png)