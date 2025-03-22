export interface ComplianceFlag {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  proposedSolution?: string;
  timestamp: string;
  emailOrigen?: string;
  documentSource?: string;
    category?: string;
}