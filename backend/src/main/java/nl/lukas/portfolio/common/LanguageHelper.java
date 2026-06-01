package nl.lukas.portfolio.common;

public class LanguageHelper {

    public static final String DEFAULT_LANG = "nl";

    public static String resolveLang(String lang) {
        boolean hasLang = lang != null && !lang.isBlank();
        return hasLang ? lang.toLowerCase() : DEFAULT_LANG;
    }
}
