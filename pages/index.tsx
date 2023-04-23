import Button from '@/components/form/Button';
import Input from '@/components/form/Input';

export default function Home() {
  return (
    <div className=''>
      <h1 className='text-2xl mb-8 text-center'>Account Backup/Restore</h1>
      <form id='backup' method='get' className='w-full space-y-6 text-lg mb-12'>
        <div>
          <input
            type='text'
            name='username'
            id='username'
            className='block w-full border px-6 py-4 rounded-full focus:outline-none'
            placeholder='username you want to backup'
            required
          />
        </div>
        <div className='mt-4'>
          <Button id='submit-backup' spanId='submit-backup-text'>
            Backup
          </Button>
        </div>
      </form>
      <form id='restore' method='post' className='w-full space-y-6 text-lg'>
        <div>
          <Input
            id='newusername'
            placeholder='username to restore the backup to'
          />
          <Input
            id='json'
            placeholder='get the backup above or paste it here'
          />
        </div>
        <div className='mt-4'>
          <Button id='submit-restore' spanId='submit-restore-text'>
            Restore
          </Button>
        </div>
        <div id='copy-btn-container' className='mt-4 hidden'>
          <Button id='copy-json-btn'>Copy JSON</Button>
        </div>
      </form>
    </div>
  );
}
