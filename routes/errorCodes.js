const _errors = {
  E0010001: {
    title: 'Internal Server Error',
    message: 'Something went wrong. Please try again later.',
    info: {
      type: "fullScreen",
      data: {
        description: "Something went wrong. Please try again later.",
        cta: "retry",
        label: "Retry"
      }
    }
  },

  E0010002: {
    title: 'Invalid request params',
    message: 'Something went wrong. Please try again later.',
    info: {
      type: "fullScreen",
      data: {
        description: "Something went wrong. Please try again later.",
        cta: "retry",
        label: "Retry"
      }
    }
  }
};

module.exports = {
  errors: _errors
};
