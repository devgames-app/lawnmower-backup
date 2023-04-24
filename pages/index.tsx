import Button from '@/components/form/Button';
import Input from '@/components/form/Input';
import useInput from '@/custom-hooks/useInput';
import Head from 'next/head';

function Home() {
  const usernameInput = useInput();
  const newUsernameInput = useInput();
  const jsonInput = useInput();

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
        >
          <Input
            id='username'
            placeholder='username you want to backup'
            {...usernameInput}
          />
          <Button id='submit-backup' spanId='submit-backup-text'>
            Backup
          </Button>
        </form>
        <form id='restore' method='post' className='w-full  text-lg grid gap-4'>
          <Input
            id='newusername'
            placeholder='username to restore the backup to'
            {...newUsernameInput}
          />
          <Input
            id='json'
            placeholder='get the backup above or paste it here'
            {...jsonInput}
          />
          <Button id='submit-restore' spanId='submit-restore-text'>
            Restore
          </Button>
          <Button id='copy-json-btn' hidden={!jsonInput.value.length}>
            Copy JSON
          </Button>
        </form>
      </div>
    </>
  );
}
export default Home;
