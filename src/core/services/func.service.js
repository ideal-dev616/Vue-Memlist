import swal from 'sweetalert2';

export const func = {
  showTextMessage: (title, text, icon) => {
    swal.fire({
      title,
      icon,
      text
    });
  },

  showHtmlMessage: (title, html, icon) => {
    swal.fire({
      title,
      icon,
      html
    });
  }
};
