import { toast } from "react-toastify";

const error = error => {
  if (!error.response)
    toast.error(error.message, {
      position: toast.POSITION.BOTTOM_RIGHT,
      autoClose: 5000
    });
  if (error.response && error.response.status < 500)
    toast.error(error.response.data, {
      position: toast.POSITION.BOTTOM_RIGHT,
      autoClose: 5000
    });
};

const warn = message => {
  toast.warn(message, {
    position: toast.POSITION.BOTTOM_RIGHT,
    autoClose: 5000
  });
};

const info = message => {
  toast.info(message, {
    position: toast.POSITION.BOTTOM_RIGHT,
    autoClose: 5000
  });
};

const success = message => {
  toast.success(message, {
    position: toast.POSITION.BOTTOM_RIGHT,
    autoClose: 5000
  });
};

export default {
  error,
  warn,
  info,
  success
};
