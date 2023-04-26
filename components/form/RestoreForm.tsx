import React, {
  ChangeEvent,
  Dispatch,
  FormEvent,
  SetStateAction,
  useCallback,
} from 'react';
import Input from './Input';
import Button from './Button';
import useInput from '@/custom-hooks/useInput';
import useFetch from '@/custom-hooks/useFetch';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { fireSwal } from '@/utils/fireSwal';

type Props = {
  jsonInput: {
    setValue: Dispatch<SetStateAction<string>>;
    inputProps: {
      onChange: ({ target }: ChangeEvent<HTMLInputElement>) => void;
      value: string;
    };
  };
};

const RestoreForm = ({ jsonInput }: Props) => {
  const newUsernameInput = useInput();
  const { loading, fetchData } = useFetch();
  const MySwal = withReactContent(Swal);

  const handleRestoreForm = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      try {
        const { response, json } = await fetchData('/api/restore/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            newusername: newUsernameInput.inputProps.value,
            backup: jsonInput.inputProps.value,
          }),
        });

        if (response?.ok) {
          fireSwal(MySwal, 'Success', await response.text(), 'success');
        } else throw new Error(json.message);
      } catch (error) {
        const isError = error instanceof Error;
        const swalText = isError ? error.message : 'Something went wrong';
        fireSwal(MySwal, 'Error', swalText, 'error');
      }
    },
    [
      MySwal,
      jsonInput.inputProps.value,
      newUsernameInput.inputProps.value,
      fetchData,
    ]
  );

  const handleCopyJsonToClipboard = useCallback(() => {
    navigator.clipboard.writeText(jsonInput.inputProps.value);
    fireSwal(MySwal, 'Info', 'JSON copied to clipboard!', 'success');
  }, [MySwal, jsonInput.inputProps.value]);

  return (
    <form onSubmit={handleRestoreForm} className='w-full text-lg grid gap-4'>
      <Input
        placeholder='username to restore the backup to'
        {...newUsernameInput.inputProps}
      />
      <Input
        placeholder='get the backup above or paste it here'
        {...jsonInput.inputProps}
      />
      <Button loading={loading} span={true}>
        Restore
      </Button>
      <Button
        hidden={!jsonInput.inputProps.value?.length}
        onClick={handleCopyJsonToClipboard}
        type='button'
      >
        Copy JSON
      </Button>
    </form>
  );
};

export default RestoreForm;
