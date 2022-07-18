export interface PlayWordInterface {
  speech: SpeechSynthesisUtterance;
  language: string;
  voices: SpeechSynthesisVoice[];
  voicesLength: number;
  getVoiceList(): void;
  playText(text: string): void;
}

export default class PlayWord implements PlayWordInterface {
  speech: SpeechSynthesisUtterance;

  synth: Window['speechSynthesis'];

  language: string;

  voices: SpeechSynthesisVoice[];

  voicesLength: number;

  constructor(language = 'US') {
    this.speech = new SpeechSynthesisUtterance();
    this.synth = window.speechSynthesis;
    this.language = language;
    this.voices = [];
    this.voicesLength = 0;
    this.getVoiceList();
  }

  getVoiceByLang = (lang: string) => this.synth.getVoices().find((voice) => voice.lang.endsWith(lang));

  getVoiceList(): void {
    this.voices = this.synth.getVoices();
    this.voicesLength = this.voices.length;
    this.voices = speechSynthesis.getVoices().filter((voice) => voice.lang.endsWith(this.language));
    if (!this.voices.length) {
      this.synth.addEventListener('voiceschanged', () => {
        this.voices = speechSynthesis.getVoices().filter((voice) => voice.lang.endsWith(this.language));
        this.voicesLength = this.voices.length;
      });

      let timeout = 0;
      const maxTimeout = 2000;
      const interval = 250;

      // eslint-disable-next-line @typescript-eslint/no-shadow
      const loadVoices = (loadVoices: CallableFunction) => {
        const voices = speechSynthesis.getVoices();

        if (voices.length > 0) {
          return loadVoices(undefined, voices);
        }

        if (timeout >= maxTimeout) {
          return loadVoices(new Error('loadVoices max timeout exceeded'));
        }

        timeout += interval;
        setTimeout(() => loadVoices(loadVoices), interval);
      };

      loadVoices((err: Error, voices: SpeechSynthesisVoice[]) => {
        if (err) return;

        this.voices = voices.filter((voice) => voice.lang.endsWith(this.language));
        this.voicesLength = this.voices.length;
      });
    }
  }

  playText(text: string): void {
    if (!text) {
      return;
    }

    if (this.synth.speaking) {
      this.synth.cancel();
    }

    this.speech = new SpeechSynthesisUtterance(text);
    this.speech.text = text;
    if (this.voices[4]) {
      this.speech.voice = this.voices[4];
    } else {
      this.speech.voice = this.voices[0];
    }

    this.synth.speak(this.speech);
  }
}
