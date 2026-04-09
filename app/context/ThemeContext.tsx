"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { createClient } from "../../lib/supabase-client";

export interface ThemeSettings {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  cardBackgroundColor: string;
  textColor: string;
  textColorSecondary: string;
  fontFamily: string;
  headingFontFamily: string;
  cardBorderRadius: number;
  buttonBorderRadius: number;
  showCategoryIcons: boolean;
  showSearchBar: boolean;
  productsPerRow: "2" | "3" | "4";
  headerImageUrl: string | null;
  footerText: string;
  showSocialLinks: boolean;
  socialFacebookUrl: string;
  socialTelegramUrl: string;
  socialInstagramUrl: string;
  socialTiktokUrl: string;
  customCSS: string;
}

const defaultTheme: ThemeSettings = {
  primaryColor: "#0E4123",
  secondaryColor: "#0E4123",
  accentColor: "#0E4123",
  backgroundColor: "#FFFFFF",
  cardBackgroundColor: "#FFFFFF",
  textColor: "#000000",
  textColorSecondary: "#6B7280",
  fontFamily: "Kantumruy Pro, sans-serif",
  headingFontFamily: "Kantumruy Pro, sans-serif",
  cardBorderRadius: 16,
  buttonBorderRadius: 12,
  showCategoryIcons: true,
  showSearchBar: true,
  productsPerRow: "3",
  headerImageUrl: null,
  footerText: "© 2026 Sean Soulong. All rights reserved.",
  showSocialLinks: true,
  socialFacebookUrl: "https://www.facebook.com/sean.soulong",
  socialTelegramUrl: "https://t.me/souloong",
  socialInstagramUrl: "https://www.instagram.com/sean.soulong/",
  socialTiktokUrl: "https://www.tiktok.com/@seansoulong",
  customCSS: "",
};

interface ThemeContextType {
  theme: ThemeSettings;
  updateTheme: (settings: Partial<ThemeSettings>) => Promise<void>;
  resetTheme: () => Promise<void>;
  loading: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeSettings>(defaultTheme);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      console.log("Loading theme...");

      // First try to load from localStorage
      const savedTheme = localStorage.getItem("menu_theme");
      if (savedTheme) {
        try {
          const parsedTheme = JSON.parse(savedTheme);
          setTheme({ ...defaultTheme, ...parsedTheme });
          applyThemeToDocument({ ...defaultTheme, ...parsedTheme });
          console.log("Theme loaded from localStorage");
        } catch (e) {
          console.error("Error parsing saved theme:", e);
        }
      }

      // Then try to load from Supabase
      const { data, error } = await supabase
        .from("theme_settings")
        .select("*")
        .eq("id", 1)
        .single();

      if (error) {
        console.error("Error loading from Supabase:", error.message);
      } else if (data) {
        console.log("Theme loaded from Supabase:", data);
        const dbTheme = {
          primaryColor: data.primary_color,
          secondaryColor: data.secondary_color,
          accentColor: data.accent_color,
          backgroundColor: data.background_color,
          cardBackgroundColor: data.card_background_color,
          textColor: data.text_color,
          textColorSecondary: data.text_color_secondary,
          fontFamily: data.font_family,
          headingFontFamily: data.heading_font_family,
          cardBorderRadius: data.card_border_radius,
          buttonBorderRadius: data.button_border_radius,
          showCategoryIcons: data.show_category_icons,
          showSearchBar: data.show_search_bar,
          productsPerRow: data.products_per_row,
          headerImageUrl: data.header_image_url,
          footerText: data.footer_text,
          showSocialLinks: data.show_social_links,
          socialFacebookUrl: data.social_facebook_url,
          socialTelegramUrl: data.social_telegram_url,
          socialInstagramUrl: data.social_instagram_url,
          socialTiktokUrl: data.social_tiktok_url,
          customCSS: data.custom_css,
        };
        setTheme({ ...defaultTheme, ...dbTheme });
        applyThemeToDocument({ ...defaultTheme, ...dbTheme });
        localStorage.setItem("menu_theme", JSON.stringify(dbTheme));
      }
    } catch (error) {
      console.error("Error in loadTheme:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateTheme = async (settings: Partial<ThemeSettings>) => {
    try {
      console.log("Updating theme with:", settings);
      const newTheme = { ...theme, ...settings };
      setTheme(newTheme);

      // Apply to document immediately
      applyThemeToDocument(newTheme);

      // Save to localStorage as backup
      localStorage.setItem("menu_theme", JSON.stringify(newTheme));

      // Try to update in database
      try {
        const updateData = {
          primary_color: newTheme.primaryColor,
          secondary_color: newTheme.secondaryColor,
          accent_color: newTheme.accentColor,
          background_color: newTheme.backgroundColor,
          card_background_color: newTheme.cardBackgroundColor,
          text_color: newTheme.textColor,
          text_color_secondary: newTheme.textColorSecondary,
          font_family: newTheme.fontFamily,
          heading_font_family: newTheme.headingFontFamily,
          card_border_radius: newTheme.cardBorderRadius,
          button_border_radius: newTheme.buttonBorderRadius,
          show_category_icons: newTheme.showCategoryIcons,
          show_search_bar: newTheme.showSearchBar,
          products_per_row: newTheme.productsPerRow,
          header_image_url: newTheme.headerImageUrl,
          footer_text: newTheme.footerText,
          show_social_links: newTheme.showSocialLinks,
          social_facebook_url: newTheme.socialFacebookUrl,
          social_telegram_url: newTheme.socialTelegramUrl,
          social_instagram_url: newTheme.socialInstagramUrl,
          social_tiktok_url: newTheme.socialTiktokUrl,
          custom_css: newTheme.customCSS,
          updated_at: new Date().toISOString(),
        };

        const { error } = await supabase
          .from("theme_settings")
          .upsert({ id: 1, ...updateData });

        if (error) {
          console.error("Supabase error updating theme:", error.message);
        } else {
          console.log("Theme updated successfully in database");
        }
      } catch (dbError) {
        console.error("Database error:", dbError);
      }
    } catch (error) {
      console.error("Error updating theme:", error);
    }
  };

  const resetTheme = async () => {
    console.log("Resetting theme to default");
    await updateTheme(defaultTheme);
  };

  const applyThemeToDocument = (settings: ThemeSettings) => {
    const root = document.documentElement;
    root.style.setProperty("--primary-color", settings.primaryColor);
    root.style.setProperty("--secondary-color", settings.secondaryColor);
    root.style.setProperty("--accent-color", settings.accentColor);
    root.style.setProperty("--background-color", settings.backgroundColor);
    root.style.setProperty("--card-bg-color", settings.cardBackgroundColor);
    root.style.setProperty("--text-color", settings.textColor);
    root.style.setProperty(
      "--text-color-secondary",
      settings.textColorSecondary
    );
    root.style.setProperty("--card-radius", `${settings.cardBorderRadius}px`);
    root.style.setProperty(
      "--button-radius",
      `${settings.buttonBorderRadius}px`
    );

    // Apply custom CSS
    const styleId = "custom-theme-css";
    let styleElement = document.getElementById(styleId);
    if (!styleElement) {
      styleElement = document.createElement("style");
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }
    styleElement.textContent = settings.customCSS;
  };

  return (
    <ThemeContext.Provider value={{ theme, updateTheme, resetTheme, loading }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
