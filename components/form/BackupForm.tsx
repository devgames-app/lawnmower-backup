import React, { ChangeEvent, Dispatch, FormEvent, SetStateAction } from 'react';
import Input from './Input';
import Button from './Button';
import useFetch from '@/hooks/useFetch';
import useInput from '@/hooks/useInput';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { fireSwal } from '@/utils/fireSwal';
import pako from 'pako';

type Props = {
  jsonInput: {
    setValue: Dispatch<SetStateAction<string>>;
    inputProps: {
      onChange: ({ target }: ChangeEvent<HTMLInputElement>) => void;
      value: string;
    };
  };
};

const BackupForm = ({ jsonInput }: Props) => {
  const usernameInput = useInput();
  const { loading, fetchData } = useFetch();
  const MySwal = withReactContent(Swal);

  const handleBackupSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { response, json } = await fetchData('/api/backup/', {
        method: 'POST',
        body: JSON.stringify({ username: usernameInput.inputProps.value }),
      });
      if (response && response.ok) {
        const buffer = await response.arrayBuffer();
        const inflated = pako.inflate(new Uint8Array(buffer));
        const text = new TextDecoder().decode(inflated);
        const textJson = JSON.stringify(text);
        const swalText =
          'Backup created! You can copy and save it for later or restore it right now.';
        jsonInput.setValue(textJson || '');
        fireSwal(MySwal, 'Success', swalText, 'success');
      } else throw new Error(json.message);
    } catch (error: unknown) {
      const isError = error instanceof Error;
      const swalText = isError ? error.message : 'Something went wrong';
      fireSwal(MySwal, 'Error', swalText, 'error');
    }
  };

  return (
    <form
      className='w-full text-lg mb-8 grid gap-4'
      onSubmit={handleBackupSubmit}
    >
      <Input
        placeholder='username you want to backup'
        {...usernameInput.inputProps}
      />
      <Button span={true} loading={loading}>
        Backup
      </Button>
    </form>
  );
};

export default BackupForm;
