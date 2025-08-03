import { createContext } from 'react'; // Corrected syntax here

// Defines and exports the ThemeContext.
// createContext(null) initializes the context with a default value of null.
// Components consuming this context will receive the value provided by the nearest ThemeContext.Provider.
export const ThemeContext = createContext(null);
