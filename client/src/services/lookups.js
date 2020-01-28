import http from "./http.js";
import messages from "./messages";

const Lookup = {};

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

export default getLookup;
