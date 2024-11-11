export const BlinkAnimation = ({
  active,
  children,
}: {
  active: boolean;
  children: React.ReactNode;
}) => {
  const style = `
  @keyframes pulse {
    0% {
      transform: scale(1);
      box-shadow: 0 10px 20px rgba(214, 40, 40, 0.3);
    }
    50% {
      transform: scale(1.13);
      box-shadow: 0 15px 30px rgba(214, 40, 40, 0.4);
    }
    100% {
      transform: scale(1);
      box-shadow: 0 10px 20px rgba(214, 40, 40, 0.3);
    }
  }

  .red-ball {
    border-radius: 50%;
    background: radial-gradient(circle at 30% 30%, #FF4040, #B80000);
    box-shadow: 0 10px 20px rgba(214, 40, 40, 0.3);
    margin: 10px auto;
    animation: pulse 2s infinite ease-in-out;
    width: 60px;
    height: 60px;
  }`;

  if (!active) {
    return <div className="flex justify-center"><div className="red-ball" /></div>;
  }

  return (
    <>
      <style>{style}</style>
      <div className="flex justify-center">
        <div className="red-ball" style={{ animation: 'pulse 2s infinite ease-in-out' }} />
      </div>
    </>
  );
};
