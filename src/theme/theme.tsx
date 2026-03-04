// theme.ts

const theme = {
    colors: {
      primary: "#40C2CC",
      onPrimary:"#ffffff",
      outLined:"#0A181A",
      background: "#FFFFFF",
      suface: "#0A181A",
      muted: "#999999",
      black:"#000000",
      overlay: "rgba(0, 0, 0, 0.4)",
    },
  
    fonts: {
      heading: "quoto",
      body: "Inter, sans-serif",
    },
  
    fontSizes: {
      xs: "10px",
      sm: "14px",
      base: "16px",
      lg: "20px",
      xl: "24px",
      "2xl": "30px",
      "3xl": "36px",
      "4xl": "48px",
      "5xl": "64px",
    },
  
    spacing: {
      none: "0px",
      xs: "4px",
      sm: "8px",
      md: "16px",
      lg: "24px",
      xl: "32px",
      "2xl": "40px",
    },
  
    breakpoints: {
      sm: "480px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
    },
  
    borderRadius: {
      sm: "4px",
      md: "8px",
      lg: "16px",
      full: "9999px",
    },
  
    shadows: {
      sm: "0 1px 2px rgba(0, 0, 0, 0.05)",
      md: "0 4px 6px rgba(0, 0, 0, 0.1)",
      lg: "0 10px 15px rgba(0, 0, 0, 0.1)",
    },
    fontFeatureSettings:{
      ss01:'on',
      ss02:'on',
      ss03:'on',
    },
    lineHeight:{
      title:'120%',
      sub:"100%",
    }
  };
  
  export default theme;
  