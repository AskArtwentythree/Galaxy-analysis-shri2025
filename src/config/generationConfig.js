export const GENERATION_CONFIG = {
  report: {
    size: 0.1,
    withErrors: 'off',
    maxSpend: 1000,
  },

  analytics: {
    rows: 10000,
  },

  files: {
    defaultReportName: 'report.csv',
    acceptedTypes: ['.csv'],
  },
};

export const getReportParams = () => GENERATION_CONFIG.report;
export const getAnalyticsParams = () => GENERATION_CONFIG.analytics;
export const getFileParams = () => GENERATION_CONFIG.files;
