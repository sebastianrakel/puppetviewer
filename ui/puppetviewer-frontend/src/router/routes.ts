import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { name: 'Overview', path: '', component: () => import('pages/OverviewPage.vue') },
      { name: 'Query', path: 'query', component: () => import('pages/QueryPage.vue')},
      { name: 'FactsOverview', path: 'facts', component: () => import('pages/facts/FactsOverviewPage.vue')},
      { name: 'FactDetail', path: 'fact/:fact', component: () => import('pages/facts/FactsDetailPage.vue')},
      { name: 'NodesOverview', path: 'nodes', component: () => import('pages/node/NodeOverviewPage.vue')},
      { name: 'NodeDetail', path: 'node/:node', component: () => import('pages/node/NodeDetailPage.vue')},
      { name: 'ReportsOverview', path: 'reports', component: () => import('pages/report/ReportOverviewPage.vue')},
      { name: 'ReportDetail', path: 'report/:certname/:report_hash', component: () => import('pages/report/ReportDetailPage.vue')},
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
