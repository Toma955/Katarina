// src/StartScreen.js
import React, { useState, useRef, useEffect } from 'react';
import './StartScreen.css';
import backgroundImage from './PaulaD.png';
import web2Image from './Web-2.jpg';
import audioFile from './PaulaD.wav';
import lyrics from './lyrics';
import { EmailService } from './components/EmailService';

const StartScreen = ({ onStart }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isSecondFlipped, setIsSecondFlipped] = useState(false);
  const [isThirdFlipped, setIsThirdFlipped] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentLyric, setCurrentLyric] = useState('');
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isSongEnded, setIsSongEnded] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(0);
  const [showSplitButtons, setShowSplitButtons] = useState(false);
  const [showBackground, setShowBackground] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const [buttonResponse, setButtonResponse] = useState('');
  const [isBlackBackground, setIsBlackBackground] = useState(false);
  const [isInstagramStyle, setIsInstagramStyle] = useState(false);
  const [showButtons, setShowButtons] = useState(true);
  const [isNoButtonInstagram, setIsNoButtonInstagram] = useState(false);
  const [showPopis, setShowPopis] = useState(false);
  const [isPopisShown, setIsPopisShown] = useState(false);
  const [showVinylPlayer, setShowVinylPlayer] = useState(false);
  const phoneNumber = '0955709282';
  const instagramLink = 'https://www.instagram.com/dusevic_paula/';
  const audioRef = useRef(new Audio(audioFile));

  // Funkcija za kreiranje zvijezda
  const createStars = () => {
    const starsContainer = document.querySelector('.stars');
    if (starsContainer) {
      starsContainer.innerHTML = '';
      for (let i = 0; i < 100; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.animationDelay = Math.random() * 3 + 's';
        starsContainer.appendChild(star);
      }
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleStartClick = () => {
    // Track start button click
    if (window.trackEvent) {
      window.trackEvent('start_button_clicked');
    }

    if (!isFlipped) {
      // Prvi klik - prikaži sliku i tekst
      setIsFlipped(true);
      const buttonContainer = document.querySelector('.button-container');
      if (buttonContainer) {
        buttonContainer.classList.add('clicked');
      }
      const iconsContainer = document.querySelector('.icons-container');
      if (iconsContainer) {
        iconsContainer.classList.add('show-headset-indicator');
      }
          } else {
        // Drugi klik - rotiraj i prikaži vinyl player
        // Dodaj animaciju rotacije
        const welcomeBox = document.querySelector('.welcome-box');
        if (welcomeBox) {
          welcomeBox.classList.add('rotate-to-vinyl');
        }
        // Prikaži vinyl player nakon animacije s kompletnim setupom
        setTimeout(() => {
          setShowVinylPlayer(true);
          // Automatski pokreni pjesmu
          if (audioRef.current) {
            // Track auto-play event
            if (window.trackAudioEvent) {
              window.trackAudioEvent('auto_play_vinyl', {
                action: 'vinyl_auto_start',
                timestamp: new Date().toISOString()
              });
            }
            audioRef.current.play();
            setIsPlaying(true);
            console.log('🎵 Pjesma pokrenuta, audioRef.current:', audioRef.current);
            
            // Ukloni hide-vinyl klasu
            const vinylContainer = document.querySelector('.vinyl-player-container');
            if (vinylContainer) {
              vinylContainer.classList.remove('hide-vinyl');
            }
          }
        }, 800); // 0.8s = trajanje animacije
      }
  };

  const handlePlayClick = () => {
    if (audioRef.current) {
      if (audioRef.current.paused) {
        // Track play event
        if (window.trackAudioEvent) {
          window.trackAudioEvent('audio_play', {
            action: 'play_audio',
            timestamp: new Date().toISOString()
          });
        }
        audioRef.current.play();
        setIsPlaying(true);
        // Vinyl nastavlja rotaciju od trenutne pozicije
        

      } else {
        // Track pause event
        if (window.trackAudioEvent) {
          window.trackAudioEvent('audio_pause', {
            action: 'pause_audio',
            timestamp: new Date().toISOString()
          });
        }
        audioRef.current.pause();
        setIsPlaying(false);
        // Vinyl se zaustavlja na trenutnoj poziciji, ne resetira se
        

      }
    }
  };

  const handleVinylProgressClick = (e) => {
    if (audioRef.current) {
      const progressBar = e.currentTarget;
      const clickPosition = (e.clientX - progressBar.getBoundingClientRect().left) / progressBar.offsetWidth;
      const newTime = clickPosition * audioRef.current.duration;
      audioRef.current.currentTime = newTime;
      

      
      // Track vinyl progress bar click
      if (window.trackAudioEvent) {
        window.trackAudioEvent('vinyl_progress_clicked', {
          action: 'seek_vinyl_audio',
          newTime: newTime,
          duration: audioRef.current.duration,
          timestamp: new Date().toISOString()
        });
      }
    }
  };

  const handleVinylProgressDrag = (e) => {
    if (audioRef.current && e.buttons === 1) { 
      const progressBar = e.currentTarget;
      const dragPosition = (e.clientX - progressBar.getBoundingClientRect().left) / progressBar.offsetWidth;
      const newTime = dragPosition * audioRef.current.duration;
      audioRef.current.currentTime = newTime;
      

      
      // Track vinyl progress bar drag
      if (window.trackAudioEvent) {
        window.trackAudioEvent('vinyl_progress_dragged', {
          action: 'drag_vinyl_audio',
          newTime: newTime,
          duration: audioRef.current.duration,
          timestamp: new Date().toISOString()
        });
      }
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const currentTime = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      const progress = (duration > 0) ? (currentTime / duration) * 100 : 0;
      
      setCurrentTime(currentTime);
      setDuration(duration);
      setProgress(progress);



      // Check if song has ended
      if (currentTime >= duration) {
        // Track song end
        if (window.trackAudioEvent) {
          window.trackAudioEvent('song_ended', {
            action: 'song_completed',
            duration: duration,
            timestamp: new Date().toISOString()
          });
        }
        
        setIsSongEnded(true);
        setIsPlaying(false);
        audioRef.current.pause();
        

        

        
        // Fade out progress bar with animation
        const progressContainer = document.querySelector('.progress-container');
        if (progressContainer) {
          progressContainer.style.animation = 'fadeOut 5s ease-in-out forwards';
          setTimeout(() => {
            progressContainer.classList.add('fade-out');
          }, 5000);
        }

        // Change text after progress bar fades out
        setTimeout(() => {
          setCurrentMessage(1);
        }, 5000);
      }
      
      // Show popis at 11 seconds instead of lyrics
      if (currentTime >= 11.0 && currentTime < 12.0 && !isPopisShown) {
        setIsPopisShown(true);
        setShowPopis(true);
      }
      
      // Hide popis at 4 minutes and 9 seconds (249 seconds)
      if (currentTime >= 249.0 && showPopis) {
        setShowPopis(false);
      }

      // Find current lyric based on time
      console.log('🔍 Tražim lyrics za vrijeme:', currentTime, 's');
      const foundLyric = lyrics.find((lyric, index) => {
        const nextLyric = lyrics[index + 1];
        const shouldShow = currentTime >= lyric.time && (!nextLyric || currentTime < nextLyric.time);
        console.log(`📝 Lyrics ${index}: ${lyric.text} (${lyric.time}s) - prikazati: ${shouldShow}`);
        return shouldShow;
      });
      
      if (foundLyric) {
        console.log('✅ Pronađen lyrics:', foundLyric.text, 'za vrijeme:', currentTime, 's');
        // Track lyric change
        if (window.trackAudioEvent) {
          window.trackAudioEvent('lyric_changed', {
            action: 'lyric_displayed',
            lyric: foundLyric.text,
            time: currentTime,
            timestamp: new Date().toISOString()
          });
        }
        setCurrentLyric(foundLyric.text);
      } else {
        console.log('❌ Nema lyrics za vrijeme:', currentTime, 's');
        setCurrentLyric(''); // Očisti lyrics kada nema trenutnog
      }
    }
  };

  const handleProgressBarClick = (e) => {
    if (audioRef.current) {
      const progressBar = e.currentTarget;
      const clickPosition = (e.clientX - progressBar.getBoundingClientRect().left) / progressBar.offsetWidth;
      const newTime = clickPosition * audioRef.current.duration;
      audioRef.current.currentTime = newTime;
      
      // Track progress bar click
      if (window.trackAudioEvent) {
        window.trackAudioEvent('progress_bar_clicked', {
          action: 'seek_audio',
          newTime: newTime,
          duration: audioRef.current.duration,
          timestamp: new Date().toISOString()
        });
      }
    }
  };

  const handleProgressBarDrag = (e) => {
    if (audioRef.current && e.buttons === 1) { 
      const progressBar = e.currentTarget;
      const dragPosition = (e.clientX - progressBar.getBoundingClientRect().left) / progressBar.offsetWidth;
      const newTime = dragPosition * audioRef.current.duration;
      audioRef.current.currentTime = newTime;
      
      // Track progress bar drag
      if (window.trackAudioEvent) {
        window.trackAudioEvent('progress_bar_dragged', {
          action: 'drag_audio',
          newTime: newTime,
          duration: audioRef.current.duration,
          timestamp: new Date().toISOString()
        });
      }
    }
  };

  const handleNextClick = () => {
    if (currentMessage === 0) {
      // Track next message
      if (window.trackAudioEvent) {
        window.trackAudioEvent('next_message', {
          action: 'message_1',
          timestamp: new Date().toISOString()
        });
      }
      
      // Move circle to info icon
      const iconsContainer = document.querySelector('.icons-container');
      if (iconsContainer) {
        iconsContainer.classList.add('show-info-indicator');
      }
      
      // Dodaj animaciju sakrivanja vinyl player-a
      const vinylContainer = document.querySelector('.vinyl-player-container');
      if (vinylContainer) {
        vinylContainer.classList.add('hide-vinyl');
      }
      
      // Ukloni sve elemente reprodukcije pjesme nakon animacije
      setTimeout(() => {
        setShowVinylPlayer(false);
        setCurrentLyric('');
        setIsPlaying(false);
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        }
        
        // Resetiraj progress i vrijeme
        setProgress(0);
        setCurrentTime(0);
        setDuration(0);
        setIsSongEnded(false);
        setShowPopis(false);
        setIsPopisShown(false);
        
        // Ukloni rotate-to-vinyl klasu s welcome box-a da se može vratiti
        const welcomeBox = document.querySelector('.welcome-box');
        if (welcomeBox) {
          welcomeBox.classList.remove('rotate-to-vinyl');
        }
        
        // Nastavi s normalnim flow-om aplikacije
        setCurrentMessage(1);
        setDisplayedText(renderMessageContent(1));
      }, 800); // 0.8s animacija
    } else if (currentMessage === 1) {
      // Track next message
      if (window.trackAudioEvent) {
        window.trackAudioEvent('next_message', {
          action: 'message_2',
          timestamp: new Date().toISOString()
        });
      }
      
      // Move circle to question mark icon
      const iconsContainer = document.querySelector('.icons-container');
      if (iconsContainer) {
        iconsContainer.classList.add('show-question-indicator');
      }
      
      setIsTransitioning(true);
      
      const welcomeText = document.querySelector('.welcome-text');
      const welcomeBox = document.querySelector('.welcome-box');
      if (welcomeText && welcomeBox) {
        welcomeText.classList.add('fade-out');
        welcomeBox.classList.add('shrink');
      }
      
      const mainButton = document.querySelector('.start-button');
      if (mainButton) {
        // Track split buttons shown
        if (window.trackAudioEvent) {
          window.trackAudioEvent('split_buttons_shown', {
            action: 'final_choice_presented',
            timestamp: new Date().toISOString()
          });
        }
        
        mainButton.classList.add('rotated');
        setShowSplitButtons(true);
        setShowBackground(true);
      }
      
      // Track background shown
      if (window.trackAudioEvent) {
        window.trackAudioEvent('background_shown', {
          action: 'background_image_displayed',
          timestamp: new Date().toISOString()
        });
      }
      
      setTimeout(() => {
        setIsSecondFlipped(true);
        setTimeout(() => {
          setCurrentMessage(2);
          setDisplayedText(renderMessageContent(2));
          setIsTransitioning(false);
          if (welcomeText) {
            welcomeText.classList.remove('fade-out');
          }
        }, 400);
      }, 800);
    } else if (currentMessage === 2) {
      // Track next message
      if (window.trackAudioEvent) {
        window.trackAudioEvent('next_message', {
          action: 'message_3',
          timestamp: new Date().toISOString()
        });
      }
      
      setIsThirdFlipped(true);
      setTimeout(() => {
        setCurrentMessage(3);
        setDisplayedText(renderMessageContent(3));
      }, 400);
    }
  };

  const handleButtonClick = (isYes) => {
    if (isYes) {
      // Track positive response
      if (window.trackAudioEvent) {
        window.trackAudioEvent('positive_response', {
          action: 'user_agreed',
          timestamp: new Date().toISOString()
        });
      }
      
      // Send email notification
      console.log('StartScreen - Sending positive response email...');
      console.log('StartScreen - Calling EmailService.sendUserResponse(true)...');
      
      EmailService.sendUserResponse(true)
        .then(result => {
          console.log('StartScreen - Email uspješno poslan! Rezultat:', result);
          if (result.success) {
            console.log('StartScreen - ✅ Email status: SUCCESS - Mail je poslan!');
          } else {
            console.log('StartScreen - ❌ Email status: FAILED - Mail nije poslan!');
            console.log('StartScreen - Razlog:', result.message);
          }
        })
        .catch(error => {
          console.error('StartScreen - 💥 Email error caught:', error);
          console.error('StartScreen - Error message:', error.message);
          console.error('StartScreen - Error stack:', error.stack);
        });
      
              setButtonResponse(`Hvala ti! Javi se na WhatsApp ili nastavljamo pričat na Instagramu`);
      setIsInstagramStyle(true);
      setIsNoButtonInstagram(true);
    } else {
      if (isNoButtonInstagram) {
        // Track Instagram click
        if (window.trackAudioEvent) {
          window.trackAudioEvent('instagram_clicked', {
            action: 'instagram_redirect',
            link: instagramLink,
            timestamp: new Date().toISOString()
          });
        }
        window.open(instagramLink, '_blank');
      } else {
        // Track negative response
        if (window.trackAudioEvent) {
          window.trackAudioEvent('negative_response', {
            action: 'user_declined',
            timestamp: new Date().toISOString()
          });
        }
        
        // Send email notification
        console.log('StartScreen - Sending negative response email...');
        console.log('StartScreen - Calling EmailService.sendUserResponse(false)...');
        
        EmailService.sendUserResponse(false)
          .then(result => {
            console.log('StartScreen - Email uspješno poslan! Rezultat:', result);
            if (result.success) {
              console.log('StartScreen - ✅ Email status: SUCCESS - Mail je poslan!');
            } else {
              console.log('StartScreen - ❌ Email status: FAILED - Mail nije poslan!');
              console.log('StartScreen - Razlog:', result.message);
            }
          })
          .catch(error => {
            console.error('StartScreen - 💥 Email error caught:', error);
            console.error('StartScreen - Error message:', error.message);
            console.error('StartScreen - Error stack:', error.stack);
          });
        
        setButtonResponse('Oprosti na smetnji');
        setIsBlackBackground(true);
        setShowButtons(false);
      }
    }
  };

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(phoneNumber).then(() => {
      // Track successful copy
      if (window.trackAudioEvent) {
        window.trackAudioEvent('number_copied', {
          action: 'phone_number_copied',
          timestamp: new Date().toISOString()
        });
      }
      setButtonResponse('Broj je kopiran! Možeš ga sada zalijepiti u WhatsApp');
    }).catch(err => {
      // Track copy error
      if (window.trackAudioEvent) {
        window.trackAudioEvent('copy_error', {
          action: 'phone_number_copy_failed',
          error: err.message,
          timestamp: new Date().toISOString()
        });
      }
      setButtonResponse('Greška pri kopiranju broja. Pokušaj ponovno.');
    });
  };

  const renderMessageContent = (messageType) => {
    switch(messageType) {
      case 0:
        return (
          <h1 className="welcome-text">
            Ova je pjesma napisana i kreirana<br/>
            <span className="highlight">samo za tebe.</span><br/>
            Originalna je, nigdje ne postoji<br/>
            i samo je <span className="highlight">Tvoja.</span>
          </h1>
        );
      case 1:
        return (
          <div className="welcome-text">
            <p>...ono što mi je kod tebe <span className="highlight">fascinantno</span> je tvoj ukus u modi, u obrazovanju, u umjetnosti življenja... zato možeš biti <span className="highlight">Ambasadorica čovječanstva</span>...</p>
            <p>Ali ono što mi je <span className="highlight">posebno</span> kod tebe fascinantno je mogućnost da se sa tobom može uspjeti na svakom planu, posebno poslovnom, i mislim da možemo spojiti <span className="highlight">IT i Pravo</span>...</p>
          </div>
        );
      case 2:
        return (
          <div className="welcome-text">
            <p>Pogledaj koliko si <span className="highlight">savršena</span>,</p>
            <p>sve što želim je vidjeti te <span className="highlight">uživo</span>...</p>
            <p>...ako si za...</p>
          </div>
        );
      case 3:
        return (
          <div className="welcome-text">
            <p>Svi naljepši <span className="highlight">ljubavni filmovi</span> i pjesme su napisane tek nakon što si se rodila...</p>
            <p>Ja ne vjerujem u <span className="highlight">slučajnost</span>...</p>
          </div>
        );
      default:
        return null;
    }
  };

  useEffect(() => {
    if (isFlipped) {
      const audio = audioRef.current;
      
      // Track audio loaded
      if (window.trackAudioEvent) {
        window.trackAudioEvent('audio_loaded', {
          action: 'audio_file_ready',
          duration: audio.duration,
          timestamp: new Date().toISOString()
        });
      }
      
      // Dodaj event listener na audioRef.current umjesto na audio varijablu
      if (audioRef.current) {
        audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
        console.log('🎵 Event listener dodan na audioRef.current');
      }
      audio.addEventListener('error', (e) => {
        // Track audio error
        if (window.trackAudioEvent) {
          window.trackAudioEvent('audio_error', {
            action: 'audio_playback_error',
            error: e.message || 'Unknown error',
            timestamp: new Date().toISOString()
          });
        }
      });
      
      return () => {
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('error', () => {});
      };
    }
  }, [isFlipped]);

  useEffect(() => {
    setDisplayedText(renderMessageContent(currentMessage));
  }, [currentMessage]);

  // useEffect za kreiranje zvijezda
  useEffect(() => {
    createStars();
  }, []);

  // useEffect za tracking device orientation
  useEffect(() => {
    const handleOrientationChange = () => {
      if (window.trackAudioEvent) {
        window.trackAudioEvent('orientation_changed', {
          action: 'device_orientation_changed',
          orientation: window.orientation || 'unknown',
          timestamp: new Date().toISOString()
        });
      }
    };

    window.addEventListener('orientationchange', handleOrientationChange);
    
    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);

  return (
    <div className="start-screen">
      {/* Svemirska pozadina s zvijezdama */}
      <div className="stars"></div>
      <div className="icons-container">
        <div className="icon-item">
          <i className="fa-solid fa-play"></i>
        </div>
        <div className="icon-item">
          <i className="fa-solid fa-headphones"></i>
        </div>
        <div className="icon-item">
          <i className="fa-solid fa-circle-info"></i>
        </div>
        <div className="icon-item">
          <i className="fa-solid fa-circle-question"></i>
        </div>
      </div>
      <div className="landscape-warning">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white">
          <path d="M16.48 2.52c3.27 1.55 5.61 4.72 5.97 8.48h1.5C23.44 4.84 18.29 0 12 0l-.66.03 3.81 3.81 1.33-1.32zm-6.25-.77c-.59-.59-1.54-.59-2.12 0L1.75 8.11c-.59.59-.59 1.54 0 2.12l12.02 12.02c.59.59 1.54.59 2.12 0l6.36-6.36c.59-.59.59-1.54 0-2.12L10.23 1.75zm4.6 19.44L2.81 9.17l6.36-6.36 12.02 12.02-6.36 6.36zm-7.31.29C4.25 19.94 1.91 16.76 1.55 13H.05C.56 19.16 5.71 24 12 24l.66-.03-3.81-3.81-1.33 1.32z"/>
        </svg>
        <p>Molimo okrenite uređaj u vertikalni položaj za najbolje iskustvo</p>
      </div>
      {showBackground && (
        <div 
          className="background-image" 
          style={{ 
            backgroundImage: isBlackBackground ? 'none' : (showSplitButtons ? `url(${web2Image})` : `url(${backgroundImage})`),
            backgroundColor: isBlackBackground ? 'black' : 'transparent'
          }} 
        />
      )}
      {!showSplitButtons && !showVinylPlayer && (
        <div className={`welcome-box ${isFlipped ? 'flipped' : ''} ${isSecondFlipped ? 'second-flipped' : ''} ${isThirdFlipped ? 'third-flipped' : ''}`}>
          <div className="welcome-box-inner">
            <div className="welcome-box-front">
              <h1 className="welcome-text">
                Dobrodošla u Tvoj svemir<br/>
                <span className="highlight">mis. Paula</span><br/>
                ...u WebApp<br/>
                stvorenu za tebe,<br/>
                potpuno inspiriranu tobom...<br/><br/>
                ...mislio sam da zaslužuješ<br/>
                nešto unikatno i čarobno...<br/><br/>
                Nadam se da imaš slušalice<br/>
                i da si spremna za putovanje?<br/><br/>
              </h1>
            </div>
            <div className="welcome-box-back" style={{ backgroundImage: `url(${backgroundImage})` }}>
              <div className="welcome-text-overlay">
                {!isTransitioning && displayedText}
                {currentLyric && !isSongEnded && !showPopis && (
                  <div className="lyrics-container">
                    <div className="lyrics-display">
                      {currentLyric}
                    </div>
                  </div>
                )}
                
                {showPopis && (
                  <div className="popis-container">
                    <div className="popis-title">Ona stvarna ti</div>
                    <div className="popis-content">
                      <div className="popis-item">Svima kažeš „ne", jer lakše je tako, znam.</div>
                      <div className="popis-item">Ono što nije bio ni početak, tvojim je potezom postao kraj.</div>
                      <div className="popis-item">Znam da nisam tvoj svijet, al' neću samo proći kraj.</div>
                      <div className="popis-item">Oko tebe leden zid od tajni, a ja bih samo tvoj topli zagrljaj.</div>
                      <div className="popis-item">Jedan iskren i stvaran.</div>
                      <div className="popis-item">Hoćeš li mi pokazati tajni svijet ispod maske?</div>
                      <div className="popis-item">Hoćeš li pustiti da te sloboda dotakne?</div>
                      <div className="popis-item">Zaslužuješ osmijeh iskren i pravi,</div>
                      <div className="popis-item">Skini sve što skrivaš,</div>
                      <div className="popis-item">Želim znati tko si ispod svega, tko si stvarna ti.</div>
                      <div className="popis-item">Ona stvarna ti.</div>
                      <div className="popis-item">Predugo operu sama sviraš, znam da te to ne dodirne,</div>
                      <div className="popis-item">al' ja neću samo gledat', doći ću i probat' sve.</div>
                      <div className="popis-item">Jer želim znat' tko si stvarna ti.</div>
                      <div className="popis-item">Hoćeš li mi pokazati puteve do snova?</div>
                      <div className="popis-item">Hoćeš li mi pokazati sjaj, da te u tami pronađem?</div>
                      <div className="popis-item">Skini taj ponos s lica.</div>
                      <div className="popis-item">Skini strah iz pogleda.</div>
                      <div className="popis-item">Jer želim saznat' tko si ona stvarna ti.</div>
                      <div className="popis-item">I nitko te ne dodirne, al' ja neću samo gledat',</div>
                      <div className="popis-item">doći ću i probat' sve, radije nestat nego se predat.</div>
                      <div className="popis-item">Penjem se do tvojih visina, ako nestaneš – nestajem s tobom.</div>
                      <div className="popis-item">Ne bojim se leta s visina, već da bez tebe ostanem sam sa sobom.</div>
                      <div className="popis-item">Hoćeš li mi pokazat' tko si ispod tuge?</div>
                      <div className="popis-item">Ispod smijeha, ispod šutnje – ona stvarna ti?</div>
                      <div className="popis-item">Skini sve što te dijeli, Pokaži mi gdje boli,</div>
                      <div className="popis-item">Želim znat' tko si ona stvarna ti.</div>
                      <div className="popis-item">(Ona stvarna ti.)</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {showVinylPlayer && (
        <div className="vinyl-player-container">
          <div 
            className={`vinyl-record ${isPlaying ? 'spinning' : ''}`}
            onClick={handlePlayClick}
          />
          
          <div className="vinyl-progress-container">
            <span className="vinyl-time-display">{formatTime(currentTime)}</span>
            <div 
              className="vinyl-progress-bar"
              onClick={handleVinylProgressClick}
              onMouseMove={handleVinylProgressDrag}
              style={{ cursor: 'pointer' }}
            >
              <div 
                className="vinyl-progress-fill" 
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="vinyl-time-display">{formatTime(duration)}</span>
          </div>

          {currentLyric && !isSongEnded && (
            <div className="vinyl-lyrics-display">
              {currentLyric}
            </div>
          )}

          

        </div>
      )}

      {showSplitButtons && !buttonResponse && (
        <div className="final-message">
          Ovo je moja malenkost i moja jedina životna želja vidjeti te uživo...
        </div>
      )}

      {buttonResponse && (
        <div className="button-response">
          {buttonResponse}
        </div>
      )}

      {isFlipped && !isSongEnded && (
        <div className={`progress-container ${isSongEnded ? 'fade-out' : ''}`}>
          <span className="time-display">{formatTime(currentTime)}</span>
          <div 
            className="progress-bar"
            onClick={handleProgressBarClick}
            onMouseMove={handleProgressBarDrag}
            style={{ cursor: 'pointer' }}
          >
            <div 
              className="progress-fill" 
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="time-display">{formatTime(duration)}</span>
        </div>
      )}

      {showButtons && (
        <div className="button-container">
          {!showSplitButtons && (
            <button 
              className={`start-button ${isFlipped ? 'playing' : ''}`} 
              onClick={isFlipped ? (showVinylPlayer ? (isSongEnded ? handleNextClick : handlePlayClick) : (currentMessage === 0 ? handleStartClick : handleNextClick)) : handleStartClick}
            >
              {isFlipped ? (isPlaying ? 'Pauza' : (isSongEnded ? 'Dalje' : (showVinylPlayer ? 'Pokreni' : (currentMessage === 0 ? 'Reproduciraj pjesmu' : 'Dalje')))) : 'Spremna sam za putovanje!'}
            </button>
          )}
          {showSplitButtons && (
            <>
              <button 
                className={`start-button split left ${isInstagramStyle ? 'instagram-style' : ''}`} 
                onClick={isInstagramStyle ? handleCopyNumber : () => handleButtonClick(true)}
              >
                {isInstagramStyle ? 'Kopiraj' : 'Može!'}
              </button>
              <button 
                className={`start-button split right ${isNoButtonInstagram ? 'instagram-style' : ''}`} 
                onClick={() => handleButtonClick(false)}
              >
                {isNoButtonInstagram ? 'Natrag na Instagram' : 'Ne, hvala'}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default StartScreen;