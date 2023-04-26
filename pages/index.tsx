import Button from '@/components/form/Button';
import Input from '@/components/form/Input';
import useFetch from '@/custom-hooks/useFetch';
import useInput from '@/custom-hooks/useInput';
import Head from 'next/head';
import { FormEvent } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import pako from 'pako';

function Home() {
  const usernameInput = useInput();
  const newUsernameInput = useInput();
  const jsonInput = useInput();
  const MySwal = withReactContent(Swal);
  const { loading: backupLoading, fetchData: backupFetchData } = useFetch();

  const handleBackupSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { response, json } = await backupFetchData('/api/backup/', {
        method: 'POST',
        body: JSON.stringify({ username: usernameInput.inputProps.value }),
      });
      if (response?.ok) {
        const buffer = await response?.arrayBuffer();
        const inflated = pako.inflate(new Uint8Array(buffer!));
        const text = new TextDecoder().decode(inflated);
        const textJson = JSON.stringify(text);

        jsonInput.setValue(textJson || '');
        await MySwal.fire({
          title: <p>Success</p>,
          text: 'Backup created! You can copy and save it for later or restore it right now.',
          icon: 'success',
          showConfirmButton: true,
          allowOutsideClick: false,
          allowEscapeKey: false,
        });
      } else throw new Error(json.message);
    } catch (error: unknown) {
      const isError = error instanceof Error;

      await Swal.fire({
        title: 'Error',
        text: isError ? error.message : 'Something went wrong',
        icon: 'error',
        showConfirmButton: true,
        allowOutsideClick: false,
        allowEscapeKey: false,
        confirmButtonText: 'OK',
      });
    }
  };

  return (
    <>
      <Head>
        <title>Account Backup/Restore</title>
      </Head>
      <div
        id='container'
        className='h-full font-medium w-full max-w-4xl mx-auto px-4 py-8'
      >
        <h1 className='text-2xl mb-8 text-center'>Account Backup/Restore</h1>
        <form
          id='backup'
          method='get'
          className='w-full text-lg mb-8 grid gap-4'
          onSubmit={handleBackupSubmit}
        >
          <Input
            id='username'
            placeholder='username you want to backup'
            {...usernameInput.inputProps}
          />
          <Button
            id='submit-backup'
            spanId='submit-backup-text'
            loading={backupLoading}
          >
            Backup
          </Button>
        </form>

        <form id='restore' method='post' className='w-full  text-lg grid gap-4'>
          <Input
            id='newusername'
            placeholder='username to restore the backup to'
            {...newUsernameInput.inputProps}
          />
          <Input
            id='json'
            placeholder='get the backup above or paste it here'
            {...jsonInput.inputProps}
          />
          <Button id='submit-restore' spanId='submit-restore-text'>
            Restore
          </Button>
          <Button
            id='copy-json-btn'
            hidden={!jsonInput.inputProps.value?.length}
          >
            Copy JSON
          </Button>
        </form>
      </div>
    </>
  );
}
export default Home;
