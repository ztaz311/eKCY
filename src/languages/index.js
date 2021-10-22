import I18n from 'react-native-i18n';

import en from './en';
import vi from './vi';

I18n.translations = {
    en,
    vi,
};

export default convertLanguage = (lang, key, data = null) => {
    var i18n = I18n
    i18n.locale = lang;
    var string = i18n.t(key);
    if (data) {
        for (var key in data) {
            string = string.replace(":" + key, data[key]);
        }
    }
    return string;
}