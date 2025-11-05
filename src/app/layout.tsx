import ThemeProviderWrapper from '../theme/themeProvider'
import ReduxProvider from '../provider/redux'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ReduxProvider>
          <ThemeProviderWrapper>
            {children}
          </ThemeProviderWrapper>
        </ReduxProvider>
      </body>
    </html>
  )
}
