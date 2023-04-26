import useInput from '@/custom-hooks/useInput';
import Head from 'next/head';
import BackupForm from '@/components/form/BackupForm';
import RestoreForm from '@/components/form/RestoreForm';

function Home() {
  const jsonInput = useInput();

  return (
    <>
      <Head>
        <title>Account Backup/Restore</title>
      </Head>
      <div className='h-full font-medium w-full max-w-4xl mx-auto px-4 py-8 grid gap-4'>
        <h1 className='text-2xl mb-4 text-center'>Account Backup/Restore</h1>
        <BackupForm jsonInput={jsonInput} />
        <RestoreForm jsonInput={jsonInput} />
      </div>
    </>
  );
}
export default Home;
