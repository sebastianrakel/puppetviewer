export interface Node {
  cached_catalog_status: string;
  catalog_environment: string;
  catalog_timestamp: Date;
  certname: string;
  deactivated: boolean | null;
  expired: boolean | null;
  facts_environment: string;
  facts_timestamp: Date;
  latest_report_corrective_change: boolean | null;
  latest_report_hash: string;
  latest_report_job_id: string;
  latest_report_noop: boolean;
  latest_report_noop_pending: boolean;
  latest_report_status: string;
  report_environment: string;
  report_timestamp: Date;
}

export type Fact = {
  certname: string;
  environment: string;
  name: string;
  value: unknown;
}

type EventCountSubject = {
  title: string;
}

export type EventCount = {
  failures: number;
  skips: number;
  successes: number;
  noops: number;
  subject_type: string;
  subject: EventCountSubject;
}

export type NodeWithEventCount = {
  node: Node;
  event_count: EventCount;
}


export type Event = {
  certname: string;
  configuration_version: string;
  containing_class: string;
  containment_path: string[];
  corrective_change: null;
  environment: string;
  file: string;
  line: number;
  message: string;
  name: string;
  new_value: any,
  old_value: any,
  property: null,
  report: string;
  report_receive_time: Date;
  resource_title: string;
  resource_type: string;
  run_end_time: Date;
  run_start_time: Date;
  status: string;
  timestamp: Date;
}

type ReportMetric = {
  category: string;
  name: string;
  value: number;
}

type ReportMetrics = {
  data: ReportMetric[];
  href: string;
}

export type ReportLog = {
  file: string;
  level: string;
  line: number;
  message: string;
  source: string;
  tags: string[];
  time: Date;
}

type ReportLogs = {
  data: ReportLog[];
  href: string;
}

export type Report = {
  cached_catalog_status: string;
  catalog_uuid: string;
  certname: string;
  code_id: null;
  configuration_version: string;
  corrective_change: null;
  end_time: Date;
  environment: string;
  hash: string;
  job_id: null;
  logs: ReportLogs;
  metrics: ReportMetrics;
  noop: boolean;
  noop_pending: boolean;
  producer: string;
  producer_timestamp: Date;
  puppet_version: string;
  receive_time: Date;
  report_format: number;
  status: string;
  transaction_uuid: string;
  type: string;
}
