import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/login', component: () => import('@/views/auth/LoginView.vue'), meta: { public: true } },
    { path: '/register', component: () => import('@/views/auth/RegisterView.vue'), meta: { public: true } },
    { path: '/', component: () => import('@/views/dashboard/DashboardView.vue'), meta: { requiresAuth: true } },
    { path: '/records', component: () => import('@/views/records/RecordListView.vue'), meta: { requiresAuth: true } },
    { path: '/records/new', component: () => import('@/views/records/RecordFormView.vue'), meta: { requiresAuth: true } },
    { path: '/stats', component: () => import('@/views/stats/StatsView.vue'), meta: { requiresAuth: true } },
    { path: '/lab', component: () => import('@/views/lab/LabListView.vue'), meta: { requiresAuth: true } },
    { path: '/lab/new', component: () => import('@/views/lab/LabFormView.vue'), meta: { requiresAuth: true } },
    { path: '/lab/trend', component: () => import('@/views/lab/LabTrendView.vue'), meta: { requiresAuth: true } },
    { path: '/lab/items', component: () => import('@/views/lab/UserLabItemView.vue'), meta: { requiresAuth: true } },
    { path: '/health-records', component: () => import('@/views/health-records/HealthRecordListView.vue'), meta: { requiresAuth: true } },
    { path: '/health-records/:id', component: () => import('@/views/health-records/HealthRecordDetailView.vue'), meta: { requiresAuth: true } },
    { path: '/visits/timeline', component: () => import('@/views/visits/VisitTimelinePage.vue'), meta: { requiresAuth: true } },
    { path: '/visits/:id', component: () => import('@/views/visits/VisitRelatedView.vue'), meta: { requiresAuth: true } },
    { path: '/symptoms', component: () => import('@/views/symptoms/SymptomPage.vue'), meta: { requiresAuth: true } },
    { path: '/symptoms/trends', component: () => import('@/views/symptoms/SymptomTrendsPage.vue'), meta: { requiresAuth: true } },
    { path: '/medications/reminders', component: () => import('@/views/medications/MedicationReminderPage.vue'), meta: { requiresAuth: true } },
    { path: '/medications/adherence', component: () => import('@/views/medications/AdherencePage.vue'), meta: { requiresAuth: true } },
    { path: '/medications', component: () => import('@/views/medication/MedicationListView.vue'), meta: { requiresAuth: true } },
    { path: '/nhi', component: () => import('@/views/nhi/NhiImportView.vue'), meta: { requiresAuth: true } },
    { path: '/profile', component: () => import('@/views/profile/ProfileView.vue'), meta: { requiresAuth: true } },
  ],
})

router.beforeEach((to) => {
  const hasToken = !!localStorage.getItem('token')
  if (to.meta.requiresAuth && !hasToken) return '/login'
  if (to.meta.public && hasToken) return '/'
  return true
})

export default router
