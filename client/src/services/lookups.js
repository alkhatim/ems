import http from "./http.js";
import messages from "./messages";

const getLookup = type => {
  if (!Lookup[type]) fetchLookup(type);
  return Lookup[type];
};

const fetchLookup = async type => {
  try {
    var res = await http.get(`/lookups/?lookup=${type}`);
    Lookup[type] = res.data;
  } catch (error) {
    messages.error(error);
  }
};

const Lookup = {
  BatchType: null,
  Contract: null,
  DeductionType: null,
  Department: null,
  EmployeeStatus: null,
  Gender: null,
  InstallmentState: null,
  Job: null,
  LoanState: null,
  Location: null,
  MissionState: null,
  Nationality: null,
  OvertimeType: null,
  State: null,
  VacationState: null,
  VacationType: null
};

export default getLookup;
