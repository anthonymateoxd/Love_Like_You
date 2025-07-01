import { useState, useEffect, useRef } from 'react';
import '../styles/Love_Like_You.css';
import audioFile from '../Music/Love_Like_You_Rebecca Sugar.mp3';

function Love_Like_You() {
  const lyrics = [
    { text: '', start: 0.0, end: 6.5 },
    { text: 'If I could begin to be', start: 6.6, end: 9.6 },
    { text: 'Half of what you think of me', start: 9.7, end: 12.5 },
    { text: 'I could do about anything', start: 12.6, end: 14.7 },
    { text: 'I could even learn how to love', start: 14.8, end: 18.7 },
    { text: 'When I see the way you act', start: 18.8, end: 22.0 },
    { text: "Wondering when I'm coming back", start: 22.1, end: 24.7 },
    { text: 'I could do about anything', start: 24.8, end: 27.1 },
    { text: 'I could even learn how to love like you', start: 27.2, end: 32.3 },
    { text: '', start: 32.3, end: 40.7 },
    { text: 'Love like you', start: 40.8, end: 44.8 },
    { text: '', start: 44.9, end: 54.0 },
    { text: 'I always thought I might be bad', start: 54.0, end: 57.3 },
    { text: "Now I'm sure that it's true", start: 57.4, end: 60.4 },
    { text: "'Cause I think you're so good", start: 60.5, end: 64.0 },
    { text: "And I'm nothing like you", start: 64.1, end: 66.4 },
    { text: 'Look at you go', start: 66.6, end: 68.0 },
    { text: 'I just adore you', start: 68.1, end: 70.0 },
    { text: 'I wish that I knew', start: 70.1, end: 73.0 },
    { text: "What makes you think I'm so special", start: 73.1, end: 79.5 },
    { text: 'If I could begin to do', start: 79.6, end: 83.0 },
    { text: 'Something that does right by you', start: 83.1, end: 86.7 },
    { text: 'I would do about anything', start: 86.8, end: 89.0 },
    { text: 'I would even learn how to love', start: 89.1, end: 93.1 },
    // --- NUEVAS LÍNEAS (FINAL DE LA CANCIÓN) ---
    { text: '', start: 93.2, end: 97.1 },
    { text: 'When I see the way you look', start: 97.2, end: 100.9 },
    { text: 'Shaken by how long it took', start: 101.0, end: 103.8 },
    { text: 'I could do about anything', start: 103.9, end: 105.9 },
    {
      text: 'I could even learn how to love like you',
      start: 106.0,
      end: 110.8,
    },
    { text: '', start: 110.8, end: 114.3 }, // Pausa antes del último "Love like you"
    { text: 'Love like you', start: 114.4, end: 116.8 }, // Último verso
    { text: '', start: 116.9, end: 119.9 }, // Pausa antes del último "Love like you"
    { text: 'Love me like you', start: 120.0, end: 123.6 }, // Final
    { text: '', start: 123.7, end: 140.0 }, // Pausa antes del último "Love like you"
  ];

  const [currentLine, setCurrentLine] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [correctChars, setCorrectChars] = useState(0);
  const [completedLines, setCompletedLines] = useState([]);
  const [mistake, setMistake] = useState(false);
  const [linePositions, setLinePositions] = useState([0, 40]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const audioRef = useRef(null);
  const timeoutRef = useRef(null);
  const [showCongratulations, setShowCongratulations] = useState(false);

  // Efecto para manejar la reproducción cuando cambia la
  useEffect(() => {
    if (hasStarted && audioRef.current) {
      // ← Añadí verificación de audioRef.current
      // Precargar el audio si es la primera vez
      if (currentLine === 0 && !audioRef.current.currentTime) {
        audioRef.current.src = audioFile;
        audioRef.current.load();
      }
      playCurrentLine();
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [currentLine, hasStarted]);

  const playCurrentLine = () => {
    if (!audioRef.current || currentLine >= lyrics.length) return;

    const line = lyrics[currentLine];

    // Limpiar timeout anterior
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Reproducir desde el inicio de la línea actual
    audioRef.current.currentTime = line.start;
    audioRef.current.play();
    setIsPlaying(true);

    const lineDuration = (line.end - line.start) * 1000;

    if (!audioRef.current || currentLine >= lyrics.length) return;

    // Verificar si es la última línea
    if (currentLine === lyrics.length - 1) {
      const lineDuration = (line.end - line.start) * 1000;
      timeoutRef.current = setTimeout(() => {
        setShowCongratulations(true);
        audioRef.current.pause();
        setIsPlaying(false);
      }, lineDuration);
      return;
    }

    // LÓGICA ESPECIAL SOLO PARA LA PRIMERA LÍNEA (0.0-6.5s)
    if (currentLine === 0 && line.text.trim() === '') {
      timeoutRef.current = setTimeout(() => {
        // No pausar, solo avanzar inmediatamente
        setCurrentLine(1);
        playCurrentLine(); // Reproducir línea 1 sin delay
      }, lineDuration);
    }
    // LÓGICA ORIGINAL PARA TODAS LAS DEMÁS LÍNEAS (COMO TU FUNCIÓN)
    else {
      timeoutRef.current = setTimeout(() => {
        audioRef.current.pause();
        setIsPlaying(false);

        timeoutRef.current = setTimeout(() => {
          audioRef.current.pause();
          setIsPlaying(false);

          if (line.text.trim() === '' && currentLine < lyrics.length - 1) {
            setCurrentLine(prev => prev + 1);
            playCurrentLine();
          }
        }, lineDuration);
      }, lineDuration);
    }
  };

  const handleMistake = () => {
    setMistake(true);
    setUserInput('');
    setCorrectChars(0);

    if (lyrics[currentLine].text.trim() !== '') {
      playCurrentLine();
    }
  };

  const advanceToNextLine = () => {
    setLinePositions([linePositions[0] - 40, linePositions[1] - 40]);

    setTimeout(() => {
      setCompletedLines([...completedLines, currentLine]);
      setCurrentLine(prev => {
        const nextLine = prev + 1;
        // Si la siguiente línea está vacía, avanzar automáticamente
        if (nextLine < lyrics.length && lyrics[nextLine].text.trim() === '') {
          setTimeout(() => {
            setCurrentLine(nextLine + 1);
          }, (lyrics[nextLine].end - lyrics[nextLine].start) * 1000);
          return nextLine;
        }
        return nextLine;
      });
      setUserInput('');
      setCorrectChars(0);
      setMistake(false);
      setLinePositions([0, 40]);
    }, 300);
  };

  // Efecto para verificar el texto ingresado
  useEffect(() => {
    if (!hasStarted || currentLine >= lyrics.length) return;

    const targetLine = lyrics[currentLine].text.toLowerCase().trim();
    const inputText = userInput.toLowerCase().trim();

    // Ignorar líneas vacías
    if (targetLine === '') return;

    if (inputText === targetLine) {
      advanceToNextLine();
    } else if (!targetLine.startsWith(inputText)) {
      handleMistake();
    } else {
      setCorrectChars(userInput.length);
      setMistake(false);
    }
  }, [userInput, currentLine, hasStarted]);

  const handleStart = () => {
    setHasStarted(true);
    setCurrentLine(0); // Asegurarse de empezar desde la primera línea
  };

  const handleInputChange = e => {
    if (!hasStarted) return;

    if (mistake) {
      setUserInput('');
      setCorrectChars(0);
      setMistake(false);
    } else {
      setUserInput(e.target.value);
    }
  };

  const handleKeyDown = e => {
    if (!hasStarted) return;

    if (e.key === 'Enter' && mistake) {
      setUserInput('');
      setCorrectChars(0);
      setMistake(false);
      if (lyrics[currentLine].text.trim() !== '') {
        playCurrentLine();
      }
    }
  };

  const getCharClass = charIndex => {
    if (charIndex < correctChars) return 'correct';
    if (mistake && charIndex >= correctChars) return 'error';
    return '';
  };

  return (
    <div className='love-like-you-container'>
      <h1>Love Like You</h1>
      <h2>Practice Typing the Lyrics</h2>
      {showCongratulations && (
        <div className='congratulations-message'>
          ¡Congratulations! You completed the song!
        </div>
      )}
      {!hasStarted ? (
        <div className='start-screen'>
          <button
            className='start-button'
            onClick={handleStart}
          >
            Start
          </button>
        </div>
      ) : (
        <>
          <div className='lyrics-display'>
            {currentLine > 0 && (
              <div
                className='lyric-line completed'
                style={{ transform: `translateY(${linePositions[0]}px)` }}
              >
                {lyrics[currentLine - 1].text}
              </div>
            )}

            <div
              className='lyric-line current'
              style={{ transform: `translateY(${linePositions[1]}px)` }}
            >
              {lyrics[currentLine]?.text.split('').map((char, charIndex) => (
                <span
                  key={charIndex}
                  className={getCharClass(charIndex)}
                >
                  {char}
                </span>
              ))}
            </div>
          </div>

          <div className='input-section'>
            <input
              type='text'
              value={userInput}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={
                mistake
                  ? 'Press Enter to try again'
                  : 'Type the current line...'
              }
              className={mistake ? 'error-input' : ''}
              autoFocus
              disabled={lyrics[currentLine]?.text.trim() === '' || !hasStarted}
            />
            {mistake && (
              <div className='error-message'>
                Oops! Try again from the beginning of this line.
              </div>
            )}
          </div>

          <div className='progress'>
            Progress: {completedLines.length} /{' '}
            {lyrics.filter(line => line.text !== '').length} lines
          </div>

          <audio
            ref={audioRef}
            src={audioFile}
            onEnded={() => setIsPlaying(false)}
          />

          <div className='audio-controls'>
            <button
              onClick={() => {
                if (isPlaying) {
                  audioRef.current.pause();
                  setIsPlaying(false);
                } else {
                  playCurrentLine();
                }
              }}
            >
              {isPlaying ? 'Pause' : 'Play'}
            </button>
            <button
              onClick={() => {
                if (audioRef.current) {
                  audioRef.current.currentTime = lyrics[currentLine].start;
                  playCurrentLine();
                }
              }}
            >
              Replay Current Line
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Love_Like_You;
