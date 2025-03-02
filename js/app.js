document.addEventListener('DOMContentLoaded', function() {
    const tineContainer = document.getElementById('tines');
    const toggleGuideBtn = document.getElementById('toggleGuide');
    const keyGuide = document.getElementById('keyGuide');
    const recordBtn = document.getElementById('recordBtn');
    const playbackBtn = document.getElementById('playbackBtn');
    
    // All notes in a single continuous layout
    const notes = [
        // Combined notes in a single array (20 notes)
        { note: 'C3', key: 'A' },
        { note: 'D3', key: 'Z' },
        { note: 'E3', key: 'E' },
        { note: 'F3', key: 'R' },
        { note: 'G3', key: 'T' },
        { note: 'A3', key: 'Q' },
        { note: 'B3', key: 'S' },
        { note: 'C4', key: 'D' },
        { note: 'D4', key: 'F' },
        { note: 'E4', key: 'G' },
        { note: 'F4', key: 'Y' },
        { note: 'G4', key: 'U' },
        { note: 'A4', key: 'I' },
        { note: 'B4', key: 'O' },
        { note: 'C5', key: 'P' },
        { note: 'D5', key: 'H' },
        { note: 'E5', key: 'J' },
        { note: 'F5', key: 'K' },
        { note: 'G5', key: 'L' },
        { note: 'A5', key: 'M' },
    ];
    
    // Recording vars
    let isRecording = false;
    let recordedNotes = [];
    let startTime;
    
    // Audio elements
    const audioElements = {};
    
    // Create tines in a single continuous group
    const containerWidth = tineContainer.offsetWidth;
    const containerHeight = tineContainer.offsetHeight;
    const totalTines = notes.length;
    const tineWidth = 36;  // 3x bigger as requested
    const spacing = 12;    // Increased spacing for larger tines
    
    // Calculate total width needed
    const totalWidth = totalTines * (tineWidth + spacing) - spacing;
    const startX = (containerWidth - totalWidth) / 2;
    
    // Create all tines in a continuous layout
    notes.forEach((noteInfo, index) => {
        // Create V-shape with taller tines in the middle
        const centerIndex = notes.length / 2 - 0.5;
        const distanceFromCenter = Math.abs(index - centerIndex);
        const heightPercentage = 1 - (distanceFromCenter / notes.length) * 0.3;
        const height = containerHeight * heightPercentage;
        
        // Calculate position
        const leftPosition = startX + index * (tineWidth + spacing);
        
        const tine = document.createElement('div');
        tine.className = 'tine';
        tine.dataset.note = noteInfo.note;
        tine.dataset.key = noteInfo.key;
        tine.style.height = `${height}px`;
        tine.style.width = `${tineWidth}px`;
        tine.style.left = `${leftPosition}px`;
        
        // Preload audio
        const audio = new Audio();
        audio.id = `audio-${noteInfo.note}`;
        audio.src = `sounds/${noteInfo.note}.mp3`;
        audioElements[noteInfo.note] = audio;
        
        tine.addEventListener('click', function() {
            playNote(noteInfo.note);
        });
        
        tineContainer.appendChild(tine);
    });
    
    // Play a note
    function playNote(note) {
        // Find the tine and add active class
        const tine = document.querySelector(`.tine[data-note="${note}"]`);
        if (!tine) return; // Safety check
        
        tine.classList.add('active');
        
        // Play the sound
        try {
            // Placeholder: Web Audio API
            const context = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = context.createOscillator();
            const gainNode = context.createGain();
            
            // Get frequency based on note
            const freq = getNoteFrequency(note);
            
            oscillator.type = 'sine';
            oscillator.frequency.value = freq;
            
            gainNode.gain.setValueAtTime(0.5, context.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 1.5);
            
            oscillator.connect(gainNode);
            gainNode.connect(context.destination);
            
            oscillator.start(context.currentTime);
            oscillator.stop(context.currentTime + 1.5);
            
            // If recording, store the note
            if (isRecording) {
                recordedNotes.push({
                    note: note,
                    time: Date.now() - startTime
                });
            }
            
            // Remove active class after a short delay
            setTimeout(() => {
                tine.classList.remove('active');
            }, 300);
        } catch (e) {
            console.error('Error playing note:', e);
        }
    }
    
    // Simple formula to convert note to frequency
    function getNoteFrequency(note) {
        const noteMap = {
            'C3': 130.81, 'D3': 146.83, 'E3': 164.81, 'F3': 174.61, 'G3': 196.00, 'A3': 220.00, 'B3': 246.94,
            'C4': 261.63, 'D4': 293.66, 'E4': 329.63, 'F4': 349.23, 'G4': 392.00, 'A4': 440.00, 'B4': 493.88,
            'C5': 523.25, 'D5': 587.33, 'E5': 659.25, 'F5': 698.46, 'G5': 783.99, 'A5': 880.00, 'B5': 987.77,
            'C6': 1046.50, 'D6': 1174.66, 'E6': 1318.51, 'F6': 1396.91
        };
        return noteMap[note] || 440; // Default to A4 if not found
    }
    
    // Handle window resize
    window.addEventListener('resize', function() {
        // Recalculate positions
        const containerWidth = tineContainer.offsetWidth;
        const containerHeight = tineContainer.offsetHeight;
        
        const totalWidth = totalTines * (tineWidth + spacing) - spacing;
        const startX = (containerWidth - totalWidth) / 2;
        
        // Update all tines
        const tines = document.querySelectorAll('.tine');
        tines.forEach((tine, index) => {
            const centerIndex = notes.length / 2 - 0.5;
            const distanceFromCenter = Math.abs(index - centerIndex);
            const heightPercentage = 1 - (distanceFromCenter / notes.length) * 0.3;
            const height = containerHeight * heightPercentage;
            
            const leftPosition = startX + index * (tineWidth + spacing);
            
            tine.style.height = `${height}px`;
            tine.style.left = `${leftPosition}px`;
        });
    });
    
    // Keyboard event listeners
    document.addEventListener('keydown', function(e) {
        // Get the key pressed (case insensitive)
        let key = e.key.toUpperCase();
        
        if (!e.repeat) {
            // Find the tine with this key
            const tine = document.querySelector(`.tine[data-key="${key}"]`);
            
            if (tine) {
                const note = tine.dataset.note;
                playNote(note);
            }
        }
    });
    
    // Toggle key guide
    toggleGuideBtn.addEventListener('click', function() {
        keyGuide.style.display = keyGuide.style.display === 'none' ? 'block' : 'none';
    });
    
    // Recording functionality
    recordBtn.addEventListener('click', function() {
        if (isRecording) {
            isRecording = false;
            recordBtn.textContent = 'Enregistrer';
            recordBtn.style.background = '#2d1b3d';
            recordBtn.style.color = '#bb86fc';
        } else {
            isRecording = true;
            recordedNotes = [];
            startTime = Date.now();
            recordBtn.textContent = 'Arrêter';
            recordBtn.style.background = '#bb86fc';
            recordBtn.style.color = '#121212';
        }
    });
    
    // Playback functionality
    playbackBtn.addEventListener('click', function() {
        if (recordedNotes.length > 0) {
            playbackBtn.disabled = true;
            playbackBtn.textContent = 'Lecture en cours...';
            
            recordedNotes.forEach(recorded => {
                setTimeout(() => {
                    playNote(recorded.note);
                }, recorded.time);
            });
            
            const playbackDuration = recordedNotes[recordedNotes.length - 1].time + 1000;
            setTimeout(() => {
                playbackBtn.disabled = false;
                playbackBtn.textContent = 'Lecture';
            }, playbackDuration);
        }
    });
});