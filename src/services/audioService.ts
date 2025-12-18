


// @ts-ignore: webkitSpeechRecognition pode não estar em todos os navegadores
const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

class AudioService {
    private synth: SpeechSynthesis;
    private recognition: any;

    constructor() {
        this.synth = window.speechSynthesis;
        this.recognition = new (SpeechRecognitionClass as any)();
    }

    speak(text: string) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'it-IT';
        utterance.rate = 0.9;
        this.synth.speak(utterance);
    }

    startListening(callback: (transcript: string) => void) {
        this.recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            callback(transcript);
        };
        this.recognition.start();
    }
}

export default AudioService;