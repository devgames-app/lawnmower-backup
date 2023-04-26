import Swal from 'sweetalert2';
import { ReactSweetAlert } from 'sweetalert2-react-content';

export const fireSwal = (
  MySwal: typeof Swal & ReactSweetAlert,
  title: string,
  text: string,
  icon: 'error' | 'success'
) => {
  return MySwal.fire({
    title,
    text,
    icon,
    showConfirmButton: true,
    allowOutsideClick: false,
    allowEscapeKey: false,
  });
};
