import React, { useRef, useState, useEffect } from 'react';

interface OTPInputProps {
  length?: number;
  onComplete: (otp: string) => void;
  disabled?: boolean;
}

const OTPInput: React.FC<OTPInputProps> = ({ length = 6, onComplete, disabled = false }) => {
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Focus next
    if (value && index < length - 1 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }

    // Trigger onComplete
    const combinedOtp = newOtp.join('');
    if (combinedOtp.length === length) {
      onComplete(combinedOtp);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0 && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const data = e.clipboardData.getData('text').slice(0, length);
    if (/^\d+$/.test(data)) {
      const newOtp = data.split('');
      const paddedOtp = [...newOtp, ...new Array(length - newOtp.length).fill('')];
      setOtp(paddedOtp);
      if (newOtp.length === length) {
        onComplete(data);
      }
      // Focus last filled or next empty
      const nextIndex = Math.min(newOtp.length, length - 1);
      inputRefs.current[nextIndex]?.focus();
    }
  };

  return (
    <div className="otp-container" style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
      {otp.map((digit, index) => (
        <input
          key={index}
          ref={(el) => { inputRefs.current[index] = el; }}
          type="text"
          maxLength={1}
          value={digit}
          disabled={disabled}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          style={{
            width: '45px',
            height: '55px',
            fontSize: '24px',
            fontWeight: 'bold',
            textAlign: 'center',
            borderRadius: '8px',
            border: '2px solid rgba(148,163,184,0.3)',
            backgroundColor: 'rgba(255,255,255,0.05)',
            color: '#fff',
            outline: 'none',
            transition: 'all 0.2s ease',
          }}
          onFocus={(e) => (e.target.style.borderColor = '#2563eb')}
          onBlur={(e) => (e.target.style.borderColor = 'rgba(148,163,184,0.3)')}
        />
      ))}
    </div>
  );
};

export default OTPInput;
