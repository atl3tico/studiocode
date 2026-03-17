import { ThemeSupa } from "@supabase/auth-ui-shared"
import type { Provider } from "@supabase/supabase-js"

export const oauthProviders = ["github"] as Provider[]

// use the css variables from the app theme to style Supabase auth template
export const sharedAppearance = {
  theme: ThemeSupa,
  variables: {
    default: {
      colors: {
        brand: "var(--primary)",
        brandAccent: "var(--accent)",
        inputText: "var(--foreground)",
        brandButtonText: "var(--primary-foreground)",
        messageText: "var(--foreground)",
        dividerBackground: "var(--foreground)",
        inputLabelText: "var(--foreground)",
        defaultButtonText: "var(--foreground)",
        anchorTextColor: "var(--primary)",
      },
      fontSizes: {
        baseInputSize: "16px",
      },
    },
  },
  className: {
    button: "authBtn",
  },
}
