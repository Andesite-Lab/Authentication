import i18n from 'i18next';

import de from '@/Common/lang/de.json';
import en from '@/Common/lang/en.json';
import es from '@/Common/lang/es.json';
import fr from '@/Common/lang/fr.json';
import it from '@/Common/lang/it.json';

export enum Language {
    DE = 'de',
    EN = 'en',
    ES = 'es',
    FR = 'fr',
    IT = 'it',
}

export class I18n {
    private static _instance: I18n;

    private constructor() {
        i18n.init({
            resources: {
                de: { translation: de },
                en: { translation: en },
                es: { translation: es },
                fr: { translation: fr },
                it: { translation: it },
            },
            fallbackLng: Language.EN,
            interpolation: {
                escapeValue: false,
            }
        });
    }

    public static get instance(): I18n {
        if (!I18n._instance)
            I18n._instance = new I18n();
        return I18n._instance;
    }

    public static translate(key: string, language: Language | string = Language.EN, interpolation: { [key: string]: unknown } = {}): string {
        I18n.instance;
        if (typeof language === 'string' && language == '')
            language = Language.EN;
        return i18n.t(key, { lng: language, ...interpolation });
    }
}
