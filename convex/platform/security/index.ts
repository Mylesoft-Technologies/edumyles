import { 
  createSecurityIncident, 
  updateSecurityIncident, 
  acknowledgeThreat, 
  mitigateThreat, 
  blockIP, 
  runVulnerabilityScan 
} from "./mutations";
import { 
  getSecurityOverview, 
  getActiveThreats, 
  getSecurityIncidents, 
  getComplianceStatus, 
  getAccessLogs, 
  getVulnerabilityScan 
} from "./queries";
