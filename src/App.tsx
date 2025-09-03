import { Button } from '@/components/ui/button';
import { fetchDummyEndpoint } from './services/dummy';
import { useState } from 'react';
import { DummyApp } from './components/dummy/DummyApp';

function App() {
  const [text, setText] = useState<string>('');

  const handleClick = async () => {
    const data = await fetchDummyEndpoint();
    setText(data.message);
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center">
      <Button onClick={handleClick}>Click me</Button>
      <p>{text}</p>
      <DummyApp />
    </div>
  );
}

export default App;
