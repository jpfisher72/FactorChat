'use client'
import "./globals.css";
import ChatComponenet from "@/components/ChatComponent";
import { createTheme, ThemeProvider } from "@mui/material";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const theme = createTheme({
    palette: {
      mode: "light",
      primary: {
        main: '#8169BF',
        light: '#D0BCFF',
        dark: '#4F378A',
        contrastText: '#fff',
      }
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none"
          }
        }
      }
    },
    
  });

  return (
    <html lang="en">
      <body>
        <ThemeProvider theme={theme}>
          {children}
          <ChatComponenet />
        </ThemeProvider>
      </body>
    </html>
  );
}
