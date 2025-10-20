import { useState } from 'react';
import { createConference } from '@/services/conferenceServices';
import { useNavigate } from '@tanstack/react-router';
import type { Conference } from './ConferenceApp';
import ConferenceForm from './ConferenceForm';
import type { User } from '@/services/userServices';

function ConferenceCreate() {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (conf: Omit<Conference, 'id'>, chairs: User[]) => {
    setError('');
    setSuccess(false);
    try {
      const data= await createConference(conf, chairs);
      setSuccess(true);
      setTimeout(() => {
        navigate({ to: `/conference/${data.id}` });
      }, 800);
    } catch (err: any) {
      setError(err.message)
    }
  };

  return (
    <div className="w-full flex flex-col items-center gap-4 mt-3">
      <ConferenceForm handleSubmit={handleSubmit} setError={setError}>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        {success && (
          <div className="text-green-600 text-sm">Guardado correctamente</div>
        )}
      </ConferenceForm>
    </div>
  );
}

export default ConferenceCreate;
